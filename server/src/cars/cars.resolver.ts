import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { GQLAuthGuard } from "../auth/gql-auth.guard";
import { Inject, UseGuards } from "@nestjs/common";
import { Car, CreateCarInput } from "../graphql";
import { User } from "../auth/auth.decorator";
import { User as UserModel } from "../users/user.entity";
import { CarsService } from "./cars.service";

@Resolver("Cars")
export class CarsResolver {
  constructor(private carsService: CarsService) {}

  @Mutation()
  @UseGuards(GQLAuthGuard)
  async createCar(
    @Args("input") input: CreateCarInput,
    @User() user: UserModel,
  ): Promise<Car> {
    return await this.carsService.create({ owner: user, values: input });
  }
}
