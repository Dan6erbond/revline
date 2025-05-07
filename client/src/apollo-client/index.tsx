import {
  ApolloClient,
  InMemoryCache,
  InMemoryCacheConfig,
  makeVar,
  ReactiveVar,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { Session } from "next-auth";
import { RefObject } from "react";
import { StrictTypedTypePolicies } from "@/gql/apollo-helpers";
import { possibleTypes } from "@/gql/possibleTypes.json";

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

const typePolicies = {
  UpcomingService: {
    keyFields: false,
  },
  Car: {
    fields: {
      tasks: relayStylePagination(["orderBy", "where"]),
      showSubtasks: {
        read(_, { storage }) {
          if (!storage.var) {
            storage.var = makeVar(false);
          }

          return storage.var();
        },
        merge(_, incoming, { storage }) {
          if (!storage.var) {
            storage.var = makeVar(incoming);
          } else {
            (storage.var as ReactiveVar<boolean>)(incoming);
          }
        },
      },
    },
  },
} satisfies StrictTypedTypePolicies;

export const cacheConfig = {
  typePolicies,
  possibleTypes,
} satisfies InMemoryCacheConfig;

export const buildClient = (props: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
}) =>
  new ApolloClient({
    cache: new InMemoryCache(cacheConfig),
    link: authLink(props).concat(httpLink),
  });
