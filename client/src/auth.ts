import NextAuth from "next-auth";
import Zitadel from "next-auth/providers/zitadel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Zitadel({
      issuer: "https://dev-zjslvu.us1.zitadel.cloud/",
    }),
  ],
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // TODO: Check if access token is expired then generate a new one

      return token;
    },
    session: ({ session }) => {
      return session;
    },
    signIn: ({}) => {
      // TODO: Check if user has profile in Revline otherwise redirect to /complete-profile
      return true;
    },
  },
});
