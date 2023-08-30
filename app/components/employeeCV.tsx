"use client";
import React, { useEffect } from "react";
import { EmployeeCV } from "../function/Employees";

type EmployeeCVProps = {
  employeeCv: EmployeeCV | undefined;
  token: string;
};

export default function EmployeeCV({ employeeCv, token }: EmployeeCVProps) {
  useEffect(() => {
    console.log(token);

    console.log(employeeCv);
  }, []);

  return <div>employeeCV</div>;
}
