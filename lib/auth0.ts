import { Auth0Client } from "@auth0/nextjs-auth0/server";

function normalizeBaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  // Accept full URLs.
  try {
    return new URL(trimmed).origin;
  } catch {
    // fall through
  }

  // Accept hostnames like "localhost:3000".
  const withScheme = trimmed.includes("localhost")
    ? `http://${trimmed}`
    : `https://${trimmed}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return undefined;
  }
}

const ROUTES = {
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  callback: "/api/auth/callback",
} as const;

const clientCache = new Map<string, Auth0Client>();

export function getAuth0Client(appBaseUrl?: string) {
  const baseUrl =
    normalizeBaseUrl(appBaseUrl) ??
    normalizeBaseUrl(process.env.AUTH0_BASE_URL) ??
    normalizeBaseUrl(process.env.APP_BASE_URL) ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : undefined);

  const domainFromIssuer = (() => {
    const issuer = process.env.AUTH0_ISSUER_BASE_URL;
    if (!issuer) return undefined;
    try {
      return new URL(issuer).hostname;
    } catch {
      return undefined;
    }
  })();

  const domain = process.env.AUTH0_DOMAIN ?? domainFromIssuer;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const secret = process.env.AUTH0_SECRET;

  const cacheKey = baseUrl ?? "__no_base_url__";
  const cached = clientCache.get(cacheKey);
  if (cached) return cached;

  const client = new Auth0Client({
    ...(baseUrl ? { appBaseUrl: baseUrl } : {}),
    ...(domain ? { domain } : {}),
    ...(clientId ? { clientId } : {}),
    ...(clientSecret ? { clientSecret } : {}),
    ...(secret ? { secret } : {}),
    signInReturnToPath: "/dashboard",
    routes: ROUTES,
  });

  clientCache.set(cacheKey, client);
  return client;
}

// Default instance for server codepaths that do not have access to request origin.
export const auth0 = getAuth0Client();
