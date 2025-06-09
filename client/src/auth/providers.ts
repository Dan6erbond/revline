import { OAuth2Config, OIDCConfig, Provider } from "next-auth/providers";

import { Profile } from "next-auth";
import ZITADEL from "next-auth/providers/zitadel";

export const providers: Provider[] = [
  ...(process.env.AUTH_ZITADEL_ISSUER
    ? [
        ZITADEL({
          issuer: process.env.AUTH_ZITADEL_ISSUER,
        }),
      ]
    : []),
  ...JSON.parse(process.env.AUTH_PROVIDERS ?? `[]`).map(
    ({
      id,
      name,
      type = "oidc",
      issuer,
      clientId,
      clientSecret,
      useIdToken,
    }: (OIDCConfig<Profile> | OAuth2Config<Profile>) & {
      useIdToken?: boolean;
    }) => ({
      id,
      name,
      type,
      issuer,
      clientId,
      clientSecret,
      useIdToken,
    })
  ),
];

export const resolvedProviders = providers.map((provider) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  let providerData: Exclude<Provider, Function> & { useIdToken?: boolean };

  if (typeof provider === "function") {
    providerData = provider();
  } else {
    providerData = provider;
  }

  return {
    id: providerData.id,
    name: providerData.name,
    useIdToken: providerData.id === "zitadel" || providerData.useIdToken,
  };
});
