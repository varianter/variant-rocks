import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../api/auth/auth-options";
import { SalesGPT } from "../components/salesGPT";

export default async function App() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return <SalesGPT />;
}
