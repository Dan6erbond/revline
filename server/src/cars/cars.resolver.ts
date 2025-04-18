import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { UseGuards } from "@nestjs/common";
import { User } from "../auth/auth.decorator";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { CreateCarInput, UploadMediaInput } from "../graphql";
import { User as UserModel } from "../users/users.entity";
import { CarsService } from "./cars.service";
import { Car } from "./cars.entity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EntityManager } from "@mikro-orm/postgresql";

@Resolver("Car")
export class CarsResolver {
  constructor(
    private carsService: CarsService,
    private readonly s3: S3Client,
    private readonly em: EntityManager,
  ) {}

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

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async uploadBannerImage(@Args("input") { carId }: UploadMediaInput) {
    const car = await this.carsService.findById(carId);

    return await this.carsService.uploadBannerImage({ car });
  }

  @ResolveField()
  async bannerImageUrl(@Parent() car: Car) {
    if (!car.bannerImage || !car.owner) {
      await this.em.populate(car, ["bannerImage", "owner"]);
    }

    if (!car.bannerImage) return null;

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${car.owner.id}/cars/${car.id}/media/${car.bannerImage.id}`,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 60 });
  }
}
