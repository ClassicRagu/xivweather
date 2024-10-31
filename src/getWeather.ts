import { WeatherRates } from "./static/WeatherRates";
import { Zones } from "./static/Zones";
import { ChanceMap } from "./types/ChanceMap";
import { WeatherMap } from "./types/WeatherMap";

// This code was ripped directly from eorzea-weather and modified for
// the files in static
const getChance = (date: Date): ChanceMap => {
  const unixtime = Math.floor(date.getTime() / 1000);
  // Get Eorzea hour for weather start
  const bell = unixtime / 175;

  // Do the magic 'cause for calculations 16:00 is 0, 00:00 is 8 and 08:00 is 16
  const increment = (bell + 8 - (bell % 8)) % 24;

  // Take Eorzea days since unix epoch
  let totalDays = unixtime / 4200;
  totalDays = (totalDays << 32) >>> 0; // eslint-disable-line no-bitwise

  const calcBase = totalDays * 0x64 + increment;

  /* eslint-disable no-bitwise */
  const step1 = ((calcBase << 0xb) ^ calcBase) >>> 0;
  const step2 = ((step1 >>> 8) ^ step1) >>> 0;
  /* eslint-enable no-bitwise */

  return { chance: step2 % 0x64, increment };
};

export const getWeather = (date: Date, zone: string): WeatherMap => {
  const { chance: hash, increment } = getChance(date);
  if (zone in Zones) {
    const rates = WeatherRates[Zones[zone]];

    // This code was ripped directly from eorzea-weather
    // Determines the weather based on the rate for each weather
    let cumChance = 0;
    for (const { Weather, Rate: chance } of rates) {
      if ((cumChance += <number>chance) > hash) {
        return { currentWeather: Weather, increment };
      }
    }

    return { currentWeather: "nothing", increment: -1 };
  } else {
    return { currentWeather: "Bad Zone", increment: -1 };
  }
};