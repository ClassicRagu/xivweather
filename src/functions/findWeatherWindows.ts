import { AllowedWeathers } from "../static/AllowedWeathers";
import { WindowTimes } from "../types/WindowTimes";
import { ZoneObject } from "../types/ZoneObject";
import { getETWindow } from "./getETWindow";
import { getTimefromIncrement } from "./getTimeFromIncrement";
import { getWeather } from "./getWeather";

const EIGHT_HOURS = 8 * 175 * 1000;

// validates that the current window takes place at night if needed
const checkForNightOnly = (
  nightOnly: boolean,
  windows: number,
  increment: number
) => {
  return (
    !nightOnly ||
    windows > 2 ||
    increment == 0 ||
    (windows == 1 && increment == 8)
  );
};

/**
 * A function that finds all consectutive windows of certain weather types in a time range
 * @param startTime 
 * @param endTime 
 * @param consecutiveWindows 
 * @param zone 
 * @param weathers 
 * @param nightOnly only applies to 1 and 2 consecutiveWindows
 * @returns 
 */
export const findWeatherWindows = (
  startTime: Date,
  endTime: Date,
  consecutiveWindows: number,
  zone: ZoneObject,
  weathers: AllowedWeathers[],
  // Night only limits results when set to 1-2 consecutive windows
  // At 1 window it allows both 4pm and 12am
  // At 2 windows it allows only 4pm
  nightOnly: boolean = false
): WindowTimes[] => {

  // Setup
  let timeArr: WindowTimes[] = [];
  let lastWeather = 1;
  const realStartTime = getETWindow(startTime).getTime();
  const realEndTime = getETWindow(endTime).getTime();
  let storedStart = new Date();
  let storedIncrement = -1;
  let storedWeathers = [];
  let i = realStartTime;

  // Loop until we reach the end time!
  while (i < realEndTime) {
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
      while (true) {
        const newWeather = getWeather(
          new Date(i),
          zone
        ).currentWeather;
        if (weathers.includes(newWeather)) {
          storedWeathers.push(newWeather);
          i = i + EIGHT_HOURS;
          lastWeather++;
        } else {
          break;
        }
      }
      if (consecutiveWindows < lastWeather) {
        timeArr = [
          ...timeArr,
          {
            startTime: storedStart,
            totalWindows: lastWeather,
            startTimeET: getTimefromIncrement(storedIncrement),
            endTime: new Date(i),
            weathers: storedWeathers,
          },
        ];
        lastWeather = 1;
      } else if (
        consecutiveWindows == lastWeather &&
        checkForNightOnly(nightOnly, consecutiveWindows, storedIncrement)
      ) {
        timeArr = [
          ...timeArr,
          {
            startTime: storedStart,
            totalWindows: lastWeather,
            startTimeET: getTimefromIncrement(storedIncrement),
            endTime: new Date(i),
            weathers: storedWeathers,
          },
        ];
        lastWeather = 1;
      }
    // Weather is invalid, reset to find the next
    } else {
      storedWeathers = [];
      lastWeather = 1;
      i = i + EIGHT_HOURS;
    }
  }
  return timeArr;
};
