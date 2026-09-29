import React from 'react';
import { Sun, Droplets, Wind, CloudRain, Lightbulb, MapPin } from 'lucide-react';
import { getFarmWeather } from '../../services/weatherService';

export const WeatherJournalCard: React.FC = () => {
  const weather = getFarmWeather();

  return (
    <div className="clay-card-green p-6 relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/30 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" /> {weather.location}
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white mt-0.5">
            Digital Farm Journal & Weather
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg">
            <Sun className="w-6 h-6 text-amber-300 animate-pulse" />
            {weather.tempCelsius}°C
          </div>
          <span className="text-sm font-medium text-emerald-100">{weather.condition}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5">
          <Droplets className="w-4 h-4 text-cyan-300" />
          <div>
            <div className="text-[10px] text-emerald-200 uppercase font-bold">Humidity</div>
            <div className="text-sm font-bold text-white">{weather.humidityPercent}%</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5">
          <CloudRain className="w-4 h-4 text-blue-300" />
          <div>
            <div className="text-[10px] text-emerald-200 uppercase font-bold">Rain Chance</div>
            <div className="text-sm font-bold text-white">{weather.rainfallChancePercent}%</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5">
          <Wind className="w-4 h-4 text-emerald-300" />
          <div>
            <div className="text-[10px] text-emerald-200 uppercase font-bold">Wind Speed</div>
            <div className="text-sm font-bold text-white">{weather.windSpeedKmh} km/h</div>
          </div>
        </div>
      </div>

      {/* Agricultural Advisory */}
      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/20 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">Daily Agronomist Advisory:</span>
          <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed font-normal">
            {weather.advisoryTip}
          </p>
        </div>
      </div>
    </div>
  );
};
