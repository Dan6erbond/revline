import { CheckoutSession } from "./checkout-session.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Subscription } from "./subscription.entity";
import { SubscriptionResolver } from "./subscription.resolver";
import { SubscriptionService } from "./subscription.service";
import { UserResolver } from './user.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Subscription, CheckoutSession])],
  providers: [SubscriptionService, SubscriptionResolver, UserResolver],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
