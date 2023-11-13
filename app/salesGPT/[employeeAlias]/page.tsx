import { redirect } from "next/navigation";
import Error from "next/error";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/auth-options";
import EmployeeCV from "@/app/components/employeeCV";
import { CustomSession } from "@/app/api/auth/[...nextauth]/typing";
import { getEmployeeData } from "@/app/function/Employees";

export default async function App({
  params,
}: {
  params: { employeeAlias: string };
}) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  if (!session) {
    return redirect("/api/auth/signin");
  }
  const employee = await getEmployeeData(params.employeeAlias);

  return <EmployeeCV employee={employee} />;
}
