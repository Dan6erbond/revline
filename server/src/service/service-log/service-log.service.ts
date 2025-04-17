import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { ServiceLog } from "./service-log.entity";
import { CarsService } from "../../cars/cars.service";
import { Car } from "../../cars/cars.entity";
import { ServiceItem } from "../service-item/service-item.entity";
import { ServiceSchedule } from "../service-schedule/service-schedule.entity";
import { OdometerReadingService } from "../../odometer-reading/odometer-reading.service";

@Injectable()
export class ServiceLogService {
  constructor(
    @InjectRepository(ServiceLog)
    private readonly serviceLogRepository: EntityRepository<ServiceLog>,
    @InjectRepository(ServiceItem)
    private readonly serviceItemRepository: EntityRepository<ServiceItem>,
    @InjectRepository(ServiceSchedule)
    private readonly serviceScheduleRepository: EntityRepository<ServiceSchedule>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
    private readonly odometerReadingService: OdometerReadingService,
  ) {}

  async createServiceLog({
    carId,
    datePerformed,
    odometerKm,
    serviceItemIds,
    scheduleId,
    notes,
    performedBy,
  }: {
    carId: string;
    datePerformed: Date;
    odometerKm?: number | null;
    serviceItemIds: string[];
    scheduleId?: string | null;
    notes?: string | null;
    performedBy?: string | null;
  }) {
    const serviceLog = new ServiceLog();
    const car = await this.carsService.findById(carId);

    serviceLog.car = car;
    serviceLog.datePerformed = datePerformed;
    serviceLog.notes = notes ?? undefined;
    serviceLog.performedBy = performedBy ?? undefined;

    if (odometerKm != null) {
      const reading = await this.odometerReadingService.createOdometerReading({
        carId,
        readingKm: odometerKm,
        notes: "Created by service log",
      });

      serviceLog.odometerReading = reading;
    }

    if (scheduleId) {
      const schedule = await this.serviceScheduleRepository.findOneOrFail({
        id: scheduleId,
      });

      serviceLog.schedule = schedule;
    }

    if (serviceItemIds?.length) {
      const items = await this.serviceItemRepository.findAll({
        where: { id: { $in: serviceItemIds } },
      });

      serviceLog.serviceItems.set(items);
    }

    await this.em.persistAndFlush(serviceLog);

    return serviceLog;
  }

  async updateServiceLog({
    id,
    datePerformed,
    odometerKm,
    serviceItemIds,
    scheduleId,
    notes,
    performedBy,
  }: {
    id: string;
    datePerformed?: Date | null;
    odometerKm?: number | null;
    serviceItemIds?: string[] | null;
    scheduleId?: string | null;
    notes?: string | null;
    performedBy?: string | null;
  }) {
    const serviceLog = await this.serviceLogRepository.findOneOrFail(
      { id },
      {
        populate: ["odometerReading", "serviceItems", "schedule", "car"],
      },
    );

    if (datePerformed !== undefined)
      serviceLog.datePerformed = datePerformed ?? serviceLog.datePerformed;
    if (notes !== undefined) serviceLog.notes = notes ?? serviceLog.notes;
    if (performedBy !== undefined)
      serviceLog.performedBy = performedBy ?? serviceLog.performedBy;

    if (odometerKm != null) {
      if (serviceLog.odometerReading) {
        serviceLog.odometerReading.readingKm = odometerKm;

        this.em.persist(serviceLog.odometerReading);
      } else {
        const newReading =
          await this.odometerReadingService.createOdometerReading({
            carId: serviceLog.car.id,
            readingKm: odometerKm,
            notes: "Created by service log",
          });

        serviceLog.odometerReading = newReading;
      }
    }

    if (scheduleId !== undefined) {
      if (scheduleId === null) {
        serviceLog.schedule = undefined;
      } else {
        const schedule = await this.serviceScheduleRepository.findOneOrFail({
          id: scheduleId,
        });
        serviceLog.schedule = schedule;
      }
    }

    if (serviceItemIds != null) {
      const items = await this.serviceItemRepository.findAll({
        where: { id: { $in: serviceItemIds } },
      });

      serviceLog.serviceItems.set(items);
    }

    await this.em.persistAndFlush(serviceLog);

    return serviceLog;
  }

  async deleteServiceLog(id: string) {
    const log = await this.serviceLogRepository.findOneOrFail({ id });
    await this.serviceLogRepository.nativeDelete(log);
    return true;
  }

  async findByCar(car: Car) {
    return await this.serviceLogRepository.find({ car: car.id });
  }

  async getCar(serviceLog: ServiceLog) {
    await this.em.populate(serviceLog, ["car"]);
    return serviceLog.car;
  }

  async getOdometerReading(serviceLog: ServiceLog) {
    await this.em.populate(serviceLog, ["odometerReading"]);
    return serviceLog.odometerReading;
  }

  async getServiceItems(serviceLog: ServiceLog) {
    await this.em.populate(serviceLog, ["serviceItems"]);
    return serviceLog.serviceItems;
  }

  async getSchedule(serviceLog: ServiceLog) {
    await this.em.populate(serviceLog, ["schedule"]);
    return serviceLog.schedule;
  }
}
