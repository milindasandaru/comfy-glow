// Calculate comfort index based on temperature (°C), humidity (%), and wind speed (m/s)

/**
 * FIDENZ COMFORT INDEX ALGORITHM
 * * Based on the "Summer Simmer Index" (SSI) for heat
 * and "Wind Chill" for cold, normalized to a 0-100 Scale.
 * * - 100 = Perfect Comfort (Ideal Zone)
 * - 0 = Extreme Danger (Heatstroke or Freezing)
 * * References:
 * - SSI derived from Pepi (1987) for physiological heat stress.
 * - Wind Chill based on standard meteorological models.
 */

export const calculateComfortIndex = (
  tempC: number,
  humidity: number,
  windSpeedMS: number,
): number => {
  // convert to fahrenheit
  const tempF = (tempC * 9) / 5 + 32;

  // calculate "feels like" temperature
  let perceivedTempF = tempF;

  if (tempF >= 70) {
    // Summer Simmer Index (SSI) for heat
    // SSI = 1.98 * (Ta - (0.55 - 0.0055 * RH) * (Ta - 58)) - 56.83
    // accurately measure heat stress
    perceivedTempF =
      1.98 * (tempF - (0.55 - 0.0055 * humidity) * (tempF - 58)) - 56.83;
  } else if (tempF <= 50) {
    // Wind Chill for cold
    // standard wind chill formula
    const windMph = windSpeedMS * 2.237; // convert m/s to mph
    perceivedTempF =
      35.74 +
      0.6215 * tempF -
      35.75 * Math.pow(windMph, 0.16) +
      0.4275 * tempF * Math.pow(windMph, 0.16);
  }

  // Between 50°F and 70°F, perceivedTempF = actual tempF (no adjustment)

  // Normalize perceivedTempF to Comfort Index (0-100 scale)
  // I define perfect comfort at 72°F (22.2°C)
  // The score drops as we move away from this ideal point

  const IDEAL_TEMP_F = 72;
  const deviation = Math.abs(perceivedTempF - IDEAL_TEMP_F);

  // Score logic:
  // 0 deviation = 100 score
  // 30 degree deviation = 0 score
  // I use a weighting of 3.33 to map 0-30 deviation to 100-0 score
  //const score = 100 - deviation * 3.5;
  const score = 100 - deviation * 2.0;

  // Clamp and return
  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Return color, label and description
 */

export const getComfortLevel = (score: number) => {
  if (score >= 85)
    return {
      label: "Excellent",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
      desc: "Ideal conditions for outdoor activity.",
    };
  if (score >= 70)
    return {
      label: "Good",
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      desc: "Comfortable, slight breeze or humidity.",
    };
  if (score >= 50)
    return {
      label: "Moderate",
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      desc: "Noticeable heat or cold. Caution advised.",
    };
  if (score >= 30)
    return {
      label: "Poor",
      color: "text-orange-500",
      bg: "bg-orange-500/20",
      desc: "Uncomfortable. Limit exposure.",
    };
  return {
    label: "Dangerous",
    color: "text-red-600",
    bg: "bg-red-600/20",
    desc: "Extreme risk. Stay indoors.",
  };
};
