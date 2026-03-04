import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, RefreshCw, Trophy } from 'lucide-react';

interface LuckyDrawProps {
  names: string[];
  winners: string[];
  setWinners: React.Dispatch<React.SetStateAction<string[]>>;
}

export function LuckyDraw({ names, winners, setWinners }: LuckyDrawProps) {
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const eligibleNames = allowRepeat
    ? names
    : names.filter((name) => !winners.includes(name));

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, width, height);

    if (eligibleNames.length === 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 16px Inter, sans-serif';
      ctx.fillText('No participants', centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / eligibleNames.length;
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6'];

    eligibleNames.forEach((item, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      let colorIndex = i % colors.length;
      if (i === eligibleNames.length - 1 && colorIndex === 0 && eligibleNames.length > 1) {
        colorIndex = 1;
      }
      ctx.fillStyle = colors[colorIndex];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      
      let fontSize = Math.max(10, Math.min(18, 250 / eligibleNames.length));
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      
      let text = item;
      if (text.length > 15) text = text.substring(0, 13) + '...';
      
      ctx.fillText(text, radius - 20, 0);
      ctx.restore();
    });
    
    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

  }, [eligibleNames]);

  const handleDraw = () => {
    if (eligibleNames.length === 0) {
      alert('No eligible participants left!');
      return;
    }

    setIsDrawing(true);
    setWinner(null);
    
    const randomIndex = Math.floor(Math.random() * eligibleNames.length);
    const finalWinner = eligibleNames[randomIndex];
    
    const sliceAngle = 360 / eligibleNames.length;
    const centerAngle = (randomIndex + 0.5) * sliceAngle;
    
    const currentMod = rotation % 360;
    const targetMod = (270 - centerAngle + 360) % 360;
    let diff = targetMod - currentMod;
    if (diff < 0) diff += 360;
    
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.6);
    const finalTargetRotation = rotation + (360 * 5) + diff + randomOffset;

    setRotation(finalTargetRotation);

    setTimeout(() => {
      setWinner(finalWinner);
      setWinners((prev) => [...prev, finalWinner]);
      setIsDrawing(false);
      triggerConfetti();
    }, 5000);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-indigo-500" />
            Lucky Draw
          </h2>
          <p className="text-slate-500 mb-8">
            {eligibleNames.length} eligible participants
          </p>

          <div className="relative w-full max-w-[320px] sm:max-w-[400px] mx-auto aspect-square mb-8">
            {/* Pointer */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 drop-shadow-md">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#1e293b" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L2 2h20L12 22z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Wheel */}
            <div 
              className="w-full h-full rounded-full shadow-xl border-4 border-white overflow-hidden bg-white"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isDrawing ? 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
              }}
            >
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-full"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {winner && (
              <motion.div
                key="winner"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="mb-6"
              >
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Winner</div>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                  {winner}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleDraw}
            disabled={isDrawing || eligibleNames.length === 0}
            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isDrawing ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center justify-between">
            Settings
          </h3>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg transition-colors ${allowRepeat ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-sm font-medium text-slate-700">Allow Repeat</span>
                <span className="block text-xs text-slate-500">Winners can win again</span>
              </div>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <input
                type="checkbox"
                className="sr-only"
                checked={allowRepeat}
                onChange={(e) => setAllowRepeat(e.target.checked)}
              />
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </label>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Winners
            </h3>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {winners.length}
            </span>
          </div>
          
          {winners.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No winners yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {winners.map((w, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={`${w}-${i}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <span className="font-medium text-slate-700">{w}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
