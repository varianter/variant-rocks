"use client";

require("../polyfill");

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import { isMobileScreen } from "../utils";
import { useChatStore } from "../store";
import styles from "../components/home.module.scss";
import dynamic from "next/dynamic";
import { Loading } from "./home";
import { ErrorBoundary } from "./error";
import { EmployeeItemProp } from "../salesGPT/types";

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

function _SalesGPT({ employees }: EmployeeItemProp) {
  const config = useChatStore((state) => state.config);
  useChatStore();

  // Setting
  const [openSettings, setOpenSettings] = useState(false);

  const loading = !useHasHydrated();

  if (loading) {
    return <Loading />;
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
        <></>
      </Sidebar>
      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
            }}
          />
        ) : (
          <Employees employees={employees} />
        )}
      </div>
    </div>
  );
}

export function SalesGPT({ employees }: EmployeeItemProp) {
  return (
    <ErrorBoundary>
      <_SalesGPT employees={employees} />
    </ErrorBoundary>
  );
}
