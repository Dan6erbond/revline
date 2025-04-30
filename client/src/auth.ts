import NextAuth from "next-auth";
import Zitadel from "next-auth/providers/zitadel";
import { buildClient } from "./apollo-client";
import { graphql } from "./gql";

export const { handlers, signIn, signOut, auth } = NextAuth({
  basePath: process.env.BASE_PATH,
  providers: [
    Zitadel({
      issuer: process.env.AUTH_ZITADEL_ISSUER,
    }),
  ],
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        if (account.provider === "zitadel") {
          token.accessToken = account.id_token;
        } else {
          token.accessToken = account.access_token;
        }
        token.refreshToken = account.refresh_token;
      }

      return token;
    },
    session: async ({ session, token }) => {
      let user = session.user;

      if (!user.id) {
        const { data } = await buildClient({
          current: async () => ({
            ...session,
            accessToken: token.accessToken,
          }),
        }).query({
          query: graphql(`
            query GetMe {
              me {
                id
                email
              }
            }
          `),
        });

        if (data.me) {
          user = { ...data.me, ...user };
        }
      }

      return { ...session, user, accessToken: token.accessToken };
    },
    signIn: async () => {
      /* if (account) {
        const { data } = await buildClient(
          async () =>
            ({
              user,
              accessToken: account.id_token,
            } as Session)
        ).query({
          query: graphql(`
            query GetProfile {
              profile {
                username
              }
            }
          `),
        });

        if (!data.profile) {
          return "/complete-profile";
        }
      } */

      return true;
    },
  },
});
