export type WeatherCategory =
  "sunny" | "partly_cloudy" | "cloudy" | "rainy" | "snowy" | "unknown";
export type Residence = {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  useActivity?: boolean;
  activityName?: string;
  activityCountry?: string;
  activityLatitude?: number;
  activityLongitude?: number;
  activityDays?: number[];
};
export type DailyWeather = {
  date: string;
  weather_code?: number | null;
  temperature_2m_mean?: number | null;
  temperature_2m_max?: number | null;
  temperature_2m_min?: number | null;
  apparent_temperature_mean?: number | null;
  precipitation_sum?: number | null;
  rain_sum?: number | null;
  snowfall_sum?: number | null;
  precipitation_hours?: number | null;
  sunshine_duration?: number | null;
  daylight_duration?: number | null;
  cloud_cover_mean?: number | null;
  wind_speed_10m_max?: number | null;
  wind_gusts_10m_max?: number | null;
  city?: string;
  placeType?: "home" | "activity";
};
export type Result = {
  totalDays: number;
  counts: Record<WeatherCategory, number>;
  percentages: Record<WeatherCategory, number>;
  averageTemp: number;
  max: { value: number; date: string; city: string };
  min: { value: number; date: string; city: string };
  wettest: { value: number; date: string; city: string };
  snowiest: { value: number; date: string; city: string };
  yearly: {
    year: number;
    temperature: number;
    sunny: number;
    rainy: number;
    snowy: number;
  }[];
  cities: {
    name: string;
    days: number;
    temperature: number;
    sunny: number;
    rainy: number;
    snowy: number;
  }[];
  longestSunny: number;
  longestWet: number;
  hotDays: number;
  tropicalNights: number;
  coldDays: number;
  heavyRainDays: number;
  awayPercent: number;
  weekday: { days: number; sunny: number; rainy: number; snowy: number };
  weekend: { days: number; sunny: number; rainy: number; snowy: number };
  birthdays: {
    total: number;
    sunny: number;
    rainy: number;
    snowy: number;
    hottest?: DailyWeather;
    coldest?: DailyWeather;
  };
};
