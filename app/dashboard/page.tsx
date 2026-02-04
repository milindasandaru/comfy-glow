"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
// import Navbar from "@/components/layout/Navbar";
// import FloatingNavbar from "@/components/layout/FloatingNavbar";
import CityCard from "@/components/weather/CityCard";
import CityDetailsModal from "@/components/weather/CityDetails";
// import SearchBar from "@/components/logic/SearchBart";

// types
interface WeatherData {
  id: number;
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

  // Map API icons to ui
  const getIconType = (apiIcon: string) => {
    if (apiIcon.includes("01")) return "sunny";
    if (apiIcon.includes("09") || apiIcon.includes("10")) return "rainy";
    if (apiIcon.includes("13")) return "snowy";
    if (apiIcon.includes("02") || apiIcon.includes("03"))
      return "partly-cloudy";
    return "cloudy";
  };

  // filtered data based on search
  const filteredCities = data.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* <Navbar /> */}

      <div className="p-6 md:p-12">
        {/** Hero Section */}
        <div className="max-w-7xl mx-auto mb-12 text-center space-y-6 animate-in fade-in duration-700">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
            Global Comfort Index
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore real-time comfort levels across major cities worldwide. Stay
            informed and plan your day with confidence.
          </p>

          {/** Search Bar */}
          <div className="flex justify-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities..."
              className="w-full max-w-md bg-secondary/30 backdrop-blur-xl border border-border rounded-2xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
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
            filteredCities.map((city, index) => (
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
                  weatherIcon={getIconType(city.icon)}
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

        {/* <FloatingNavbar /> */}
      </div>
    </div>
  );
}
