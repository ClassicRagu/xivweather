import { AllowedWeathers } from "../static/AllowedWeathers";
import { WeatherRates } from "../static/WeatherRates";
import { WindowTimes } from "../types/WindowTimes";
import { ZoneObject } from "../types/ZoneObject";
import { getETWindow } from "./getETWindow";
import { getTimefromIncrement } from "./getTimeFromIncrement";
import { getWeather } from "./getWeather";

const EIGHT_HOURS = 8 * 175 * 1000;

/**
 * A function that finds the next weather in a zone. Beware of infinite loops as we don't properly validate 
 * @param startTime 
 * @param zone 
 * @param weathers 
 * @param safety an optional variable that stops infinite loops, enabled by default
 * @returns 
 */
export const findNextWeatherWindow = (
  startTime: Date,
  zone: ZoneObject,
  weathers: AllowedWeathers[],
  safety: boolean = true
): WindowTimes[] => {

  // Setup
  let lastWeather = 1;
  const realStartTime = getETWindow(startTime).getTime();
  let storedStart = new Date();
  let storedIncrement = -1;
  let storedWeathers = [];
  let i = realStartTime;

  // Avoiding infinite loops
  if(safety && !WeatherRates[zone.Rate as number].find((x) => weathers.includes(x.Weather))){
    return []
  }

  // Loop until we reach the end time!
  while (true) {
    // Get weather for loop
    const { currentWeather, increment } = getWeather(
      new Date(i),
      zone
    );

    // Check current weather is part of our search
    const validWeather = weathers.includes(currentWeather);

    // Weather is valid, begin counting consecutive windows
    if (validWeather) {
      storedWeathers.push(currentWeather);
      storedStart = new Date(i);
      storedIncrement = increment;
      i = i + EIGHT_HOURS;
      return [
        {
          startTime: storedStart,
          totalWindows: lastWeather,
          startTimeET: getTimefromIncrement(storedIncrement),
          endTime: new Date(i),
          weathers: storedWeathers,
        },
      ]
    // Weather is invalid, reset to find the next
    } else {
      storedWeathers = [];
      lastWeather = 1;
      i = i + EIGHT_HOURS;
    }
  }
};
