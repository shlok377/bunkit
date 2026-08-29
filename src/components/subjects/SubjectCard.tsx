import React, { useState } from 'react';
import { Subject, TimeTableSlot } from '../../types';
import { getSubjectColorById } from '../../utils/colors';
import { SUBJECT_MOOD_TAGS } from '../../config/settings';
import { Edit3, Trash2, Clock, MapPin, AlertTriangle } from 'lucide-react';

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
  const mood = SUBJECT_MOOD_TAGS.find((m) => m.id === subject.moodTag) || SUBJECT_MOOD_TAGS[1];

  // Calculate total weekly hours in timetable for this subject
  const subjectSlots = timetable.filter((s) => s.subjectId === subject.id);
  const totalWeeklyHours = subjectSlots.reduce((acc, slot) => acc + slot.durationHours, 0);

  return (
    <div className="brutal-card bg-[#141416] border-2 border-zinc-800 hover:border-zinc-700 transition-all p-3 relative overflow-hidden flex flex-col justify-between group">
      {/* Top Accent Color Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: color.hex }}
      />

      <div className="pt-1.5 space-y-2">
        {/* Header with Code and Mood Badge */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className="font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]"
              style={{ backgroundColor: color.hex, color: color.text }}
            >
              {subject.code || 'SUB'}
            </span>
            {subject.roomDefault && (
              <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-0.5 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800">
                <MapPin size={10} />
                {subject.roomDefault}
              </span>
            )}
          </div>

          <span
            className="text-[11px] font-mono font-bold px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300"
            title={`Mood Tag: ${mood.label}`}
          >
            {mood.emoji} {mood.id.toUpperCase()}
          </span>
        </div>

        {/* Subject Name */}
        <h3 className="font-mono font-bold text-sm text-white tracking-tight leading-snug line-clamp-2">
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
            <strong className="text-zinc-200">{subjectSlots.length}</strong> classes
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 mt-1 border-t border-zinc-850">
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
              Removing &ldquo;{subject.name}&rdquo; will also remove its {subjectSlots.length} scheduled timetable slots.
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
              className="px-2 py-1 bg-rose-600 text-white border border-black font-mono text-[10px] uppercase font-bold hover:bg-rose-500 shadow-[1px_1px_0_#000]"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
