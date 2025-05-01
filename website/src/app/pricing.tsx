import { Card, CardBody, CardHeader, Chip, Divider, cn } from "@heroui/react";

import { Check } from "lucide-react";
import React from "react";

function SubscriptionCard({
  isRecommended,
  price,
  title,
  description,
  features,
}: {
  price?: number;
  onSubscribe?(): void;
  onManage?(): void;
  isRecommended?: boolean;
  isCurrent?: boolean;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <Card
      className={cn(
        "min-w-[250px] max-w-[400px] flex-1 px-2 py-6 gap-4",
        isRecommended && "border-primary-400 border-2 relative overflow-visible"
      )}
      isBlurred
    >
      {isRecommended && (
        <div className="absolute -top-4 z-20 w-full flex">
          <Chip variant="dot" color="primary" className="mx-auto bg-background">
            Recommended
          </Chip>
        </div>
      )}
      <CardHeader className="flex-col gap-2">
        <p className="text-2xl">{title}</p>
        <p>{description}</p>
      </CardHeader>
      <Divider />
      <CardBody>
        {price && (
          <p className="text-2xl text-default-600 mb-6">
            <span className="text-default-400">$</span>
            <span>{price}</span>
            <span className="text-medium"> monthly</span>
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (
            <li className="flex gap-2 items-center" key={feature}>
              <Check /> {feature}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export default function Pricing() {
  return (
    <section
      className="w-full bg-background py-16 px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-content1-foreground mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-lg text-content2-foreground mb-12">
          Whether you&apos;re tuning your weekend project or tracking your build&apos;s
          evolution, we&apos;ve got you covered.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-8 sm:flex-row sm:justify-center">
        <SubscriptionCard
          title="Free"
          description="Keep your car's history in check with essentials for maintenance and fuel tracking."
          features={[
            "Manage 1 vehicle",
            "Fuel & maintenance tracking",
            "Service logs & odometer readings",
          ]}
        />
        <SubscriptionCard
          title="DIY"
          description="For car owners who maintain their vehicles and want organized, searchable records."
          price={2}
          features={[
            "Maintenance & repair tracking",
            "Parts log & service history",
            "Custom reminders",
            "Unlimited vehicles",
            "Secure document storage",
          ]}
        />
        <SubscriptionCard
          title="Enthusiast"
          description="For performance-focused drivers who want to share, analyze, and track everything."
          price={4}
          features={[
            "Photo & video gallery",
            "Performance tracking (dyno, drag, track days)",
            "Sharable vehicle profiles",
            "Advanced logging for upgrades",
          ]}
          isRecommended
        />
      </div>
    </section>
  );
}
