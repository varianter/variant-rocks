import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../../api/auth/auth-options";
import { getEmployeeCVData } from "../../function/Employees";
import EmployeeCV from "@/app/components/employeeCV";

export default async function App({
  params,
}: {
  params: { employeeAlias: string };
}) {
  const session = await getServerSession(authOptions);
  const employeeCV = await getEmployeeCVData(
    params.employeeAlias,
    session.id_token,
  );
  console.log("her , ", employeeCV);
  if (!session) {
    return redirect("/api/auth/signin");
  }
  return <EmployeeCV employeeCv={employeeCV} />;
}
