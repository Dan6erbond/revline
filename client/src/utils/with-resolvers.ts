import { useState } from "react";

export const withResolvers = <T>() => {
  let resolve: (value: T | PromiseLike<T>) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve!, reject!] as const;
};

export const useWithResolvers = <T>() => {
  const [withResolversRet] = useState(withResolvers<T>());
  return withResolversRet;
};
