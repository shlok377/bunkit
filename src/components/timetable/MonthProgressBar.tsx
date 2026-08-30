import React from 'react';
import { getMonthProgress } from '../../utils/dateUtils';
import { Calendar, TrendingDown } from 'lucide-react';

interface MonthProgressBarProps {
  currentDate?: Date;
}

export const MonthProgressBar: React.FC<MonthProgressBarProps> = ({ currentDate = new Date() }) => {
  const info = getMonthProgress(currentDate);

  return (
    <div className="brutal-card p-3 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider">
          <Calendar size={14} className="text-emerald-400" />
          <span>{info.monthName} {info.year}</span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-[11px]">
          <TrendingDown size={13} />
          <span>{info.percentRemaining}% MONTH LEFT</span>
        </div>
      </div>

      {/* Brutalist Progress Bar */}
      <div className="relative h-3 bg-zinc-900 border-2 border-black overflow-hidden shadow-[1px_1px_0_#000]">
        {/* Fill representing month left or elapsed based on visual design */}
        <div
          className="h-full bg-emerald-500 transition-all duration-500 border-r border-black"
          style={{ width: `${info.percentRemaining}%` }}
        />
      </div>

      {/* Progress Subtext */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>Day {info.currentDay} of {info.totalDays}</span>
        <span className="font-bold text-zinc-300">{info.daysRemaining} days remaining</span>
      </div>
    </div>
  );
};
