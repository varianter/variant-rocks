import EmployeeCard from "./employeeCard";
import styles from "./home.module.scss";
import employeeStyles from "./employees.module.scss";
import { EmployeeItemProp } from "../function/Employees";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import { useState } from "react";
import { IconButton } from "./button";
import ChatIcon from "../icons/chat.svg";
import SettingsIcon from "../icons/settings.svg";
import Link from "next/link";

type EmployeesProps = {
  showSideBar?: (newState: boolean) => void;
} & EmployeeItemProp;

export default async function Employees({ employees }: EmployeesProps) {
  const config = useChatStore((state) => state.config);
  const [selectedOffice, setSelectedOffice] = useState("");
  const offices = ["Trondheim", "Oslo", "Bergen"];
  const officeButtons = offices.map((office) => (
    <button key={office} onClick={() => setSelectedOffice(office)}>
      {office}
    </button>
  ));

  return (
    <>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>Ansatte</div>
          <div className={styles["employee-buttons"]}>
            {officeButtons}
            <button onClick={() => setSelectedOffice("")}>Alle</button>
          </div>
          <div>
            <Link href="/">
              <IconButton bordered icon={<ChatIcon />} shadow />
            </Link>
            <IconButton bordered icon={<SettingsIcon />} shadow />
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
                href={"salesGPT/" + employee.email.split("@")[0]}
                key={employee.email}
              />
            );
          })}
      </ul>
    </>
  );
}
