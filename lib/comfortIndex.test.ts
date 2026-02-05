import { describe, expect, it } from "vitest";
import { calculateComfortIndex, getComfortLevel } from "./comfortIndex";

describe("calculateComfortIndex", () => {
  it("returns a number in [0, 100]", () => {
    const score = calculateComfortIndex(25, 50, 3);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("is near 100 around the ideal temperature", () => {
    // Around the ideal point and in the neutral band (no SSI / wind-chill adjustment).
    // 21°C = 69.8°F, deviation from 72°F is small.
    const score = calculateComfortIndex(21, 50, 2);
    expect(score).toBeGreaterThanOrEqual(95);
  });

  it("drops as temperature moves away from the ideal", () => {
    const nearIdeal = calculateComfortIndex(22.2, 40, 1);
    const warmer = calculateComfortIndex(30, 40, 1);
    const colder = calculateComfortIndex(5, 40, 1);

    expect(warmer).toBeLessThan(nearIdeal);
    expect(colder).toBeLessThan(nearIdeal);
  });

  it("penalizes high humidity in hot conditions (SSI)", () => {
    const lowHumidity = calculateComfortIndex(30, 30, 1);
    const highHumidity = calculateComfortIndex(30, 90, 1);
    expect(highHumidity).toBeLessThan(lowHumidity);
  });

  it("penalizes high wind in cold conditions (wind chill)", () => {
    const lowWind = calculateComfortIndex(0, 40, 1);
    const highWind = calculateComfortIndex(0, 40, 10);
    expect(highWind).toBeLessThan(lowWind);
  });
});

describe("getComfortLevel", () => {
  it("returns expected labels", () => {
    expect(getComfortLevel(90).label).toBe("Excellent");
    expect(getComfortLevel(75).label).toBe("Good");
    expect(getComfortLevel(55).label).toBe("Moderate");
    expect(getComfortLevel(35).label).toBe("Poor");
    expect(getComfortLevel(10).label).toBe("Dangerous");
  });
});
