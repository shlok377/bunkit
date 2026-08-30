import React, { useState } from 'react';
import { MaterializedSlot } from '../../utils/timetableEngine';
import { TimeTableSlot, Subject } from '../../types';
import { AttendanceStatusType, ATTENDANCE_STATUS_CONFIG } from '../../config/settings';
import { AttendanceActionDrawer } from '../attendance/AttendanceActionDrawer';
import { useApp } from '../../store/AppContext';
import { ChevronUp, ChevronDown, Trash2, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimetableWidgetProps {
  slot: MaterializedSlot;
  isMakerMode: boolean;
  onUpdateDuration: (slotId: string, newDuration: number) => void;
  onUpdateSlot: (slotId: string, updates: Partial<TimeTableSlot>) => void;
  onDeleteSlot: (slotId: string) => void;
  onMoveSlot?: (slotId: string, direction: 'up' | 'down') => void;
  subjects: Subject[];
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimetableWidget: React.FC<TimetableWidgetProps> = ({
  slot,
  isMakerMode,
  onUpdateDuration,
  onUpdateSlot,
  onDeleteSlot,
  onMoveSlot,
  subjects,
  isFirst,
  isLast,
}) => {
  const { markAttendance } = useApp();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isEditingSubject, setIsEditingSubject] = useState(false);

  const duration = slot.durationHours;
  const currentRecord = slot.record;
  const statusConfig = currentRecord ? ATTENDANCE_STATUS_CONFIG[currentRecord.status] : null;

  const handleCardClick = () => {
    if (!isMakerMode) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleSelectStatus = (status: AttendanceStatusType) => {
    markAttendance(
      slot.dateStr,
      slot.slotId,
      slot.subjectId,
      status,
      slot.durationHours
    );
  };

  const handleClearStatus = () => {
    handleSelectStatus('exempted');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duration < 6) {
      onUpdateDuration(slot.slotId, duration + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duration > 1) {
      onUpdateDuration(slot.slotId, duration - 1);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      style={{
        minHeight: `${slot.minHeightPx}px`,
        borderColor: statusConfig ? statusConfig.borderColor : '#27272A',
        backgroundColor: statusConfig ? statusConfig.bgDarkColor : '#0D0D10',
      }}
      className={`
        brutal-card relative p-3 flex flex-col justify-between border transition-all overflow-hidden
        ${isMakerMode ? 'border-dashed border-zinc-600 cursor-default' : 'cursor-pointer'}
      `}
    >
      {/* Left Color Accent */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1.5"
        style={{ backgroundColor: slot.color.hex }}
      />

      <div className="pl-1.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-zinc-400 font-medium">
            {slot.timeRangeFormatted}
          </span>

          <div className="flex items-center gap-1.5">
            {statusConfig ? (
              <span
                className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 border border-black"
                style={{
                  backgroundColor: statusConfig.borderColor,
                  color: '#000000',
                }}
              >
                {statusConfig.label}
              </span>
            ) : (
              <span className="text-[9px] font-mono text-zinc-400">
                {duration}h
              </span>
            )}
          </div>
        </div>

        <h3 className="font-mono font-bold text-sm text-white tracking-tight leading-snug">
          {slot.subject.name}
        </h3>
      </div>

      {/* Attendance Drawer */}
      <AnimatePresence>
        {!isMakerMode && isExpanded && (
          <div className="pl-1.5">
            <AttendanceActionDrawer
              currentStatus={currentRecord?.status}
              onSelectStatus={handleSelectStatus}
              onClearStatus={handleClearStatus}
              durationHours={duration}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Minimal Maker Controls */}
      {isMakerMode && (
        <div className="pl-1.5 pt-2 mt-2 border-t border-zinc-800 space-y-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-1 font-mono text-xs">
            {/* Duration Steppers */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={duration <= 1}
                className="w-5 h-5 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-zinc-300 disabled:opacity-20 hover:text-white"
              >
                <Minus size={10} strokeWidth={3} />
              </button>

              <span className="font-mono text-xs font-bold text-white px-1.5">
                {duration}h
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={duration >= 6}
                className="w-5 h-5 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-zinc-300 disabled:opacity-20 hover:text-white"
              >
                <Plus size={10} strokeWidth={3} />
              </button>
            </div>

            {/* Reorder & Delete */}
            <div className="flex items-center gap-1.5">
              {onMoveSlot && (
                <>
                  <button
                    type="button"
                    onClick={() => onMoveSlot(slot.slotId, 'up')}
                    disabled={isFirst}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSlot(slot.slotId, 'down')}
                    disabled={isLast}
                    className="p-1 text-zinc-400 hover:text-white disabled:opacity-20"
                  >
                    <ChevronDown size={12} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setIsEditingSubject(!isEditingSubject)}
                className="text-[10px] text-zinc-400 hover:text-white underline px-1"
              >
                Sub
              </button>

              <button
                type="button"
                onClick={() => onDeleteSlot(slot.slotId)}
                className="text-rose-400 hover:text-rose-300 p-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {/* Inline Subject Switcher */}
          <AnimatePresence>
            {isEditingSubject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-1 grid grid-cols-2 gap-1 max-h-24 overflow-y-auto"
              >
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      onUpdateSlot(slot.slotId, { subjectId: sub.id });
                      setIsEditingSubject(false);
                    }}
                    className={`p-1 text-[10px] font-mono text-left border truncate ${
                      sub.id === slot.subjectId
                        ? 'border-white bg-zinc-900 text-white font-bold'
                        : 'border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
