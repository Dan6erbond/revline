import {
  ApolloClient,
  InMemoryCache,
  InMemoryCacheConfig,
} from "@apollo/client";

import { RefObject } from "react";
import { Session } from "next-auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";

export const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

export const authLink = ({
  accessToken,
  getSessionRef,
}: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
}) =>
  setContext(async (_, { headers }) => {
    const at =
      accessToken ??
      (await getSessionRef?.current().then((s) => s?.accessToken));
    return {
      headers: {
        ...headers,
        authorization: at ? `Bearer ${at}` : undefined,
      },
    };
  });

export const cacheConfig = {
  typePolicies: {
    UpcomingService: {
      keyFields: false,
    },
  },
} satisfies InMemoryCacheConfig;

export const buildClient = (props: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
}) =>
  new ApolloClient({
    link: authLink(props).concat(httpLink),
    cache: new InMemoryCache(cacheConfig),
  });
