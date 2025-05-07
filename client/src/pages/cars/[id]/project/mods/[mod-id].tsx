import CarLayout from "@/components/layout/car-layout";
import ModIdea from "@/mods";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { Suspense } from "react";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

export default function Mod() {
  const router = useRouter();
  const id = getQueryParam(router.query["mod-id"]);

  return (
    <CarLayout
      className="p-4 md:p-8 flex flex-col gap-2 relative"
      style={{
        minHeight: "calc(70vh - 4rem)",
      }}
    >
      <SubscriptionOverlay requiredTiers={[SubscriptionTier.Enthusiast]} />

      <Suspense fallback="Loading...">{id && <ModIdea id={id} />}</Suspense>
    </CarLayout>
  );
}
