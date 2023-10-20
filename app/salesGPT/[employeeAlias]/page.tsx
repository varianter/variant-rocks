import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../../api/auth/auth-options";
import EmployeeCV from "@/app/components/employeeCV";
import { CustomSession } from "@/app/api/auth/[...nextauth]/typing";

export default async function App({
  params,
}: {
  params: { employeeAlias: string };
}) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return <EmployeeCV employeeAlias={params.employeeAlias} />;
}
