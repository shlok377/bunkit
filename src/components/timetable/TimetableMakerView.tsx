import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { MonthProgressBar } from './MonthProgressBar';
import { WeekSlider } from './WeekSlider';
import { TimetableWidget } from './TimetableWidget';
import { AddSlotModal } from './AddSlotModal';
import { materializeDaySchedule } from '../../utils/timetableEngine';
import { formatToIsoDate, parseIsoDate } from '../../utils/dateUtils';
import { Plus, Edit3, CheckCircle, Clock, CalendarDays } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const TimetableMakerView: React.FC = () => {
  const { subjects, timetable, records, addSlot, updateSlot, deleteSlot } = useApp();

  const [selectedDateStr, setSelectedDateStr] = useState<string>(() =>
    formatToIsoDate(new Date())
  );
  const [isMakerMode, setIsMakerMode] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const selectedDate = useMemo(() => parseIsoDate(selectedDateStr), [selectedDateStr]);
  const dayOfWeek = selectedDate.getDay();

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[dayOfWeek];

  // Materialized slots for the selected date
  const daySlots = useMemo(() => {
    return materializeDaySchedule(selectedDateStr, timetable, records, subjects);
  }, [selectedDateStr, timetable, records, subjects]);

  const totalDayHours = useMemo(() => {
    return daySlots.reduce((sum, slot) => sum + slot.durationHours, 0);
  }, [daySlots]);

  // Handle duration update from widget resizing pills
  const handleUpdateDuration = (slotId: string, newDuration: number) => {
    updateSlot(slotId, { durationHours: newDuration });
  };

  // Handle slot reordering
  const handleMoveSlot = (slotId: string, direction: 'up' | 'down') => {
    const currentIndex = daySlots.findIndex((s) => s.slotId === slotId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= daySlots.length) return;

    const currentSlot = daySlots[currentIndex];
    const targetSlot = daySlots[targetIndex];

    // Swap their order numbers or start times
    const tempOrder = currentSlot.order;
    updateSlot(currentSlot.slotId, { order: targetSlot.order });
    updateSlot(targetSlot.slotId, { order: tempOrder });
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Month Progress Bar */}
      <MonthProgressBar currentDate={selectedDate} />

      {/* 2. Horizontal Week Slider */}
      <WeekSlider
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
        timetable={timetable}
      />

      {/* 3. Schedule Header & Maker Mode Toggle */}
      <div className="brutal-card p-3.5 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <CalendarDays size={16} className="text-emerald-400" />
              <h2 className="font-mono text-sm font-black uppercase text-white tracking-wider">
                {currentDayName}&apos;s Schedule
              </h2>
            </div>
            <div className="font-mono text-xs text-zinc-400 flex items-center gap-2">
              <span><strong>{daySlots.length}</strong> lectures</span>
              <span>•</span>
              <span className="text-emerald-400"><strong>{totalDayHours}</strong> total hrs</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit / Maker Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMakerMode(!isMakerMode)}
              className={`flex items-center gap-1 font-mono text-[11px] uppercase font-bold py-1.5 px-2.5 border-2 transition-all shadow-[2px_2px_0_#000] ${
                isMakerMode
                  ? 'border-amber-400 bg-amber-950/80 text-amber-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {isMakerMode ? (
                <>
                  <CheckCircle size={13} className="text-amber-400" />
                  <span>Done Editing</span>
                </>
              ) : (
                <>
                  <Edit3 size={13} />
                  <span>Maker Mode</span>
                </>
              )}
            </button>

            {/* Add Slot Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="brutal-btn-primary flex items-center gap-1 py-1.5 px-2.5 text-[11px]"
            >
              <Plus size={14} className="stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {isMakerMode && (
          <div className="p-2 bg-amber-950/40 border border-amber-500/40 text-[11px] font-mono text-amber-300 flex items-center justify-between">
            <span>⚡ Maker Mode Active: Use [+] / [-] on widgets to stretch duration &amp; ratio.</span>
          </div>
        )}
      </div>

      {/* 4. Vertical Stack of Dynamic Apple-Style Widgets */}
      <div className="space-y-3">
        <AnimatePresence>
          {daySlots.length > 0 ? (
            daySlots.map((slot, index) => (
              <TimetableWidget
                key={slot.slotId}
                slot={slot}
                isMakerMode={isMakerMode}
                onUpdateDuration={handleUpdateDuration}
                onUpdateSlot={updateSlot}
                onDeleteSlot={deleteSlot}
                onMoveSlot={handleMoveSlot}
                subjects={subjects}
                isFirst={index === 0}
                isLast={index === daySlots.length - 1}
              />
            ))
          ) : (
            <div className="brutal-card p-8 text-center bg-zinc-950/60 border-2 border-dashed border-zinc-800 space-y-3">
              <div className="w-10 h-10 mx-auto bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-500 font-mono">
                <Clock size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-mono text-sm font-bold text-white uppercase">
                  Free Day / No Lectures Scheduled
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  No classes are scheduled on {currentDayName} in your weekly timetable template.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="brutal-btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
              >
                <Plus size={14} className="stroke-[3]" />
                <span>Add First Lecture for {currentDayName}</span>
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Slot Modal */}
      <AddSlotModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSlot={addSlot}
        subjects={subjects}
        dayOfWeek={dayOfWeek}
        dayName={currentDayName}
        existingSlotsCount={daySlots.length}
      />
    </div>
  );
};
