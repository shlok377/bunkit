import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { exportStateAsJson, importStateFromJson } from '../../utils/storage';
import { CalculationMode } from '../../config/settings';
import {
  Sliders,
  Download,
  Upload,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  FileCode,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { state, settings, updateSettings, importState, resetAllData } = useApp();

  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');

  const handleExport = () => {
    const jsonStr = exportStateAsJson(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bunkit_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError('');
    setImportSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = importStateFromJson(text);
        importState(parsed);
        setImportSuccess('Data successfully restored!');
      } catch (err: any) {
        setImportError(err.message || 'Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="brutal-card p-4 bg-zinc-950/90 border-2 border-zinc-800 space-y-1">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-emerald-400" />
          <h2 className="font-mono text-sm font-black uppercase text-white tracking-wider">
            Settings
          </h2>
        </div>
        <p className="text-xs text-zinc-400 font-mono">
          All data is saved locally in your browser.
        </p>
      </div>

      {/* 2. Attendance Threshold Controls */}
      <div className="brutal-card p-4 bg-zinc-950 border-2 border-zinc-800 space-y-4 font-mono">
        <h3 className="text-xs font-black uppercase text-zinc-300 border-b border-zinc-850 pb-2">
          Attendance Criteria
        </h3>

        {/* Target Attendance Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="text-zinc-300 font-bold uppercase">
              Target Attendance:
            </label>
            <span className="text-sm font-black text-emerald-400 bg-black px-2 py-0.5 border border-zinc-700">
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
            className="w-full accent-emerald-500 bg-zinc-800 h-2 cursor-pointer"
          />
        </div>

        {/* Warning Threshold Slider */}
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <div className="flex items-center justify-between text-xs">
            <label className="text-zinc-300 font-bold uppercase">
              Warning Threshold:
            </label>
            <span className="text-sm font-black text-amber-400 bg-black px-2 py-0.5 border border-zinc-700">
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
            className="w-full accent-amber-500 bg-zinc-800 h-2 cursor-pointer"
          />
        </div>

        {/* Calculation Mode */}
        <div className="space-y-2 pt-2 border-t border-zinc-900">
          <label className="text-xs text-zinc-300 font-bold uppercase block">
            Calculation Mode:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'hourly', label: 'Hourly Based', desc: 'Prioritize hours attended' },
              { id: 'lecture_count', label: 'Class Count', desc: 'Prioritize classes attended' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => updateSettings({ primaryCalculationMode: mode.id as CalculationMode })}
                className={`p-2 border-2 text-left transition-all ${
                  settings.primaryCalculationMode === mode.id
                    ? 'border-emerald-500 bg-emerald-950/80 text-white shadow-[2px_2px_0_#000]'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="font-bold text-xs uppercase text-emerald-400">{mode.label}</div>
                <div className="text-[9.5px] text-zinc-400 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Confetti Animation Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
          <span className="text-xs text-zinc-300 font-bold uppercase flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-400" />
            Confetti Effects
          </span>
          <button
            type="button"
            onClick={() => updateSettings({ enableConfetti: !settings.enableConfetti })}
            className={`font-mono text-[10px] uppercase font-bold px-3 py-1 border-2 transition-all ${
              settings.enableConfetti
                ? 'border-emerald-500 bg-emerald-950 text-emerald-300'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}
          >
            {settings.enableConfetti ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>
      </div>

      {/* 3. Data Backup, Export & Restore */}
      <div className="brutal-card p-4 bg-zinc-950 border-2 border-zinc-800 space-y-4 font-mono">
        <h3 className="text-xs font-black uppercase text-zinc-300 border-b border-zinc-850 pb-2 flex items-center gap-1.5">
          <FileCode size={14} className="text-sky-400" />
          Backup &amp; Restore
        </h3>

        {importSuccess && (
          <div className="p-2.5 bg-emerald-950/80 border-2 border-emerald-500 text-emerald-300 text-xs flex items-center gap-1.5">
            <CheckCircle size={14} />
            <span>{importSuccess}</span>
          </div>
        )}

        {importError && (
          <div className="p-2.5 bg-rose-950/80 border-2 border-rose-500 text-rose-300 text-xs">
            ⚠️ {importError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="brutal-btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center gap-2 py-2"
          >
            <Download size={14} />
            <span>Export (.JSON)</span>
          </button>

          <label className="brutal-btn bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 flex items-center justify-center gap-2 py-2 cursor-pointer">
            <Upload size={14} />
            <span>Import (.JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Danger Zone: Reset All Data */}
        <div className="pt-3 border-t-2 border-rose-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1">
                <ShieldAlert size={13} />
                Wipe All Data:
              </div>
              <div className="text-[10px] text-zinc-500">Reset local storage to empty</div>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="brutal-btn-danger text-[10px] py-1.5 px-3"
            >
              Reset
            </button>
          </div>

          {showConfirmReset && (
            <div className="p-3 bg-zinc-900 border-2 border-rose-600 space-y-2 animate-fade-in">
              <p className="text-xs text-rose-300 leading-tight">
                Are you sure? This will delete all subjects, timetable slots, and attendance records.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmReset(false)}
                  className="px-2.5 py-1 bg-zinc-800 text-zinc-300 font-bold text-[10px] uppercase border border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetAllData();
                    setShowConfirmReset(false);
                    setImportSuccess('All data cleared.');
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] uppercase border border-black hover:bg-rose-500"
                >
                  Yes, Wipe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
