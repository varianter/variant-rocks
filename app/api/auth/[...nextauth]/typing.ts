import { Session } from "next-auth";

export interface CustomSession extends Session {
  access_token: string;
}
