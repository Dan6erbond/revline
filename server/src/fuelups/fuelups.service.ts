import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { FuelUp } from "./fuelups.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { FuelCategory, OctaneRating } from "../graphql";
import { CarsService } from "../cars/cars.service";
import { Car } from "../cars/cars.entity";
import { OdometerReadingService } from "../odometer-reading/odometer-reading.service";

@Injectable()
export class FuelupsService {
  constructor(
    @InjectRepository(FuelUp)
    private readonly fuelUpRepository: EntityRepository<FuelUp>,
    private readonly em: EntityManager,
    private readonly carsService: CarsService,
    private readonly odometerReadingService: OdometerReadingService,
  ) {}

  async createFuelUp({
    carId,
    odometerKm,
    ...values
  }: {
    carId: string;
    occurredAt: Date;
    station: string;
    amountLiters: number;
    cost: number;
    fuelCategory: FuelCategory;
    octane?: OctaneRating | null;
    odometerKm?: number | null;
    notes?: string | null;
    isFullTank: boolean;
    locationLat?: number | null;
    locationLng?: number | null;
  }) {
    const fuelUp = new FuelUp();

    const car = await this.carsService.findById(carId);

    fuelUp.car = car;

    Object.assign(fuelUp, values);

    if (odometerKm) {
      const reading = await this.odometerReadingService.createOdometerReading({
        carId,
        readingKm: odometerKm,
        locationLat: values.locationLat,
        locationLng: values.locationLng,
        notes: "Created by fuel-up",
      });

      fuelUp.odometerReading = reading;
    }

    await this.em.persistAndFlush(fuelUp);

    return fuelUp;
  }

  async updateFuelUp({
    id,
    ...values
  }: {
    id: string;
    occurredAt?: Date | null;
    station?: string | null;
    amount?: number | null;
    cost?: number | null;
    fuelCategory?: FuelCategory | null;
    octane?: OctaneRating | null;
    odometerKm?: number | null;
    notes?: string | null;
    isFullTank?: boolean | null;
    locationLat?: number | null;
    locationLng?: number | null;
  }) {
    const fuelUp = await this.fuelUpRepository.findOneOrFail({ id });

    Object.assign(fuelUp, values);

    await this.em.persistAndFlush(fuelUp);

    return fuelUp;
  }

  async getCar(fuelUp: FuelUp) {
    await this.em.populate(fuelUp, ["car"]);

    return fuelUp.car;
  }

  async findByCar(car: Car) {
    return await this.fuelUpRepository.findAll({
      where: { car: car.id },
    });
  }

  async getOdometerReading(fuelUp: FuelUp) {
    await this.em.populate(fuelUp, ["odometerReading"]);

    return fuelUp.odometerReading;
  }
}
