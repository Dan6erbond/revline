import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useDebounce<T extends Array<any>>({
  delay = 500,
  handle,
  immediateHandler,
}: {
  delay?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (...args: T) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  immediateHandler?: (...args: T) => any;
}) {
  const [handler, setHandler] = useState<NodeJS.Timeout | null>(null);

  return (...args: T) => {
    if (handler) clearTimeout(handler);

    setHandler(setTimeout(() => handle(...args), delay));
    immediateHandler?.(...args);
  };
}
