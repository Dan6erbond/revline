import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { User } from "../auth/auth.decorator";
import { GQLAuthGuard } from "../auth/gql-auth.guard";
import { User as UserModel } from "../graphql";

@Resolver("Users")
export class UsersResolver {
  @Query()
  @UseGuards(GQLAuthGuard)
  me(@User() user: UserModel): UserModel {
    return user;
  }
}
