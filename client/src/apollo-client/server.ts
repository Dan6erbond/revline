import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { authLink, cacheConfig } from ".";

import { RefObject } from "react";
import { Session } from "next-auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

export const buildClient = ({
  url,
  ...props
}: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
  url: string;
}) => {
  const httpLink = createUploadLink({
    uri: new URL("/graphql", process.env.INTERNAL_SERVER_URL ?? url).toString(),
  });

  return new ApolloClient({
    link: authLink(props).concat(httpLink),
    cache: new InMemoryCache(cacheConfig),
  });
};

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return buildClient({ url: process.env.SERVER_URL! });
});
