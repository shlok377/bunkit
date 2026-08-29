import { useState, useEffect } from 'react';
import { loadAppState, saveAppState } from './utils/storage';
import { AppState } from './types';
import { ATTENDANCE_STATUS_CONFIG, DISTINCT_SUBJECT_COLORS } from './config/settings';
import { Calendar, BarChart3, Clock, Settings } from 'lucide-react';

export default function App() {
  const [state] = useState<AppState>(loadAppState);
  const [activeTab, setActiveTab] = useState<'today' | 'analytics' | 'timetable' | 'settings'>('today');

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC] flex flex-col font-sans pb-24 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b-2 border-zinc-800 bg-[#0E0E10] px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-[0_4px_0_#000000]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 border-2 border-black flex items-center justify-center font-mono font-black text-black text-lg shadow-[2px_2px_0_#000]">
            B
          </div>
          <div>
            <h1 className="font-mono font-black tracking-wider text-sm text-white uppercase flex items-center gap-1.5">
              BunkIt <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 border border-emerald-500/40">v1.0</span>
            </h1>
            <p className="text-[11px] text-zinc-400 font-mono tracking-tight">ATTENDANCE INTELLIGENCE</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-xs px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>TARGET: {state.settings.targetAttendancePercent}%</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        {/* Foundation Demo Cards */}
        <section className="brutal-card p-4 space-y-3 bg-zinc-950/90 border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono text-xs uppercase text-zinc-400 font-bold tracking-wider">Design System Ready</span>
            <span className="brutal-badge bg-emerald-950 text-emerald-400 border-emerald-500">TASK 1 COMPLETE</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Minimal neo-brutalist dark architecture with crisp borders, opacity-based depth layering, and centralized configuration store initialized.
          </p>

          {/* Color Swatch Preview (15 Distinct Colors) */}
          <div className="pt-2">
            <div className="text-[11px] font-mono font-bold text-zinc-400 mb-2 uppercase">15-Distinct High-Contrast Palette:</div>
            <div className="grid grid-cols-5 gap-1.5">
              {DISTINCT_SUBJECT_COLORS.map((c) => (
                <div
                  key={c.id}
                  className="h-6 border border-black/80 flex items-center justify-center font-mono text-[9px] font-bold shadow-[1px_1px_0_#000]"
                  style={{ backgroundColor: c.hex, color: c.text }}
                  title={c.name}
                >
                  {c.name.slice(0, 3)}
                </div>
              ))}
            </div>
          </div>

          {/* 5 Status Tokens Preview */}
          <div className="pt-2">
            <div className="text-[11px] font-mono font-bold text-zinc-400 mb-2 uppercase">5 Visual Attendance States:</div>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ATTENDANCE_STATUS_CONFIG) as (keyof typeof ATTENDANCE_STATUS_CONFIG)[]).map((key) => {
                const conf = ATTENDANCE_STATUS_CONFIG[key];
                return (
                  <div
                    key={key}
                    className="p-2 border-2 transition-all font-mono text-xs flex items-center justify-between shadow-[2px_2px_0_#000]"
                    style={{
                      borderColor: conf.borderColor,
                      backgroundColor: conf.bgDarkColor,
                      color: conf.textColor,
                    }}
                  >
                    <span className="font-black uppercase">{conf.label}</span>
                    <span className="text-[10px] opacity-75">{conf.shortLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Floating Brutalist Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E10]/95 border-t-2 border-zinc-800 p-2 backdrop-blur-none">
        <div className="max-w-md mx-auto flex items-center justify-around">
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'timetable', label: 'Timetable', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'today' | 'analytics' | 'timetable' | 'settings')}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 font-mono text-[10px] uppercase font-extrabold transition-all border-2 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-950/80 text-emerald-400 shadow-[2px_2px_0_#000] -translate-y-0.5'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
