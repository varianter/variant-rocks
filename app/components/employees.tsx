import EmployeeCard from "./employeeCard";
import styles from "./home.module.scss";
import employeeStyles from "./employees.module.scss";
import { EmployeeItemProp } from "../function/Employees";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import { useState } from "react";

export default async function Employees({ employees }: EmployeeItemProp) {
  const config = useChatStore((state) => state.config);
  const [selectedOffice, setSelectedOffice] = useState("");

  return (
    <>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>Ansatte</div>
          <div>
            <button onClick={() => setSelectedOffice("Trondheim")}>
              Trondheim
            </button>
            <button onClick={() => setSelectedOffice("Oslo")}>Oslo</button>
            <button onClick={() => setSelectedOffice("Bergen")}>Bergen</button>
            <button onClick={() => setSelectedOffice("")}>Alle</button>
          </div>
        </div>
      </div>
      <ul
        className={
          config.tightBorder && !isMobileScreen()
            ? employeeStyles["employee-list-tight"]
            : employeeStyles["employee-list"]
        }
      >
        {employees
          .filter((employee) =>
            selectedOffice !== ""
              ? employee.officeName === selectedOffice
              : true,
          )
          .map((employee) => {
            return (
              <EmployeeCard
                employeeName={employee.name}
                employeeRole={"mangler felt"}
                employeeImageSrc={employee.imageUrl}
                href={""}
                key={employee.email}
              />
            );
          })}
      </ul>
    </>
  );
}
