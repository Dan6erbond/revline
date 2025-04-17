import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { ServiceSchedule } from "./service-schedule.entity";
import { CarsService } from "../../cars/cars.service";
import { ServiceItem } from "../service-item/service-item.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceLog } from "../service-log/service-log.entity";
import {
  UpcomingService,
  ServiceSchedule as ServiceScheduleGQL,
} from "../../graphql";
import { OdometerReadingService } from "../../odometer-reading/odometer-reading.service";

@Injectable()
export class ServiceScheduleService {
  constructor(
    @InjectRepository(ServiceSchedule)
    private readonly serviceScheduleRepository: EntityRepository<ServiceSchedule>,
    @InjectRepository(ServiceItem)
    private readonly serviceItemRepository: EntityRepository<ServiceItem>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
    private readonly odometerReadingService: OdometerReadingService,
  ) {}

  async createServiceSchedule({
    carId,
    serviceItemIds,
    ...values
  }: {
    carId: string;
    title: string;
    notes?: string | null;
    repeatEveryKm?: number | null;
    repeatEveryMonths?: number | null;
    startsAtKm?: number | null;
    startsAtDate?: Date | null;
    serviceItemIds?: string[];
  }): Promise<ServiceSchedule> {
    const schedule = new ServiceSchedule();
    const car = await this.carsService.findById(carId);

    schedule.car = car;

    Object.assign(schedule, values);

    if (serviceItemIds?.length) {
      const items = await this.serviceItemRepository.findAll({
        where: { id: { $in: serviceItemIds } },
      });

      schedule.items.set(items);
    }

    await this.em.persistAndFlush(schedule);

    return schedule;
  }

  async updateServiceSchedule({
    id,
    serviceItemIds,
    ...values
  }: {
    id: string;
    title?: string | null;
    notes?: string | null;
    repeatEveryKm?: number | null;
    repeatEveryMonths?: number | null;
    startsAtKm?: number | null;
    startsAtDate?: Date | null;
    serviceItemIds?: string[] | null;
  }): Promise<ServiceSchedule> {
    const schedule = await this.serviceScheduleRepository.findOneOrFail(
      { id },
      { populate: ["items", "car"] },
    );

    Object.assign(schedule, values);

    if (serviceItemIds != null) {
      const items = await this.em.find(ServiceItem, {
        id: { $in: serviceItemIds },
      });

      schedule.items.set(items);
    }

    await this.em.persistAndFlush(schedule);

    return schedule;
  }

  async deleteServiceSchedule(id: string): Promise<boolean> {
    const schedule = await this.serviceScheduleRepository.findOneOrFail({
      id,
    });
    await this.serviceScheduleRepository.nativeDelete(schedule);
    return true;
  }

  async findById(id: string): Promise<ServiceSchedule> {
    return this.serviceScheduleRepository.findOneOrFail({ id });
  }

  async findByCar(car: Car): Promise<ServiceSchedule[]> {
    return this.serviceScheduleRepository.find({ car: car.id });
  }

  async getCar(schedule: ServiceSchedule): Promise<Car> {
    await this.em.populate(schedule, ["car"]);
    return schedule.car;
  }

  async getServiceItems(schedule: ServiceSchedule): Promise<ServiceItem[]> {
    await this.em.populate(schedule, ["items"]);
    return schedule.items.getItems();
  }

  async getServiceLogs(schedule: ServiceSchedule): Promise<ServiceLog[]> {
    await this.em.populate(schedule, ["logs"]);
    return schedule.logs.getItems();
  }

  async getUpcomingServices(car: Car): Promise<UpcomingService[]> {
    const lastOdometerReading =
      await this.odometerReadingService.getLatestReading(car);
    const odometerKm = lastOdometerReading?.readingKm ?? 0;

    const schedules = await this.serviceScheduleRepository.findAll({
      where: { car: car.id, archived: false },
      populate: ["logs", "logs.odometerReading"],
    });

    const now = new Date();

    const upcoming: (UpcomingService & { dueAt: Date | number })[] = [];

    for (const schedule of schedules) {
      const logs = schedule.logs
        .getItems()
        .sort((a, b) => b.datePerformed.getTime() - a.datePerformed.getTime());
      const lastLog = logs[0];

      const repeatKm = schedule.repeatEveryKm;
      const repeatMonths = schedule.repeatEveryMonths;
      const startKm = schedule.startsAtKm ?? 0;
      const startDate = schedule.startsAtDate ?? now;

      let nextDueKm: number | undefined;
      let nextDueDate: Date | undefined;

      // --- Compute next due by km ---
      if (repeatKm !== undefined) {
        const lastKm = lastLog?.odometerReading?.readingKm ?? startKm;
        const cyclesSinceStart = Math.floor((lastKm - startKm) / repeatKm) + 1;
        nextDueKm = startKm + cyclesSinceStart * repeatKm;
      }

      // --- Compute next due by date ---
      if (repeatMonths !== undefined) {
        const baseDate = lastLog?.datePerformed ?? startDate;
        nextDueDate = new Date(baseDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + repeatMonths);
      }

      // --- Determine "dueAt" value for sorting ---
      let dueAt: Date | number;
      if (nextDueKm !== undefined && nextDueDate !== undefined) {
        // Take whichever is sooner
        const kmDelta = nextDueKm - odometerKm;
        const dateDelta = nextDueDate.getTime() - now.getTime();
        dueAt =
          kmDelta < 0 || dateDelta < 0
            ? Math.min(kmDelta, dateDelta)
            : Math.min(kmDelta, dateDelta);
      } else if (nextDueKm !== undefined) {
        dueAt = nextDueKm;
      } else if (nextDueDate !== undefined) {
        dueAt = nextDueDate;
      } else {
        continue; // Can't determine next due
      }

      upcoming.push({
        schedule: schedule as unknown as ServiceScheduleGQL,
        nextDueKm,
        nextDueDate,
        dueAt,
      });
    }

    // --- Sort by dueAt (date or km) ---
    return upcoming.sort((a, b) => {
      if (typeof a.dueAt === "number" && typeof b.dueAt === "number")
        return a.dueAt - b.dueAt;
      if (a.dueAt instanceof Date && b.dueAt instanceof Date)
        return a.dueAt.getTime() - b.dueAt.getTime();
      if (a.dueAt instanceof Date) return -1;
      if (b.dueAt instanceof Date) return 1;
      return 0;
    });
  }
}
