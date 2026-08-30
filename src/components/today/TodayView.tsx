import React, { useMemo } from 'react';
import { useApp } from '../../store/AppContext';
import { materializeDaySchedule } from '../../utils/timetableEngine';
import { formatToIsoDate, formatDisplayDate } from '../../utils/dateUtils';
import { ATTENDANCE_STATUS_CONFIG, AttendanceStatusType } from '../../config/settings';
import { AttendanceActionDrawer } from '../attendance/AttendanceActionDrawer';
import { Clock, MapPin, Sparkles, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const TodayView: React.FC = () => {
  const { subjects, timetable, records, settings, markAttendance } = useApp();
  const todayStr = useMemo(() => formatToIsoDate(new Date()), []);
  const displayDate = useMemo(() => formatDisplayDate(todayStr), [todayStr]);

  const [expandedSlotId, setExpandedSlotId] = React.useState<string | null>(null);

  // Materialized slots for today
  const todaySlots = useMemo(() => {
    return materializeDaySchedule(todayStr, timetable, records, subjects);
  }, [todayStr, timetable, records, subjects]);

  // Today's stats
  const todayStats = useMemo(() => {
    const total = todaySlots.length;
    const markedCount = todaySlots.filter((s) => !!s.record).length;
    const attendedCount = todaySlots.filter(
      (s) => s.record && (s.record.status === 'attended' || s.record.status === 'proxy' || s.record.status === 'exam')
    ).length;
    const totalHours = todaySlots.reduce((acc, s) => acc + s.durationHours, 0);

    return {
      total,
      markedCount,
      attendedCount,
      totalHours,
      isFullyMarked: total > 0 && markedCount === total,
    };
  }, [todaySlots]);

  const handleSelectStatus = (slotId: string, subjectId: string, durationHours: number, status: AttendanceStatusType) => {
    markAttendance(todayStr, slotId, subjectId, status, durationHours);

    // Fire celebratory confetti if marking attended & settings allow
    if ((status === 'attended' || status === 'proxy') && settings.enableConfetti) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#059669', '#FFFFFF'],
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. High-Impact Brutalist Landing Header */}
      <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              <Sparkles size={13} />
              <span>{displayDate.weekday}</span>
            </div>
            <h1 className="font-mono text-2xl font-black text-white tracking-tight uppercase">
              {displayDate.dayNum} {displayDate.month}
            </h1>
          </div>

          <div className="text-right space-y-1">
            <span className="brutal-badge bg-zinc-900 text-zinc-300 border-zinc-700">
              {todayStats.total} {todayStats.total === 1 ? 'LECTURE' : 'LECTURES'} ({todayStats.totalHours}H)
            </span>
          </div>
        </div>

        {/* Progress Bar of Today's Marked Lectures */}
        {todayStats.total > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-zinc-850">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Today&apos;s Attendance Progress</span>
              <span className="font-bold text-emerald-400">
                {todayStats.markedCount} / {todayStats.total} Marked
              </span>
            </div>
            <div className="h-2 bg-zinc-900 border border-black overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(todayStats.markedCount / todayStats.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Staggered Animated List of Today's Lectures */}
      <div className="space-y-3">
        {todaySlots.length > 0 ? (
          todaySlots.map((slot, index) => {
            const isExpanded = expandedSlotId === slot.slotId;
            const currentRecord = slot.record;
            const statusConfig = currentRecord ? ATTENDANCE_STATUS_CONFIG[currentRecord.status] : null;

            return (
              <motion.div
                key={slot.slotId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.08 }}
                onClick={() => setExpandedSlotId(isExpanded ? null : slot.slotId)}
                style={{
                  minHeight: `${slot.minHeightPx}px`,
                  borderColor: statusConfig ? statusConfig.borderColor : undefined,
                  backgroundColor: statusConfig ? statusConfig.bgDarkColor : '#131316',
                }}
                className={`
                  brutal-card relative p-3.5 flex flex-col justify-between transition-all cursor-pointer overflow-hidden
                  ${
                    statusConfig
                      ? 'border-2 shadow-[4px_4px_0_#000000]'
                      : 'border-2 border-zinc-800 hover:border-zinc-700 shadow-[4px_4px_0_#000000]'
                  }
                `}
              >
                {/* Subject Color Accent Strip */}
                <div
                  className="absolute top-0 bottom-0 left-0 w-2.5"
                  style={{ backgroundColor: slot.color.hex }}
                />

                <div className="pl-2 space-y-2">
                  {/* Top Line: Time & Status Pill */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300">
                      <Clock size={12} className="text-zinc-500" />
                      <strong className="text-white">{slot.timeRangeFormatted}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {statusConfig ? (
                        <span
                          className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
                          style={{
                            backgroundColor: statusConfig.borderColor,
                            color: '#000000',
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-zinc-900 border border-zinc-700 text-amber-400">
                          Unmarked
                        </span>
                      )}

                      <span
                        className="font-mono text-[9px] font-black uppercase px-2 py-0.5 border border-black"
                        style={{
                          backgroundColor: slot.color.hex,
                          color: slot.color.text,
                        }}
                      >
                        {slot.durationHours} {slot.durationHours === 1 ? 'hr' : 'hrs'}
                      </span>
                    </div>
                  </div>

                  {/* Subject Title & Details */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-zinc-400">
                        [{slot.subject.code || 'SUB'}]
                      </span>
                      <h3 className="font-mono text-base font-black text-white tracking-tight leading-snug">
                        {slot.subject.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-0.5 font-mono text-xs">
                      {slot.room ? (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <MapPin size={11} className="text-zinc-500" />
                          <span>{slot.room}</span>
                        </div>
                      ) : <div />}

                      <span className="text-[10px] text-zinc-400 font-bold hover:text-white">
                        {isExpanded ? 'Hide ▲' : statusConfig ? 'Tap to change status ▼' : 'Tap to mark ▼'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Reveal Attendance Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <div className="pl-2">
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
          /* Empty Weekend / Free Day */
          <div className="brutal-card p-8 text-center bg-zinc-950/80 border-2 border-zinc-800 space-y-3">
            <div className="w-12 h-12 mx-auto bg-emerald-950/50 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Coffee size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-base font-black text-white uppercase">
                No Lectures Scheduled Today
              </h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto font-mono">
                Enjoy your free day or head over to the <strong className="text-zinc-200">Timetable</strong> tab to inspect or customize your schedule!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
