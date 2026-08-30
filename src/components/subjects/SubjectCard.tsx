import React, { useState } from 'react';
import { Subject, TimeTableSlot } from '../../types';
import { getSubjectColorById } from '../../utils/colors';
import { Edit3, Trash2, Clock, AlertTriangle } from 'lucide-react';

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
    <div className="brutal-card bg-[#141416] border-2 border-zinc-800 hover:border-zinc-700 transition-all p-3 relative overflow-hidden flex flex-col justify-between">
      {/* Top Accent Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: color.hex }}
      />

      <div className="pt-1.5 space-y-2">
        {/* Subject Name */}
        <h3 className="font-mono font-bold text-sm text-white tracking-tight leading-snug">
          {subject.name}
        </h3>

        {/* Timetable Slot Info */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 border-t border-zinc-900 pt-2">
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-zinc-500" />
            <strong className="text-zinc-200">{totalWeeklyHours}h</strong>/week
          </span>
          <span className="text-zinc-600">|</span>
          <span>
            <strong className="text-zinc-200">{subjectSlots.length}</strong> {subjectSlots.length === 1 ? 'class' : 'classes'}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 mt-1 border-t border-zinc-850">
        <button
          onClick={() => onEdit(subject)}
          className="p-1.5 font-mono text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors flex items-center gap-1"
          title="Edit Subject"
        >
          <Edit3 size={13} />
          <span className="text-[10px] uppercase font-bold">Edit</span>
        </button>

        <button
          onClick={() => setShowConfirmDelete(true)}
          className="p-1.5 font-mono text-xs text-rose-400 hover:text-rose-300 bg-zinc-900 border border-zinc-800 hover:border-rose-700 transition-colors flex items-center gap-1"
          title="Delete Subject"
        >
          <Trash2 size={13} />
          <span className="text-[10px] uppercase font-bold">Delete</span>
        </button>
      </div>

      {/* Inline Delete Confirmation Overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-zinc-950/95 border-2 border-rose-600 p-3 flex flex-col justify-between z-20 animate-fade-in">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-400 font-mono text-xs font-bold uppercase">
              <AlertTriangle size={14} />
              Confirm Delete?
            </div>
            <p className="text-[11px] text-zinc-400 font-mono leading-tight">
              Removing &ldquo;{subject.name}&rdquo; will remove its {subjectSlots.length} scheduled slots.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-2 py-1 bg-zinc-900 text-zinc-300 border border-zinc-700 font-mono text-[10px] uppercase font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(subject.id);
                setShowConfirmDelete(false);
              }}
              className="px-2 py-1 bg-rose-600 text-white border border-black font-mono text-[10px] uppercase font-bold hover:bg-rose-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
