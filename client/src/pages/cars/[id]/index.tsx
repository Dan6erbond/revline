import { ComponentProps, Suspense } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { addApolloState, buildClient } from "@/apollo-client";

import CarHead from "@/components/car/head";
import CarLayout from "@/components/layout/car-layout";
import { GetCarWithOwnerQuery } from "@/gql/graphql";
import PublicCarLayout from "@/components/layout/public-car-layout";
import PublicOverview from "@/components/car/public-overview";
import { auth } from "@/auth";
import dynamic from "next/dynamic";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useSession } from "next-auth/react";

const Expenses = dynamic(() => import("@/components/expenses"), { ssr: false });

const getCarWithOwner = graphql(`
  query GetCarWithOwner($id: ID!) {
    me {
      id
      settings {
        id
        powerUnit
        torqueUnit
      }
    }
    car(id: $id) {
      id
      name
      make
      model
      trim
      year
      bannerImage {
        id
        url
      }
      owner {
        id
        email
        profile {
          id
          username
        }
      }
    }
  }
`);

export default function Car({
  data,
  ...props
}: {
  data: GetCarWithOwnerQuery;
  baseUrl: string;
  basePath: string;
}) {
  const { data: session } = useSession();

  if (!session || data.car.owner?.id !== session.user?.id) {
    return (
      <PublicCarLayout>
        <CarHead car={data.car} {...props} />
        <PublicOverview />
      </PublicCarLayout>
    );
  }

  return (
    <CarLayout>
      <CarHead car={data.car} {...props} />
      <Suspense fallback="Loading...">
        <Expenses />
      </Suspense>
    </CarLayout>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<ComponentProps<typeof Car> & { [key: string]: any }>
> {
  const session = await auth(ctx);
  const client = buildClient({ accessToken: session?.accessToken });

  const { data } = await client.query({
    query: getCarWithOwner,
    variables: { id: getQueryParam(ctx.params?.id)! },
  });

  return {
    props: addApolloState(client, {
      data,
      session,
      baseUrl: new URL(
        (
          process.env.COOLIFY_URL ??
          process.env.BASE_URL ??
          "http://localhost:3001"
        ).split(",")[0]
      ).origin,
      basePath: process.env.BASE_PATH ?? "",
    }),
  };
}
