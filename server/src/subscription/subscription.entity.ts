import { Entity, Enum, ManyToOne, OneToOne, Property } from "@mikro-orm/core";

import { BaseEntity } from "../db/base.entity";
import { CheckoutSession } from "./checkout-session.entity";
import { SubscriptionPlan } from "../graphql";
import { User } from "../users/users.entity";

@Entity()
export class Subscription extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Enum(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @Property({ nullable: true })
  stripeSubscriptionId?: string;

  @Property({ nullable: true })
  stripeInvoiceId?: string;

  @Property({ type: Date, nullable: true })
  startDate?: Date;

  @Property({ type: Date, nullable: true })
  endDate?: Date;

  @Property({ default: false })
  isActive: boolean;

  @OneToOne(() => CheckoutSession, { nullable: true })
  checkoutSession?: CheckoutSession;
}
