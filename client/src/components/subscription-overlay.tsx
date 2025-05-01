import { Button, cn } from "@heroui/react";

import Link from "next/link";
import { Lock } from "lucide-react";
import { SubscriptionTier } from "@/gql/graphql";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";

const getSubscription = graphql(`
  query GetSubscription {
    me {
      id
      subscription {
        id
        tier
      }
    }
  }
`);

export default function SubscriptionOverlay({
  requiredTier,
  requiredTiers,
}: {
  requiredTier?: SubscriptionTier;
  requiredTiers?: SubscriptionTier[];
}) {
  const { data } = useQuery(getSubscription);

  const shouldShowOverlay =
    (Array.isArray(requiredTiers) &&
      !requiredTiers.includes(
        data?.me.subscription?.tier as SubscriptionTier
      )) ||
    (!requiredTiers &&
      requiredTier !== undefined &&
      data?.me.subscription?.tier !== requiredTier);

  return (
    <div
      className={cn(
        "absolute inset-0 z-50 bg-zinc-950/60 backdrop-blur-sm hidden flex-col items-center justify-center text-content2-foreground",
        shouldShowOverlay && "flex"
      )}
    >
      <div className="flex flex-col items-center space-y-4 text-center px-4">
        <Lock className="w-8 h-8 text-primary" />
        <h2 className="text-xl font-semibold">Upgrade Required</h2>
        <p className="text-sm max-w-sm text-content3-foreground">
          This feature is available on the{" "}
          <span className="text-primary font-medium">{requiredTier}</span> plan.
          Upgrade your subscription to unlock it.
        </p>
        <Button as={Link} href="/subscription">
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
}
