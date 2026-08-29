import React, { useState, useMemo } from 'react';
import { Subject, MoodTagType } from '../../types';
import { useApp } from '../../store/AppContext';
import { SubjectCard } from './SubjectCard';
import { SubjectModal } from './SubjectModal';
import { Plus, Search, Layers, Sparkles } from 'lucide-react';
import { SUBJECT_MOOD_TAGS } from '../../config/settings';

export const SubjectManagerView: React.FC = () => {
  const { subjects, timetable, addSubject, updateSubject, deleteSubject } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.roomDefault && s.roomDefault.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesMood =
        selectedMoodFilter === 'all' || s.moodTag === selectedMoodFilter;

      return matchesSearch && matchesMood;
    });
  }, [subjects, searchQuery, selectedMoodFilter]);

  // Mood counts
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = { fun: 0, ok_ok: 0, hate: 0 };
    subjects.forEach((s) => {
      if (s.moodTag && counts[s.moodTag] !== undefined) {
        counts[s.moodTag]++;
      }
    });
    return counts;
  }, [subjects]);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSaveSubject = (data: {
    name: string;
    code?: string;
    colorId: string;
    moodTag?: MoodTagType;
    roomDefault?: string;
    targetPercentage?: number;
  }) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
    } else {
      addSubject(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Stats */}
      <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            <h2 className="font-mono text-sm font-black uppercase text-white tracking-wider">
              Semester Subjects ({subjects.length})
            </h2>
          </div>
          <button
            onClick={handleOpenAdd}
            className="brutal-btn-primary flex items-center gap-1.5 py-1.5 px-3 text-xs"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Add Subject</span>
          </button>
        </div>

        {/* Palette & Mood summary */}
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs border-t border-zinc-850">
          <div className="p-2 bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] uppercase">Palette In Use:</span>
            <span className="font-bold text-white">
              {subjects.length} / 15 <span className="text-zinc-500 font-normal">({15 - subjects.length} free)</span>
            </span>
          </div>

          <div className="p-2 bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] uppercase">Mood Split:</span>
            <span className="font-bold text-zinc-300 flex items-center gap-1.5 text-[11px]">
              <span>🔥 {moodCounts.fun}</span>
              <span>😐 {moodCounts.ok_ok}</span>
              <span>💀 {moodCounts.hate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Mood Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects by name, code, or room..."
            className="brutal-input w-full pl-9 text-xs"
          />
        </div>

        {/* Mood filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedMoodFilter('all')}
            className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 border transition-all ${
              selectedMoodFilter === 'all'
                ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            All ({subjects.length})
          </button>
          {SUBJECT_MOOD_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedMoodFilter(tag.id)}
              className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 border transition-all flex items-center gap-1 ${
                selectedMoodFilter === tag.id
                  ? 'border-white bg-zinc-800 text-white shadow-[1px_1px_0_#FFF]'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.id.toUpperCase()} ({moodCounts[tag.id] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredSubjects.map((sub) => (
            <SubjectCard
              key={sub.id}
              subject={sub}
              timetable={timetable}
              onEdit={handleOpenEdit}
              onDelete={deleteSubject}
            />
          ))}
        </div>
      ) : (
        <div className="brutal-card p-8 text-center bg-zinc-950/60 border-2 border-dashed border-zinc-800 space-y-3">
          <div className="w-10 h-10 mx-auto bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 font-mono">
            ?
          </div>
          <div className="space-y-1">
            <h4 className="font-mono text-sm font-bold text-white uppercase">
              {searchQuery ? 'No Matching Subjects Found' : 'No Subjects Added Yet'}
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              {searchQuery
                ? 'Try tweaking your search query or clear the filter to view all subjects.'
                : 'Add the subjects you have this semester to start creating your timetable.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={handleOpenAdd}
              className="brutal-btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
            >
              <Sparkles size={14} />
              <span>Add Your First Subject</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        existingSubjects={subjects}
        initialSubject={editingSubject}
      />
    </div>
  );
};
