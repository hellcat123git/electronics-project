import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { motion } from 'framer-motion';

export default function DiodeSimulation() {
  const [isForwardBias, setIsForwardBias] = useState(true);
  const [forwardVoltage, setForwardVoltage] = useState(0.7);
  const [reverseVoltage, setReverseVoltage] = useState(-50);

  const currentVoltage = isForwardBias ? forwardVoltage : reverseVoltage;

  // Calculate Diode Current
  const calculateCurrent = (v: number) => {
    if (v < 0) return -0.05; // -0.05 uA for reverse
    if (v >= 0 && v <= 0.6) return 0; // 0 mA before knee
    // Above 0.6V, exponential rise to 1000mA at 1V
    const A = 2.48;
    const B = 15;
    return A * (Math.exp(B * (v - 0.6)) - 1);
  };

  const currentId = calculateCurrent(currentVoltage);

  // Generate Graph Data
  const graphData = useMemo(() => {
    const data = [];
    if (isForwardBias) {
      for (let v = 0; v <= 1.2; v += 0.02) {
        data.push({
          voltage: parseFloat(v.toFixed(2)),
          current: calculateCurrent(v)
        });
      }
    } else {
      for (let v = 0; v >= -100; v -= 2) {
        data.push({
          voltage: parseFloat(v.toFixed(2)),
          current: calculateCurrent(v)
        });
      }
    }
    return data;
  }, [isForwardBias]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 font-sans flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-400">
          1N4007 Diode Simulator
        </h1>
        <p className="text-slate-400 mt-2">Interactive V-I Characteristics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        
        {/* CONTROL PANEL */}
        <div className="glass p-6 rounded-2xl flex flex-col gap-8 col-span-1 lg:col-span-1 border border-slate-800 shadow-2xl shadow-cyan-900/20">
          <h2 className="text-2xl font-semibold text-slate-200">Control Panel</h2>

          {/* Mode Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 relative">
            <motion.div
              className="absolute inset-y-1 bg-cyan-600/30 border border-cyan-500/50 rounded-lg shadow-lg"
              layout
              initial={false}
              animate={{
                left: isForwardBias ? "0.25rem" : "50%",
                width: "calc(50% - 0.25rem)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setIsForwardBias(true)}
              className={`flex-1 py-3 px-4 text-sm font-medium z-10 transition-colors ${isForwardBias ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Forward Bias
            </button>
            <button
              onClick={() => setIsForwardBias(false)}
              className={`flex-1 py-3 px-4 text-sm font-medium z-10 transition-colors ${!isForwardBias ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Reverse Bias
            </button>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-slate-300">Input Voltage (Vin)</label>
              <span className="text-xl font-mono text-cyan-400">{currentVoltage.toFixed(2)} V</span>
            </div>
            
            <input
              type="range"
              min={isForwardBias ? 0 : -100}
              max={isForwardBias ? 1.2 : 0}
              step={isForwardBias ? 0.01 : 1}
              value={currentVoltage}
              onChange={(e) => isForwardBias ? setForwardVoltage(parseFloat(e.target.value)) : setReverseVoltage(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{isForwardBias ? '0V' : '-100V'}</span>
              <span>{isForwardBias ? '1.2V' : '0V'}</span>
            </div>
          </div>

          {/* Readouts */}
          <div className="mt-auto flex flex-col gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400">Current (Id)</span>
              <span className="text-2xl font-mono text-green-400">
                {isForwardBias 
                  ? currentId < 0.1 ? "0.00 mA" : `${currentId.toFixed(2)} mA` 
                  : `${currentId.toFixed(2)} µA`}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          
          {/* CIRCUIT DIAGRAM */}
          <div className="glass p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-64 shadow-2xl shadow-green-900/10">
            <h2 className="absolute top-4 left-6 text-xl font-semibold text-slate-200">Circuit</h2>
            
            <svg viewBox="0 0 400 200" className="w-full max-w-md mt-4">
              {/* Wires */}
              <motion.path
                d="M 50 150 L 50 50 L 150 50"
                fill="none"
                stroke={isForwardBias && currentVoltage > 0.6 ? "#22d3ee" : "#334155"}
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                d="M 250 50 L 350 50 L 350 150"
                fill="none"
                stroke={isForwardBias && currentVoltage > 0.6 ? "#22d3ee" : "#334155"}
                strokeWidth="4"
              />
              <motion.path
                d="M 350 150 L 50 150"
                fill="none"
                stroke={isForwardBias && currentVoltage > 0.6 ? "#22d3ee" : "#334155"}
                strokeWidth="4"
              />

              {/* Current Animation */}
              {isForwardBias && currentVoltage > 0.6 && (
                <motion.circle
                  r="4"
                  fill="#4ade80"
                  style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }}
                  animate={{
                    offsetDistance: ["0%", "100%"]
                  }}
                  transition={{
                    duration: Math.max(0.2, 2 - currentVoltage),
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="[offset-path:path('M_50_150_L_50_50_L_150_50_L_250_50_L_350_50_L_350_150_L_50_150')]"
                />
              )}

              {/* DC Source */}
              <circle cx="50" cy="150" r="20" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
              <text x="50" y="155" textAnchor="middle" fill="#cbd5e1" fontSize="14" fontWeight="bold">DC</text>
              <text x="15" y="155" textAnchor="middle" fill="#94a3b8" fontSize="12">{isForwardBias ? '+' : '-'}</text>
              <text x="50" y="190" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold">{Math.abs(currentVoltage).toFixed(1)}V</text>

              {/* Resistor */}
              <path d="M 150 50 L 160 40 L 170 60 L 180 40 L 190 60 L 200 40 L 210 60 L 220 40 L 230 60 L 240 50 L 250 50" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinejoin="bevel"/>
              <text x="200" y="25" textAnchor="middle" fill="#94a3b8" fontSize="12">1kΩ</text>

              {/* Diode */}
              <g transform={isForwardBias ? "translate(350, 100) rotate(90)" : "translate(350, 100) rotate(270)"}>
                <polygon points="-15,-15 15,0 -15,15" fill="#e2e8f0" />
                <line x1="15" y1="-15" x2="15" y2="15" stroke="#e2e8f0" strokeWidth="4" />
              </g>
              <text x="380" y="105" textAnchor="middle" fill="#cbd5e1" fontSize="12">1N4007</text>
            </svg>
            
            {!isForwardBias && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="absolute bottom-6 right-6 text-red-400 font-mono text-sm bg-red-950/50 px-3 py-1 rounded-full border border-red-900/50"
               >
                 Current Blocked (Reverse Bias)
               </motion.div>
            )}
          </div>

          {/* V-I GRAPH */}
          <div className="glass p-6 rounded-2xl border border-slate-800 flex-1 min-h-[400px] relative shadow-2xl shadow-cyan-900/10">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">V-I Characteristic Curve</h2>
            
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="voltage" 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8' }}
                    label={{ value: 'Voltage (V)', position: 'bottom', fill: '#94a3b8' }}
                    domain={isForwardBias ? [0, 1.2] : [-100, 0]}
                    type="number"
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tick={{ fill: '#94a3b8' }}
                    label={{ value: isForwardBias ? 'Current (mA)' : 'Current (µA)', angle: -90, position: 'insideLeft', fill: '#94a3b8', offset: -10 }}
                    domain={isForwardBias ? [0, 1000] : [-0.1, 0]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#22d3ee' }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value: any) => [`${Number(value).toFixed(2)} ${isForwardBias ? 'mA' : 'µA'}`, 'Current']}
                    labelFormatter={(label) => `${label} V`}
                  />
                  
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#22d3ee" 
                    strokeWidth={3} 
                    dot={false}
                    isAnimationActive={false}
                  />

                  {/* Highlight current point */}
                  <ReferenceDot 
                    x={currentVoltage} 
                    y={currentId} 
                    r={6} 
                    fill="#4ade80" 
                    stroke="#0f172a" 
                    strokeWidth={2}
                  />

                  {/* Annotations */}
                  {isForwardBias && (
                    <ReferenceLine x={0.7} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'top', value: 'Knee (0.7V)', fill: '#f59e0b', fontSize: 12 }} />
                  )}
                  {!isForwardBias && (
                    <ReferenceLine y={-0.05} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'bottom', value: 'Leakage ≈ -0.05µA', fill: '#ef4444', fontSize: 12 }} />
                  )}

                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
