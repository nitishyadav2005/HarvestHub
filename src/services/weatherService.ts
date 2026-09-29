import type { FarmWeather } from '../types';

export function getFarmWeather(): FarmWeather {
  return {
    tempCelsius: 29,
    condition: 'Partly Cloudy',
    humidityPercent: 68,
    rainfallChancePercent: 20,
    windSpeedKmh: 12,
    location: 'North & Central India Agri Belt',
    advisoryTip: 'Optimal atmospheric humidity for Rabi crop field preparation and neem fertigation. Good window for morning spraying.'
  };
}
