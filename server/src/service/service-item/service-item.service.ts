import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { ServiceItem } from "./service-item.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { CarsService } from "../../cars/cars.service";
import { Car } from "../../cars/cars.entity";

@Injectable()
export class ServiceItemService {
  constructor(
    @InjectRepository(ServiceItem)
    private readonly serviceItemRepository: EntityRepository<ServiceItem>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
  ) {}

  async createServiceItem({
    carId,
    ...values
  }: {
    carId: string;
    label: string;
    notes?: string | null;
    estimatedDuration?: number | null;
    defaultIntervalKm?: number | null;
    defaultIntervalMonths?: number | null;
    tags?: string[] | null;
  }) {
    const car = await this.carsService.findById(carId);
    const item = new ServiceItem();

    item.car = car;
    Object.assign(item, values);

    await this.em.persistAndFlush(item);
    return item;
  }

  async updateServiceItem({
    id,
    ...values
  }: {
    id: string;
    label?: string | null;
    notes?: string | null;
    estimatedDuration?: number | null;
    defaultIntervalKm?: number | null;
    defaultIntervalMonths?: number | null;
    tags?: string[] | null;
  }) {
    const item = await this.serviceItemRepository.findOneOrFail({ id });

    Object.assign(item, values);
    await this.em.persistAndFlush(item);

    return item;
  }

  async deleteServiceItem(id: string) {
    const item = await this.serviceItemRepository.findOneOrFail({ id });
    await this.em.removeAndFlush(item);
    return true;
  }

  async findByCar(car: Car) {
    return await this.serviceItemRepository.findAll({
      where: { car: car.id },
    });
  }

  async getCar(serviceItem: ServiceItem) {
    await this.em.populate(serviceItem, ["car"]);
    return serviceItem.car;
  }
}
