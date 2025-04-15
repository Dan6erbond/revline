import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { ReactNode, useCallback, useMemo } from "react";

import { ApolloProvider } from "@apollo/client/react/context";
import { Session } from "next-auth";
import { setContext } from "@apollo/client/link/context";
import { useSession } from "next-auth/react";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = (getSession: () => Promise<Session | null>) =>
  setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const session = await getSession();
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

export const buildClient = (getSession: () => Promise<Session | null>) =>
  new ApolloClient({
    link: authLink(getSession).concat(httpLink),
    cache: new InMemoryCache(),
  });

export const AuthenticatedApolloProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data } = useSession();

  const getSession = useCallback(async () => data, [data]);

  const client = useMemo(() => buildClient(getSession), [getSession]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
