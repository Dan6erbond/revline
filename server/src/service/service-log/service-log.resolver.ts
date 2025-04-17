import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { ServiceLogService } from "./service-log.service";
import { AuthGuard, AuthRequired } from "../../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { CreateServiceLogInput, UpdateServiceLogInput } from "../../graphql";
import { ServiceLog } from "./service-log.entity";

@Resolver("ServiceLog")
export class ServiceLogResolver {
  constructor(private readonly serviceLogsService: ServiceLogService) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createServiceLog(@Args("input") input: CreateServiceLogInput) {
    return await this.serviceLogsService.createServiceLog(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateServiceLog(@Args("input") input: UpdateServiceLogInput) {
    return await this.serviceLogsService.updateServiceLog(input);
  }

  @ResolveField()
  async car(@Parent() log: ServiceLog) {
    return await this.serviceLogsService.getCar(log);
  }

  @ResolveField()
  async odometerReading(@Parent() log: ServiceLog) {
    return await this.serviceLogsService.getOdometerReading(log);
  }

  @ResolveField()
  async items(@Parent() log: ServiceLog) {
    return await this.serviceLogsService.getServiceItems(log);
  }

  @ResolveField()
  async schedule(@Parent() log: ServiceLog) {
    return await this.serviceLogsService.getSchedule(log);
  }
}
