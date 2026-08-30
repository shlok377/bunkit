import React from 'react';
import { getWeekDays, addDays, formatToIsoDate, parseIsoDate } from '../../utils/dateUtils';
import { TimeTableSlot } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekSliderProps {
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  timetable: TimeTableSlot[];
}

export const WeekSlider: React.FC<WeekSliderProps> = ({
  selectedDateStr,
  onSelectDate,
  timetable,
}) => {
  const selectedDate = parseIsoDate(selectedDateStr);
  const weekDays = getWeekDays(selectedDate);
  const todayStr = formatToIsoDate(new Date());

  return (
    <div className="space-y-2">
      {/* Navigation Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectDate(addDays(selectedDateStr, -7))}
            className="text-zinc-500 hover:text-white transition-colors"
            title="Previous Week"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[10px] uppercase font-bold text-zinc-300">
            {weekDays[0].dayNumber} {weekDays[0].dayName.slice(0, 3)} – {weekDays[6].dayNumber} {weekDays[6].dayName.slice(0, 3)}
          </span>
          <button
            onClick={() => onSelectDate(addDays(selectedDateStr, 7))}
            className="text-zinc-500 hover:text-white transition-colors"
            title="Next Week"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {selectedDateStr !== todayStr && (
          <button
            onClick={() => onSelectDate(todayStr)}
            className="text-[10px] font-mono uppercase font-bold text-white hover:underline"
          >
            Today
          </button>
        )}
      </div>

      {/* 7 Days Row */}
      <div className="grid grid-cols-7 gap-1 bg-zinc-950 p-1 border border-zinc-800 font-mono">
        {weekDays.map((day) => {
          const isSelected = day.dateStr === selectedDateStr;
          const hasLectures = timetable.some((slot) => slot.dayOfWeek === day.dayOfWeek);

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => onSelectDate(day.dateStr)}
              className={`py-1.5 flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-white text-black font-black'
                  : day.isToday
                  ? 'bg-zinc-900 text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              <span className="text-[8px] uppercase tracking-tighter">
                {day.shortDay}
              </span>
              <span className="text-xs mt-0.5">
                {day.dayNumber}
              </span>

              <div className="h-1 flex items-center justify-center mt-0.5">
                {hasLectures && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-black' : 'bg-zinc-600'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
