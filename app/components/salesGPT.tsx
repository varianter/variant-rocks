"use client";

import { useState } from "react";
import Employees from "./employees";
import LayoutWrapper from "./layoutWrapper";
import Sidebar from "./sidebar";
import SalesGPTPrompt from "./salesGPTPropmt";

function _SalesGPT() {
  const [employeeSelected, setEmployeeSelected] = useState(false);

  return (
    <LayoutWrapper>
      <Sidebar title="SalgGpt" subTitle="">
        {employeeSelected && <SalesGPTPrompt />}
      </Sidebar>
      <Employees />
    </LayoutWrapper>
  );
}

export function SalesGPT() {
  return <_SalesGPT />;
}
