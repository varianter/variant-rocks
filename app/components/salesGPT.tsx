"use client";
import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmployeeItem, EmployeeOption } from "../salesGPT/types";
import EmployeeCVSummary from "./employeeCVSummary";
import { ErrorBoundary } from "./error";
import LayoutWrapper from "./layoutWrapper";
import Sidebar from "./sidebar";
import { aliasFromEmail } from "../utils";
import { Settings } from "./settings";
import styles from "../components/salesGPT.module.scss";

function _SalesGPT({ employees }: SalesGPTProps) {
  const router = useRouter();
  const pathName = usePathname();

  const [openSettings, setOpenSettings] = useState(false);

  const selectedEmployeeAlias = useSearchParams().get("employeeAlias") ?? "";
  const selectedEmployee = employees.find(
    (emp) => aliasFromEmail(emp.email) === selectedEmployeeAlias,
  );
  const [selectedOption, setSelectEmployee] = useState<EmployeeOption | null>({
    label: selectedEmployee?.name ?? "",
    value: selectedEmployee,
  });
  const options: EmployeeOption[] = employees.map((emp: EmployeeItem) => ({
    value: emp,
    label: emp.name,
  }));

  function handleSelectEmployee(newValue: SingleValue<EmployeeOption>): void {
    setSelectEmployee(newValue);
    router.push(
      pathName +
        `?employeeAlias=${aliasFromEmail(newValue?.value?.email ?? "")}`,
    );
  }

  return (
    <LayoutWrapper>
      <Sidebar title="SalgGpt" subTitle="" setOpenSettings={setOpenSettings}>
        <Select
          options={options}
          isSearchable={true}
          value={selectedOption}
          onChange={handleSelectEmployee}
        />
      </Sidebar>

      <div style={{ overflow: "auto" }} className={styles["window-content"]}>
        {openSettings ? (
          <Settings closeSettings={() => setOpenSettings(false)} />
        ) : (
          // Her kan man bytte ut vindu avhengig av valgt funksjon på sikt
          <EmployeeCVSummary employee={selectedEmployee} />
        )}
      </div>
    </LayoutWrapper>
  );
}

interface SalesGPTProps {
  employees: EmployeeItem[];
}

export default function SalesGPT({ employees }: SalesGPTProps) {
  return (
    <ErrorBoundary fallback={<p> Something went wrong with the SalesGPT! </p>}>
      <_SalesGPT employees={employees} />
    </ErrorBoundary>
  );
}
