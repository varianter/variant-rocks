import { requestOpenai } from "@/app/function/CallGptWithoutReactContext";
import { NextRequest, NextResponse } from "next/server";
import { RequirementResponse } from "../generateRequirementResponse/route";

const BASE_URL = process.env.CHEWBACCA_BASE_URL;

export const POST = async (
  req: NextRequest,
  res: NextResponse,
): Promise<Response> => {
  const { requirementResponses, summaryText, name, gpt4 } = await req.json();

  const result =
    (await generateSummaryOfQualifications(
      requirementResponses,
      summaryText,
      name,
      gpt4,
    )) ?? "";

  return new Response(JSON.stringify(result), { status: 200 });
};

async function generateSummaryOfQualifications(
  requirementResponses: RequirementResponse[],
  summaryText: string | undefined,
  name: string,
): Promise<string | undefined> {
  return await generateSummaryFromRequirementResponses(
    requirementResponses,
    summaryText,
    name,
  );
}

function findSummaryPrompt(
  requirementResponses: RequirementResponse[],
  summaryText: string | undefined,
  name: string,
) {
  const table = requirementResponsesToTable(requirementResponses);
  if (summaryText) {
    return `Vi har nå fått en krav-begrunnelse tabellen som ${name} må oppfylle ${table}.
    Her er det gamle sammendraget ${summaryText}.
    Skriv om sammendraget slik at den svarer på alle krav
    med begrunnelesen i tabellen. Bruk alt i tabellen og sammendraget.
    Ikke bruk noe som ikke er i tabellen eller sammendraget. 
    Teksten må flyte naturlig og sammenhengende så den scorer høyt i salg.
    Du kan endre rekkefølge på svar på krav og du slipper å skrive hvert krav
    på en egen paragraf.
    Ettersom du vil overbevise leseren, må du bruke begrunnelseskolonnen aktivt når du svarer på krav.
    Referer til prosjektene og få med kundenavn.
    Det er en fordel hvis sammendraget er langt.
    Du kan ikke regne med at brukeren har lest krav-begrunnelse tabellen.
    `;
  }
  return `Her er krav-begrunnelse tabellen. Lag et sammendrag av ${name} sin
  erfaring som svarer på kravene. Sammendraget bør være langt. 
  Husk å referer til navn på prosjekt, kunde og års erfaring for hvert krav i sammendraget.
 Sammendraget  må flyte naturlig og sammenhengende så den scorer høyt i salg.
  Husk å inkludere alle rader ifra tabellen i svaret.
  Det kan hende at samme prosjekt er brukt i de ulike begrunnelsene.
  Ikke bruk noe som ikke står i tabllen i ditt sammendrag.
  Du trenger ikke å gi noe mer enn sammendraget i svaret ditt.
  krav-begrunnelse tabell : ${table}`;
}

async function generateSummaryFromRequirementResponses(
  requirementResponses: RequirementResponse[],
  summaryText: string | undefined,
  name: string,
  gpt4: boolean,
): Promise<string> {
  const prompt = findSummaryPrompt(requirementResponses, summaryText, name);
  let summary = await requestOpenai(
    [{ role: "user", content: prompt }],
    "variant-rocks-turbo-16k",
    2000,
    1,
  );
  if (gpt4) {
    summary = await requestOpenai(
      [
        {
          role: "user",
          content: `Gjør teksten mer sammenhengende. Den skal ha en formell tone men fortsatt høres ut som et menneske`,
        },
      ],
      "variant-rocks-gpt4",
      2000,
      1,
    );
  }
  return (
    summary ??
    "Feil: krav-begrunnelse tabllen ble for lang og GPT gikk over token limit"
  );
}

function requirementResponsesToTable(
  requirementResponses: RequirementResponse[],
): string {
  const header = "Krav,Begrunnelse,ErfaringMedKrav\n";
  const rows = requirementResponses
    .map((rr) => `${rr.requirement},${rr.response},${rr.experience}`)
    .join("\n");
  const csv = header + rows + "\n";
  return csv;
}
