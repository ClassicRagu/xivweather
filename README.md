# XIVWeather
XIVWeather is an NPM package built off of [Eorzea Weather](https://github.com/eorzea-weather/node-eorzea-weather/tree/main). All of the static files are built using Lumina [in this separate C# application](https://github.com/ClassicRagu/WeatherGenerator) to make implementing new zones far more painless than the existing Eorzea Weather solution. This currently only supports EN.

## Install
```npm install xivweather```

## Usage
```js
import { getETWindow, getWeather, getTimefromIncrement, ZONE_EUREKA_PYROS } from "xivweather";

const EorzeaTime = getETWindow(new Date()).getTime();
const weather = getWeather(EorzeaTime, ZONE_EUREKA_PYROS); // {currentWeather: Umbral Wind, increment: 0}
const time = getTimefromIncrement(weather.increment) // 4pm
```