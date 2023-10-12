import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { authOptions } from "../../api/auth/auth-options";
import {
  generateSummaryOfQualifications,
  getEmployeeCVData,
} from "../../function/Employees";
import EmployeeCV from "@/app/components/employeeCV";
import { CustomSession } from "@/app/api/auth/[...nextauth]/typing";
import { getHeaders } from "@/app/requests";

export default async function App({
  params,
}: {
  params: { employeeAlias: string };
}) {
  const session = (await getServerSession(authOptions)) as CustomSession;
  if (!session) {
    return redirect("/api/auth/signin");
  }
  const token = session.access_token;
  const summaryOfQualifications: string = await generateSummaryOfQualifications(
    'Finn alle krav i teksten : "kandidaten må ha erfaring med .NET"',
    params.employeeAlias,
    token,
  );
  return <EmployeeCV summaryOfQualifications={summaryOfQualifications} />;
}
