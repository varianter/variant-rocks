export type EmployeeItem = {
  email: string;
  name: string;
  telephone: string;
  imageUrl: string;
  officeName: string;
  startDate: Date;
};

export type EmployeeItemProp = {
  employees: EmployeeItem[];
};

const BASE_URL = "https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net";

export async function requestEmployees(): Promise<EmployeeItem[] | undefined> {
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

export async function dummyApi() {
  const request = await fetch("https://dummyjson.com/products/1");

  return await request.json();
}
