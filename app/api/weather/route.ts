import { NextResponse } from "next/server";
import axios from "axios";
import citiesData from "../../data/cities.json"; // Ensure path matches
import { calculateComfortIndex, getComfortLevel } from "@/lib/comfortIndex";
import {
  getCachedList,
  getCachedProcessed,
  getCachedRaw,
  OpenWeatherRaw,
  setCachedList,
  setCachedProcessed,
  setCachedRaw,
  WeatherInfo,
} from "@/lib/weather";

// Define the structure of your JSON file
interface CityEntry {
  CityCode: string;
  CityName: string;
  Temp: string;
  Status: string;
}

interface CitiesFile {
  List: CityEntry[];
}

// Access the array using 'unknown' first to satisfy the linter
const cityList: CityEntry[] = (citiesData as unknown as CitiesFile).List;

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing" },
        { status: 500 },
      );
    }

    // Prefer a cached pre-ranked list (processed output cache)
    const cachedList = getCachedList();
    if (cachedList) {
      return NextResponse.json({ weather: cachedList }, { status: 200 });
    }

    const weatherPromises = cityList.map(async (city) => {
      const cityCode = city.CityCode;

      // Processed cache (per-city)
      const cachedProcessed = getCachedProcessed(cityCode);
      if (cachedProcessed) return cachedProcessed;

      // Raw cache (OpenWeather response)
      let raw = getCachedRaw(cityCode);
      if (!raw) {
        const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${apiKey}&units=metric`;
        const response = await axios.get<OpenWeatherRaw>(url);
        raw = response.data;
        setCachedRaw(cityCode, raw);
      }

      // Calculate Comfort Index from raw
      const temp = raw.main.temp;
      const humidity = raw.main.humidity;
      const windSpeed = raw.wind.speed;

      const score = calculateComfortIndex(temp, humidity, windSpeed);
      const comfortLevel = getComfortLevel(score);

      const weatherInfo: WeatherInfo = {
        id: cityCode,
        name: city.CityName,
        country: raw.sys.country,
        temp: Math.round(temp),
        humidity,
        windSpeed,
        condition: raw.weather[0]?.main ?? "Unknown",
        description: raw.weather[0]?.description ?? "",
        icon: raw.weather[0]?.icon ?? "",
        comfortScore: score,
        comfortLevel,
        timestamp: new Date().toISOString(),
      };

      setCachedProcessed(cityCode, weatherInfo);
      return weatherInfo;
    });

    const weatherData = await Promise.all(weatherPromises);

    // Sort & Rank by comfortScore descending
    weatherData.sort((a, b) => b.comfortScore - a.comfortScore);

    const rankedWeatherData = weatherData.map((city, index) => ({
      ...city,
      rank: index + 1,
    }));

    setCachedList(rankedWeatherData);

    return NextResponse.json({ weather: rankedWeatherData }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
