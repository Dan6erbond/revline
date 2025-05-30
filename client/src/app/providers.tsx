"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

import AffiliateCookie from "./affiliate";
import AuthenticatedApolloNextAppProvider from "@/apollo-client/next-app-provider";
import ConfigProvider from "@/contexts/config";
import { Session } from "next-auth";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

export function Providers({
  children,
  session,
  serverUrl,
  basePath,
}: {
  children: React.ReactNode;
  session?: Session | null;
  serverUrl: string;
  basePath: string;
}) {
  const router = useRouter();

  return (
    <ConfigProvider basePath={basePath}>
      <AuthenticatedApolloNextAppProvider session={session} url={serverUrl}>
        <HeroUIProvider navigate={router.push}>
          <Suspense>
            <AffiliateCookie />
          </Suspense>
          <ToastProvider />
          {children}
        </HeroUIProvider>
      </AuthenticatedApolloNextAppProvider>
    </ConfigProvider>
  );
}
