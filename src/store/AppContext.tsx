import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, Subject, TimeTableSlot, AttendanceRecord } from '../types';
import { AppSettings, AttendanceStatusType } from '../config/settings';
import { loadAppState, saveAppState, getInitialState } from '../utils/storage';
import { getAutoAssignedColor } from '../utils/colors';

interface AppContextType {
  state: AppState;
  subjects: Subject[];
  timetable: TimeTableSlot[];
  records: Record<string, AttendanceRecord>;
  settings: AppSettings;
  
  // Subject Actions
  addSubject: (data: { name: string; code?: string; colorId?: string; moodTag?: Subject['moodTag']; roomDefault?: string; targetPercentage?: number }) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string, cascade?: boolean) => void;
  getSubjectById: (id: string) => Subject | undefined;

  // Timetable Actions
  addSlot: (slot: Omit<TimeTableSlot, 'id'>) => TimeTableSlot;
  updateSlot: (id: string, updates: Partial<TimeTableSlot>) => void;
  deleteSlot: (id: string) => void;

  // Attendance Actions
  markAttendance: (date: string, slotId: string, subjectId: string, status: AttendanceStatusType, durationHours: number, note?: string) => void;
  getRecordForSlot: (date: string, slotId: string) => AttendanceRecord | undefined;
  getRecordsForDate: (date: string) => AttendanceRecord[];

  // Settings & State Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetAllData: () => void;
  importState: (newState: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(loadAppState);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Add Subject with Auto-Color Assignment fallback
  const addSubject = useCallback((data: { name: string; code?: string; colorId?: string; moodTag?: Subject['moodTag']; roomDefault?: string; targetPercentage?: number }): Subject => {
    let finalColorId = data.colorId;
    if (!finalColorId) {
      finalColorId = getAutoAssignedColor(state.subjects).id;
    }

    const newSubject: Subject = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      code: data.code?.trim().toUpperCase(),
      colorId: finalColorId,
      moodTag: data.moodTag || 'ok_ok',
      roomDefault: data.roomDefault?.trim(),
      targetPercentage: data.targetPercentage,
      createdAt: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));

    return newSubject;
  }, [state.subjects]);

  // Update Subject
  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  // Delete Subject (with optional cascade removal of slots & records)
  const deleteSubject = useCallback((id: string, cascade = true) => {
    setState((prev) => {
      const newSubjects = prev.subjects.filter((s) => s.id !== id);
      let newTimetable = prev.timetable;
      let newRecords = { ...prev.records };

      if (cascade) {
        newTimetable = prev.timetable.filter((slot) => slot.subjectId !== id);
        // remove records for this subject
        Object.keys(newRecords).forEach((key) => {
          if (newRecords[key].subjectId === id) {
            delete newRecords[key];
          }
        });
      }

      return {
        ...prev,
        subjects: newSubjects,
        timetable: newTimetable,
        records: newRecords,
      };
    });
  }, []);

  // Get Subject By Id
  const getSubjectById = useCallback((id: string) => {
    return state.subjects.find((s) => s.id === id);
  }, [state.subjects]);

  // Add Slot
  const addSlot = useCallback((slot: Omit<TimeTableSlot, 'id'>): TimeTableSlot => {
    const newSlot: TimeTableSlot = {
      ...slot,
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    setState((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSlot],
    }));

    return newSlot;
  }, []);

  // Update Slot
  const updateSlot = useCallback((id: string, updates: Partial<TimeTableSlot>) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)),
    }));
  }, []);

  // Delete Slot
  const deleteSlot = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((slot) => slot.id !== id),
    }));
  }, []);

  // Mark Attendance
  const markAttendance = useCallback((
    date: string,
    slotId: string,
    subjectId: string,
    status: AttendanceStatusType,
    durationHours: number,
    note?: string
  ) => {
    const key = `${date}_${slotId}`;
    const record: AttendanceRecord = {
      id: key,
      date,
      slotId,
      subjectId,
      status,
      durationHours,
      timestamp: Date.now(),
      note,
    };

    setState((prev) => ({
      ...prev,
      records: {
        ...prev.records,
        [key]: record,
      },
    }));
  }, []);

  // Get Record for Slot
  const getRecordForSlot = useCallback((date: string, slotId: string) => {
    return state.records[`${date}_${slotId}`];
  }, [state.records]);

  // Get Records for Date
  const getRecordsForDate = useCallback((date: string) => {
    return Object.values(state.records).filter((r) => r.date === date);
  }, [state.records]);

  // Update Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...updates,
      },
    }));
  }, []);

  // Reset All Data
  const resetAllData = useCallback(() => {
    const fresh = getInitialState();
    setState(fresh);
    saveAppState(fresh);
  }, []);

  // Import State
  const importState = useCallback((newState: AppState) => {
    setState(newState);
    saveAppState(newState);
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        subjects: state.subjects,
        timetable: state.timetable,
        records: state.records,
        settings: state.settings,
        addSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        addSlot,
        updateSlot,
        deleteSlot,
        markAttendance,
        getRecordForSlot,
        getRecordsForDate,
        updateSettings,
        resetAllData,
        importState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
