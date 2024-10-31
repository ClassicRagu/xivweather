import { ValidZones } from "../static/AllowedZones";
import { WeatherRates } from "../static/WeatherRates";
import { Zones } from "../static/Zones";

export const getAllZoneWeather = (zone: ValidZones) => {
  if (zone in Zones) {
    return WeatherRates[Zones[zone]];
  }
}