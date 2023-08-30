import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../../api/auth/auth-options";
import { getAccessToken, getEmployeeCVData } from "../../function/Employees";
import EmployeeCV from "@/app/components/employeeCV";

export default async function App({
  params,
}: {
  params: { employeeAlias: string };
}) {
  const employeeCV = await getEmployeeCVData(params.employeeAlias);
  const session = await getServerSession(authOptions);
  const token = await getAccessToken();
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return <EmployeeCV token={token} employeeCv={employeeCV} />;
}
