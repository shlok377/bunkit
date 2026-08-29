import React, { useState, useEffect } from 'react';
import { Subject, MoodTagType } from '../../types';
import { SubjectColor, SUBJECT_MOOD_TAGS } from '../../config/settings';
import { ColorPickerGrid } from './ColorPickerGrid';
import { getAutoAssignedColor, getSubjectColorById } from '../../utils/colors';
import { X, Sparkles } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    code?: string;
    colorId: string;
    moodTag?: MoodTagType;
    roomDefault?: string;
    targetPercentage?: number;
  }) => void;
  existingSubjects: Subject[];
  initialSubject?: Subject | null;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSubjects,
  initialSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [roomDefault, setRoomDefault] = useState('');
  const [moodTag, setMoodTag] = useState<MoodTagType>('ok_ok');
  const [selectedColor, setSelectedColor] = useState<SubjectColor>(() =>
    getAutoAssignedColor(existingSubjects)
  );
  const [targetPercentage, setTargetPercentage] = useState<number | ''>('');
  const [error, setError] = useState('');

  // Hydrate when editing or opening modal
  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name);
      setCode(initialSubject.code || '');
      setRoomDefault(initialSubject.roomDefault || '');
      setMoodTag(initialSubject.moodTag || 'ok_ok');
      setSelectedColor(getSubjectColorById(initialSubject.colorId));
      setTargetPercentage(initialSubject.targetPercentage || '');
    } else {
      setName('');
      setCode('');
      setRoomDefault('');
      setMoodTag('ok_ok');
      setSelectedColor(getAutoAssignedColor(existingSubjects));
      setTargetPercentage('');
    }
    setError('');
  }, [initialSubject, isOpen, existingSubjects]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }

    onSave({
      name: name.trim(),
      code: code.trim() || undefined,
      colorId: selectedColor.id,
      moodTag,
      roomDefault: roomDefault.trim() || undefined,
      targetPercentage: targetPercentage ? Number(targetPercentage) : undefined,
    });
    onClose();
  };

  const isEditing = !!initialSubject;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none animate-fade-in">
      <div className="brutal-card w-full max-w-md bg-[#121214] border-2 border-zinc-700 shadow-[8px_8px_0_#000000] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 border border-black shadow-[1px_1px_0_#000]"
              style={{ backgroundColor: selectedColor.hex }}
            />
            <h2 className="font-mono text-sm font-black uppercase tracking-wider text-white">
              {isEditing ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button
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

          {/* Subject Name */}
          <div className="space-y-1">
            <label className="font-mono text-xs uppercase font-bold text-zinc-300 flex items-center justify-between">
              <span>Subject Name *</span>
              <span className="text-[10px] text-zinc-500">e.g. Machine Learning</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Data Structures & Algorithms"
              className="brutal-input w-full"
            />
          </div>

          {/* Code & Room in 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono text-xs uppercase font-bold text-zinc-300">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CS301"
                className="brutal-input w-full uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs uppercase font-bold text-zinc-300">
                Default Room
              </label>
              <input
                type="text"
                value={roomDefault}
                onChange={(e) => setRoomDefault(e.target.value)}
                placeholder="Lab 2 / Room 304"
                className="brutal-input w-full"
              />
            </div>
          </div>

          {/* 15-Distinct Color Palette Grid */}
          <ColorPickerGrid
            selectedColorId={selectedColor.id}
            onSelectColor={setSelectedColor}
            existingSubjects={existingSubjects}
            currentSubjectId={initialSubject?.id}
          />

          {/* Auto-Assignment Notification */}
          <div className="p-2 bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-400" />
              Assigned Color:
            </span>
            <span
              className="px-2 py-0.5 font-bold border border-black"
              style={{ backgroundColor: selectedColor.hex, color: selectedColor.text }}
            >
              {selectedColor.name}
            </span>
          </div>

          {/* Mood / Interest Tagging */}
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase font-bold text-zinc-300 flex items-center justify-between">
              <span>Mood / Priority Tag</span>
              <span className="text-[10px] text-zinc-500">For Weekly Smart Plan</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECT_MOOD_TAGS.map((tag) => {
                const isSelected = moodTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setMoodTag(tag.id as MoodTagType)}
                    className={`p-2 border-2 text-left font-mono transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-white bg-zinc-900 shadow-[2px_2px_0_#FFFFFF] scale-[1.02]'
                        : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 opacity-80'
                    }`}
                  >
                    <span className="text-base">{tag.emoji}</span>
                    <span className="font-bold text-[10px] uppercase text-zinc-300">{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="brutal-btn bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="brutal-btn-primary">
              {isEditing ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
