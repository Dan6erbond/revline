import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { UseGuards } from "@nestjs/common";
import { User } from "../auth/auth.decorator";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { CreateCarInput } from "../graphql";
import { User as UserModel } from "../users/users.entity";
import { CarsService } from "./cars.service";

@Resolver("Cars")
export class CarsResolver {
  constructor(private carsService: CarsService) {}

  @AuthRequired(true)
  @Query()
  @UseGuards(AuthGuard)
  async cars(@User() user: UserModel) {
    return await this.carsService.findByOwner(user);
  }

  @AuthRequired(true)
  @Query()
  @UseGuards(AuthGuard)
  async car(@Args("id") id: string) {
    return await this.carsService.findById(id);
  }

  @AuthRequired(true)
  @Mutation()
  @UseGuards(AuthGuard)
  async createCar(
    @Args("input") input: CreateCarInput,
    @User() user: UserModel,
  ) {
    return await this.carsService.create({ owner: user, values: input });
  }
}
