import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable, Logger } from "@nestjs/common";
import { Subscription } from "./subscription.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { User } from "../users/users.entity";
import { SubscriptionPlan } from "../graphql";
import Stripe from "stripe";
import { CheckoutSession } from "./checkout-session.entity";

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: EntityRepository<Subscription>,
    @InjectRepository(CheckoutSession)
    private readonly checkoutSessionRepository: EntityRepository<CheckoutSession>,
    private readonly em: EntityManager,
    private readonly stripe: Stripe,
  ) {}

  async createCheckoutSession({
    user,
    plan,
  }: {
    user: User;
    plan: SubscriptionPlan;
  }) {
    const price = await this.stripe.prices.retrieve(
      "price_1RGIWjPfOpSTLh7j3AWYoHxB",
    );

    const session = await this.stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `http://localhost:3001/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3001/subscription?canceled=true`,
    });

    const checkoutSession = new CheckoutSession();

    checkoutSession.stripeSessionId = session.id;
    checkoutSession.user = user;
    checkoutSession.plan = plan;

    await this.em.persistAndFlush(checkoutSession);

    return session.url;
  }

  async handleCompletedCheckout(session: Stripe.Checkout.Session) {
    const checkoutSession = await this.checkoutSessionRepository.findOneOrFail(
      { stripeSessionId: session.id },
      { populate: ["user"] },
    );

    if (!checkoutSession.user.stripeCustomerId) {
      checkoutSession.user.stripeCustomerId = session.customer as string;
      this.em.persist(checkoutSession.user);
    }

    const subscription = new Subscription();
    subscription.user = checkoutSession.user;
    subscription.plan = checkoutSession.plan;
    subscription.stripeSubscriptionId = session.subscription as string;
    subscription.stripeInvoiceId = session.invoice as string;
    subscription.checkoutSession = checkoutSession;

    await this.em.persistAndFlush(subscription);
  }

  async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await this.subscriptionRepository.findOneOrFail({
      stripeInvoiceId: invoice.id,
    });

    this.logger.debug(
      `🔔 Invoice payment succeeded: ${invoice.id} - ${invoice.amount_due}`,
    );

    subscription.isActive = true;

    await this.em.persistAndFlush(subscription);
  }

  async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.subscriptionRepository.findOneOrFail({
      stripeInvoiceId: invoice.id,
    });

    this.logger.warn(`❌ Invoice payment failed: ${invoice.id}`);

    subscription.isActive = false;

    await this.em.persistAndFlush(subscription);
  }

  async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const dbSubscription = await this.subscriptionRepository.findOneOrFail({
      stripeSubscriptionId: subscription.id,
    });

    for (const item of subscription.items.data) {
      switch (item.plan.product) {
        case process.env.STRIPE_PRODUCT_ID_ENTHUSIAST:
          dbSubscription.plan = SubscriptionPlan.Enthusiast;
      }
    }

    if (subscription.cancel_at) {
      dbSubscription.endDate = new Date(subscription.cancel_at);
    }

    this.logger.debug(`🔔 Subscription updated: ${subscription.id}`);

    await this.em.persistAndFlush(dbSubscription);
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const dbSubscription = await this.subscriptionRepository.findOneOrFail({
      stripeSubscriptionId: subscription.id,
    });

    dbSubscription.isActive = false;

    this.logger.warn(` Subscription deleted: ${subscription.id}`);

    await this.em.persistAndFlush(dbSubscription);
  }

  async createPortalSession(user: User) {
    if (!user.stripeCustomerId) return null;

    const returnUrl = "http://localhost:3001/subscription";

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: returnUrl,
    });

    return portalSession.url;
  }

  async findByUser(user: User) {
    return await this.subscriptionRepository.findOne({
      user: user.id,
      isActive: true,
      $or: [{ endDate: null }, { endDate: { $gt: new Date() } }],
    });
  }
}
