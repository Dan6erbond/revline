import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Car } from "../cars/cars.entity";
import { MediaService } from "./media.service";

@Resolver("Car")
export class CarsResolver {
  constructor(private readonly mediaService: MediaService) {}

  @ResolveField()
  async media(@Parent() car: Car) {
    return this.mediaService.findByCar(car);
  }
}
