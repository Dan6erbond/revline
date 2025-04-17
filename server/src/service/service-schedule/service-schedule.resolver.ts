import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ServiceScheduleService } from "./service-schedule.service";
import { AuthGuard, AuthRequired } from "../../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import {
  CreateServiceScheduleInput,
  UpdateServiceScheduleInput,
} from "../../graphql";
import { ServiceSchedule } from "./service-schedule.entity";
import { Car } from "../../cars/cars.entity";
import { ServiceItem } from "../service-item/service-item.entity";
import { ServiceLog } from "../service-log/service-log.entity";

@Resolver("ServiceSchedule")
export class ServiceScheduleResolver {
  constructor(
    private readonly serviceSchedulesService: ServiceScheduleService,
  ) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createServiceSchedule(
    @Args("input") input: CreateServiceScheduleInput,
  ): Promise<ServiceSchedule> {
    return this.serviceSchedulesService.createServiceSchedule(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateServiceSchedule(
    @Args("input") input: UpdateServiceScheduleInput,
  ): Promise<ServiceSchedule> {
    return this.serviceSchedulesService.updateServiceSchedule(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async deleteServiceSchedule(@Args("id") id: string): Promise<boolean> {
    return this.serviceSchedulesService.deleteServiceSchedule(id);
  }

  @ResolveField()
  async car(@Parent() schedule: ServiceSchedule): Promise<Car> {
    return this.serviceSchedulesService.getCar(schedule);
  }

  @ResolveField()
  async items(@Parent() schedule: ServiceSchedule): Promise<ServiceItem[]> {
    return await this.serviceSchedulesService.getServiceItems(schedule);
  }

  @ResolveField()
  async logs(@Parent() schedule: ServiceSchedule): Promise<ServiceLog[]> {
    return await this.serviceSchedulesService.getServiceLogs(schedule);
  }
}
