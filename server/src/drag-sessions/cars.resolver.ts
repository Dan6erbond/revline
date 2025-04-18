import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Car } from "../cars/cars.entity";
import { DragSessionsService } from "./drag-sessions.service";

@Resolver("Car")
export class CarsResolver {
  constructor(private readonly dragSessionsService: DragSessionsService) {}

  @ResolveField()
  async dragSessions(@Parent() car: Car) {
    return this.dragSessionsService.findByCar(car);
  }
}
