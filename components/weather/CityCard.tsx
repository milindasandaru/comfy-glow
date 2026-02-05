import React from "react";
import {
  Cloud,
  Sun,
  CloudRain,
  Snowflake,
  CloudSun,
  CloudLightning,
  CloudFog,
} from "lucide-react";
import CircularProgress from "./CircularProgress";
import { cn } from "@/lib/utils";

// This interface defines the props for the CityCard component
export interface CityCardProps {
  cityName: string;
  temperature: number;
  weatherDescription: string;
  comfortIndex: number; // Comfort index value (0-100)
  rank: number; // Rank of the city based on comfort index
  weatherIcon: string;
  onClick?: () => void; // Optional click handler
}

const CityCard: React.FC<CityCardProps> = ({
  cityName,
  temperature,
  weatherDescription,
  comfortIndex,
  rank,
  weatherIcon,
  onClick,
}) => {
  // Function to select the appropriate weather icon
  const getIcon = () => {
    switch (weatherIcon) {
      case "sunny":
        return <Sun className="h-7 w-7 text-primary" />;
      case "rainy":
        return <CloudRain className="h-7 w-7 text-primary" />;
      case "snowy":
        return <Snowflake className="h-7 w-7 text-primary" />;
      case "partly-cloudy":
        return <CloudSun className="h-7 w-7 text-primary" />;
      case "stormy":
        return <CloudLightning className="h-7 w-7 text-primary" />;
      case "misty":
        return <CloudFog className="h-7 w-7 text-primary" />;
      default:
        return <Cloud className="h-7 w-7 text-primary" />;
    }
  };

  const getComfortCardClass = () => {
    if (comfortIndex >= 80) return "glass-card-comfort-good";
    if (comfortIndex >= 50) return "glass-card-comfort-medium";
    return "glass-card-comfort-poor";
  };

  const getRankLabel = () => `#${rank}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card-pro group relative overflow-hidden rounded-2xl p-6 cursor-pointer",
        "hover:scale-[1.02] hover:-translate-y-1 animate-fade-in",
        getComfortCardClass(),
      )}
      style={{ animationDelay: `${rank * 100}ms` }}
    >
      {/* Rank Badge */}
      <div className="absolute right-4 top-4">
        <span className="rounded-full bg-background/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground border border-border/50">
          {getRankLabel()}
        </span>
      </div>

      {/* Weather Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:animate-float">
        {getIcon()}
      </div>

      {/* City Name */}
      <h3 className="mb-1 text-xl font-bold text-foreground">{cityName}</h3>

      {/* Weather Description */}
      <p className="mb-4 text-sm text-muted-foreground">{weatherDescription}</p>

      {/* Temperature & Comfort Score Row */}
      <div className="flex items-center justify-between">
        {/* Temperature */}
        <div>
          <span className="text-5xl font-light text-foreground">
            {temperature}
          </span>
          <span className="text-2xl text-muted-foreground">°C</span>
        </div>

        {/* Circular Progress for Comfort Score */}
        <CircularProgress value={comfortIndex} size={70} strokeWidth={5} />
      </div>
    </div>
  );
};

export default CityCard;
