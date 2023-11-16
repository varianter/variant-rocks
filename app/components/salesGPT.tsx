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
import { Sidebar } from "./sidebar";
import { IconButton } from "./button";
import { SalesSidebar } from "./sidebar-sales";
//import globalStyles from "./chatHomepage.module.scss";

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

  const [requirementText, setRequirementText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

  async function handleAnalyseButtonClick(): Promise<void> {
    setIsAnalysisLoading(true);
    const requirements = requirementText.split("\n").filter((s) => s.length);
    const employeeAlias = aliasFromEmail(selectedEmployee?.email);
    await fetch("/api/chewbacca/generateSummaryOfQualifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeAlias, requirements }),
    })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = "/api/auth/signin";
        }
        return await response.json();
      })
      .then((data) => {
        setGeneratedText(data);
        setIsAnalysisLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsAnalysisLoading(false);
      });
  }

  return (
    <div className={styles.container}>
      <SalesSidebar title={title} subtitle={""}>
        <div className={styles["sidebar-content"]}>
          <div className={styles["input-field"]}>
            <label htmlFor="choose-employee">
              {Locale.SalesGPT.ChooseEmployee}
            </label>
            <EmployeeSelect
              employees={employees}
              selectedEmployee={selectedEmployee}
              handleSelectEmployee={handleSelectEmployee}
            />
          </div>
          <div className={styles["input-field"]}>
            <label htmlFor="requirements">{Locale.SalesGPT.Requirements}</label>
            <textarea
              id="requirements"
              className={styles["text-input"]}
              placeholder={Locale.SalesGPT.RequirementsPlaceholder}
              // value={requirementText}
              // onChange={(event) => setRequirementText(event.target.value)}
            ></textarea>
          </div>
          <div className={styles["input-field"]}>
            <label htmlFor="summary">{Locale.SalesGPT.Summary}</label>
            <textarea
              id="summary"
              className={styles["text-input"]}
              placeholder={Locale.SalesGPT.SummaryPlaceholder}
              // value={summaryText}
              // onChange={(event) => setSummaryText(event.target.value)}
            ></textarea>
          </div>
          <div className={styles["analyse-button-container"]}>
            <IconButton
              key="analyse"
              bordered
              icon={<span></span>}
              className={styles["analyse-button"]}
              text={Locale.SalesGPT.Analyse}
              onClick={handleAnalyseButtonClick}
            />
          </div>
        </div>
      </SalesSidebar>

      <div style={{ overflow: "auto" }} className={styles["window-content"]}>
        <EmployeeCVSummary
          isLoading={isAnalysisLoading}
          employee={selectedEmployee}
          generatedText={generatedText}
        />
      </div>
    </div>
  );
}

export default function SalesGPT() {
  return (
    <ErrorBoundary fallback={<p> Something went wrong with the SalesGPT! </p>}>
      <_SalesGPT />
    </ErrorBoundary>
  );
}
