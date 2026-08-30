import React, { useState, useEffect } from 'react';
import { Subject } from '../../types';
import { SubjectColor } from '../../config/settings';
import { ColorPickerGrid } from './ColorPickerGrid';
import { getAutoAssignedColor, getSubjectColorById } from '../../utils/colors';
import { X } from 'lucide-react';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; colorId: string }) => void;
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
  const [selectedColor, setSelectedColor] = useState<SubjectColor>(() =>
    getAutoAssignedColor(existingSubjects)
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialSubject) {
      setName(initialSubject.name);
      setSelectedColor(getSubjectColorById(initialSubject.colorId));
    } else {
      setName('');
      setSelectedColor(getAutoAssignedColor(existingSubjects));
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
      colorId: selectedColor.id,
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
              {isEditing ? 'Edit Subject' : 'Add Subject'}
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-2 bg-rose-950/80 border-2 border-rose-500 text-rose-300 font-mono text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Subject Name */}
          <div className="space-y-1">
            <label className="font-mono text-xs uppercase font-bold text-zinc-300">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Mathematics"
              className="brutal-input w-full"
            />
          </div>

          {/* 15-Distinct Color Palette Grid */}
          <ColorPickerGrid
            selectedColorId={selectedColor.id}
            onSelectColor={setSelectedColor}
            existingSubjects={existingSubjects}
            currentSubjectId={initialSubject?.id}
          />

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
              {isEditing ? 'Save' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
