import React, { useState } from 'react';
import { Subject, TimeTableSlot } from '../../types';
import { getSubjectColorById } from '../../utils/colors';
import { Edit3, Trash2 } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  timetable: TimeTableSlot[];
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  timetable,
  onEdit,
  onDelete,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const color = getSubjectColorById(subject.colorId);

  const subjectSlots = timetable.filter((s) => s.subjectId === subject.id);
  const totalWeeklyHours = subjectSlots.reduce((acc, slot) => acc + slot.durationHours, 0);

  return (
    <div className="brutal-card bg-[#0D0D10] border border-zinc-800 p-3 relative overflow-hidden flex items-center justify-between">
      {/* Left Color Stripe */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1.5"
        style={{ backgroundColor: color.hex }}
      />

      <div className="pl-2 space-y-0.5 font-mono">
        <h3 className="font-bold text-sm text-white tracking-tight leading-snug">
          {subject.name}
        </h3>
        <span className="text-[10px] text-zinc-500 block">
          {totalWeeklyHours}h / week • {subjectSlots.length} {subjectSlots.length === 1 ? 'class' : 'classes'}
        </span>
      </div>

      <div className="flex items-center gap-1 font-mono">
        <button
          onClick={() => onEdit(subject)}
          className="p-1.5 text-zinc-400 hover:text-white transition-colors"
          title="Edit"
        >
          <Edit3 size={13} />
        </button>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {showConfirmDelete && (
        <div className="absolute inset-0 bg-zinc-950/95 border border-rose-600 p-2.5 flex items-center justify-between z-20 font-mono text-xs">
          <span className="text-[11px] text-rose-300">Delete &ldquo;{subject.name}&rdquo;?</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(subject.id);
                setShowConfirmDelete(false);
              }}
              className="px-2 py-0.5 text-[10px] bg-rose-600 text-white font-bold"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
