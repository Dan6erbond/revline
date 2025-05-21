import { Button, Snippet } from "@heroui/react";
import { HandCoins, Link, Link2, LogIn, UsersRound } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";

import React from "react";
import RootNavbar from "@/components/layout/root-navbar";
import { graphql } from "../gql";
import { useHref } from "../utils/use-href";
import { useRouter } from "next/router";

const getConnectAccountId = graphql(`
  query GetConnectAccountId {
    me {
      id
      stripeAccountID
      affiliate6moCode
      affiliate12moCode
    }
  }
`);

const createConnectAccount = graphql(`
  mutation CreateConnectAccount {
    createConnectAccount {
      id
      stripeAccountID
      affiliate6moCode
      affiliate12moCode
    }
  }
`);

const linkConnectAccount = graphql(`
  mutation LinkConnectAccount {
    linkConnectAccount
  }
`);

const createExpressLoginLink = graphql(`
  mutation CreateExpressLoginLink {
    createExpressLoginLink
  }
`);

export default function Affiliate() {
  const router = useRouter();

  const href = useHref();

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const { data } = useQuery(getConnectAccountId);

  const [mutateCreateConnectAccount, { loading: isCreatingConnectAccount }] =
    useMutation(createConnectAccount);

  const [mutateLinkConnectAccount, { loading: isLinkingConnectAccount }] =
    useMutation(linkConnectAccount);

  const [
    mutateCreateExpressLoginLink,
    { loading: isCreatingExpressLoginLink },
  ] = useMutation(createExpressLoginLink);

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <main className="container mx-auto p-4 md:p-8 flex flex-col gap-4 md:gap-6">
        <div className="bg-default shadow-sm rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 text-primary p-3 rounded-full">
              <HandCoins className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-content1-foreground">
                Join the Revline Affiliate Program
              </h1>
              <p className="text-content2-foreground mt-1 max-w-xl">
                Earn money by referring car enthusiasts and DIY mechanics to
                Revline 1. Choose your model: get a{" "}
                <span className="font-medium text-primary">
                  20% commission for a full year
                </span>{" "}
                or a{" "}
                <span className="font-medium text-primary">
                  30% commission over 6 months
                </span>{" "}
                on their active subscriptions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-content3">
            <UsersRound className="size-4" />
            <span>Partner with us and grow together</span>
          </div>
        </div>
        {data?.me.stripeAccountID ? (
          <div className="flex flex-col gap-4 md:gap-6">
            <div>
              <h2 className="text-lg font-semibold text-content1-foreground mb-2">
                Your affiliate account is active
              </h2>
              <p className="text-content2-foreground mb-4">
                You&apos;re set up to receive commissions. Use the button below
                to manage your Stripe account details and view payouts.
              </p>
              <Button
                variant="flat"
                size="lg"
                endContent={<LogIn className="size-5" />}
                onPress={() => {
                  mutateCreateExpressLoginLink().then(({ data }) => {
                    if (!data?.createExpressLoginLink) return;

                    window.location.href = data.createExpressLoginLink;
                  });
                }}
                isLoading={isCreatingExpressLoginLink}
              >
                Open Stripe Dashboard
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-content1-foreground mb-2">
                Share your affiliate links
              </h2>
              <p className="text-content2-foreground mb-4">
                Share one of the links below to start earning based on your
                preferred commission model. Each user who signs up using your
                link will be tracked automatically.
              </p>
              <div className="flex">
                <div className="flex-1">
                  <p className="mb-1 font-medium text-content2-foreground">
                    6-month / 30% commission:
                  </p>
                  <Snippet
                    color="default"
                    codeString={`${origin}/subscription?affiliate=${data.me.affiliate6moCode}`}
                    symbol={<Link2 className="inline-block size-5 mr-2" />}
                  >
                    {data.me.affiliate6moCode}
                  </Snippet>
                </div>
                <div className="flex-1">
                  <p className="mb-1 font-medium text-content2-foreground">
                    12-month / 20% commission:
                  </p>
                  <Snippet
                    color="default"
                    codeString={`${origin}/subscription?affiliate=${data.me.affiliate12moCode}`}
                    symbol={<Link2 className="inline-block size-5 mr-2" />}
                  >
                    {data.me.affiliate12moCode}
                  </Snippet>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-content1-foreground mb-2">
              Set up your affiliate account
            </h2>
            <p className="text-content2-foreground mb-4">
              To start earning commissions, connect your Stripe account.
              We&apos;ll use this to send payouts automatically based on your
              referred users&apos; active subscriptions.
            </p>
            <Button
              variant="flat"
              size="lg"
              className="self-center"
              endContent={<Link className="size-5" />}
              onPress={() => {
                mutateCreateConnectAccount()
                  .then(({ data }) => {
                    if (!data?.createConnectAccount) return;

                    return mutateLinkConnectAccount();
                  })
                  .then((res) => {
                    if (!res?.data?.linkConnectAccount) return;

                    window.location.href = res.data.linkConnectAccount;
                  });
              }}
              isLoading={isCreatingConnectAccount || isLinkingConnectAccount}
            >
              Connect Stripe Account
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
