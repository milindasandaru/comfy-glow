export type OpenWeatherRaw = {
  sys: { country: string };
  main: { temp: number; humidity: number };
  wind: { speed: number };
  weather: { main: string; description: string; icon: string }[];
};

export type ComfortLevel = {
  label: string;
  color: string;
  bg: string;
  desc: string;
};

export type WeatherInfo = {
  id: string;
  name: string;
  country: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
  comfortScore: number;
  comfortLevel: ComfortLevel;
  timestamp: string;
  rank?: number;
};

type CacheStatus = "HIT" | "MISS";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  hits: number;
  misses: number;
  lastStatus: CacheStatus;
};

export const RAW_TTL_MS = 5 * 60 * 1000;
export const PROCESSED_TTL_MS = 5 * 60 * 1000;
export const LIST_TTL_MS = 5 * 60 * 1000;

const rawCache = new Map<string, CacheEntry<OpenWeatherRaw>>();
const processedCache = new Map<string, CacheEntry<WeatherInfo>>();
let listCache: CacheEntry<WeatherInfo[]> | null = null;

const isFresh = (timestamp: number, ttl: number) =>
  Date.now() - timestamp < ttl;

export function getCachedList(): WeatherInfo[] | null {
  if (!listCache) return null;
  if (!isFresh(listCache.timestamp, LIST_TTL_MS)) {
    listCache.lastStatus = "MISS";
    listCache.misses += 1;
    return null;
  }

  listCache.lastStatus = "HIT";
  listCache.hits += 1;
  return listCache.data;
}

export function setCachedList(list: WeatherInfo[]) {
  if (!listCache) {
    listCache = {
      data: list,
      timestamp: Date.now(),
      hits: 0,
      misses: 0,
      lastStatus: "MISS",
    };
    return;
  }

  listCache.data = list;
  listCache.timestamp = Date.now();
}

export function getCachedRaw(cityCode: string): OpenWeatherRaw | null {
  const entry = rawCache.get(cityCode);
  if (!entry) return null;
  if (!isFresh(entry.timestamp, RAW_TTL_MS)) {
    entry.lastStatus = "MISS";
    entry.misses += 1;
    return null;
  }
  entry.lastStatus = "HIT";
  entry.hits += 1;
  return entry.data;
}

export function setCachedRaw(cityCode: string, data: OpenWeatherRaw) {
  const existing = rawCache.get(cityCode);
  if (existing) {
    existing.data = data;
    existing.timestamp = Date.now();
    return;
  }
  rawCache.set(cityCode, {
    data,
    timestamp: Date.now(),
    hits: 0,
    misses: 0,
    lastStatus: "MISS",
  });
}

export function getCachedProcessed(cityCode: string): WeatherInfo | null {
  const entry = processedCache.get(cityCode);
  if (!entry) return null;
  if (!isFresh(entry.timestamp, PROCESSED_TTL_MS)) {
    entry.lastStatus = "MISS";
    entry.misses += 1;
    return null;
  }
  entry.lastStatus = "HIT";
  entry.hits += 1;
  return entry.data;
}

export function setCachedProcessed(cityCode: string, data: WeatherInfo) {
  const existing = processedCache.get(cityCode);
  if (existing) {
    existing.data = data;
    existing.timestamp = Date.now();
    return;
  }
  processedCache.set(cityCode, {
    data,
    timestamp: Date.now(),
    hits: 0,
    misses: 0,
    lastStatus: "MISS",
  });
}

export function getWeatherCacheSnapshot() {
  const now = Date.now();

  const raw = Array.from(rawCache.entries()).map(([cityCode, entry]) => ({
    cityCode,
    ageSeconds: Math.round((now - entry.timestamp) / 1000),
    isFresh: isFresh(entry.timestamp, RAW_TTL_MS),
    hits: entry.hits,
    misses: entry.misses,
    lastStatus: entry.lastStatus,
  }));

  const processed = Array.from(processedCache.entries()).map(
    ([cityCode, entry]) => ({
      cityCode,
      ageSeconds: Math.round((now - entry.timestamp) / 1000),
      isFresh: isFresh(entry.timestamp, PROCESSED_TTL_MS),
      hits: entry.hits,
      misses: entry.misses,
      lastStatus: entry.lastStatus,
    }),
  );

  const list =
    listCache === null
      ? null
      : {
          ageSeconds: Math.round((now - listCache.timestamp) / 1000),
          isFresh: isFresh(listCache.timestamp, LIST_TTL_MS),
          hits: listCache.hits,
          misses: listCache.misses,
          lastStatus: listCache.lastStatus,
          size: listCache.data.length,
        };

  return {
    now: new Date(now).toISOString(),
    ttlSeconds: {
      raw: RAW_TTL_MS / 1000,
      processed: PROCESSED_TTL_MS / 1000,
      list: LIST_TTL_MS / 1000,
    },
    list,
    raw,
    processed,
  };
}
