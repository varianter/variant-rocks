import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, getServerSession } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { NextRequest, NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!!,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: { params: { scope: "openid api://chewbacca/.default" } },
      idToken: true,
    }),
  ],

  // TO ENV
  jwt: { secret: process.env.JWT_COOKIE_SECRET },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
        token.access_token = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          id_token: token.id_token,
          access_token: token.access_token,
        });
      }
      console.log(session);
      return session;
    },
  },
};

export async function getProperServerSession(
  req: NextRequest,
  res: NextResponse,
) {
  return await getServerSession(
    req as unknown as NextApiRequest,
    {
      ...res,
      getHeader: (name: string) => res.headers?.get(name),
      setHeader: (name: string, value: string) => res.headers?.set(name, value),
    } as unknown as NextApiResponse,
    authOptions,
  );
}
