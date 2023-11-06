import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface CustomSession extends Session {
  access_token: string;
}

export interface CustomToken extends JWT {
  expiry: number; //unix timestamp
  access_token: string | undefined;
  refresh_token: string | undefined;
}
