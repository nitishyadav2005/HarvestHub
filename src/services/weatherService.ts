import type { FarmWeather } from '../types';

export function getFarmWeather(): FarmWeather {
  return {
    tempCelsius: 29,
    condition: 'Partly Cloudy',
    humidityPercent: 68,
    rainfallChancePercent: 20,
    windSpeedKmh: 12,
    location: 'Green Valley Farm, Karnal Belt',
    advisoryTip: 'Optimal morning humidity for wheat CRI irrigation and mustard fertigation on Green Valley Plot A and North Field. Favorable window for pest scouting.'
  };
}
