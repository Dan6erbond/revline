import { Global, Module } from "@nestjs/common";

import Stripe from "stripe";
import { StripeController } from "./stripe.controller";
import { SubscriptionModule } from "../subscription/subscription.module";

@Global()
@Module({
  imports: [SubscriptionModule],
  providers: [
    {
      provide: Stripe,
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY!);
      },
    },
  ],
  exports: [Stripe],
  controllers: [StripeController],
})
export class StripeModule {}
