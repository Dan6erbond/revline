import { AuthError } from "next-auth";
import SignInForm from "./form";
import { redirect } from "next/navigation";
import { resolvedProviders } from "@/auth/providers";
import { signIn } from "@/auth";

const SIGNIN_ERROR_URL = "/auth/signin";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
  const signInAction = async (
    provider?: string | undefined,
    options?:
      | FormData
      | ({
          redirectTo?: string;
          redirect?: true | undefined;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } & Record<string, any>)
      | undefined,
    authorizationParams?:
      | string[][]
      | Record<string, string>
      | string
      | URLSearchParams
  ) => {
    "use server";
    try {
      await signIn(provider, options, authorizationParams);
    } catch (error) {
      // Signin can fail for a number of reasons, such as the user
      // not existing, or the user not having the correct role.
      // In some cases, you may want to redirect to a custom error
      if (error instanceof AuthError) {
        return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
      }

      // Otherwise if a redirects happens Next.js can handle it
      // so you can just re-thrown the error and let Next.js handle it.
      // Docs:
      // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
      throw error;
    }
  };

  const { callbackUrl } = await searchParams;

  return (
    <SignInForm
      callbackUrl={callbackUrl}
      signIn={signInAction}
      providers={resolvedProviders}
    />
  );
}
