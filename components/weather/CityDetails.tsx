"use client";

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
import CircularProgress from "./CircularProgress";

// types
interface CityData {
  id: string;
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
const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const seedFromString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const generateForecastData = (currentTemp: number, seed: number) => {
  const rand = mulberry32(seed);
  const times = ["Now", "4h", "8h", "12h", "16h", "20h"];
  return times.map((time, index) => {
    const wave = Math.sin((index + 1) / 1.6) * 1.5;
    const jitter = (rand() - 0.5) * 3.5;
    const variation = wave + jitter;
    return { time, temp: Math.round((currentTemp + variation) * 10) / 10 };
  });
};

const CityDetailsModal: React.FC<CityDetailsModalProps> = ({
  city,
  isOpen,
  onClose,
}) => {
  // close modal on background click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const forecastData = city
    ? generateForecastData(city.temp, seedFromString(city.id))
    : [];

  if (!isOpen || !city) return null;

  const comfortLabel =
    city.comfortScore >= 80
      ? "Excellent"
      : city.comfortScore >= 50
        ? "Moderate"
        : "Poor";

  return (
    // overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="button"
      tabIndex={-1}
      aria-label="Close city details"
    >
      {/** Model Content */}
      <div
        className="relative w-full max-w-2xl overflow-hidden glass-card rounded-3xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${city.name} weather details`}
      >
        {/** Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>

        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">
                {city.name}
              </h2>
              <p className="text-muted-foreground">{city.description}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-6xl font-light text-foreground">
                {Math.round(city.temp)}
              </span>
              <span className="text-3xl text-muted-foreground">°C</span>
            </div>
          </div>
        </div>

        {/* Comfort Score */}
        <div className="flex items-center justify-center px-8 pb-6">
          <div className="flex items-center gap-6">
            <CircularProgress
              value={city.comfortScore}
              size={100}
              strokeWidth={8}
            />
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Comfort Index
              </p>
              <p className="text-lg font-semibold text-foreground">
                {comfortLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on temperature, humidity & wind
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 px-8 pb-8">
          <StatTile
            icon={Droplets}
            label="Humidity"
            value={city.humidity.toString()}
            unit="%"
          />
          <StatTile
            icon={Wind}
            label="Wind Speed"
            value={city.windSpeed.toString()}
            unit="km/h"
          />
          <StatTile icon={Eye} label="Visibility" value="10 km" />
          <StatTile icon={Gauge} label="Pressure" value="1012 hPa" />
        </div>

        {/** Chart section */}
        <div className="px-8 pb-8 h-64 w-full">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
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
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit?: string;
}) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
    <Icon className="h-6 w-6 text-primary mb-2" />
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold text-foreground">
      {value}
      {unit ? (
        <span className="text-sm text-muted-foreground">{unit}</span>
      ) : null}
    </span>
  </div>
);

export default CityDetailsModal;
