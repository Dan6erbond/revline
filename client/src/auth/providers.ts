import { Provider } from "next-auth/providers";
import ZITADEL from "next-auth/providers/zitadel";

export const providers: Provider[] = [
  ZITADEL({
    issuer: process.env.AUTH_ZITADEL_ISSUER,
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");
