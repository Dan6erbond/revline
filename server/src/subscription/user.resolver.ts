import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { User } from "../auth/auth.decorator";
import { User as UserModel } from "../users/users.entity";
import { SubscriptionService } from "./subscription.service";

@Resolver("User")
export class UserResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ResolveField()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  async subscription(@User() authUser: UserModel, @Parent() user: UserModel) {
    if (user.id !== authUser.id) {
      throw new UnauthorizedException();
    }

    return await this.subscriptionService.findByUser(user);
  }
}
