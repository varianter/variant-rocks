"use client";
import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "./error";
import { Loading } from "./chatHomepage";
import styles from "../components/employeeCVSummary.module.scss";
import CV from "./CV";
import { EmployeeItem } from "../salesGPT/types";
import { aliasFromEmail } from "../utils";
import Locale from "../locales";

type EmployeeCVSummaryProps = {
  employee: EmployeeItem | undefined;
  isLoading: boolean;
  generatedText: string;
};

function _EmployeeCVSummary({
  employee,
  isLoading,
  generatedText,
}: EmployeeCVSummaryProps) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <p>
        {Locale.SalesGPT.Consultant}: {employee?.name}
      </p>
      <CV GPTResponse={generatedText}></CV>
    </div>
  );
}

function _EmptyEmployeeSummary() {
  return (
    <div className={styles["empty"]}>
      <div className={styles["content-box"]}>
        <span className={styles["emoji"]}>&#x1F916;</span>
        <p className={styles["text"]}>
          {Locale.SalesGPT.EmployeeCVSummary.Empty}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeCVSummary({
  employee,
  isLoading,
  generatedText,
}: EmployeeCVSummaryProps) {
  return (
    <ErrorBoundary
      fallback={<p> Something went wrong with the EmployeeCV! </p>}
    >
      {employee ? (
        <_EmployeeCVSummary
          isLoading={isLoading}
          employee={employee}
          generatedText={generatedText}
        />
      ) : (
        <_EmptyEmployeeSummary />
      )}
    </ErrorBoundary>
  );
}
