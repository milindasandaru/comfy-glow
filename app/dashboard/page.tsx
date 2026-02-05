"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CityCard from "@/components/weather/CityCard";
import CityDetailsModal from "@/components/weather/CityDetails";

// types
interface WeatherData {
  id: string;
  name: string;
  country: string;
  temp: number;
  condition: string;
  description: string;
  icon: string;
  comfortScore: number;
  rank: number;
  humidity: number;
  windSpeed: number;
}

export default function Dashboard() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<
    "rank" | "temp-desc" | "temp-asc" | "name-asc"
  >("rank");
  const [selectedCity, setSelectedCity] = useState<WeatherData | null>(null);

  // Fetch weather data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/weather");
        setData(res.data.weather);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map OpenWeather icon/condition to our UI icon types
  const getIconType = (
    apiIcon: string,
    temp: number,
    condition: string,
    description: string,
  ) => {
    const icon = (apiIcon ?? "").toLowerCase();
    const main = (condition ?? "").toLowerCase();
    const desc = (description ?? "").toLowerCase();

    // Requested behavior: sub-zero temperatures show snow
    if (temp <= 0) return "snowy";

    // Prefer OpenWeather icon code when present
    if (icon.includes("11")) return "stormy";
    if (icon.includes("50")) return "misty";
    if (icon.includes("09") || icon.includes("10")) return "rainy";
    if (icon.includes("13")) return "snowy";
    if (icon.includes("01")) return "sunny";
    if (icon.includes("02")) return "partly-cloudy";
    if (icon.includes("03") || icon.includes("04")) return "cloudy";

    // Fallback to condition/description
    if (main.includes("thunder") || desc.includes("thunder")) return "stormy";
    if (main.includes("snow") || desc.includes("snow")) return "snowy";
    if (
      main.includes("rain") ||
      main.includes("drizzle") ||
      desc.includes("rain") ||
      desc.includes("drizzle")
    ) {
      return "rainy";
    }
    if (main.includes("mist") || main.includes("fog") || desc.includes("mist"))
      return "misty";
    if (main.includes("clear")) return "sunny";
    if (main.includes("cloud") || desc.includes("cloud")) return "cloudy";
    return "cloudy";
  };

  // filtered data based on search
  const filteredCities = data.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleCities = (() => {
    const copy = [...filteredCities];
    switch (sortBy) {
      case "temp-desc":
        return copy.sort((a, b) => b.temp - a.temp);
      case "temp-asc":
        return copy.sort((a, b) => a.temp - b.temp);
      case "name-asc":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "rank":
      default:
        return copy.sort((a, b) => a.rank - b.rank);
    }
  })();

  return (
    <div className="p-6 md:p-12">
      {/** Hero Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center space-y-6 animate-in fade-in duration-700">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">
          Global Comfort Index
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore real-time comfort levels across major cities worldwide. Stay
          informed and plan your day with confidence.
        </p>

        {/** Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cities..."
            className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "rank"
                  | "temp-desc"
                  | "temp-asc"
                  | "name-asc",
              )
            }
            className="w-full sm:w-56 bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="rank">Sort: Rank (Comfort)</option>
            <option value="temp-desc">Sort: Temperature (High → Low)</option>
            <option value="temp-asc">Sort: Temperature (Low → High)</option>
            <option value="name-asc">Sort: City Name (A → Z)</option>
          </select>
        </div>
      </div>

      {/** Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/** Loading skeletons */}
        {loading &&
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-secondary/50 animate-pulse border border-border"
            />
          ))}

        {/** City Cards */}
        {!loading &&
          visibleCities.map((city, index) => (
            <div
              key={city.id}
              className="animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CityCard
                cityName={city.name}
                temperature={city.temp}
                weatherDescription={city.description}
                comfortIndex={city.comfortScore}
                rank={city.rank}
                weatherIcon={getIconType(
                  city.icon,
                  city.temp,
                  city.condition,
                  city.description,
                )}
                onClick={() => setSelectedCity(city)}
              />
            </div>
          ))}
      </div>

      {/** Empty state */}
      {!loading && filteredCities.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          No cities found matching &quot;{search}&quot;.
        </div>
      )}

      {/** Detail modal */}
      <CityDetailsModal
        city={selectedCity}
        isOpen={!!selectedCity}
        onClose={() => setSelectedCity(null)}
      />
    </div>
  );
}
