import { Entity, Enum, ManyToOne, OneToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { Subscription } from "./subscription.entity";
import { SubscriptionPlan } from "../graphql";
import { User } from "../users/users.entity";

@Entity()
export class CheckoutSession extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Enum(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @OneToOne(() => Subscription, (subscription) => subscription.checkoutSession)
  subscription?: Subscription;

  @Property()
  stripeSessionId: string;
}
