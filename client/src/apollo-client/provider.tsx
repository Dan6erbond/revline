import { ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { ApolloProvider } from "@apollo/client";
import { Session } from "next-auth";
import { buildClient } from "./index";
import { useSession } from "next-auth/react";

const withResolvers = <T,>() => {
  let resolve: (value: T | PromiseLike<T>) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve!, reject!] as const;
};

export const useWithResolvers = <T,>() => {
  const [withResolversRet] = useState(withResolvers<T>());
  return withResolversRet;
};

const AuthenticatedApolloProvider = ({ children }: { children: ReactNode }) => {
  const { data, status } = useSession();

  const [promise, resolve] = useWithResolvers<Session | null>();

  const getSessionRef = useRef(() => promise);

  useEffect(() => {
    if (status !== "loading") {
      getSessionRef.current = async () => data;

      resolve(data);
    }
  }, [data, status, resolve]);

  const client = useMemo(() => buildClient(getSessionRef), [getSessionRef]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthenticatedApolloProvider;
