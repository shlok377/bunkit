import React, { useState } from 'react';
import { MaterializedSlot } from '../../utils/timetableEngine';
import { TimeTableSlot, Subject } from '../../types';
import { AttendanceStatusType, ATTENDANCE_STATUS_CONFIG } from '../../config/settings';
import { AttendanceActionDrawer } from '../attendance/AttendanceActionDrawer';
import { useApp } from '../../store/AppContext';
import { Clock, MapPin, ChevronUp, ChevronDown, Trash2, Plus, Minus, MoveVertical } from 'lucide-react';
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
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    // If clearing, we can mark as undefined or pass a custom handler
    // In our context, markAttendance updates state. We can mark status or reset.
    // Setting to exempted or deleting record
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      style={{
        minHeight: `${slot.minHeightPx}px`,
        borderColor: statusConfig ? statusConfig.borderColor : undefined,
        backgroundColor: statusConfig ? statusConfig.bgDarkColor : '#121215',
      }}
      className={`
        brutal-card relative p-3.5 flex flex-col justify-between transition-all overflow-hidden cursor-pointer
        ${
          isMakerMode
            ? 'border-2 border-dashed border-zinc-600 bg-zinc-950/95 shadow-[4px_4px_0_#18181B] cursor-default'
            : statusConfig
            ? 'border-2 shadow-[4px_4px_0_#000000]'
            : 'border-2 border-zinc-800 hover:border-zinc-700 shadow-[4px_4px_0_#000000]'
        }
      `}
    >
      {/* Left Subject Color Accent Stripe */}
      <div
        className="absolute top-0 bottom-0 left-0 w-2"
        style={{ backgroundColor: slot.color.hex }}
      />

      {/* Main Widget Header & Details */}
      <div className="pl-2 space-y-2">
        {/* Top Info Strip: Time Range & Duration Aspect Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
            <Clock size={12} className="text-zinc-500" />
            <strong className="text-white font-bold">{slot.timeRangeFormatted}</strong>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Active Status Badge if marked */}
            {statusConfig && (
              <span
                className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
                style={{
                  backgroundColor: statusConfig.borderColor,
                  color: '#000000',
                }}
              >
                {statusConfig.label}
              </span>
            )}

            {/* Aspect Ratio Badge */}
            <span
              className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
              style={{
                backgroundColor: slot.color.hex,
                color: slot.color.text,
              }}
              title={`Widget Aspect Ratio: ${slot.aspectRatioClass} (${duration} hr duration)`}
            >
              {duration} {duration === 1 ? 'HR' : 'HRS'}
            </span>
          </div>
        </div>

        {/* Subject Name & Code */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-zinc-400">
              [{slot.subject.code || 'SUB'}]
            </span>
            <h3 className="font-mono text-sm font-black text-white tracking-tight leading-snug">
              {slot.subject.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            {slot.room ? (
              <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400">
                <MapPin size={11} className="text-zinc-500" />
                <span>{slot.room}</span>
              </div>
            ) : <div />}

            {!isMakerMode && (
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-0.5 hover:text-white transition-colors">
                {isExpanded ? 'Hide Options ▲' : statusConfig ? 'Change Status ▼' : 'Tap to Mark Attendance ▼'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Quick Drawer (Single Click Expansion) */}
      <AnimatePresence>
        {!isMakerMode && isExpanded && (
          <div className="pl-2">
            <AttendanceActionDrawer
              currentStatus={currentRecord?.status}
              onSelectStatus={handleSelectStatus}
              onClearStatus={handleClearStatus}
              durationHours={duration}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Maker Mode Dynamic Resizing & Slot Control Dock */}
      {isMakerMode && (
        <div className="pl-2 pt-3 mt-2 border-t-2 border-zinc-800/80 space-y-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-2 bg-zinc-900/90 p-2 border border-zinc-700">
            {/* Quick Duration Vertical Resizer Pills */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1">
                <MoveVertical size={11} className="text-emerald-400" />
                Duration:
              </span>

              <button
                type="button"
                onClick={handleDecrement}
                disabled={duration <= 1}
                className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-600 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-700 active:scale-95 transition-all font-mono"
                title="Decrease duration by 1 hour"
              >
                <Minus size={12} strokeWidth={3} />
              </button>

              <span className="font-mono text-xs font-black text-emerald-400 w-8 text-center bg-black py-0.5 border border-zinc-700">
                {duration}h
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={duration >= 6}
                className="w-6 h-6 flex items-center justify-center bg-zinc-800 border border-zinc-600 text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-700 active:scale-95 transition-all font-mono"
                title="Increase duration by 1 hour (stretch widget vertically)"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>

            {/* Change Subject Trigger */}
            <button
              type="button"
              onClick={() => setIsEditingSubject(!isEditingSubject)}
              className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 transition-colors"
            >
              {isEditingSubject ? 'Done' : 'Change Sub'}
            </button>
          </div>

          {/* Quick Subject Switcher Drawer */}
          <AnimatePresence>
            {isEditingSubject && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 bg-zinc-950 p-2 border border-zinc-700"
              >
                <span className="font-mono text-[10px] uppercase text-zinc-400 font-bold block mb-1">
                  Assign Different Subject:
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {subjects.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        onUpdateSlot(slot.slotId, { subjectId: sub.id });
                        setIsEditingSubject(false);
                      }}
                      className={`p-1.5 font-mono text-[10px] text-left border transition-all truncate flex items-center gap-1 ${
                        sub.id === slot.subjectId
                          ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 font-bold'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-none border border-black flex-shrink-0"
                        style={{ backgroundColor: sub.colorId }}
                      />
                      <span className="truncate">{sub.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slot Positioning & Delete Actions */}
          <div className="flex items-center justify-between pt-1 font-mono text-xs">
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Order:</span>
              {onMoveSlot && (
                <>
                  <button
                    type="button"
                    onClick={() => onMoveSlot(slot.slotId, 'up')}
                    disabled={isFirst}
                    className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move up"
                  >
                    <ChevronUp size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveSlot(slot.slotId, 'down')}
                    disabled={isLast}
                    className="p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-20"
                    title="Move down"
                  >
                    <ChevronDown size={12} />
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[10px] uppercase font-bold py-0.5 px-1.5 bg-rose-950/50 border border-rose-900 hover:border-rose-600 transition-colors"
            >
              <Trash2 size={11} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-zinc-950/95 border-2 border-rose-600 p-3 flex flex-col justify-between z-30" onClick={(e) => e.stopPropagation()}>
          <div className="space-y-1">
            <h4 className="font-mono text-xs font-bold text-rose-400 uppercase">Remove Slot?</h4>
            <p className="font-mono text-[11px] text-zinc-400 leading-tight">
              Remove &ldquo;{slot.subject.name}&rdquo; ({slot.timeRangeFormatted}) from this day&apos;s schedule?
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowConfirmDelete(false)}
              className="px-2 py-1 bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono text-[10px] uppercase font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onDeleteSlot(slot.slotId);
                setShowConfirmDelete(false);
              }}
              className="px-2 py-1 bg-rose-600 text-white font-mono text-[10px] uppercase font-bold hover:bg-rose-500"
            >
              Yes, Remove
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
