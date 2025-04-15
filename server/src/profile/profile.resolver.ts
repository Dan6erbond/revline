import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { User } from "../auth/auth.decorator";
import { GQLAuthGuard } from "../auth/gql-auth.guard";
import { User as UserModel } from "../users/user.entity";
import { Profile } from "../graphql";

@Resolver("Profile")
export class ProfileResolver {
  @Query()
  @UseGuards(GQLAuthGuard)
  profile(@User() user: UserModel): Profile {
    return user.profile;
  }
}
