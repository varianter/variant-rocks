import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth-options";
import { CustomSession } from "../../auth/[...nextauth]/typing";
import { requestOpenai } from "@/app/function/CallGptWithoutReactContext";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionRequestMessage } from "openai";

type RequirementResponse = {
  requirement: string;
  response: string;
};

type RequirementCompetency = {
  requirement: string;
  competencies: string[];
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
  customer: string;
};

type Role = {
  id: string;
  title: string;
  description: string;
};

const BASE_URL = "https://chewie-webapp-ld2ijhpvmb34c.azurewebsites.net";

export const POST = async (
  req: NextRequest,
  res: NextResponse,
): Promise<Response> => {
  const { employeeAlias, requirements } = await req.json();

  const session = (await getServerSession(authOptions)) as CustomSession;
  const token = session.access_token;

  const result =
    (await generateSummaryOfQualifications(
      requirements,
      employeeAlias as string,
      token,
    )) ?? "";

  return new Response(JSON.stringify(result), { status: 200 });
};

async function generateSummaryOfQualifications(
  requirementText: string[],
  employeeAlias: string,
  token: string,
): Promise<string | undefined> {
  const requirements = await findRelevantRequirements(
    requirementText,
    token,
    employeeAlias,
  );
  if (!requirements) {
    return undefined;
  }
  console.log(requirements);
  const requirementResponses = await Promise.all(
    requirements.map(
      async (requirement) =>
        await generateRequirementResponse(requirement, token, employeeAlias),
    ),
  );
  console.log(requirementResponses);
  return await generateSummaryFromRequirementResponses(requirementResponses);
}

async function findRelevantRequirements(
  requirementText: string[],
  token: string,
  employeeAlias: string,
): Promise<RequirementCompetency[] | undefined> {
  const competencyOfEmployee: string[] | undefined =
    await requestEmployeeCompetencies(employeeAlias, token);

  if (!competencyOfEmployee) {
    return undefined;
  }

  return await Promise.all(
    requirementText.map(
      async (r) =>
        await generateKeywordsFromRequirements(r, competencyOfEmployee),
    ),
  );
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
  if (!relevantProjects || relevantProjects.length < 1) {
    return { requirement: requirement.requirement, response: "" };
  }
  const prompt: string = `bruk teksten under og svar på kravet. Prosjekt er separert med semikolon
  få med prosjekt- og kundenavn når du referer til prosjekt. Bruk sitater fra teksten i begrunnelsen.
    krav : ${requirement.requirement} tekst: ${relevantProjects
    ?.map(projectExperienceToText)
    .join(";")}`;
  const response = await requestOpenai([{ role: "user", content: prompt }]);
  return { requirement: requirement.requirement, response: response };
}

async function generateKeywordsFromRequirements(
  requirementText: string,
  competencies: string[],
): Promise<RequirementCompetency> {
  const example: ChatCompletionRequestMessage[] = [
    {
      role: "user",
      content:
        'Jeg har noen nøkkelord som systemet mitt støtter. Disse er JIRA,KUBERNETES,AZURE,GCP,AWS,JAVA,C# svar hvilken nøkkelord som er relevant for kravet : "Kandidaten må være god på utvikling av skytjenester ". Svaret skal ikke inneholde noe annet enn kommaseparert liste med nøkkelord',
    },
    { role: "assistant", content: "KUBERNETES,GCP,AZURE,AWS" },
  ];
  const prompt: ChatCompletionRequestMessage = {
    role: "user",
    content: ` Glem tidligere nøkkelord. Jeg har noen nye nøkkelord som systemet mitt støtter. Disse er ${competencies} svar hvilken nøkkelord som er relevant for kravet : "${requirementText}". Svaret skal ikke inneholde noe annet enn kommaseparert liste med nøkkelord`,
  };
  const response = await requestOpenai([...example, prompt]);
  return { requirement: requirementText, competencies: response.split(",") };
}

async function generateSummaryFromRequirementResponses(
  requirementResponses: RequirementResponse[],
): Promise<string> {
  const prompt: string = `Her er krav-begrunnelse tabellen. Lag et sammendrag av konsulentens erfaring som svarer på kravene. Sammendraget bør være langt. Husk å referer til prosjektene og kunde i sammendraget ${requirementResponsesToTable(
    requirementResponses,
  )}`;
  return await requestOpenai([{ role: "user", content: prompt }]);
}

async function requestEmployeeCompetencies(
  employeeAlias: string,
  token: string,
) {
  const request = await fetch(
    `${BASE_URL}/employees/competencies?alias=${employeeAlias}&country=no`,
    {
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  );
  if (!request.ok) {
    return Promise.resolve(undefined);
  }
  return (await request.json()) as string[];
}

async function findRelevantProjectForCompetencies(
  token: string,
  employeeAlias: string,
  competencies: string[],
): Promise<ProjectExperience[] | undefined> {
  const request = await fetch(
    `${BASE_URL}/employees/cv/projectExperiences?alias=${employeeAlias}&country=no&competencies=${competencies.join(
      "&competencies",
    )}`,
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

function projectExperienceToText(projectExperience: ProjectExperience): string {
  let roleText = projectExperience.roles
    .map((role) => role.title + ":" + role.description)
    .join(",");
  return `${projectExperience.title} kunde: ${projectExperience.customer}.${projectExperience.description}, + ${roleText}`;
}

function requirementResponsesToTable(
  requirementResponses: RequirementResponse[],
): string {
  const header = "Requirement,Response\n";
  const rows = requirementResponses
    .map((rr) => `${rr.requirement},${rr.response}`)
    .join("\n");
  const csv = header + rows + "\n";
  return csv;
}
