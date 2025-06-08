import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: { id: string; email: string; createTime: string } | null;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare global {
  namespace umami {
    interface umami {
      identify(unique_id: string, data?: object): void;
      identify(data: object): void;
    }
  }
}
