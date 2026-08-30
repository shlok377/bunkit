import React from 'react';
import { AttendanceStatusType, ATTENDANCE_STATUS_CONFIG } from '../../config/settings';
import { Check, X, ShieldAlert, Award, Ban, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendanceActionDrawerProps {
  currentStatus?: AttendanceStatusType;
  onSelectStatus: (status: AttendanceStatusType) => void;
  onClearStatus: () => void;
  durationHours: number;
}

export const AttendanceActionDrawer: React.FC<AttendanceActionDrawerProps> = ({
  currentStatus,
  onSelectStatus,
  onClearStatus,
  durationHours,
}) => {
  const statusList: {
    id: AttendanceStatusType;
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    { id: 'attended', label: 'Attended', icon: Check, desc: `+${durationHours}h credit` },
    { id: 'absent', label: 'Absent', icon: X, desc: 'Bunked' },
    { id: 'proxy', label: 'Proxy', icon: ShieldAlert, desc: 'Friend marked' },
    { id: 'exam', label: 'Exam', icon: Award, desc: 'Midterm/Test' },
    { id: 'exempted', label: 'Not Counted', icon: Ban, desc: 'Excluded from total' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="pt-3 border-t-2 border-black/30 space-y-2 mt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-zinc-400">
        <span>Mark Attendance ({durationHours} {durationHours === 1 ? 'hr' : 'hrs'}):</span>
        {currentStatus && (
          <button
            type="button"
            onClick={onClearStatus}
            className="text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-900 px-1.5 py-0.5 border border-zinc-700"
          >
            <RotateCcw size={10} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 5 Status Badges / Buttons Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {statusList.map((item) => {
          const config = ATTENDANCE_STATUS_CONFIG[item.id];
          const isSelected = currentStatus === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectStatus(item.id)}
              title={`${config.label} - ${config.description}`}
              className={`
                p-1.5 flex flex-col items-center justify-center text-center font-mono transition-all border-2
                ${
                  isSelected
                    ? 'scale-105 shadow-[2px_2px_0_#000] ring-2 ring-white/80 z-10'
                    : 'hover:scale-[1.02] active:scale-95 shadow-[1px_1px_0_#000]'
                }
              `}
              style={{
                borderColor: config.borderColor,
                backgroundColor: isSelected ? config.bgDarkColor : 'rgba(24, 24, 27, 0.85)',
                color: isSelected ? '#FFFFFF' : config.textColor,
              }}
            >
              <Icon size={14} className="stroke-[3] mb-0.5" />
              <span className="text-[9px] font-black uppercase tracking-tight leading-none">
                {item.label}
              </span>
              <span className="text-[7.5px] opacity-70 mt-0.5 leading-none hidden sm:inline-block">
                {item.desc}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
