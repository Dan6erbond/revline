import { CheckCircle, CircleAlert } from "lucide-react";
import { Spinner, addToast } from "@heroui/react";

import { ToastProps } from "@heroui/toast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withNotification = <T extends Array<any>, U>(
  payload: Omit<
    ToastProps,
    | "toast"
    | "index"
    | "total"
    | "state"
    | "heights"
    | "setHeights"
    | "isRegionExpanded"
    | "maxVisibleToasts"
  >,
  cb: (...args: T) => Promise<U>,
  completedPayload?: Omit<
    ToastProps,
    | "toast"
    | "index"
    | "total"
    | "state"
    | "heights"
    | "setHeights"
    | "isRegionExpanded"
    | "maxVisibleToasts"
  >,
  handleError?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
  ) => void | Omit<
    ToastProps,
    | "toast"
    | "index"
    | "total"
    | "state"
    | "heights"
    | "setHeights"
    | "isRegionExpanded"
    | "maxVisibleToasts"
  >
) => {
  return async (...args: T) => {
    try {
      const promise = cb(...args);

      addToast({
        promise,
        loadingIcon: <Spinner />,
        description: "Please wait a moment.",
        timeout: 1,
        ...payload,
      });

      const res = await promise;

      addToast({
        title: "Success!",
        icon: <CheckCircle color="hsl(var(--heroui-primary-700))" />,
        color: "success",
        ...completedPayload,
      });

      return res;
    } catch (error) {
      const errorPayload = handleError?.(error);

      addToast({
        icon: <CircleAlert />,
        title: "An error occurred!",
        description: "Please try again later.",
        color: "danger",
        ...(errorPayload ?? {}),
      });
    }
  };
};
