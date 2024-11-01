# XIVWeather
XIVWeather is an NPM package built off of [Eorzea Weather](https://github.com/eorzea-weather/node-eorzea-weather/tree/main). All of the static files are built using Lumina [in this separate C# application](https://github.com/ClassicRagu/WeatherGenerator) to make implementing new zones far more painless than the existing Eorzea Weather solution. This currently only supports EN.

## Install
```npm install xivweather```

## Usage
```js
import { getETWindow, getWeather, getTimefromIncrement, ZONE_EUREKA_PYROS } from "xivweather";

const eorzeaTime = getETWindow(new Date()).getTime();
const weather = getWeather(eorzeaTime, ZONE_EUREKA_PYROS); // {currentWeather: Umbral Wind, increment: 0}
const time = getTimefromIncrement(weather.increment) // 4pm

const startTime = new Date()
const endTime = new Date(startTime + 6.048e8)
const consectutiveWindows = 2
const zone = ZONE_EUREKA_PYROS
const weathers = ["Thunder", "Heat Waves"]
// optional
const nightOnly = false

// Returns a list of consectutive weather windows in a time range
const windows = findWeatherWindows(startTime, endTime, consectutiveWindows, zone, weathers, nightOnly)
```