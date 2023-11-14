"use client";
import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmployeeItem } from "../salesGPT/types";
import EmployeeCVSummary from "./employeeCVSummary";
import { ErrorBoundary } from "./error";
import Sidebar from "./sidebar";
import { aliasFromEmail } from "../utils";
import { Settings } from "./settings";
import Locale from "../locales";
import EmployeeSelect from "./employeeSelect";
import styles from "../components/salesGPT.module.scss";
import { IconButton } from "./button";

function _SalesGPT({ employees }: SalesGPTProps) {
  const router = useRouter();
  const pathName = usePathname();
  const title = Locale.SalesGPT.Title;

  const [openSettings, setOpenSettings] = useState(false);

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

  // From EmployeeCVSummary

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
      <Sidebar title={title} subTitle="" setOpenSettings={setOpenSettings}>
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
              value={requirementText}
              onChange={(event) => setRequirementText(event.target.value)}
            ></textarea>
          </div>
          <div className={styles["input-field"]}>
            <label htmlFor="summary">{Locale.SalesGPT.Summary}</label>
            <textarea
              id="summary"
              className={styles["text-input"]}
              placeholder={Locale.SalesGPT.SummaryPlaceholder}
              value={summaryText}
              onChange={(event) => setSummaryText(event.target.value)}
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
      </Sidebar>

      <div className={styles["right-pane"]}>
        {openSettings ? (
          <Settings closeSettings={() => setOpenSettings(false)} />
        ) : (
          // Her kan man bytte ut vindu avhengig av valgt funksjon på sikt
          <EmployeeCVSummary
            isLoading={isAnalysisLoading}
            employee={selectedEmployee}
            generatedText={generatedText}
          />
        )}
      </div>
    </div>
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
