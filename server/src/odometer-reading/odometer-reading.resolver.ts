import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { OdometerReading } from "./odometer-reading.entity";
import { OdometerReadingService } from "./odometer-reading.service";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import {
  CreateOdometerReadingInput,
  UpdateOdometerReadingInput,
} from "../graphql";

@Resolver("OdometerReading")
export class OdometerReadingResolver {
  constructor(
    private readonly odometerReadingService: OdometerReadingService,
  ) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createOdometerReading(
    @Args("input") input: CreateOdometerReadingInput,
  ) {
    return this.odometerReadingService.createOdometerReading(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateOdometerReading(
    @Args("input") input: UpdateOdometerReadingInput,
  ) {
    return this.odometerReadingService.updateOdometerReading(input);
  }

  @ResolveField()
  async car(@Parent() reading: OdometerReading) {
    return await this.odometerReadingService.getCar(reading);
  }
}
