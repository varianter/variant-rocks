"use client";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "./error";
import dynamic from "next/dynamic";
import { Loading } from "./home";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import styles from "../components/home.module.scss";
import specificStyles from "../components/employeeCv.module.scss";
import Sidebar from "./sidebar";
import CV from "./CV";
import { EmployeeItem } from "../salesGPT/types";
import Select, { ActionMeta, SingleValue } from "react-select";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context";

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

type SummaryOfQualificationProps = {
  employees: EmployeeItem[];
};

function _EmployeeCV({ employees }: SummaryOfQualificationProps) {
  const router = useRouter();
  const pathName = usePathname();

  const selectedEmployeeAlias = useSearchParams().get("employeeAlias") ?? "";
  const selectedEmployee = employees.find(
    (emp) => aliasFromEmail(emp.email) === selectedEmployeeAlias,
  );

  const config = useChatStore((state) => state.config);
  0;
  const [selectedOption, setSelectEmployee] =
    React.useState<EmployeeOption | null>({
      label: selectedEmployee?.name ?? "",
      value: selectedEmployee,
    });

  interface EmployeeOption {
    value: EmployeeItem | undefined;
    label: string;
  }

  const options: EmployeeOption[] = employees.map((emp: EmployeeItem) => ({
    value: emp,
    label: emp.name,
  }));

  // Setting
  const [openSettings, setOpenSettings] = useState(false);
  const [requirementText, setRequirementText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }
  if (!selectedEmployee) {
    //return <Error statusCode={404} />;
  }

  async function handleButtonClick(requirementText: string): Promise<void> {
    setIsLoading(true);
    const requirements = requirementText.split("\n").filter((s) => s.length);
    const employeeAlias = employees[0]?.email.split("@")[0];
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error:", error);
        setIsLoading(false);
      });
  }

  function handleSelectEmployee(
    newValue: SingleValue<EmployeeOption>,
    actionMeta: ActionMeta<EmployeeOption>,
  ): void {
    setSelectEmployee(newValue);
    router.push(
      pathName +
        `?employeeAlias=${aliasFromEmail(newValue?.value?.email ?? "")}`,
    );
  }

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
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
          <>
            <div>
              <p>Konsulent: {selectedEmployee?.name}</p>
            </div>
            <textarea
              className={specificStyles.RequirementInput}
              placeholder={
                "Kandidaten må ha erfaring med X\nKandidaten må også ha kjennskap til Y\nErfaring med Z er et pluss"
              }
              value={requirementText}
              onChange={(event) => setRequirementText(event.target.value)}
            ></textarea>
            <button onClick={async () => handleButtonClick(requirementText)}>
              Generer oppsummering av kvalifikasjoner
            </button>
            <CV GPTResponse={generatedText}></CV>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmployeeCV({ employees }: SummaryOfQualificationProps) {
  return (
    <ErrorBoundary
      fallback={<p> Something went wrong with the EmployeeCV! </p>}
    >
      <_EmployeeCV employees={employees} />
    </ErrorBoundary>
  );
}

function aliasFromEmail(email: string) {
  return email.split("@")[0];
}
