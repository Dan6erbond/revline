import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";

import { UseGuards } from "@nestjs/common";
import { UploadMediaInput } from "../graphql";
import { MediaService } from "./media.service";

@Resolver()
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async uploadMedia(@Args("input") input: UploadMediaInput) {
    return this.mediaService.upload(input);
  }
}
