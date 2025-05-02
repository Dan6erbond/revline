"use client";

import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { ReactNode, RefObject, useCallback, useEffect, useRef } from "react";
import { authLink, cacheConfig, httpLink } from ".";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useWithResolvers } from "@/utils/with-resolvers";

export const buildClient = (props: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
}) =>
  new ApolloClient({
    link: authLink(props).concat(httpLink),
    cache: new InMemoryCache(cacheConfig),
  });

const AuthenticatedApolloNextAppProvider = ({
  children,
  session = null,
}: {
  children: ReactNode;
  session?: Session | null;
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
    () => buildClient({ getSessionRef, accessToken: session?.accessToken }),
    [getSessionRef, session]
  );

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
};

export default AuthenticatedApolloNextAppProvider;
