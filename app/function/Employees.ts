import { requestOpenai } from "./CallGptWithoutReactContext";

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

type RequirementCompetency = {
  requirement: string;
  competencies: string[];
};

type RequirementResponse = {
  requirement: string;
  response: string;
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

async function findRelevantProjectForCompetencies(
  token: string,
  employeeAlias: string,
  competencies: string[],
): Promise<ProjectExperience[] | undefined> {
  const request = await fetch(
    `${BASE_URL}/employees/cv/projectExperiences?alias=${employeeAlias}&country=no&competencies=${competencies}`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );

  if (!request.ok) {
    return Promise.resolve(undefined);
  }
  return (await request.json()) as ProjectExperience[];
}

export async function getEmployeeCVData(employeeAlias: string, token: string) {
  const employeeCVData = await requestEmployeeCVData(employeeAlias, token);
  return employeeCVData;
}

function findRelevantRequirements(
  prompt: string,
  token: string,
  employeeAlias: string,
): Promise<RequirementCompetency[]> {
  // TODO steg 1 få en liste med ordrett krav for kandidaten
  // TODO steg 2 hent alle kompetanser til kandidaten
  // TODO steg 3 finn relevante kompetanser for hvert krav
  const requirements: RequirementCompetency[] = [
    {
      requirement: "Kandidaten må ha erfaring med .NET",
      competencies: [".NET"],
    },
  ];
  return Promise.resolve(requirements);
}

export async function generateSummaryOfQualifications(
  prompt: string,
  employeeAlias: string,
  token: string,
): Promise<string> {
  const requirements = await findRelevantRequirements(
    prompt,
    token,
    employeeAlias,
  );
  const requirementResponses = await Promise.all(
    requirements.map(
      async (requirement) =>
        await generateRequirementResponse(requirement, token, employeeAlias),
    ),
  );
  return await generateSummaryFromRequirementResponses(requirementResponses);
}

async function generateRequirementResponse(
  requirement: RequirementCompetency,
  token: string,
  employeeAlias: string,
): Promise<RequirementResponse> {
  const relevantProjects = await findRelevantProjectForCompetencies(
    token,
    employeeAlias,
    requirement.competencies,
  );
  if (!relevantProjects) {
    return { requirement: requirement.requirement, response: "" };
  }
  const prompt: string = `bruk teksten under og svar på kravet. Bruk sitater fra teksten i begrunnelsen.
  krav : ${requirement.requirement} tekst: ${relevantProjects
    ?.map(projectExperienceToText)
    .join(",")}`;
  const response = await requestOpenai([{ role: "user", content: prompt }]);
  return { requirement: requirement.requirement, response: response };
}

function projectExperienceToText(projectExperience: ProjectExperience): string {
  let roleText = projectExperience.roles
    .map((role) => role.title + ":" + role.description)
    .join(",");
  return projectExperience.description + "," + roleText;
}

async function generateSummaryFromRequirementResponses(
  requirementResponses: RequirementResponse[],
): Promise<string> {
  return Promise.resolve(requirementResponses[0].response); //TODO Bruk GPT til å oppsummere dette
}
