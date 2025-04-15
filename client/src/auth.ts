import NextAuth from "next-auth";
import Zitadel from "next-auth/providers/zitadel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Zitadel({
      issuer: process.env.AUTH_ZITADEL_ISSUER,
    }),
  ],
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // TODO: Check if access token is expired then generate a new one

      return token;
    },
    session: ({ session, token }) => {
      return { ...session, accessToken: token.idToken };
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
