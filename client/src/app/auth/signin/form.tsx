"use client";

import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";

import { providerMap } from "@/auth/providers";
import { useEffect } from "react";

export default function SignInForm({
  callbackUrl,
  signIn,
}: {
  callbackUrl?: string;
  signIn: (
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
  ) => void;
}) {
  useEffect(() => {
    if (Object.values(providerMap).length > 0) {
      signIn(Object.values(providerMap)[0].id, {
        redirectTo: callbackUrl ?? "",
      });
    }
  });

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)] bg-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col text-center gap-2">
          <h2 className="text-2xl font-bold text-content-1-foreground">
            Sign In to Revline 1
          </h2>
          <p className="text-sm text-content-3-foreground">
            Access your garage, media and projects.
          </p>
        </CardHeader>
        <CardBody className="p-6 flex flex-col gap-6">
          <form
            action={async (formData) => {
              await signIn("credentials", formData);
            }}
            className="flex flex-col gap-4"
          >
            <Input
              label="Email"
              name="email"
              id="email"
              placeholder="you@example.com"
              type="email"
              required
            />
            <Input
              label="Password"
              name="password"
              id="password"
              type="password"
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="border-t pt-4 space-y-2">
            {Object.values(providerMap).map((provider) => (
              <Button
                color="secondary"
                className="w-full"
                onPress={() =>
                  signIn(provider.id, {
                    redirectTo: callbackUrl ?? "",
                  })
                }
                key={provider.id}
              >
                Sign in with {provider.name}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
