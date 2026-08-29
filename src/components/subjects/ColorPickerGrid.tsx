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
  // Map of occupied color IDs to subject names
  const occupiedColorMap = new Map<string, string>();
  existingSubjects.forEach((sub) => {
    if (!currentSubjectId || sub.id !== currentSubjectId) {
      occupiedColorMap.set(sub.colorId, sub.name);
    }
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-400 font-bold uppercase tracking-wider">
          Color Choice (15 Distinct Hues)
        </span>
        <span className="text-[11px] text-zinc-500 font-bold">
          {15 - occupiedColorMap.size} available
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 p-2.5 bg-zinc-950 border-2 border-zinc-800">
        {DISTINCT_SUBJECT_COLORS.map((color) => {
          const isOccupied = occupiedColorMap.has(color.id);
          const occupiedByName = occupiedColorMap.get(color.id);
          const isSelected = selectedColorId === color.id;

          return (
            <button
              key={color.id}
              type="button"
              disabled={isOccupied}
              onClick={() => onSelectColor(color)}
              title={
                isOccupied
                  ? `In Use by: ${occupiedByName}`
                  : `${color.name} (Click to choose)`
              }
              className={`
                relative h-10 flex flex-col items-center justify-center border-2 transition-all font-mono text-[10px]
                ${
                  isSelected
                    ? 'border-white scale-105 shadow-[2px_2px_0_#FFFFFF] z-10 ring-2 ring-white/50'
                    : isOccupied
                    ? 'border-zinc-800 opacity-20 grayscale cursor-not-allowed border-dashed bg-zinc-900'
                    : 'border-black hover:border-white/80 active:scale-95 shadow-[2px_2px_0_#000]'
                }
              `}
              style={{
                backgroundColor: isOccupied ? '#18181B' : color.hex,
                color: isOccupied ? '#71717A' : color.text,
              }}
            >
              {isSelected && (
                <div className="bg-black/70 p-0.5 border border-white">
                  <Check size={14} className="text-white stroke-[3]" />
                </div>
              )}

              {isOccupied && (
                <div className="flex items-center justify-center">
                  <Lock size={12} className="text-zinc-500" />
                </div>
              )}

              <span className="sr-only">{color.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <span>* Active colors are locked to prevent timetable confusion</span>
      </div>
    </div>
  );
};
