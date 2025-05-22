"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

import AffiliateCookie from "./affiliate";
import AuthenticatedApolloNextAppProvider from "@/apollo-client/next-app-provider";
import { Session } from "next-auth";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const router = useRouter();

  return (
    <AuthenticatedApolloNextAppProvider session={session}>
      <HeroUIProvider navigate={router.push}>
        <Suspense>
          <AffiliateCookie />
        </Suspense>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </AuthenticatedApolloNextAppProvider>
  );
}
