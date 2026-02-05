import React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 50,
  strokeWidth = 6,
  className,
}) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedValue / 100) * circumference;

  const getColorClass = () => {
    if (clampedValue >= 80) return "text-emerald-500";
    if (clampedValue >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getGlowFilter = () => {
    if (clampedValue >= 80)
      return "drop-shadow(0 0 10px rgba(16,185,129,0.45))";
    if (clampedValue >= 50)
      return "drop-shadow(0 0 10px rgba(245,158,11,0.45))";
    return "drop-shadow(0 0 10px rgba(239,68,68,0.45))";
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className ?? ""}`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: getGlowFilter() }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${getColorClass()} transition-all duration-700 ease-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {/* Value text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">
          {clampedValue}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Score
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
