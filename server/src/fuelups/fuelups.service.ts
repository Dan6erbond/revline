import {
  EntityManager,
  EntityRepository,
  QueryOrder,
} from "@mikro-orm/postgresql";
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
    odometerKm,
    ...values
  }: {
    id: string;
    occurredAt?: Date | null;
    station?: string | null;
    amountLiters?: number | null;
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

    if (odometerKm != null) {
      if (fuelUp.odometerReading) {
        fuelUp.odometerReading.readingKm = odometerKm;

        this.em.persist(fuelUp.odometerReading);
      } else {
        const newReading =
          await this.odometerReadingService.createOdometerReading({
            carId: fuelUp.car.id,
            readingKm: odometerKm,
            notes: "Created by service log",
          });

        fuelUp.odometerReading = newReading;
      }
    }

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

  async getAverageConsumption(car: Car) {
    const fuelUps = await this.fuelUpRepository.findAll({
      where: { car: car.id },
      orderBy: { occurredAt: QueryOrder.ASC },
      populate: ["odometerReading"],
    });

    const fullTanks = fuelUps.filter((f) => f.isFullTank && f.odometerReading);

    if (fullTanks.length < 2) return null; // Not enough data

    let totalDistance = 0;
    let totalFuelUsed = 0;

    for (let i = 0; i < fullTanks.length - 1; i++) {
      const start = fullTanks[i];
      const end = fullTanks[i + 1];

      const startKm = start.odometerReading!.readingKm;
      const endKm = end.odometerReading!.readingKm;

      const distance = endKm - startKm;
      if (distance <= 0) continue; // skip invalid data

      // Get all fuel-ups between start and end (excluding start)
      const fuelInBetween = fuelUps.filter(
        (f) =>
          f.occurredAt > start.occurredAt && f.occurredAt <= end.occurredAt,
      );

      const fuelUsed = fuelInBetween.reduce(
        (sum, f) => sum + f.amountLiters,
        0,
      );

      totalDistance += distance;
      totalFuelUsed += fuelUsed;
    }

    return totalDistance > 0 ? totalFuelUsed / totalDistance : null;
  }
}
