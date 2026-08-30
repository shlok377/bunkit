import React from 'react';
import { getWeekDays, addDays, formatToIsoDate, parseIsoDate } from '../../utils/dateUtils';
import { TimeTableSlot } from '../../types';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

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

  const handlePrevDay = () => {
    onSelectDate(addDays(selectedDateStr, -1));
  };

  const handleNextDay = () => {
    onSelectDate(addDays(selectedDateStr, 1));
  };

  const handlePrevWeek = () => {
    onSelectDate(addDays(selectedDateStr, -7));
  };

  const handleNextWeek = () => {
    onSelectDate(addDays(selectedDateStr, 7));
  };

  const handleToday = () => {
    onSelectDate(todayStr);
  };

  return (
    <div className="space-y-2">
      {/* Week Navigation Header */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevWeek}
            className="p-1 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Previous Week"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] font-bold text-zinc-300 uppercase px-1">
            Week of {weekDays[0].dayNumber} {weekDays[0].dayName.slice(0, 3)} – {weekDays[6].dayNumber} {weekDays[6].dayName.slice(0, 3)}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-1 border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title="Next Week"
          >
            <ChevronRight size={14} />
          </button>
        </div>

        {selectedDateStr !== todayStr && (
          <button
            onClick={handleToday}
            className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-950/90 text-emerald-400 border border-emerald-500 flex items-center gap-1 hover:bg-emerald-900"
          >
            <RotateCcw size={10} />
            <span>Today</span>
          </button>
        )}
      </div>

      {/* Horizontal Days Selector */}
      <div className="grid grid-cols-7 gap-1 bg-zinc-950 p-1.5 border-2 border-zinc-800">
        {weekDays.map((day) => {
          const isSelected = day.dateStr === selectedDateStr;
          // Check if lectures are scheduled on this day of week
          const hasLectures = timetable.some((slot) => slot.dayOfWeek === day.dayOfWeek);

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => onSelectDate(day.dateStr)}
              className={`flex flex-col items-center justify-center py-2 px-1 border-2 transition-all font-mono ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[2px_2px_0_#000] -translate-y-0.5 z-10'
                  : day.isToday
                  ? 'border-zinc-600 bg-zinc-900/90 text-white'
                  : 'border-transparent bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
              }`}
            >
              <span className="text-[9px] font-extrabold uppercase tracking-tight">
                {day.shortDay}
              </span>
              <span className={`text-xs font-black my-0.5 ${isSelected ? 'text-emerald-400' : 'text-zinc-200'}`}>
                {day.dayNumber}
              </span>

              {/* Lecture slot indicator pill / dot */}
              <div className="h-1 flex items-center justify-center">
                {hasLectures && (
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-emerald-400' : 'bg-zinc-500'
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Day Stepper Controls */}
      <div className="flex items-center justify-between font-mono text-[11px] pt-1">
        <button
          onClick={handlePrevDay}
          className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
        >
          ← Prev Day
        </button>

        <span className="text-zinc-500 text-[10px]">
          Viewing: <strong className="text-zinc-300">{selectedDateStr}</strong>
        </span>

        <button
          onClick={handleNextDay}
          className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold"
        >
          Next Day →
        </button>
      </div>
    </div>
  );
};
