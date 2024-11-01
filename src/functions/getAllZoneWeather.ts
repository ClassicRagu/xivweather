import { ValidZones } from "../static/AllowedZones";
import { WeatherRates } from "../static/WeatherRates";
import { Zones } from "../static/Zones";

export const getAllZoneWeather = (zone: ValidZones) => {
  return WeatherRates[Zones[zone]];
};
