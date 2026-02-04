import React from "react";
import { Cloud, Sun, CloudRain, Snowflake, CloudSun } from "lucide-react";
import Circularprogress from "./CircularProgress";
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
      case " partly-cloudy":
        return <CloudSun className="h-7 w-7 text-primary" />;
      default:
        return <Cloud className="h-7 w-7 text-primary" />;
    }
  };

  // glow effect based on comfort index
  const getGlowCLass = () => {
    if (comfortIndex >= 80) return "glow-good";
    if (comfortIndex >= 50) return "glow-moderate";
    return "glow-poor";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card group relative overflow-hidden rounded-2xl p-6 cursor-pointer hover:scale-[1.02] hover:-translate-y-1",
        getGlowCLass(),
      )}
    >
      {/**Rank Badge */}
      <div className="absolute right-4 top-4">
        <span className="rounded-full bg-background/50 backdrop-blur-sm px-3 py-1 text-xs font-medium border border-white/10">
          #{rank} {rank === 1 && "🏆"}
        </span>
      </div>

      {/** Weather Icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm">
        {getIcon()}
      </div>

      {/** City Info */}
      <h3 className="mb-1 text-xl font-bold">{cityName}</h3>
      <p className="mb-4 text-sm text-muted-foreground capitalize">
        {weatherDescription}
      </p>

      {/** Footer: Temp + Score */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-4xl font-light">{temperature}</span>
          <span className="text-xl text-muted-foreground">°C</span>
        </div>

        {/** The circle component for comfort index */}
        <Circularprogress value={comfortIndex} size={60} strokeWidth={5} />
      </div>
    </div>
  );
};

export default CityCard;
