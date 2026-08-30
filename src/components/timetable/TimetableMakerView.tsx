import React, { useState, useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { MonthProgressBar } from './MonthProgressBar';
import { WeekSlider } from './WeekSlider';
import { TimetableWidget } from './TimetableWidget';
import { AddSlotModal } from './AddSlotModal';
import { materializeDaySchedule } from '../../utils/timetableEngine';
import { formatToIsoDate, parseIsoDate } from '../../utils/dateUtils';
import { Plus } from 'lucide-react';
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

  const daySlots = useMemo(() => {
    return materializeDaySchedule(selectedDateStr, timetable, records, subjects);
  }, [selectedDateStr, timetable, records, subjects]);

  const totalDayHours = useMemo(() => {
    return daySlots.reduce((sum, slot) => sum + slot.durationHours, 0);
  }, [daySlots]);

  const handleUpdateDuration = (slotId: string, newDuration: number) => {
    updateSlot(slotId, { durationHours: newDuration });
  };

  const handleMoveSlot = (slotId: string, direction: 'up' | 'down') => {
    const currentIndex = daySlots.findIndex((s) => s.slotId === slotId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= daySlots.length) return;

    const currentSlot = daySlots[currentIndex];
    const targetSlot = daySlots[targetIndex];

    const tempOrder = currentSlot.order;
    updateSlot(currentSlot.slotId, { order: targetSlot.order });
    updateSlot(targetSlot.slotId, { order: tempOrder });
  };

  return (
    <div className="space-y-4">
      {/* 1. Month Progress */}
      <MonthProgressBar currentDate={selectedDate} />

      {/* 2. Week Slider */}
      <WeekSlider
        selectedDateStr={selectedDateStr}
        onSelectDate={setSelectedDateStr}
        timetable={timetable}
      />

      {/* 3. Minimal Action Header */}
      <div className="flex items-center justify-between font-mono pt-1">
        <div className="space-y-0.5">
          <h2 className="text-sm font-black uppercase text-white tracking-wider">
            {currentDayName}
          </h2>
          <span className="text-[10px] text-zinc-400 block">
            {daySlots.length} classes • {totalDayHours}h
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setIsMakerMode(!isMakerMode)}
            className={`px-2.5 py-1 font-bold uppercase text-[10px] border transition-all ${
              isMakerMode
                ? 'bg-amber-400 text-black border-amber-400'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white'
            }`}
          >
            {isMakerMode ? 'Done' : 'Edit'}
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-2.5 py-1 font-bold uppercase text-[10px] bg-white text-black border border-white hover:bg-zinc-200 flex items-center gap-1"
          >
            <Plus size={12} strokeWidth={3} />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 4. Widgets Stack */}
      <div className="space-y-2.5">
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
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              No classes on {currentDayName}.
            </div>
          )}
        </AnimatePresence>
      </div>

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
