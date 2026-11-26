import { NextRequest } from "next/server";

type WeatherAlert = {
  level: "good" | "caution" | "warning";
  title: string;
  advice: string;
};

function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Misty / Foggy";
  if (code <= 57) return "Light drizzle";
  if (code <= 67) return "Rain showers";
  if (code <= 82) return "Heavy rain showers";
  if (code >= 95) return "Thunderstorm risk";
  return "Tropical conditions";
}

function buildAlert(
  code: number,
  temp: number,
  rainProb: number,
  windKmh: number
): WeatherAlert {
  if (code >= 95 || rainProb >= 75) {
    return {
      level: "warning",
      title: "Monsoon / Heavy Rain Alert",
      advice:
        "High rain probability. Plan indoor heritage stops, carry waterproof gear, and check highland road/rail updates.",
    };
  }
  if (code >= 51 || rainProb >= 45 || windKmh >= 30) {
    return {
      level: "caution",
      title: "Passing Showers / Breeze Advisory",
      advice:
        "Pack a light rain jacket and start outdoor climbs or beaches early in the morning before afternoon clouds build.",
    };
  }
  if (temp >= 33) {
    return {
      level: "caution",
      title: "Warm Sun & Hydration Advisory",
      advice:
        "High daytime heat. Schedule temple walks or climbs before 9:30 AM and rest in shaded cafes midday.",
    };
  }
  return {
    level: "good",
    title: "Great Travel Weather",
    advice:
      "Comfortable tropical conditions ideal for sightseeing, coastal walks, and scenic transfers.",
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < 5 ||
    lat > 10.5 ||
    lon < 79 ||
    lon > 82.5
  ) {
    return Response.json(
      { error: "Provide valid Sri Lanka coordinates." },
      { status: 400 }
    );
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=3&timezone=Asia%2FColombo`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      throw new Error("Weather provider unavailable.");
    }
    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const temp = Math.round(Number(current.temperature_2m ?? 28));
    const code = Number(current.weather_code ?? 1);
    const wind = Math.round(Number(current.wind_speed_10m ?? 10));
    const rainProb = Number(daily.precipitation_probability_max?.[0] ?? 20);

    return Response.json({
      temperatureC: temp,
      windKmh: wind,
      rainProbability: rainProb,
      condition: describeWeatherCode(code),
      alert: buildAlert(code, temp, rainProb, wind),
      forecast: (daily.time || []).map((date: string, i: number) => ({
        date,
        maxC: Math.round(Number(daily.temperature_2m_max?.[i] ?? temp)),
        minC: Math.round(Number(daily.temperature_2m_min?.[i] ?? temp - 5)),
        rainProb: Number(daily.precipitation_probability_max?.[i] ?? rainProb),
        condition: describeWeatherCode(Number(daily.weather_code?.[i] ?? code)),
      })),
    });
  } catch {
    return Response.json(
      { error: "Unable to load live weather alerts right now." },
      { status: 503 }
    );
  }
}
