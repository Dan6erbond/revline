import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";

import { UseGuards } from "@nestjs/common";
import { UploadMediaInput } from "../graphql";
import { MediaService } from "./media.service";
import { Media } from "./media.entity";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { EntityManager } from "@mikro-orm/postgresql";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Resolver("Media")
export class MediaResolver {
  constructor(
    private readonly mediaService: MediaService,
    private readonly s3: S3Client,
    private readonly em: EntityManager,
  ) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async uploadMedia(@Args("input") input: UploadMediaInput) {
    return this.mediaService.upload(input);
  }

  @ResolveField()
  async url(@Parent() media: Media) {
    if (!media.car || !media.car.owner) {
      await this.em.populate(media, ["car", "car.owner"]);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${media.car.owner.id}/cars/${media.car.id}/media/${media.id}`,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 60 });
  }
}
