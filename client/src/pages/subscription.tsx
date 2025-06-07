import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  addToast,
  cn,
} from "@heroui/react";
import { Check, Settings } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";

import RootNavbar from "@/components/layout/root-navbar";
import { SubscriptionTier } from "@/gql/graphql";
import { getQueryParam } from "../utils/router";
import { graphql } from "@/gql";
import { useEffect } from "react";
import { useRouter } from "next/router";

function SubscriptionCard({
  isRecommended,
  isCurrent,
  price,
  onSubscribe,
  onManage,
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
        isRecommended &&
          "border-primary-400 border-2 relative overflow-visible",
        isCurrent && "border-secondary-400 border-2 relative overflow-visible"
      )}
      isBlurred
    >
      {isCurrent ? (
        <div className="absolute -top-4 z-20 w-full flex">
          <Chip
            variant="dot"
            color="secondary"
            className="mx-auto bg-background"
          >
            Current
          </Chip>
        </div>
      ) : (
        isRecommended && (
          <div className="absolute -top-4 z-20 w-full flex">
            <Chip
              variant="dot"
              color="primary"
              className="mx-auto bg-background"
            >
              Recommended
            </Chip>
          </div>
        )
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
      {onSubscribe && (
        <>
          <Divider />
          <CardFooter className="justify-center">
            <Button
              color="primary"
              className="bg-gradient-to-r from-teal-500 to-teal-700 flex flex-col gap-1 h-12 w-32"
              onPress={onSubscribe}
            >
              <span>Try Free</span>
              <span className="text-xs">For 7 days</span>
            </Button>
          </CardFooter>
        </>
      )}
      {onManage && (
        <>
          <Divider />
          <CardFooter className="justify-center">
            <Button
              color="primary"
              className="bg-gradient-to-r from-secondary-500 to-secondary-300"
              startContent={<Settings />}
              onPress={onManage}
            >
              Manage
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}

const createCheckoutSession = graphql(`
  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {
    createCheckoutSession(input: $input)
  }
`);

const createBillingPortalSession = graphql(`
  mutation CreateBillingPortalSession {
    createBillingPortalSession
  }
`);

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

export default function Subscription() {
  const router = useRouter();
  const success = getQueryParam(router.query.success);
  const canceled = getQueryParam(router.query.canceled);

  const { data } = useQuery(getSubscription);

  const [mutate] = useMutation(createCheckoutSession);
  const [mutateBillingPortalSession] = useMutation(createBillingPortalSession);

  useEffect(() => {
    if (success) {
      addToast({
        title: "Checkout complete",
        description:
          "Thanks for your purchase! Your subscription is now active and you're all set to explore your new features.",
        color: "success",
      });
    } else if (canceled) {
      addToast({
        title: "Checkout canceled",
        description:
          "Your payment process was canceled. If this was a mistake, you can try again or contact support for assistance.",
        color: "warning",
      });
    }
  }, [canceled, success]);

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <main className="p-4 flex flex-col gap-4 relative container mx-auto">
        <h1 className="text-2xl text-center mb-4">Manage your Subscription</h1>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 md:gap-4">
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
            isCurrent={data?.me?.subscription?.tier === SubscriptionTier.Diy}
            onSubscribe={
              data?.me?.subscription?.tier == null
                ? () => {
                    const decodedCookie = decodeURIComponent(document.cookie);
                    const ca = decodedCookie.split(";");
                    const affiliate = ca
                      .find((c) => c.trim().startsWith("affiliate="))
                      ?.substring(11);

                    mutate({
                      variables: {
                        input: { tier: SubscriptionTier.Diy, affiliate },
                      },
                    }).then(
                      ({ data }) =>
                        data?.createCheckoutSession &&
                        (window.location.href = data?.createCheckoutSession)
                    );
                  }
                : undefined
            }
            onManage={
              data?.me?.subscription?.tier === SubscriptionTier.Diy
                ? () => {
                    mutateBillingPortalSession().then(
                      ({ data }) =>
                        data?.createBillingPortalSession &&
                        (window.location.href =
                          data?.createBillingPortalSession)
                    );
                  }
                : undefined
            }
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
            isRecommended={data?.me?.subscription?.tier == null}
            isCurrent={
              data?.me?.subscription?.tier === SubscriptionTier.Enthusiast
            }
            onSubscribe={
              data?.me?.subscription?.tier == null
                ? () => {
                    const decodedCookie = decodeURIComponent(document.cookie);
                    const ca = decodedCookie.split(";");
                    const affiliate = ca
                      .find((c) => c.trim().startsWith("affiliate="))
                      ?.substring(11);

                    mutate({
                      variables: {
                        input: { tier: SubscriptionTier.Enthusiast, affiliate },
                      },
                    }).then(
                      ({ data }) =>
                        data?.createCheckoutSession &&
                        (window.location.href = data?.createCheckoutSession)
                    );
                  }
                : undefined
            }
            onManage={
              data?.me?.subscription?.tier === SubscriptionTier.Enthusiast
                ? () => {
                    mutateBillingPortalSession().then(
                      ({ data }) =>
                        data?.createBillingPortalSession &&
                        (window.location.href =
                          data?.createBillingPortalSession)
                    );
                  }
                : undefined
            }
          />
        </div>
      </main>
    </>
  );
}
