import { ApolloClient, InMemoryCache } from "@apollo/client";

import { RefObject } from "react";
import { Session } from "next-auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";

const httpLink = createUploadLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = (getSessionRef: RefObject<() => Promise<Session | null>>) =>
  setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const session = await getSessionRef.current();
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: session?.accessToken
          ? `Bearer ${session.accessToken}`
          : "",
      },
    };
  });

export const buildClient = (
  getSessionRef: RefObject<() => Promise<Session | null>>
) =>
  new ApolloClient({
    link: authLink(getSessionRef).concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        UpcomingService: {
          keyFields: false,
        },
      },
    }),
  });
