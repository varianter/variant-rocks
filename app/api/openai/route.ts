import { NextRequest, NextResponse } from "next/server";
import { getProperServerSession } from "../auth/auth-options";
import { requestOpenai } from "../common";

async function makeRequest(req: NextRequest) {
  try {
    const api = await requestOpenai(req);
    const res = new NextResponse(api.body);
    res.headers.set("Content-Type", "application/json");
    res.headers.set("Cache-Control", "no-cache");
    return res;
  } catch (e) {
    console.error("[OpenAI] ", req.body, e);
    return NextResponse.json(
      {
        error: true,
        msg: JSON.stringify(e),
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getProperServerSession(req, res);
  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in." },
      { status: 401 },
    );
  }

  return makeRequest(req);
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getProperServerSession(req, res);
  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in." },
      { status: 401 },
    );
  }

  return makeRequest(req);
}
