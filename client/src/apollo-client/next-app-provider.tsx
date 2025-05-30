"use client";

import { ApolloClient, InMemoryCache } from "@apollo/client-integration-nextjs";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { authLink, cacheConfig } from ".";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { RefObject } from "react";
import { Session } from "next-auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { useSession } from "next-auth/react";
import { useWithResolvers } from "@/utils/with-resolvers";

export const buildClient = ({
  url,
  ...props
}: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
  url: string;
}) => {
  const httpLink = createUploadLink({
    uri: new URL("/graphql", url).toString(),
  });

  return new ApolloClient({
    link: authLink(props).concat(httpLink),
    cache: new InMemoryCache(cacheConfig),
  });
};

const AuthenticatedApolloNextAppProvider = ({
  children,
  session = null,
  url,
}: {
  children: ReactNode;
  session?: Session | null;
  url: string;
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

  const makeClient = useCallback(
    () =>
      buildClient({ getSessionRef, accessToken: session?.accessToken, url }),
    [getSessionRef, session]
  );

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default AuthenticatedApolloNextAppProvider;
