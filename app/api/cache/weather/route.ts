import { NextResponse } from "next/server";
import { getWeatherCacheSnapshot } from "@/lib/weather";

export async function GET() {
  return NextResponse.json(getWeatherCacheSnapshot(), { status: 200 });
}
