import React, { useState, useRef } from 'react';
import { Upload, Users, Trash2 } from 'lucide-react';

interface InputDataProps {
  names: string[];
  setNames: React.Dispatch<React.SetStateAction<string[]>>;
}

export function InputData({ names, setNames }: InputDataProps) {
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNames = () => {
    const newNames = textInput
      .split(/\r?\n|,/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    
    setNames((prev) => Array.from(new Set([...prev, ...newNames])));
    setTextInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newNames = content
        .split(/\r?\n|,/)
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
      
      setNames((prev) => Array.from(new Set([...prev, ...newNames])));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all names?')) {
      setNames([]);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-500" />
          Add Participants
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Paste names (one per line or comma-separated)
            </label>
            <textarea
              className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
              placeholder="John Doe&#10;Jane Smith&#10;Alice Johnson"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleAddNames}
              disabled={!textInput.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Names
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">or</span>
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload CSV
                <input
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Current List ({names.length})
          </h2>
          {names.length > 0 && (
            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
        
        {names.length === 0 ? (
          <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
            No participants added yet.
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-wrap gap-2">
              {names.map((name, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
