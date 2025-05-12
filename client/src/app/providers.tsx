"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";

import AuthenticatedApolloNextAppProvider from "@/apollo-client/next-app-provider";
import { Session } from "next-auth";
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
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </AuthenticatedApolloNextAppProvider>
  );
}
