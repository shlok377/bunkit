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
    <div className="space-y-4 font-mono">
      <h2 className="text-sm font-black uppercase text-white tracking-wider pt-1">
        Settings
      </h2>

      {/* Target & Warning Sliders */}
      <div className="brutal-card p-4 bg-[#0D0D10] border border-zinc-800 space-y-4 text-xs">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase">Target Attendance</span>
            <span className="font-bold text-white">{settings.targetAttendancePercent}%</span>
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

        <div className="space-y-1.5 pt-2 border-t border-zinc-850">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 font-bold uppercase">Warning Alert</span>
            <span className="font-bold text-white">{settings.warningThresholdPercent}%</span>
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

        <div className="space-y-1.5 pt-2 border-t border-zinc-850">
          <span className="text-zinc-400 font-bold uppercase block">Default Mode</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'hourly', label: 'Hourly' },
              { id: 'lecture_count', label: 'Classes' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateSettings({ primaryCalculationMode: mode.id as CalculationMode })}
                className={`py-1.5 border text-center font-bold uppercase text-[10px] ${
                  settings.primaryCalculationMode === mode.id
                    ? 'border-white bg-white text-black'
                    : 'border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
          <span className="text-zinc-400 font-bold uppercase">Confetti</span>
          <button
            type="button"
            onClick={() => updateSettings({ enableConfetti: !settings.enableConfetti })}
            className="text-xs font-bold text-white uppercase underline"
          >
            {settings.enableConfetti ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Backup & Portability */}
      <div className="brutal-card p-4 bg-[#0D0D10] border border-zinc-800 space-y-3 text-xs">
        <span className="text-zinc-400 font-bold uppercase block border-b border-zinc-850 pb-1.5">
          Data Backup
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="py-2 border border-zinc-700 hover:border-white text-white font-bold text-[10px] uppercase text-center"
          >
            Export JSON
          </button>

          <label className="py-2 border border-zinc-700 hover:border-white text-white font-bold text-[10px] uppercase text-center cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
          <span className="text-zinc-500 text-[11px]">Wipe All Data</span>
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="text-rose-400 hover:text-rose-300 text-[10px] uppercase font-bold underline"
          >
            Reset
          </button>
        </div>

        {showConfirmReset && (
          <div className="p-3 bg-zinc-900 border border-rose-600 space-y-2">
            <p className="text-[11px] text-rose-300">
              Permanently wipe all stored subjects and logs?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-0.5 text-[10px] text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                }}
                className="px-2 py-0.5 text-[10px] bg-rose-600 text-white font-bold"
              >
                Wipe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
