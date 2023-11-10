import { EmployeeCVDetails, EmployeeItem } from "../salesGPT/types";
import { requestOpenai } from "./CallGptWithoutReactContext";

const BASE_URL = "https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net";

async function requestEmployees(): Promise<EmployeeItem[] | undefined> {
  const request = await fetch(`${BASE_URL}/employees`, {});

  if (!request.ok) {
    return undefined;
  }
  return (await request.json()).employees as EmployeeItem[];
}

export default async function getAllEmployees() {
  const employees = await requestEmployees();
  return employees;
}

async function requestEmployeeCVData(employeeAlias: string, token: string) {
  const request = await fetch(
    `${BASE_URL}/employees/cv?alias=${employeeAlias}&country=no`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );

  if (!request.ok) {
    return undefined;
  }
  return (await request.json()) as EmployeeCVDetails;
}

export async function getEmployeeCVData(employeeAlias: string, token: string) {
  const employeeCVData = await requestEmployeeCVData(employeeAlias, token);
  return employeeCVData;
}
