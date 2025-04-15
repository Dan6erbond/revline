import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { Profile, User as UserModel } from "../graphql";
import { ProfileService } from "../profile/profile.service";
import { User } from "./users.entity";
import { User as AuthUser } from "../auth/auth.decorator";

@Resolver("User")
export class UsersResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  me(@AuthUser() user: UserModel): UserModel {
    return user;
  }

  @ResolveField()
  async profile(@Parent() user: User): Promise<Profile | null> {
    return await this.profileService.getUserProfile(user);
  }
}
