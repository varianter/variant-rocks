"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmployeeItem } from "../types";
import EmployeeCVSummary from "./employeeCVSummary";
import { ErrorBoundary } from "../../components/error";
import { aliasFromEmail } from "../../utils";
import styles from "../components/salesGPT.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import Locale from "../../locales";
import EmployeeSelect from "./employeeSelect";
import { IconButton } from "../../components/button";
import { SalesSidebar } from "./sales-sidebar";
import { Path } from "../../constant";
import ChatIcon from "../../icons/chat.svg";

function _SalesGPT() {
  const router = useRouter();
  const pathName = usePathname();
  const title = Locale.SalesGPT.Title;
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
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
    console.debug(requirementText, summaryText, generatedText);
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
              className={styles["analyse-button"]}
              text={Locale.SalesGPT.Analyse}
              onClick={handleAnalyseButtonClick}
            />
          </div>
        </div>
        <IconButton
          text={"Tilbake til chat"}
          icon={<ChatIcon />}
          onClick={() => navigate(Path.Home)}
        />
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
