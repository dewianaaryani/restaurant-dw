import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface User {
    active?: boolean;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      active?: boolean;
      role?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    active?: boolean;
    role?: string;
  }
}
