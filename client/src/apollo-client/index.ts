import { StrictTypedTypePolicies } from "@/gql/apollo-helpers";
import { possibleTypes } from "@/gql/possibleTypes.json";
import {
  ApolloCache,
  ApolloClient,
  InMemoryCache,
  InMemoryCacheConfig,
  makeVar,
  NormalizedCacheObject,
  ReactiveVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { relayStylePagination } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { Session } from "next-auth";
import { RefObject } from "react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

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
      mods: relayStylePagination(["orderBy", "where"]),
      buildLogs: relayStylePagination(["orderBy", "where"]),
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

export const buildClient = ({
  url = process.env.SERVER_URL,
  cache = new InMemoryCache(cacheConfig),
  initialState,
  ...props
}: {
  accessToken?: string;
  getSessionRef?: RefObject<() => Promise<Session | null>>;
  url?: string;
  cache?: ApolloCache<NormalizedCacheObject>;
  initialState?: NormalizedCacheObject | null;
}) => {
  const httpLink = createUploadLink({
    uri: new URL("/graphql", process.env.INTERNAL_SERVER_URL ?? url).toString(),
  });

  const client = new ApolloClient({
    ssrMode: typeof window === "undefined",
    cache,
    link: authLink(props).concat(httpLink),
  });

  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = client.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache as any, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    client.cache.restore(data);
  }

  return client;
};

export const addApolloState = <T extends {}>(
  client: ApolloClient<NormalizedCacheObject>,
  props: T
): T & { [APOLLO_STATE_PROP_NAME]?: any } => {
  if (props) {
    (props as any)[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return props;
};
