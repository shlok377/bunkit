import { useState } from 'react';
import { AppProvider } from './store/AppContext';
import { TodayView } from './components/today/TodayView';
import { TimetableMakerView } from './components/timetable/TimetableMakerView';
import { SubjectManagerView } from './components/subjects/SubjectManagerView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { Calendar, BarChart2, Clock, Settings, Layers } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'today' | 'timetable' | 'subjects' | 'analytics' | 'settings'>('today');

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans pt-5 pb-24 selection:bg-white selection:text-black">
      {/* Main View Area */}
      <main className="flex-1 max-w-sm mx-auto w-full px-4 space-y-4">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'timetable' && <TimetableMakerView />}
        {activeTab === 'subjects' && <SubjectManagerView />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Ultra-Minimal Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 border-t border-zinc-850 py-2 backdrop-blur-none">
        <div className="max-w-sm mx-auto flex items-center justify-around px-2">
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'timetable', label: 'Time Table', icon: Clock },
            { id: 'subjects', label: 'Subjects', icon: Layers },
            { id: 'analytics', label: 'Stats', icon: BarChart2 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 py-1 px-2 font-mono text-[9px] uppercase font-bold tracking-wider transition-all ${
                  isActive
                    ? 'text-white scale-105'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.75} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-white -mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
