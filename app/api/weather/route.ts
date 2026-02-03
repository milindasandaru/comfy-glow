import { NextResponse } from "next/server";
import axios from "axios";
import citiesData from "../../../app/data/cities.json"; // Ensure path matches
import { calculateComfortIndex, getComfortLevel } from "@/lib/comfortIndex";

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

// Define the structure of the Cleaned Weather Data
interface WeatherInfo {
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
  comfortLevel: { label: string; color: string; bg: string; desc: string };
  timestamp: string;
  rank?: number;
}

// Define the structure of the Cache
interface CacheEntry {
  data: WeatherInfo;
  timestamp: number;
}

// Access the array using 'unknown' first to satisfy the linter
const cityList: CityEntry[] = (citiesData as unknown as CitiesFile).List;

// Typed Cache
const weatherCache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is missing" },
        { status: 500 },
      );
    }

    const weatherPromises = cityList.map(async (city) => {
      const cityCode = city.CityCode;
      const currentTime = Date.now();

      // Check Cache first
      if (
        weatherCache[cityCode] &&
        currentTime - weatherCache[cityCode].timestamp < CACHE_DURATION
      ) {
        console.log(`🔥 CACHE HIT: ${city.CityName}`);
        return weatherCache[cityCode].data;
      }

      console.log(`💨 API FETCH: ${city.CityName}`);

      // Fetch weather data from OpenWeatherMap
      // explicit type for axios response avoids 'any'
      const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityCode}&appid=${apiKey}&units=metric`;
      const response = await axios.get<{
        sys: { country: string };
        main: { temp: number; humidity: number };
        wind: { speed: number };
        weather: { main: string; description: string; icon: string }[];
      }>(url);

      const data = response.data;

      // Calculate Comfort Index
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      const score = calculateComfortIndex(temp, humidity, windSpeed);
      const comfortLevel = getComfortLevel(score);

      // Structure the cleaned weather data
      const weatherInfo: WeatherInfo = {
        id: cityCode,
        name: city.CityName,
        country: data.sys.country,
        temp: Math.round(temp),
        humidity: humidity,
        windSpeed: windSpeed,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        comfortScore: score,
        comfortLevel: comfortLevel,
        timestamp: new Date().toISOString(),
      };

      // Save to Cache
      weatherCache[cityCode] = {
        data: weatherInfo,
        timestamp: currentTime,
      };

      return weatherInfo;
    });

    // Wait for all requests
    const weatherData = await Promise.all(weatherPromises);

    // Sort & Rank by comfortScore descending
    weatherData.sort((a, b) => b.comfortScore - a.comfortScore);

    const rankedWeatherData = weatherData.map((city, index) => ({
      ...city,
      rank: index + 1,
    }));

    return NextResponse.json({ weather: rankedWeatherData }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
