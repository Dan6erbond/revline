import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { ServiceLogService } from "./service-log/service-log.service";
import { Car } from "../cars/cars.entity";
import { ServiceItemService } from "./service-item/service-item.service";
import { ServiceScheduleService } from "./service-schedule/service-schedule.service";

@Resolver("Car")
export class CarsResolver {
  constructor(
    private readonly serviceLogsService: ServiceLogService,
    private readonly serviceItemsService: ServiceItemService,
    private readonly serviceSchedulesService: ServiceScheduleService,
  ) {}

  @ResolveField()
  async serviceLogs(@Parent() car: Car) {
    return await this.serviceLogsService.findByCar(car);
  }

  @ResolveField()
  async serviceItems(@Parent() car: Car) {
    return await this.serviceItemsService.findByCar(car);
  }

  @ResolveField()
  async serviceSchedules(@Parent() car: Car) {
    return await this.serviceSchedulesService.findByCar(car);
  }

  @ResolveField()
  async upcomingServices(@Parent() car: Car) {
    return await this.serviceSchedulesService.getUpcomingServices(car);
  }
}
