"use client";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "./error";
import dynamic from "next/dynamic";
import Error from "next/error";
import { Loading } from "./home";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import styles from "../components/home.module.scss";
import specificStyles from "../components/employeeCv.module.scss";
import Sidebar from "./sidebar";
import CV from "./CV";
import { EmployeeCVDetails } from "../salesGPT/types";

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
  employee: EmployeeCVDetails | undefined;
};

function _EmployeeCV({ employee }: SummaryOfQualificationProps) {
  const config = useChatStore((state) => state.config);

  // Setting
  const [openSettings, setOpenSettings] = useState(false);
  const [requirementText, setRequirementText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <Loading />;
  }
  if (!employee) {
    return <Error statusCode={404} />;
  }

  async function handleButtonClick(requirementText: string): Promise<void> {
    setIsLoading(true);
    const requirements = requirementText.split("\n").filter((s) => s.length);
    const employeeAlias = employee?.email.split("@")[0];
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

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <Sidebar title="SalgGpt" subTitle="" setOpenSettings={setOpenSettings}>
        <div></div>
      </Sidebar>
      <div style={{ overflow: "auto" }} className={styles["window-content"]}>
        {openSettings ? (
          <Settings closeSettings={() => setOpenSettings(false)} />
        ) : (
          <>
            <div>
              <p>Konsulent: {employee.email.split("@")[0]}</p>
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

export default function EmployeeCV({ employee }: SummaryOfQualificationProps) {
  return (
    <ErrorBoundary
      fallback={<p> Something went wrong with the EmployeeCV! </p>}
    >
      <_EmployeeCV employee={employee} />
    </ErrorBoundary>
  );
}
