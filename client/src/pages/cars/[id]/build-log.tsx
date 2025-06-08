import {
  BuildLogOrderField,
  GetCarWithOwnerQuery,
  OrderDirection,
} from "@/gql/graphql";
import { Card, CardBody, Divider, Skeleton, Spinner } from "@heroui/react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { addApolloState, buildClient } from "@/apollo-client";

import CarHead from "@/components/car/head";
import { ComponentProps } from "react";
import { MediaPreview } from "@/components/media/item";
import ModChip from "@/mods/chip";
import PublicCarLayout from "@/components/layout/public-car-layout";
import { auth } from "@/auth";
import { createExtensions } from "@/components/minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getCarWithOwner } from "@/car/queries";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useIntersectionObserver } from "@heroui/use-intersection-observer";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getBuildLogs = graphql(`
  query GetBuildLogs(
    $id: ID!
    $where: BuildLogWhereInput
    $first: Int
    $after: Cursor
    $orderBy: [BuildLogOrder!]
  ) {
    car(id: $id) {
      id
      buildLogs(
        where: $where
        first: $first
        after: $after
        orderBy: $orderBy
      ) {
        edges {
          node {
            id
            title
            notes
            media {
              id
              ...MediaItem
            }
            mods {
              id
              title
              category
              status
              description
              stage
            }
            logTime
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
    }
  }
`);

export default function BuildLog({
  data: carData,
  ...props
}: {
  data: GetCarWithOwnerQuery;
  baseUrl: string;
  basePath: string;
}) {
  const router = useRouter();

  const { data, loading, error, fetchMore } = useQuery(getBuildLogs, {
    variables: {
      id: getQueryParam(router.query.id) as string,
      first: 10,
      orderBy: [
        { field: BuildLogOrderField.LogTime, direction: OrderDirection.Desc },
      ],
    },
    skip: !getQueryParam(router.query.id),
  });

  const [loaderRef] = useIntersectionObserver({
    isEnabled: data?.car.buildLogs.pageInfo.hasNextPage && !loading,
    onChange: (isIntersecting) =>
      isIntersecting &&
      data?.car.buildLogs.edges &&
      fetchMore({
        variables: {
          after:
            data.car.buildLogs.edges[data.car.buildLogs.edges.length - 1]
              ?.cursor,
        },
      }),
  });

  return (
    <PublicCarLayout>
      <CarHead car={carData.car} page="build-log" {...props} />
      <section className="container mx-auto p-4 md:p-6">
        <h1 className="mb-10 text-2xl font-bold tracking-tighter text-foreground sm:text-3xl">
          Build Log
        </h1>

        {error && <p>Error loading build logs.</p>}

        <div className="relative mx-auto max-w-4xl">
          <Divider
            orientation="vertical"
            className="absolute top-4 left-2 bg-content4"
          />

          {data?.car.buildLogs.edges?.map((e) => (
            <div key={e?.node?.id} className="relative mb-10 pl-8">
              <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-foreground" />

              <h4 className="rounded-xl py-2 text-xl font-bold tracking-tight xl:mb-4 xl:px-3">
                {e?.node?.title}
              </h4>

              <h5 className="text-md top-3 -left-34 rounded-xl tracking-tight text-muted-foreground xl:absolute">
                {e?.node?.logTime
                  ? new Date(e?.node?.logTime).toLocaleDateString()
                  : ""}
              </h5>

              <Card className="my-5 border-none shadow-none">
                <CardBody className="flex flex-col gap-4">
                  <div
                    className="prose text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: generateHTML(
                        e?.node?.notes,
                        createExtensions("")
                      ),
                    }}
                  />

                  {e?.node?.media && e?.node?.media.length > 0 && (
                    <div className="flex flex-nowrap gap-4 overflow-x-auto p-2">
                      {e?.node?.media.map((m) => (
                        <div className="aspect-square shrink-0 relative h-[150px] md:h-[200px] lg:h-[250px] rounded-xl overflow-hidden border-2 border-content4">
                          <MediaPreview item={m} key={m.id} />
                        </div>
                      ))}
                    </div>
                  )}

                  {e?.node?.mods && e.node.mods.length > 0 && (
                    <div className="space-y-2">
                      <p>Mods</p>
                      <div className="flex flex-wrap gap-2">
                        {e.node.mods.map((mod) => (
                          <ModChip key={mod.id} variant="faded" mod={mod} />
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}

          {loading &&
            Array(10)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="relative mb-10 pl-8">
                  <div className="absolute top-3.5 left-0 flex size-4 items-center justify-center rounded-full bg-default-300" />

                  <Card className="my-5 border-none shadow-none">
                    <CardBody className="flex flex-col gap-4">
                      <Skeleton className="rounded-lg w-4/5">
                        <div className="h-5 bg-default-300 rounded-lg" />
                      </Skeleton>
                      <Skeleton className="rounded-lg w-3/5">
                        <div className="h-4 bg-default-200 rounded-lg" />
                      </Skeleton>
                      <Skeleton className="rounded-lg w-full">
                        <div className="h-16 bg-default-100 rounded-lg" />
                      </Skeleton>
                      <div className="space-y-2">
                        <Skeleton className="w-2/3 rounded-lg">
                          <div className="h-3 bg-default-200 rounded-lg" />
                        </Skeleton>
                        <Skeleton className="w-1/2 rounded-lg">
                          <div className="h-3 bg-default-300 rounded-lg" />
                        </Skeleton>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              ))}
        </div>

        {!loading && data?.car.buildLogs.pageInfo.hasNextPage && (
          <div className="flex w-full justify-center mt-10">
            <Spinner ref={loaderRef} color="white" />
          </div>
        )}
      </section>
    </PublicCarLayout>
  );
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<
    ComponentProps<typeof BuildLog> & { [key: string]: any }
  >
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
