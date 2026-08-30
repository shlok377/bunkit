import React, { useState } from 'react';
import { Subject, TimeTableSlot } from '../../types';
import { getSubjectColorById } from '../../utils/colors';
import { computeEndTime, formatTo12Hour } from '../../utils/timetableEngine';
import { X, Clock, MapPin, Sparkles } from 'lucide-react';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSlot: (slot: Omit<TimeTableSlot, 'id'>) => void;
  subjects: Subject[];
  dayOfWeek: number;
  dayName: string;
  existingSlotsCount: number;
}

export const AddSlotModal: React.FC<AddSlotModalProps> = ({
  isOpen,
  onClose,
  onAddSlot,
  subjects,
  dayOfWeek,
  dayName,
  existingSlotsCount,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects.length > 0 ? subjects[0].id : ''
  );
  const [startTime, setStartTime] = useState<string>('09:00');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [room, setRoom] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const color = selectedSubject ? getSubjectColorById(selectedSubject.colorId) : null;
  const endTime = computeEndTime(startTime, durationHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      setError('Please select a subject');
      return;
    }

    onAddSlot({
      dayOfWeek,
      subjectId: selectedSubjectId,
      startTime,
      durationHours,
      room: room.trim() || selectedSubject?.roomDefault || undefined,
      order: existingSlotsCount + 1,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none animate-fade-in">
      <div className="brutal-card w-full max-w-md bg-[#121214] border-2 border-zinc-700 shadow-[8px_8px_0_#000000] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              Add Lecture to {dayName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-zinc-700 hover:border-white text-zinc-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-2.5 bg-rose-950/80 border-2 border-rose-500 text-rose-300 font-mono text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Subject Picker */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs uppercase font-bold text-zinc-300">
              Select Subject *
            </label>
            {subjects.length === 0 ? (
              <p className="text-xs text-amber-400 font-mono">
                No subjects found. Please create subjects in the Subjects tab first!
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {subjects.map((sub) => {
                  const isSelected = sub.id === selectedSubjectId;
                  const subColor = getSubjectColorById(sub.colorId);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSelectedSubjectId(sub.id);
                        if (!room && sub.roomDefault) {
                          setRoom(sub.roomDefault);
                        }
                      }}
                      className={`p-2 font-mono text-xs text-left border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-white bg-zinc-900 shadow-[2px_2px_0_#FFF]'
                          : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 border border-black"
                          style={{ backgroundColor: subColor.hex }}
                        />
                        <span className="font-bold text-white">{sub.name}</span>
                        {sub.code && <span className="text-[10px] text-zinc-500">[{sub.code}]</span>}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase" style={{ color: subColor.hex }}>
                        {subColor.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Time & Duration in 2 Columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs uppercase font-bold text-zinc-300 flex items-center gap-1">
                <Clock size={12} className="text-zinc-400" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="brutal-input w-full text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs uppercase font-bold text-zinc-300">
                Duration (1 to 6 hrs)
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="brutal-input w-full text-xs font-mono"
              >
                <option value={1}>1 hour (1:1 Ratio)</option>
                <option value={2}>2 hours (1:2 Lab/Double)</option>
                <option value={3}>3 hours (1:3 Workshop)</option>
                <option value={4}>4 hours (1:4 Extended)</option>
                <option value={5}>5 hours (1:5 Block)</option>
                <option value={6}>6 hours (1:6 Max)</option>
              </select>
            </div>
          </div>

          {/* Computed Time Window Preview Card */}
          <div className="p-3 bg-zinc-950 border-2 border-zinc-800 font-mono text-xs space-y-1">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] uppercase font-bold">Scheduled Window:</span>
              <span className="text-[10px] text-emerald-400 font-bold">Ratio 1:{durationHours}</span>
            </div>
            <div className="text-sm font-black text-white flex items-center justify-between">
              <span>{formatTo12Hour(startTime)} – {formatTo12Hour(endTime)}</span>
              {color && (
                <span
                  className="px-2 py-0.5 text-[10px] uppercase font-black border border-black"
                  style={{ backgroundColor: color.hex, color: color.text }}
                >
                  {durationHours} {durationHours === 1 ? 'hr' : 'hrs'}
                </span>
              )}
            </div>
          </div>

          {/* Optional Room Override */}
          <div className="space-y-1">
            <label className="font-mono text-xs uppercase font-bold text-zinc-300 flex items-center gap-1">
              <MapPin size={12} className="text-zinc-400" />
              Room / Classroom (Optional)
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 402 / Lab 3"
              className="brutal-input w-full text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={subjects.length === 0}
              className="brutal-btn-primary"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
