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
  competencies: string[];
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
  return (await request.json()) as EmployeeCV;
}

async function requestSpecificProjectData(
  token: string,
  employeeAlias: string,
  competencies: string[],
) {
  const request = await fetch(
    `${BASE_URL}/employees/cv/projectExperiences?alias=${employeeAlias}&country=no&competencies=${competencies}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );

  if (!request.ok) {
    return undefined;
  }
  return (await request.json()) as ProjectExperience[];
}

export async function getSpecificProjectData(
  token: string,
  employeeAlias: string,
  competencies: string[],
) {
  const projectData = await requestSpecificProjectData(
    token,
    employeeAlias,
    competencies,
  );
  return projectData;
}

export async function getEmployeeCVData(employeeAlias: string, token: string) {
  const employeeCVData = await requestEmployeeCVData(employeeAlias, token);
  return employeeCVData;
}
