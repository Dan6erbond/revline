import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { OdometerReading } from "./odometer-reading.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CarsService } from "../cars/cars.service";
import { Car } from "../cars/cars.entity";

@Injectable()
export class OdometerReadingService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(OdometerReading)
    private readonly odometerReadingRepository: EntityRepository<OdometerReading>,
    private readonly carsService: CarsService,
  ) {}

  async createOdometerReading({
    carId,
    ...values
  }: {
    carId: string;
    readingKm: number;
    locationLat?: number | null;
    locationLng?: number | null;
    notes?: string | null;
  }) {
    const reading = new OdometerReading();

    const car = await this.carsService.findById(carId);

    Object.assign(reading, values);

    reading.car = car;

    await this.em.persistAndFlush(reading);

    return reading;
  }

  async updateOdometerReading({
    id,
    ...values
  }: {
    id: string;
    readingKm?: number | null;
    locationLat?: number | null;
    locationLng?: number | null;
    notes?: string | null;
  }) {
    const reading = await this.odometerReadingRepository.findOneOrFail({ id });

    Object.assign(reading, values);

    await this.em.persistAndFlush(reading);

    return reading;
  }

  async getCar(reading: OdometerReading) {
    await this.em.populate(reading, ["car"]);

    return reading.car;
  }

  async findByCar(car: Car) {
    return await this.odometerReadingRepository.findAll({
      where: { car: car.id },
    });
  }
}
