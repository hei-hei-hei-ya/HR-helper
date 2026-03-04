import React, { useState } from 'react';
import { InputData } from './components/InputData';
import { LuckyDraw } from './components/LuckyDraw';
import { AutoGrouping } from './components/AutoGrouping';
import { Users, Gift, Shuffle, Sparkles } from 'lucide-react';

type Tab = 'input' | 'draw' | 'group';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [names, setNames] = useState<string[]>([]);
  const [winners, setWinners] = useState<string[]>([]);

  const tabs = [
    { id: 'input', label: 'Participants', icon: Users },
    { id: 'draw', label: 'Lucky Draw', icon: Gift },
    { id: 'group', label: 'Auto Grouping', icon: Shuffle },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                HR Toolkit
              </h1>
            </div>
            
            <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'input' && (
            <InputData names={names} setNames={setNames} />
          )}
          {activeTab === 'draw' && (
            <LuckyDraw names={names} winners={winners} setWinners={setWinners} />
          )}
          {activeTab === 'group' && (
            <AutoGrouping names={names} />
          )}
        </div>
      </main>
    </div>
  );
}
