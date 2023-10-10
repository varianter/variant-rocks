import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

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

type WorkExperience = {
  id: string;
  title: string;
  description: string;
  monthFrom: string;
  yearFrom: string;
  monthTo: string;
  yearTo: string;
};

type Role = {
  id: string;
  title: string;
  description: string;
};

type ProjectExperience = {
  id: string;
  title: string;
  description: string;
  monthFrom: string;
  yearFrom: string;
  monthTo: string;
  yearTo: string;
  roles: Role[];
};

type Presentation = {
  id: string;
  title: string;
  description: string;
  month: string;
  year: string;
};

type Certification = {
  id: string;
  title: string;
  description: string;
  expiryDate: Date;
  issuedMonth: string;
  issuedYear: string;
};

export type EmployeeCV = {
  email: string;
  workExperiences: WorkExperience[];
  projectExperiences: ProjectExperience[];
  presentations: Presentation[];
  certifications: Certification[];
};

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

interface TokenResponse {
  tokenType: string;
  accessToken: string;
}

const adClientId = process.env.AZURE_AD_CLIENT_ID;
const adClientSecret = process.env.AZURE_AD_CLIENT_SECRET;
const adTenantId = process.env.AZURE_AD_TENANT_ID;

// TODO: get correct token

async function requestEmployeeCVData(employeeAlias: string, token: any) {
  employeeAlias = "hah"; //TODO feil argument fra funksjon
  const request = await fetch(
    `${BASE_URL}/employees/cv?alias=${employeeAlias}&country=no`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );
  console.log("her er det", request.ok);

  if (!request.ok) {
    return undefined;
  }
  const debug = await request.json();
  console.log(debug);
  return debug as EmployeeCV;
}

export async function getEmployeeCVData(employeeAlias: string, token: any) {
  const employeeCVData = await requestEmployeeCVData(employeeAlias, token);
  return employeeCVData;
}
