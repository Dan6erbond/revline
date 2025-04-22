import { AuthGuard, AuthRequired } from "../auth/auth.guard";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { UseGuards } from "@nestjs/common";
import { User } from "../auth/auth.decorator";
import { User as UserModel } from "../users/users.entity";
import { SubscriptionService } from "./subscription.service";
import { CreateCheckoutSessionInput } from "../graphql";

@Resolver()
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  createCheckoutSession(
    @Args("input") input: CreateCheckoutSessionInput,
    @User() user: UserModel,
  ) {
    return this.subscriptionService.createCheckoutSession({ ...input, user });
  }

  @Mutation()
  @AuthRequired(true)
  @UseGuards(AuthGuard)
  createPortalSession(@User() user: UserModel) {
    return this.subscriptionService.createPortalSession(user);
  }
}
