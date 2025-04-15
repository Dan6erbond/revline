import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { CreateFuelUpInput, UpdateFuelUpInput } from "../graphql";
import { FuelUp } from "./fuelups.entity";
import { FuelupsService } from "./fuelups.service";

@Resolver("FuelUp")
export class FuelupsResolver {
  constructor(private readonly fuelUpsService: FuelupsService) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async createFuelUp(@Args("input") input: CreateFuelUpInput) {
    return await this.fuelUpsService.createFuelUp(input);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateFuelUp(@Args("input") input: UpdateFuelUpInput) {
    return await this.fuelUpsService.updateFuelUp(input);
  }

  @ResolveField()
  async car(@Parent() fuelUp: FuelUp) {
    return await this.fuelUpsService.getCar(fuelUp);
  }
}
