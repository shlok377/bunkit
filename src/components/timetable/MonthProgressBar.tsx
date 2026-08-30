import React from 'react';
import { getMonthProgress } from '../../utils/dateUtils';

interface MonthProgressBarProps {
  currentDate?: Date;
}

export const MonthProgressBar: React.FC<MonthProgressBarProps> = ({ currentDate = new Date() }) => {
  const info = getMonthProgress(currentDate);

  return (
    <div className="space-y-1 font-mono">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
        <span>{info.monthName} ({info.daysRemaining} days left)</span>
        <span className="text-zinc-200">{info.percentRemaining}% left</span>
      </div>

      <div className="h-1 bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${info.percentRemaining}%` }}
        />
      </div>
    </div>
  );
};
