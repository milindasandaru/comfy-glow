## Comfy Glow — Comfort Index Dashboard

Next.js App Router project that fetches live city weather from OpenWeather, computes a **Comfort Index (0–100)**, ranks cities, and displays a responsive dashboard.

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Environment

Create `.env.local`:

```bash
OPENWEATHER_API_KEY=...your key...

# Auth0 (required for dashboard access)
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT.us.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
AUTH0_SECRET=...random 32+ chars...

# Optional alternative to AUTH0_ISSUER_BASE_URL
# AUTH0_DOMAIN=YOUR_TENANT.us.auth0.com

# Optional: restrict dashboard access to specific users
# comma-separated emails
AUTH_ALLOWED_EMAILS=user1@example.com,user2@example.com
```

### 3) Run

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Step 3 — Comfort Index (0–100)

### Formula (defined in code)

Implemented in [lib/comfortIndex.ts](lib/comfortIndex.ts).

Inputs:

- Temperature (°C)
- Humidity (%)
- Wind speed (m/s)

Approach:

- Convert $T_{C}$ to Fahrenheit $T_{F}$
- Compute a _perceived_ temperature:
  - If hot ($T_F \ge 70$): use **Summer Simmer Index (SSI)** to account for humidity heat stress
  - If cold ($T_F \le 50$): use **Wind Chill** to account for wind cooling
  - Otherwise: perceived temp = actual temp

Scoring:

- Ideal comfort point is set to **72°F (~22.2°C)**
- Deviation $d = |T_{perceived} - 72|$
- Comfort score is then:

$$score = clamp(0, 100, round(100 - 2 \cdot d))$$

### Reasoning (variable weights)

This algorithm is **temperature-centric**: humidity and wind only affect the score by adjusting the _perceived_ temperature.

Key “weights” and why they were chosen:

- **Ideal temperature = 72°F**: a commonly accepted comfortable indoor/outdoor point.
- **Score slope = 2 points per 1°F deviation**: makes the scale intuitive and stable.
  - Example: a 10°F perceived deviation drops ~20 points.
- **Heat threshold $\ge 70°F$ uses SSI**: humidity becomes meaningful in warm conditions and SSI models heat stress.
- **Cold threshold $\le 50°F$ uses Wind Chill**: wind becomes meaningful in cold conditions and wind chill models perceived cooling.

In other words:

- Temp is the primary driver.
- Humidity matters mainly when it’s hot.
- Wind matters mainly when it’s cold.

### Trade-offs considered

- **Simplicity vs accuracy**: This is a compact, explainable scoring model rather than a complex biophysical model.
- **Piecewise formulas**: SSI/wind chill are only applied in ranges where they’re most relevant to avoid over-correcting in mild weather.
- **Determinism and stability**: A linear mapping around an ideal point produces consistent rankings and avoids “jittery” scores.

### Applied to each city

The API computes `comfortScore` for each city in [app/api/weather/route.ts](app/api/weather/route.ts).

### Sorted ranking

The API sorts cities descending by `comfortScore` and assigns `rank` starting at 1.

## Step 4 — Display Weather Information

Dashboard displays (per city):

- City Name
- Weather Description
- Temperature
- Comfort Score
- Rank Position

See [app/dashboard/page.tsx](app/dashboard/page.tsx) + [components/weather/CityCard.tsx](components/weather/CityCard.tsx).

## Step 5 — Server-Side Caching (5 minutes)

Caching is implemented as:

- **Raw cache**: caches OpenWeather API responses for 5 minutes
- **Processed cache**: caches computed per-city `WeatherInfo` for 5 minutes
- **List cache**: caches the final ranked list for 5 minutes (preferred, fastest path)

Shared cache lives in [lib/weather.ts](lib/weather.ts).

### Cache design (why 3 layers?)

- **Raw cache** saves OpenWeather calls (reduces rate-limit pressure and latency).
- **Processed cache** avoids recomputing comfort score + formatting repeatedly.
- **List cache** returns the final ranked response instantly when possible.

This split makes the system fast for the common case (list cache HIT), but still efficient when a partial refresh is needed (processed/raw caches).

### Debug endpoint (HIT / MISS)

Call:

- `GET /api/cache/weather`

It returns:

- TTLs
- Cache sizes
- Per-city cache ages
- HIT/MISS counters and freshness

## Step 6 — Responsive UI

UI uses Tailwind responsive utilities (e.g. grid breakpoints) and supports mobile + desktop layouts.

## Part 2 — Authentication & Authorization (Auth0)

### Step 1 — Authentication (login/logout)

- Home page login button calls `GET /api/auth/login`.
- Dashboard is **protected** in [middleware.ts](middleware.ts): unauthenticated users are redirected to Auth0 login.

### Step 2 — MFA

MFA (email / OTP / etc.) is configured in the **Auth0 dashboard**.

### Step 3 — Restrict signups / whitelist users

This is typically enforced in Auth0:

- Disable public signups for your connection
- Add an Auth0 Action / rule to allow only whitelisted emails

Additionally, this project supports a simple allowlist gate in middleware using `AUTH_ALLOWED_EMAILS`.

## Notes

### Known limitations

- **In-memory cache**: Works best in a long-running Node process. In serverless/multi-instance deployments, cache won’t be shared and may reset.
- **Rate limits / network**: If OpenWeather is slow or rate-limited, the API may respond slower on cache MISS.
- **Graph data source**: The temperature trend graphs are UI-focused and not pulled from an hourly forecast endpoint (so they are not “true historical” charts).
- **Comfort is subjective**: A single “ideal” temperature and linear slope will not match every user’s preference.

## Bonus features

- **Dark mode**: Default theme is dark; toggle available in the navbar.
- **Unit tests**: `vitest` tests added for the Comfort Index logic.
  - Run: `npm test`
- **Sorting/filtering (frontend)**: Search + sort controls are available on the dashboard.
- **Graphs**: City details modal includes a temperature trend chart per city.

In-memory caching works best in a long-running node process; in serverless environments, cache may reset between invocations.
