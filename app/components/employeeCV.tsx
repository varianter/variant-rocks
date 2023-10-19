"use client";
import React, { useEffect, useState } from "react";
import { EmployeeCV } from "../function/Employees";
import { ErrorBoundary } from "./error";
import dynamic from "next/dynamic";
import { Loading } from "./home";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import styles from "../components/home.module.scss";
import Sidebar from "./sidebar";
import CV from "./CV";

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Employees = dynamic(async () => await import("./employees"), {
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
  employeeAlias: string;
};

function _EmployeeCV({ employeeAlias }: SummaryOfQualificationProps) {
  const config = useChatStore((state) => state.config);

  useChatStore();

  // Setting
  const [openSettings, setOpenSettings] = useState(false);
  const [requirementText, setRequirementText] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const loading = !useHasHydrated();

  if (loading) {
    return <Loading />;
  }

  async function handleButtonClick(requirementText: string): Promise<void> {
    const requirements = requirementText.split("\n");
    await fetch("/api/chewbacca/generateSummaryOfQualifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ employeeAlias, requirements }),
    })
      .then(async (response) => {
        console.log("her ", response.body);
        return await response.json();
      })
      .then((data) => {
        setGeneratedText(data);
        console.log("gjort");
      })
      .catch((error) => {
        console.log("Error:", error);
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
      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings closeSettings={() => setOpenSettings(false)} />
        ) : (
          <>
            <textarea
              placeholder={
                "Kandidaten må ha erfaring med X\nKandidaten må også ha kjennskap til Y\nErfaring med Z er et pluss"
              }
              value={requirementText}
              onChange={(event) => setRequirementText(event.target.value)}
            ></textarea>
            <CV GPTResponse={employeeAlias} />
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

export default function EmployeeCV({
  employeeAlias,
}: SummaryOfQualificationProps) {
  return (
    <ErrorBoundary>
      <_EmployeeCV employeeAlias={employeeAlias} />
    </ErrorBoundary>
  );
}
