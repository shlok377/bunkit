import React from 'react';
import { DISTINCT_SUBJECT_COLORS, SubjectColor } from '../../config/settings';
import { Subject } from '../../types';
import { Check, Lock } from 'lucide-react';

interface ColorPickerGridProps {
  selectedColorId: string;
  onSelectColor: (color: SubjectColor) => void;
  existingSubjects: Subject[];
  currentSubjectId?: string;
}

export const ColorPickerGrid: React.FC<ColorPickerGridProps> = ({
  selectedColorId,
  onSelectColor,
  existingSubjects,
  currentSubjectId,
}) => {
  const occupiedColorIds = new Set<string>();
  existingSubjects.forEach((sub) => {
    if (!currentSubjectId || sub.id !== currentSubjectId) {
      occupiedColorIds.add(sub.colorId);
    }
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400 font-bold uppercase tracking-wider">
          Color Choice
        </span>
        <span className="text-[11px] text-zinc-500 font-bold">
          {15 - occupiedColorIds.size} / 15 Available
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 p-2 bg-zinc-950 border-2 border-zinc-800">
        {DISTINCT_SUBJECT_COLORS.map((color) => {
          const isOccupied = occupiedColorIds.has(color.id);
          const isSelected = selectedColorId === color.id;

          return (
            <button
              key={color.id}
              type="button"
              disabled={isOccupied}
              onClick={() => onSelectColor(color)}
              className={`
                relative h-9 flex items-center justify-center border-2 transition-all
                ${
                  isSelected
                    ? 'border-white scale-105 shadow-[2px_2px_0_#FFFFFF] z-10'
                    : isOccupied
                    ? 'border-zinc-850 opacity-20 grayscale cursor-not-allowed bg-zinc-900'
                    : 'border-black hover:border-white/80 active:scale-95 shadow-[1px_1px_0_#000]'
                }
              `}
              style={{
                backgroundColor: isOccupied ? '#18181B' : color.hex,
              }}
            >
              {isSelected && (
                <div className="bg-black/80 p-0.5 border border-white">
                  <Check size={13} className="text-white stroke-[3]" />
                </div>
              )}

              {isOccupied && (
                <Lock size={12} className="text-zinc-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
