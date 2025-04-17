import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, EntityManager } from "@mikro-orm/core";
import { ServiceSchedule } from "./service-schedule.entity";
import { CarsService } from "../../cars/cars.service";
import { ServiceItem } from "../service-item/service-item.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceLog } from "../service-log/service-log.entity";

@Injectable()
export class ServiceScheduleService {
  constructor(
    @InjectRepository(ServiceSchedule)
    private readonly serviceScheduleRepository: EntityRepository<ServiceSchedule>,
    @InjectRepository(ServiceItem)
    private readonly serviceItemRepository: EntityRepository<ServiceItem>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
  ) {}

  async createServiceSchedule({
    carId,
    title,
    notes,
    repeatEveryKm,
    repeatEveryMonths,
    serviceItemIds,
  }: {
    carId: string;
    title: string;
    notes?: string | null;
    repeatEveryKm?: number | null;
    repeatEveryMonths?: number | null;
    serviceItemIds?: string[];
  }): Promise<ServiceSchedule> {
    const schedule = new ServiceSchedule();
    const car = await this.carsService.findById(carId);

    schedule.car = car;
    schedule.title = title;
    schedule.notes = notes ?? undefined;
    schedule.repeatEveryKm = repeatEveryKm ?? undefined;
    schedule.repeatEveryMonths = repeatEveryMonths ?? undefined;

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
    title,
    notes,
    repeatEveryKm,
    repeatEveryMonths,
    serviceItemIds,
  }: {
    id: string;
    title?: string | null;
    notes?: string | null;
    repeatEveryKm?: number | null;
    repeatEveryMonths?: number | null;
    serviceItemIds?: string[] | null;
  }): Promise<ServiceSchedule> {
    const schedule = await this.serviceScheduleRepository.findOneOrFail(
      { id },
      { populate: ["items", "car"] },
    );

    if (title !== undefined) schedule.title = title ?? schedule.title;
    if (notes !== undefined) schedule.notes = notes ?? schedule.notes;
    if (repeatEveryKm !== undefined)
      schedule.repeatEveryKm = repeatEveryKm ?? schedule.repeatEveryKm;
    if (repeatEveryMonths !== undefined)
      schedule.repeatEveryMonths =
        repeatEveryMonths ?? schedule.repeatEveryMonths;

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
}
