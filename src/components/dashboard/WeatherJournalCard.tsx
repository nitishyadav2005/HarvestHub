import React from 'react';
import { Sun, Droplets, Wind, CloudRain, Lightbulb, MapPin } from 'lucide-react';
import { getFarmWeather } from '../../services/weatherService';

export const WeatherJournalCard: React.FC = () => {
  const weather = getFarmWeather();

  return (
    <div className="clay-card-green p-6 relative overflow-hidden">
      {/* Background soft glow decoration */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-4 mb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-semibold uppercase tracking-wider truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" /> {weather.location}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5 truncate">
            Digital Farm Journal & Weather
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base sm:text-lg">
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-pulse shrink-0" />
            <span className="font-mono tabular-nums">{weather.tempCelsius}°C</span>
          </div>
          <span className="text-xs sm:text-sm font-medium text-emerald-100 truncate">{weather.condition}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5 min-w-0">
          <Droplets className="w-4 h-4 text-cyan-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-200 uppercase font-bold truncate">Humidity</div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono tabular-nums">{weather.humidityPercent}%</div>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5 min-w-0">
          <CloudRain className="w-4 h-4 text-blue-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-200 uppercase font-bold truncate">Rain Chance</div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono tabular-nums">{weather.rainfallChancePercent}%</div>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2.5 min-w-0">
          <Wind className="w-4 h-4 text-emerald-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-emerald-200 uppercase font-bold truncate">Wind Speed</div>
            <div className="text-xs sm:text-sm font-bold text-white font-mono tabular-nums">{weather.windSpeedKmh} km/h</div>
          </div>
        </div>
      </div>

      {/* Agricultural Advisory */}
      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-400/20 flex items-start gap-3 min-w-0">
        <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide truncate block">Daily Agronomist Advisory:</span>
          <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed font-normal break-words">
            {weather.advisoryTip}
          </p>
        </div>
      </div>
    </div>
  );
};
