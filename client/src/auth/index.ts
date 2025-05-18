import NextAuth from "next-auth";
import { buildClient } from "@/apollo-client";
import { graphql } from "@/gql";
import { providers } from "./providers";

const basePath = process.env.BASE_PATH ?? "";

export const { auth, handlers, signIn, signOut } = NextAuth({
  basePath: `${basePath}/api/auth`,
  providers,
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
          accessToken: token.accessToken,
        }).query({
          query: graphql(`
            query GetMe {
              me {
                id
                email
                createTime
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
    redirect: ({ url, baseUrl }) => {
      const u = new URL(url, baseUrl);

      const path = u.pathname.replace(new RegExp(`^(${basePath})+`), "");

      u.pathname = basePath + (path.startsWith("/") ? "" : "/") + path;

      return u.toString();
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
