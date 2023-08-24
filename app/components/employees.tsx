import EmployeeCard from "./employeeCard";
import styles from "./home.module.scss";
import employeeStyles from "./employees.module.scss";

export default function Employees() {
  return (
    <div className={styles["window-content"]}>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>Ansatte</div>
          <div>
            <button>Trondheim</button>
            <button>Oslo</button>
            <button>Bergen</button>
          </div>
        </div>
      </div>
      <ul className={employeeStyles["employee-list"]}>
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
        <EmployeeCard
          employeeName={"NAME"}
          employeeRole={"ROLE"}
          employeeImageSrc={""}
          href={""}
        />
      </ul>
    </div>
  );
}
