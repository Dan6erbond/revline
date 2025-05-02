import { ApolloClient, InMemoryCache, registerApolloClient } from "@apollo/client-integration-nextjs";
import { cacheConfig, httpLink } from ".";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(cacheConfig),
    link: httpLink,
  });
});
