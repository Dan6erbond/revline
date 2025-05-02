"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";

import { ApolloProvider } from "@apollo/client";
import { Session } from "next-auth";
import { buildClient } from ".";
import { useSession } from "next-auth/react";
import { useWithResolvers } from "@/utils/with-resolvers";

const AuthenticatedApolloProvider = ({ children }: { children: ReactNode }) => {
  const { data, status } = useSession();

  const [promise, resolve] = useWithResolvers<Session | null>();

  const getSessionRef = useRef(() => promise);

  useEffect(() => {
    if (status !== "loading") {
      getSessionRef.current = async () => data;

      resolve(data);
    }
  }, [data, status, resolve]);

  const client = useMemo(() => buildClient({ getSessionRef }), [getSessionRef]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthenticatedApolloProvider;
