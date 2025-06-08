"use client";

import { APOLLO_STATE_PROP_NAME, buildClient } from ".";
import { ReactNode, useEffect, useMemo, useRef } from "react";

import { ApolloProvider } from "@apollo/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useWithResolvers } from "@/utils/with-resolvers";

const AuthenticatedApolloProvider = ({
  children,
  session = null,
  url,
  pageProps,
}: {
  children: ReactNode;
  url: string;
  session?: Session | null;
  pageProps: any;
}) => {
  const { data, status } = useSession();

  const [promise, resolve] = useWithResolvers<Session | null>();

  const getSessionRef = useRef(() => promise);

  useEffect(() => {
    if (status !== "loading") {
      getSessionRef.current = async () => data;

      resolve(data);
    }
  }, [data, status, resolve]);

  const initialState = useMemo(
    () => pageProps[APOLLO_STATE_PROP_NAME],
    [pageProps]
  );

  const client = useMemo(
    () =>
      buildClient({
        getSessionRef,
        accessToken: session?.accessToken,
        url,
        initialState,
      }),
    [getSessionRef, session, url, initialState]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthenticatedApolloProvider;
