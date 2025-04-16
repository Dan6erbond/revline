import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { User } from "../auth/auth.decorator";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { User as UserModel } from "../users/users.entity";
import { UpdateProfileInput, UploadProfilePictureInput } from "../graphql";
import { ProfileService } from "./profile.service";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Profile } from "./profile.entity";
import { EntityManager } from "@mikro-orm/postgresql";

@Resolver("Profile")
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly s3: S3Client,
    private readonly em: EntityManager,
  ) {}

  @Query()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  profile(@User() user: UserModel) {
    return this.profileService.getUserProfile(user);
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  uploadProfilePicture(
    @Args("input") input: UploadProfilePictureInput,
    @User() user: UserModel,
  ) {
    return this.profileService.uploadProfilePicture({
      ...input,
      user,
    });
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async updateProfile(
    @Args("input") input: UpdateProfileInput,
    @User() user: UserModel,
  ) {
    return await this.profileService.updateProfile({ ...input, user });
  }

  @ResolveField()
  async profilePictureUrl(@Parent() profile: Profile) {
    if (!profile.profilePicture) return null;

    if (!profile.user) {
      await this.em.populate(profile, ["user"]);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${profile.user.id}/profile-pictures/${profile.profilePicture}`,
    });

    return await getSignedUrl(this.s3, command, { expiresIn: 60 * 60 });
  }
}
