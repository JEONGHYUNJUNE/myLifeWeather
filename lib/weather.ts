import type { DailyWeather, Result, WeatherCategory } from "./types";
const categories: WeatherCategory[] = [
  "sunny",
  "partly_cloudy",
  "cloudy",
  "rainy",
  "snowy",
  "unknown",
];
export function classifyWeather(d: DailyWeather): WeatherCategory {
  if ((d.snowfall_sum ?? 0) >= 0.1) return "snowy";
  if ((d.rain_sum ?? d.precipitation_sum ?? 0) >= 0.1) return "rainy";
  const ratio =
    d.daylight_duration && d.sunshine_duration != null
      ? d.sunshine_duration / d.daylight_duration
      : null;
  if (
    (ratio != null && ratio >= 0.65) ||
    (d.cloud_cover_mean != null && d.cloud_cover_mean < 30)
  )
    return "sunny";
  if (d.cloud_cover_mean != null)
    return d.cloud_cover_mean >= 75 ? "cloudy" : "partly_cloudy";
  if (d.weather_code != null) {
    if ([0].includes(d.weather_code)) return "sunny";
    if ([1, 2].includes(d.weather_code)) return "partly_cloudy";
    if (d.weather_code === 3) return "cloudy";
    if (d.weather_code >= 71 && d.weather_code <= 86) return "snowy";
    if (d.weather_code >= 51) return "rainy";
  }
  return "unknown";
}
export function validatePeriods(
  rs: { startDate: string; endDate: string; isCurrent: boolean }[],
  today = new Date().toISOString().slice(0, 10),
) {
  const sorted = [...rs]
    .map((r) => ({ ...r, end: r.isCurrent ? today : r.endDate }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const overlaps: string[] = [],
    gaps: string[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prevEnd = new Date(sorted[i - 1].end + "T00:00:00");
    const nextStart = new Date(sorted[i].startDate + "T00:00:00");
    const delta = (+nextStart - +prevEnd) / 86400000;
    if (delta <= 0) overlaps.push(sorted[i].startDate);
    else if (delta > 1) gaps.push(sorted[i].startDate);
  }
  return { overlaps, gaps };
}
const safe = (n: number | null | undefined) =>
  typeof n === "number" ? n : NaN;
export function analyzeWeather(
  days: DailyWeather[],
  birthdate: string,
): Result {
  const counts = Object.fromEntries(categories.map((c) => [c, 0])) as Record<
    WeatherCategory,
    number
  >;
  days.forEach((d) => counts[classifyWeather(d)]++);
  const percentages = Object.fromEntries(
    categories.map((c) => [
      c,
      days.length ? Math.round((counts[c] / days.length) * 1000) / 10 : 0,
    ]),
  ) as Record<WeatherCategory, number>;
  const temps = days.filter((d) =>
    Number.isFinite(safe(d.temperature_2m_mean)),
  );
  const extreme = (
    key:
      | "temperature_2m_max"
      | "temperature_2m_min"
      | "precipitation_sum"
      | "snowfall_sum",
    max = true,
  ) =>
    days.reduce(
      (a, d) =>
        Number.isFinite(safe(d[key])) &&
        (!a ||
          (max ? safe(d[key]) > safe(a[key]) : safe(d[key]) < safe(a[key])))
          ? d
          : a,
      undefined as DailyWeather | undefined,
    );
  const yearlyMap = new Map<number, DailyWeather[]>(),
    cityMap = new Map<string, DailyWeather[]>();
  days.forEach((d) => {
    const y = +d.date.slice(0, 4);
    yearlyMap.set(y, [...(yearlyMap.get(y) || []), d]);
    const c = d.city || "알 수 없음";
    cityMap.set(c, [...(cityMap.get(c) || []), d]);
  });
  const avg = (a: DailyWeather[]) => {
    const v = a.map((x) => safe(x.temperature_2m_mean)).filter(Number.isFinite);
    return v.length ? v.reduce((x, y) => x + y, 0) / v.length : 0;
  };
  const streak = (wanted: (c: WeatherCategory) => boolean) => {
    let best = 0,
      n = 0;
    days.forEach((d) => {
      n = wanted(classifyWeather(d)) ? n + 1 : 0;
      best = Math.max(best, n);
    });
    return best;
  };
  const md = birthdate.slice(5);
  const birthdayDays = days.filter((d) => d.date.slice(5) === md);
  const bdCats = birthdayDays.map(classifyWeather);
  const pack = (d: DailyWeather | undefined, key: keyof DailyWeather) => ({
    value: d ? Number(d[key] ?? 0) : 0,
    date: d?.date || "-",
    city: d?.city || "-",
  });
  const dayPack = (a: DailyWeather[]) => ({
    days: a.length,
    sunny: a.filter((x) => classifyWeather(x) === "sunny").length,
    rainy: a.filter((x) => classifyWeather(x) === "rainy").length,
    snowy: a.filter((x) => classifyWeather(x) === "snowy").length,
  });
  const weekdays = days.filter((d) => {
      const w = new Date(d.date + "T12:00:00").getDay();
      return w >= 1 && w <= 5;
    }),
    weekends = days.filter((d) => {
      const w = new Date(d.date + "T12:00:00").getDay();
      return w === 0 || w === 6;
    });
  return {
    totalDays: days.length,
    counts,
    percentages,
    averageTemp: avg(temps),
    max: pack(extreme("temperature_2m_max"), "temperature_2m_max"),
    min: pack(extreme("temperature_2m_min", false), "temperature_2m_min"),
    wettest: pack(extreme("precipitation_sum"), "precipitation_sum"),
    snowiest: pack(extreme("snowfall_sum"), "snowfall_sum"),
    yearly: [...yearlyMap].map(([year, a]) => ({
      year,
      temperature: +avg(a).toFixed(1),
      sunny: a.filter((x) => classifyWeather(x) === "sunny").length,
      rainy: a.filter((x) => classifyWeather(x) === "rainy").length,
      snowy: a.filter((x) => classifyWeather(x) === "snowy").length,
    })),
    cities: [...cityMap].map(([name, a]) => ({
      name,
      days: a.length,
      temperature: +avg(a).toFixed(1),
      sunny: a.filter((x) => classifyWeather(x) === "sunny").length,
      rainy: a.filter((x) => classifyWeather(x) === "rainy").length,
      snowy: a.filter((x) => classifyWeather(x) === "snowy").length,
    })),
    longestSunny: streak((c) => c === "sunny"),
    longestWet: streak((c) => c === "rainy" || c === "snowy"),
    hotDays: days.filter((d) => safe(d.temperature_2m_max) >= 33).length,
    tropicalNights: days.filter((d) => safe(d.temperature_2m_min) >= 25).length,
    coldDays: days.filter((d) => safe(d.temperature_2m_min) <= -12).length,
    heavyRainDays: days.filter((d) => safe(d.precipitation_sum) >= 80).length,
    awayPercent: days.length
      ? Math.round(
          (days.filter((d) => d.placeType === "activity").length /
            days.length) *
            1000,
        ) / 10
      : 0,
    weekday: dayPack(weekdays),
    weekend: dayPack(weekends),
    birthdays: {
      total: birthdayDays.length,
      sunny: bdCats.filter((c) => c === "sunny").length,
      rainy: bdCats.filter((c) => c === "rainy").length,
      snowy: bdCats.filter((c) => c === "snowy").length,
      hottest: birthdayDays.sort(
        (a, b) => safe(b.temperature_2m_max) - safe(a.temperature_2m_max),
      )[0],
      coldest: birthdayDays.sort(
        (a, b) => safe(a.temperature_2m_min) - safe(b.temperature_2m_min),
      )[0],
    },
  };
}
