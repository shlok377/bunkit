import React, { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { materializeDaySchedule } from '../../utils/timetableEngine';
import { formatToIsoDate, formatDisplayDate } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_CONFIG, AttendanceStatusType } from '../../config/settings';
import { AttendanceActionDrawer } from '../attendance/AttendanceActionDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const TodayView: React.FC = () => {
  const { subjects, timetable, records, settings, markAttendance } = useApp();
  const todayStr = useMemo(() => formatToIsoDate(new Date()), []);
  const displayDate = useMemo(() => formatDisplayDate(todayStr), [todayStr]);

  const [expandedSlotId, setExpandedSlotId] = React.useState<string | null>(null);

  const todaySlots = useMemo(() => {
    return materializeDaySchedule(todayStr, timetable, records, subjects);
  }, [todayStr, timetable, records, subjects]);

  const handleSelectStatus = (slotId: string, subjectId: string, durationHours: number, status: AttendanceStatusType) => {
    markAttendance(todayStr, slotId, subjectId, status, durationHours);

    if (status === 'attended' && settings.enableConfetti) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#FFFFFF'],
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Ultra-Minimal Date Header */}
      <div className="space-y-0.5 pt-1">
        <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
          {displayDate.weekday}
        </span>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-mono font-black text-white tracking-tight uppercase">
            {displayDate.dayNum} {displayDate.month}
          </h1>
          <span className="text-[10px] font-mono text-zinc-400">
            {todaySlots.length} {todaySlots.length === 1 ? 'lecture' : 'lectures'}
          </span>
        </div>
      </div>

      {/* Minimal Staggered List of Lectures */}
      <div className="space-y-2.5">
        {todaySlots.length > 0 ? (
          todaySlots.map((slot, index) => {
            const isExpanded = expandedSlotId === slot.slotId;
            const currentRecord = slot.record;
            const statusConfig = currentRecord ? ATTENDANCE_STATUS_CONFIG[currentRecord.status] : null;

            return (
              <motion.div
                key={slot.slotId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.04 }}
                onClick={() => setExpandedSlotId(isExpanded ? null : slot.slotId)}
                style={{
                  minHeight: `${slot.minHeightPx}px`,
                  borderColor: statusConfig ? statusConfig.borderColor : '#27272A',
                  backgroundColor: statusConfig ? statusConfig.bgDarkColor : '#0D0D10',
                }}
                className="brutal-card relative p-3 flex flex-col justify-between cursor-pointer border overflow-hidden"
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
                          {slot.durationHours}h
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-mono font-bold text-sm text-white tracking-tight leading-snug">
                    {slot.subject.name}
                  </h3>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <div className="pl-1.5">
                      <AttendanceActionDrawer
                        currentStatus={currentRecord?.status}
                        onSelectStatus={(status) => {
                          handleSelectStatus(slot.slotId, slot.subjectId, slot.durationHours, status);
                        }}
                        onClearStatus={() => {
                          handleSelectStatus(slot.slotId, slot.subjectId, slot.durationHours, 'exempted');
                        }}
                        durationHours={slot.durationHours}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        ) : (
          <div className="py-12 text-center text-zinc-400 font-mono text-xs">
            No lectures scheduled today.
          </div>
        )}
      </div>
    </div>
  );
};
