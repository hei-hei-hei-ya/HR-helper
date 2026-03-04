import React, { useState } from 'react';
import { Users, Shuffle, Copy, CheckCircle2, Download } from 'lucide-react';
import { motion } from 'motion/react';

interface AutoGroupingProps {
  names: string[];
}

export function AutoGrouping({ names }: AutoGroupingProps) {
  const [groupSize, setGroupSize] = useState<number>(4);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (names.length === 0) {
      alert('Please add participants first.');
      return;
    }
    if (groupSize < 1) {
      alert('Group size must be at least 1.');
      return;
    }

    setIsGenerating(true);
    
    // Simulate a brief generation delay for UX
    setTimeout(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5);
      const result: string[][] = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        result.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(result);
      setIsGenerating(false);
      setCopied(false);
    }, 600);
  };

  const handleCopy = () => {
    if (groups.length === 0) return;
    
    const text = groups.map((g, i) => `Group ${i + 1}:\n${g.join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "Group,Name\n";
    groups.forEach((group, index) => {
      group.forEach(member => {
        // Escape quotes in member name
        const escapedMember = member.includes(',') || member.includes('"') 
          ? `"${member.replace(/"/g, '""')}"` 
          : member;
        csvContent += `Group ${index + 1},${escapedMember}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'groups.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Auto Grouping</h2>
            <p className="text-sm text-slate-500">{names.length} total participants</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
              People per group:
            </label>
            <input
              type="number"
              min="1"
              max={Math.max(1, names.length)}
              value={groupSize}
              onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center font-medium"
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={names.length === 0 || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            <Shuffle className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Generated Groups ({groups.length})
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Text
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groups.map((group, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={`group-${index}`}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Group {index + 1}</span>
                  <span className="text-xs font-medium bg-white text-slate-500 px-2 py-1 rounded-full border border-slate-200">
                    {group.length} members
                  </span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {group.map((member, mIndex) => (
                      <li key={mIndex} className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
