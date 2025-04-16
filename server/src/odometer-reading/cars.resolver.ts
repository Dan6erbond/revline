import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { OdometerReadingService } from "./odometer-reading.service";
import { Car } from "../cars/cars.entity";

@Resolver("Car")
export class CarsResolver {
  constructor(
    private readonly odometerReadingService: OdometerReadingService,
  ) {}

  @ResolveField()
  async odometerReadings(@Parent() car: Car) {
    return await this.odometerReadingService.findByCar(car);
  }
}
