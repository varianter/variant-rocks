import { Configuration, LogLevel } from "@azure/msal-node";
import * as msal from "@azure/msal-node";

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
export const getAccessToken = async (): Promise<string> => {
  const msalConfig: Configuration = {
    auth: {
      clientId: adClientId!,
      clientSecret: adClientSecret,
      authority: `https://login.microsoftonline.com/${adTenantId}`,
    },
    system: {
      loggerOptions: {
        loggerCallback: (
          level: LogLevel,
          message: string,
          containsPii: boolean,
        ) => {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Verbose,
      },
    },
  };

  // const pca = new msal.PublicClientApplication(msalConfig);
  const cca = new msal.ConfidentialClientApplication(msalConfig);
  const tokenRequest = {
    scopes: ["https://graph.microsoft.com/.default"],
  };

  try {
    // const authResult = await cca.acquireTokenByClientCredential(tokenRequest);
    const authResult = await cca.acquireTokenByClientCredential(tokenRequest);
    if (authResult && authResult.accessToken) {
      const token = authResult.accessToken;
      return token;
    } else {
      throw new Error("Kunne ikke finne utstedt token");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Kunne ikke hente tilgangstoken");
  }
};

async function requestEmployeeCVData(employeeAlias: string) {
  const token = await getAccessToken();
  const request = await fetch(
    `${BASE_URL}/employees/cv?alias${employeeAlias}`,
    {
      headers: {
        Authorization: token,
      },
    },
  );

  if (!request.ok) {
    return undefined;
  }
  return (await request.json()).employeeCV as EmployeeCV;
}

export async function getEmployeeCVData(employeeAlias: string) {
  const employeeCVData = await requestEmployeeCVData(employeeAlias);
  return employeeCVData;
}
