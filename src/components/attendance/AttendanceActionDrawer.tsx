import React from 'react';
import { AttendanceStatusType, ATTENDANCE_STATUS_CONFIG } from '../../config/settings';
import { Check, X, Ban, RotateCcw } from 'lucide-react';
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
  }[] = [
    { id: 'attended', label: 'Attended', icon: Check },
    { id: 'absent', label: 'Absent', icon: X },
    { id: 'exempted', label: 'Not Counted', icon: Ban },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="pt-2.5 border-t-2 border-black/40 space-y-2 mt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between font-mono text-[10px] uppercase font-bold text-zinc-400">
        <span>Mark ({durationHours} {durationHours === 1 ? 'hr' : 'hrs'}):</span>
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

      {/* 3 Status Badges Grid */}
      <div className="grid grid-cols-3 gap-2">
        {statusList.map((item) => {
          const config = ATTENDANCE_STATUS_CONFIG[item.id];
          const isSelected = currentStatus === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectStatus(item.id)}
              className={`
                p-2 flex items-center justify-center gap-1.5 font-mono transition-all border-2
                ${
                  isSelected
                    ? 'scale-105 shadow-[2px_2px_0_#000] ring-2 ring-white/80 z-10'
                    : 'hover:scale-[1.02] active:scale-95 shadow-[1px_1px_0_#000]'
                }
              `}
              style={{
                borderColor: config.borderColor,
                backgroundColor: isSelected ? config.bgDarkColor : 'rgba(24, 24, 27, 0.9)',
                color: isSelected ? '#FFFFFF' : config.textColor,
              }}
            >
              <Icon size={14} className="stroke-[3]" />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
