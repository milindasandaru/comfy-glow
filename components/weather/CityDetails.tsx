import React from "react";
import { X, Droplets, Wind, Eye, Gauge, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Circularprogress from "./CircularProgress";

// types
interface CityData {
  id: number;
  name: string;
  temp: number;
  description: string;
  comfortScore: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

interface CityDetailsModalProps {
  city: CityData | null;
  isOpen: boolean;
  onClose: () => void;
}

// generate dummy data for chart
const generateFOrecastData = (currentTemp: number) => {
  const data = [];
  for (let i = 0; i < 6; i++) {
    // Simple sine wave variation for demo purposes
    const time = ["Now", "4h", "8h", "12h", "16h", "20h"][i];
    const variation = Math.floor(Math.random() * 5) - 2;
    data.push({ time, temp: currentTemp + variation });
  }
  return data;
};

const CityDetailsModal: React.FC<CityDetailsModalProps> = ({
  city,
  isOpen,
  onClose,
}) => {
  // close modal on background click
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !city) return null;

  const forecastData = generateFOrecastData(city.temp);

  return (
    // overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/** Model Content */}
      <div className="relative w-full max-w-2xl overflow-hidden glass-class rounded-3xl animate-in zoom-in-95 duration-300">
        {/** Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>

        {/** Header section */}
        <div className="p-8 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {city.name}
              </h2>
              <p className="text-muted-foreground capitalize text-lg">
                {city.description}
              </p>
            </div>

            {/** Score circle */}
            <Circularprogress
              value={city.comfortScore}
              size={90}
              strokeWidth={10}
            />
          </div>
        </div>

        {/** Main stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 p-4">
          <StatTile
            icon={Droplets}
            label="Humidity"
            value={`${city.humidity}%`}
          />
          <StatTile
            icon={Wind}
            label="Wind Speed"
            value={`${city.windSpeed} m/s`}
          />
          <StatTile icon={Gauge} label="Pressure" value="1012 hPa" />
          <StatTile icon={Eye} label="Visibility" value="10 km" />
        </div>

        {/** Chart section */}
        <div className="p-8 pt-0 h-64 w-full">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium uppercase tracking wider text-muted-foreground">
              24-Hours Forecast Trend
            </span>
          </div>

          <div className="h-full w-full bg-white/5 rounded-2xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="time"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  unit="°"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#ffff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#0ea5e9"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for the stat tiles
const StatTile = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
    <Icon className="h-6 w-6 text-primary mb-2" />
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold text-foreground">{value}</span>
  </div>
);

export default CityDetailsModal;
