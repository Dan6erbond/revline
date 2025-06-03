import CarLayout from "@/components/layout/car-layout";
import SubscriptionOverlay from "@/components/subscription-overlay";
import { SubscriptionTier } from "@/gql/graphql";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getQueryParam } from "@/utils/router";
import { useRouter } from "next/router";

const ModView = dynamic(() => import("@/mods"), { ssr: false });

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

      <Suspense fallback="Loading...">{id && <ModView id={id} />}</Suspense>
    </CarLayout>
  );
}
