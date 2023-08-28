import EmployeeCard from "./employeeCard";
import styles from "./home.module.scss";
import employeeStyles from "./employees.module.scss";
import { EmployeeItemProp } from "../function/Employees";
import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";

export default async function Employees({ employees }: EmployeeItemProp) {
  const config = useChatStore((state) => state.config);

  return (
    <>
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
      <ul
        className={
          config.tightBorder && !isMobileScreen()
            ? employeeStyles["employee-list-tight"]
            : employeeStyles["employee-list"]
        }
      >
        {employees.map((employee) => {
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
