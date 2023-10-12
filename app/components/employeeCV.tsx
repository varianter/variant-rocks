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
import SalesGPTPrompt from "./salesGPTPropmt";
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
  summaryOfQualifications: string;
};

function _EmployeeCV({ summaryOfQualifications }: SummaryOfQualificationProps) {
  const config = useChatStore((state) => state.config);

  useChatStore();

  // Setting
  const [openSettings, setOpenSettings] = useState(false);

  const loading = !useHasHydrated();

  if (loading) {
    return <Loading />;
  }

  console.log(summaryOfQualifications);

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <Sidebar
        title="SalgGpt"
        subTitle=""
        setOpenSettings={setOpenSettings}
      ></Sidebar>
      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings closeSettings={() => setOpenSettings(false)} />
        ) : (
          <CV GPTResponse={summaryOfQualifications} />
        )}
      </div>
    </div>
  );
}

export default function EmployeeCV({
  summaryOfQualifications,
}: SummaryOfQualificationProps) {
  return (
    <ErrorBoundary>
      <_EmployeeCV summaryOfQualifications={summaryOfQualifications} />
    </ErrorBoundary>
  );
}
