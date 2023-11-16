"use client";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmployeeItem, EmployeeOption } from "../salesGPT/types";
import EmployeeCVSummary from "./employeeCVSummary";
import { ErrorBoundary } from "./error";
import LayoutWrapper from "./layoutWrapper";
import { aliasFromEmail } from "../utils";
import { Settings } from "./settings";
import styles from "../components/salesGPT.module.scss";
import { useLocation } from "react-router-dom";
import Locale from "../locales";
import EmployeeSelect from "./employeeSelect";

function _SalesGPT() {
  const router = useRouter();
  const pathName = usePathname();
  const title = Locale.SalesGPT.Title;

  const [openSettings, setOpenSettings] = useState(false);

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  // const [selectedEmployee, setEmployee] = useState<EmployeeItem | undefined>(
  //   undefined,
  // );
  // const [selectedOption, setSelectEmployee] = useState<EmployeeOption | null>({
  //   label: selectedEmployee?.name ?? "",
  //   value: selectedEmployee,
  // });
  // const options: EmployeeOption[] = employees.map((emp: EmployeeItem) => ({
  //   value: emp,
  //   label: emp.name,
  // }));

  // function handleSelectEmployee(newValue: SingleValue<EmployeeOption>): void {
  //   setSelectEmployee(newValue);
  //   router.push(
  //     pathName +
  //       `?employeeAlias=${aliasFromEmail(newValue?.value?.email ?? "")}`,
  //   );
  // }
  const selectedEmployeeAlias = useSearchParams().get("employeeAlias") ?? "";
  const selectedEmployee = employees.find(
    (emp) => aliasFromEmail(emp.email) === selectedEmployeeAlias,
  );
  function handleSelectEmployee(newValue: EmployeeItem | undefined): void {
    if (newValue === undefined) {
      router.push(pathName);
    } else {
      router.push(
        pathName + `?employeeAlias=${aliasFromEmail(newValue?.email)}`,
      );
    }
  }

  const location = useLocation();

  useEffect(() => {
    fetch("/api/chewbacca/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const data = (await response.json()) as EmployeeItem[];
        setEmployees(data ?? []);
        const searchParams = new URLSearchParams(location.search);
        const selectedEmployeeAlias = searchParams.get("employeeAlias") ?? "";
        // const employee = data.find(
        //   (emp) => aliasFromEmail(emp.email) === selectedEmployeeAlias,
        // );
        // setSelectEmployee({ label: employee?.name ?? "", value: employee });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <LayoutWrapper>
      {/* <Select
        options={options}
        isSearchable={true}
        value={selectedOption}
        onChange={handleSelectEmployee}
      /> */}
      <label htmlFor="choose-employee">{Locale.SalesGPT.ChooseEmployee}</label>
      <EmployeeSelect
        // id="choose-employee"
        employees={employees}
        selectedEmployee={selectedEmployee}
        handleSelectEmployee={handleSelectEmployee}
      />

      <div style={{ overflow: "auto" }} className={styles["window-content"]}>
        {openSettings ? (
          <Settings />
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

export default function SalesGPT() {
  return (
    <ErrorBoundary fallback={<p> Something went wrong with the SalesGPT! </p>}>
      <_SalesGPT />
    </ErrorBoundary>
  );
}
