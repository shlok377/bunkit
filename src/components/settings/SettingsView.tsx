import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { exportStateAsJson, importStateFromJson } from '../../utils/storage';
import { CalculationMode } from '../../config/settings';

export const SettingsView: React.FC = () => {
  const { state, settings, updateSettings, importState, resetAllData } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExport = () => {
    const jsonStr = exportStateAsJson(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bunkit_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = importStateFromJson(text);
        importState(parsed);
      } catch (err) {
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 font-mono pt-2">
      {/* Page Title */}
      <h2 className="text-sm font-black uppercase text-white tracking-widest">
        Settings
      </h2>

      {/* 1. Criteria Section */}
      <div className="brutal-card p-5 bg-[#0D0D10] border border-zinc-800 space-y-6 text-xs">
        {/* Target Attendance Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              Target Attendance
            </span>
            <span className="font-bold text-white text-sm bg-black px-2 py-0.5 border border-zinc-800">
              {settings.targetAttendancePercent}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="95"
            step="1"
            value={settings.targetAttendancePercent}
            onChange={(e) =>
              updateSettings({ targetAttendancePercent: Number(e.target.value) })
            }
            className="w-full accent-white bg-zinc-800 h-1.5 cursor-pointer"
          />
        </div>

        {/* Warning Threshold Slider */}
        <div className="space-y-3 pt-4 border-t border-zinc-850">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
              Warning Threshold
            </span>
            <span className="font-bold text-white text-sm bg-black px-2 py-0.5 border border-zinc-800">
              {settings.warningThresholdPercent}%
            </span>
          </div>
          <input
            type="range"
            min="40"
            max="80"
            step="1"
            value={settings.warningThresholdPercent}
            onChange={(e) =>
              updateSettings({ warningThresholdPercent: Number(e.target.value) })
            }
            className="w-full accent-white bg-zinc-800 h-1.5 cursor-pointer"
          />
        </div>

        {/* Calculation Mode */}
        <div className="space-y-3 pt-4 border-t border-zinc-850">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px] block">
            Calculation Mode
          </span>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {[
              { id: 'hourly', label: 'Hourly' },
              { id: 'lecture_count', label: 'Classes' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateSettings({ primaryCalculationMode: mode.id as CalculationMode })}
                className={`py-2 border text-center font-bold uppercase text-[10px] tracking-wider transition-all ${
                  settings.primaryCalculationMode === mode.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confetti Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-850">
          <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
            Confetti Effects
          </span>
          <button
            type="button"
            onClick={() => updateSettings({ enableConfetti: !settings.enableConfetti })}
            className="text-xs font-bold text-white uppercase underline hover:text-zinc-300 py-1"
          >
            {settings.enableConfetti ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 2. Backup & Portability Section */}
      <div className="brutal-card p-5 bg-[#0D0D10] border border-zinc-800 space-y-5 text-xs">
        <span className="text-zinc-400 font-bold uppercase tracking-wider text-[11px] block border-b border-zinc-850 pb-2">
          Backup &amp; Restore
        </span>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="py-2.5 border border-zinc-700 hover:border-white text-white font-bold text-[10px] uppercase tracking-wider text-center transition-colors"
          >
            Export JSON
          </button>

          <label className="py-2.5 border border-zinc-700 hover:border-white text-white font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer transition-colors">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Wipe Data Danger Row */}
        <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
          <span className="text-zinc-500 text-[11px]">Clear all stored data</span>
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="text-rose-400 hover:text-rose-300 text-[10px] uppercase font-bold underline py-1"
          >
            Reset
          </button>
        </div>

        {showConfirmReset && (
          <div className="p-3.5 bg-zinc-900 border border-rose-600 space-y-2.5 mt-2">
            <p className="text-[11px] text-rose-300 leading-tight">
              Permanently wipe all stored subjects and attendance records?
            </p>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 text-[10px] text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 text-[10px] bg-rose-600 text-white font-bold"
              >
                Wipe All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
