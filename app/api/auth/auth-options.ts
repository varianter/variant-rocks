import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_AD_TENANT_ID ?? "",

      idToken: true,
    }),
  ],

  // TO ENV
  secret: process.env.JWT_COOKIE_SECRET,

  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  // session: {
  //   strategy: "jwt",
  // },
};
