import React, { useState } from 'react';
import { Subject } from '../../types';
import { useApp } from '../../store/AppContext';
import { SubjectCard } from './SubjectCard';
import { SubjectModal } from './SubjectModal';
import { Plus, Layers } from 'lucide-react';

export const SubjectManagerView: React.FC = () => {
  const { subjects, timetable, addSubject, updateSubject, deleteSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSaveSubject = (data: { name: string; colorId: string }) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data);
    } else {
      addSubject(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            <h2 className="font-mono text-sm font-black uppercase text-white tracking-wider">
              Subjects ({subjects.length})
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
      </div>

      {/* Subjects List */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5">
          {subjects.map((sub) => (
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
          <div className="space-y-1">
            <h4 className="font-mono text-sm font-bold text-white uppercase">
              No Subjects Added
            </h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Add your semester subjects to assign colors and build your timetable.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="brutal-btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
          >
            <Plus size={14} className="stroke-[3]" />
            <span>Add First Subject</span>
          </button>
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
