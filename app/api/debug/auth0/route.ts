import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuth0Client } from "@/lib/auth0";

function safeHostname(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  try {
    // This will throw if required config is missing/invalid.
    getAuth0Client(origin);

    return NextResponse.json(
      {
        ok: true,
        origin,
        env: {
          AUTH0_BASE_URL: process.env.AUTH0_BASE_URL ?? null,
          APP_BASE_URL: process.env.APP_BASE_URL ?? null,
          AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? null,
          AUTH0_ISSUER_BASE_URL_HOST: safeHostname(
            process.env.AUTH0_ISSUER_BASE_URL,
          ),
          AUTH0_CLIENT_ID_SET: Boolean(process.env.AUTH0_CLIENT_ID),
          AUTH0_CLIENT_SECRET_SET: Boolean(process.env.AUTH0_CLIENT_SECRET),
          AUTH0_SECRET_SET: Boolean(process.env.AUTH0_SECRET),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        origin,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
