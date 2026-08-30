import React, { useState } from 'react';
import { Subject } from '../../types';
import { useApp } from '../../store/AppContext';
import { SubjectCard } from './SubjectCard';
import { SubjectModal } from './SubjectModal';
import { Plus } from 'lucide-react';

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
      {/* Minimal Header */}
      <div className="flex items-center justify-between font-mono pt-1">
        <h2 className="text-sm font-black uppercase text-white tracking-wider">
          Subjects ({subjects.length})
        </h2>
        <button
          onClick={handleOpenAdd}
          className="px-2.5 py-1 font-bold uppercase text-[10px] bg-white text-black border border-white hover:bg-zinc-200 flex items-center gap-1"
        >
          <Plus size={12} strokeWidth={3} />
          <span>Add</span>
        </button>
      </div>

      {/* Subjects List */}
      {subjects.length > 0 ? (
        <div className="space-y-2">
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
        <div className="py-12 text-center text-zinc-500 font-mono text-xs space-y-2">
          <p>No subjects added yet.</p>
          <button
            onClick={handleOpenAdd}
            className="text-white underline text-[11px] font-bold"
          >
            + Add your first subject
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
