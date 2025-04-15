import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { User } from "../auth/auth.decorator";
import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { User as UserModel } from "../users/user.entity";
import { Profile } from "../graphql";

@Resolver("Profile")
export class ProfileResolver {
  @Query()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  profile(@User() user: UserModel): Profile {
    return user.profile;
  }
}
