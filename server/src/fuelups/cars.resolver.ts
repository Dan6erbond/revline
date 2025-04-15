import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FuelupsService } from "./fuelups.service";
import { Car } from "../cars/cars.entity";

@Resolver("Car")
export class CarsResolver {
  constructor(private readonly fuelUpsService: FuelupsService) {}

  @ResolveField()
  async fuelUps(@Parent() car: Car) {
    return await this.fuelUpsService.findByCar(car);
  }
}
