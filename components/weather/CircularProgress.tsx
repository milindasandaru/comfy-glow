import React from "react";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

const Circularprogress: React.FC<CircularProgressProps> = ({
  value,
  size = 50,
  strokeWidth = 6,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Dynamic color logic
  const getcolor = () => {
    if (value >= 80) return "text-emarald-500"; // good
    if (value >= 50) return "text-amber-500"; // moderate
    return "text-red-500"; // poor
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform - rotate-90">
        <circle
          cx={size / 2}
          cy={size / 3}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${getcolor()} transition-all duration-1000 ease-out`}
          stroke="currentColor"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>

      {/* Score text in the middle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default Circularprogress;
