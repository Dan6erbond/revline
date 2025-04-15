import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { UseGuards } from "@nestjs/common";
import { User } from "../auth/auth.decorator";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { Car, CreateCarInput } from "../graphql";
import { User as UserModel } from "../users/user.entity";
import { CarsService } from "./cars.service";

@Resolver("Cars")
export class CarsResolver {
  constructor(private carsService: CarsService) {}

  @AuthRequired(true)
  @Query()
  @UseGuards(AuthGuard)
  async cars(@User() user: UserModel): Promise<Car[]> {
    return await this.carsService.findByOwner(user);
  }

  @AuthRequired(true)
  @Mutation()
  @UseGuards(AuthGuard)
  async createCar(
    @Args("input") input: CreateCarInput,
    @User() user: UserModel,
  ): Promise<Car> {
    return await this.carsService.create({ owner: user, values: input });
  }
}
