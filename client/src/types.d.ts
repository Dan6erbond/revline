import "next-auth";
import "next-auth/jwt";
import "currency-codes/data";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: { id?: string };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "currency-codes/data" {
  interface CurrencyCodeData {
    code: string;
    number: string;
    digits: number;
    currency: string;
    countries: string[];
  }

  const data: CurrencyCodeData[];
  export default data;
}
