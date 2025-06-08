import { Alert, Button, Tab, Tabs } from "@heroui/react";
import { ComponentProps, useEffect, useState } from "react";
import {
  Gauge,
  Images,
  Link,
  ScrollText,
  Settings,
  Wrench,
} from "lucide-react";

import Image from "next/image";
import RootNavbar from "./root-navbar";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { signIn } from "next-auth/react";
import { useConfig } from "@/contexts/config";
import { useHref } from "@/utils/use-href";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getCarBanner = graphql(`
  query GetCarBanner($id: ID!) {
    me {
      id
      settings {
        id
        distanceUnit
        fuelConsumptionUnit
      }
    }
    car(id: $id) {
      id
      name
      bannerImage {
        id
      }
      averageConsumptionLitersPerKm
      odometerKm
    }
  }
`);

export default function PublicCarLayout({
  children,
  ...props
}: ComponentProps<"main">) {
  const router = useRouter();
  const href = useHref();
  const config = useConfig();

  const tabs = [
    {
      name: "Overview",
      href: `/cars/${router.query.id}`,
      active: router.pathname === "/cars/[id]",
      icon: <Gauge className="size-5" />,
    },
    {
      name: "Mods",
      href: `/cars/${router.query.id}/mods`,
      active: router.pathname === "/cars/[id]/mods",
      icon: <Wrench className="size-5" />,
    },
    {
      name: "Build Log",
      href: `/cars/${router.query.id}/build-log`,
      active: router.pathname === "/cars/[id]/build-log",
      icon: <ScrollText className="size-5" />,
    },
    {
      name: "Gallery",
      href: `/cars/${router.query.id}/gallery`,
      active: router.pathname.startsWith("/cars/[id]/gallery"),
      icon: <Images className="size-5" />,
      isDisabled: true,
    },
  ];

  const { data } = useQuery(getCarBanner, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const [providers, setProviders] = useState<{
    [key: string]: { id: string };
  }>({});

  useEffect(() => {
    fetch(config.basePath + "/api/auth/providers")
      .then((res) => res.json())
      .then((providers) => setProviders(providers));
  }, [setProviders]);

  return (
    <>
      <RootNavbar pathname={router.pathname} path={router.asPath} />
      <div className="h-[30vh] relative">
        <Image
          className="h-full w-full rounded-none object-cover"
          src={
            data?.car?.bannerImage?.id
              ? new URL(
                  `/media/${data.car.bannerImage.id}`,
                  config.serverUrl
                ).toString()
              : href("/placeholder.png")
          }
          alt={data?.car?.name ?? "Car banner"}
          fill
        />
      </div>
      <div className="flex items-center sticky h-12 md:h-18 top-16 -mt-12 md:-mt-18 w-full z-20 bg-zinc-900/70 backdrop-blur-sm p-4 gap-4">
        <h2 className="text-2xl md:text-3xl text-white">{data?.car?.name}</h2>
      </div>
      <main {...props}>
        <Tabs
          variant="underlined"
          selectedKey={tabs.find((t) => t.active)?.name ?? ""}
          className="flex sticky h-14 top-28 md:top-34 pt-2 w-full z-20 bg-zinc-700/30 backdrop-blur-md"
        >
          {tabs.map(({ name, icon, active, href, ...t }) => (
            <Tab
              key={name}
              title={
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{name}</span>
                </div>
              }
              href={href}
              {...t}
            >
              {active && (
                <>
                  <div className="container mx-auto p-4">
                    {/* Alert for unauthenticated users */}
                    {data?.me == null && (
                      <Alert
                        color="secondary"
                        variant="faded"
                        title="You're not logged in"
                        description="Create an account or log in to manage your cars, get personalized tuning info, and access all Revline features."
                        endContent={
                          <div className="flex gap-2">
                            <Button
                              onPress={() =>
                                signIn(
                                  Object.values(providers).length === 1 &&
                                    Object.values(providers)[0].id !==
                                      "credentials"
                                    ? Object.values(providers)[0].id
                                    : undefined,
                                  {
                                    redirectTo: router.asPath,
                                  }
                                )
                              }
                              color="primary"
                              size="sm"
                              variant="bordered"
                            >
                              Sign in
                            </Button>
                          </div>
                        }
                      />
                    )}

                    {/* Alert for users without unit settings */}
                    {data?.me && data?.me?.settings == null && (
                      <Alert
                        color="warning"
                        variant="faded"
                        title="Unit settings incomplete"
                        description="To get accurate results, please set your preferred units for torque, power, and other measurements."
                        endContent={
                          <Button
                            as={Link}
                            href="/settings"
                            color="warning"
                            size="sm"
                            variant="flat"
                            startContent={<Settings className="size-4" />}
                          >
                            Configure now
                          </Button>
                        }
                      />
                    )}
                  </div>
                  {children}
                </>
              )}
            </Tab>
          ))}
        </Tabs>
      </main>
    </>
  );
}
