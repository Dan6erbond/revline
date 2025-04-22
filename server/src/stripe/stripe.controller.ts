import {
  BadRequestException,
  Controller,
  Post,
  RawBodyRequest,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import Stripe from "stripe";
import { SubscriptionService } from "../subscription/subscription.service";

@Controller("stripe")
export class StripeController {
  constructor(
    private readonly stripe: Stripe,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post("webhook")
  async webhook(@Req() req: RawBodyRequest<Request>) {
    if (!req.rawBody) return;

    let event = req.rawBody as unknown as Stripe.Event;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];

      try {
        event = this.stripe.webhooks.constructEvent(
          req.rawBody,
          signature!,
          endpointSecret,
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        throw new BadRequestException();
      }
    }
    let session: Stripe.Checkout.Session;
    let subscription: Stripe.Subscription;
    let invoice: Stripe.Invoice;
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        session = event.data.object;
        await this.subscriptionService.handleCompletedCheckout(session);
        break;
      case "customer.subscription.updated":
        subscription = event.data.object;
        await this.subscriptionService.handleSubscriptionUpdated(subscription);
        break;
      case "customer.subscription.deleted":
        subscription = event.data.object;
        await this.subscriptionService.handleSubscriptionDeleted(subscription);
        break;
      case "invoice.payment_succeeded":
        invoice = event.data.object;
        await this.subscriptionService.handleInvoicePaymentSucceeded(invoice);
        break;
      case "invoice.payment_failed":
        invoice = event.data.object;
        await this.subscriptionService.handleInvoicePaymentSucceeded(invoice);
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  }
}
