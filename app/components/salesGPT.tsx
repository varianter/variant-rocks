"use client";

import { useState } from "react";
import Employees from "../components/employees";
import Sidebar from "../components/sidebar";
import SalesGPTPrompt from "../components/salesGPTPropmt";
import { isMobileScreen } from "../utils";
import { useChatStore } from "../store";
import styles from "../components/home.module.scss";

function _SalesGPT() {
  const [employeeSelected, setEmployeeSelected] = useState(false);
  const config = useChatStore((state) => state.config);

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <Sidebar title="SalgGpt" subTitle="">
        {employeeSelected && <SalesGPTPrompt />}
      </Sidebar>
      <Employees />
    </div>
  );
}

export function SalesGPT() {
  return <_SalesGPT />;
}
