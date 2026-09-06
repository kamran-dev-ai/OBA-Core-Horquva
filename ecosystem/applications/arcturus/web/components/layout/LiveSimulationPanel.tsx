"use client";

import { Activity, Pause, Play, Square, Loader2 } from "lucide-react";
import ProgressBar from "../ui/ProgressBar";
import { useSimulationStream } from "../../hooks/useSimulationStream";
import { dashboardApi, experimentApi } from "../../lib/api-client";
import { useState, useEffect } from "react";

export default function LiveSimulationPanel() {
  const [activeExpId, setActiveExpId] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getActiveSimulation().then(data => {
      if (data?.experiment_id) {
        setActiveExpId(data.experiment_id);
      }
    });
  }, []);

  const { currentTick, status, worldState } = useSimulationStream(activeExpId);
  
  if (!activeExpId) {
    return (
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs font-medium text-slate-500 text-center">
        No active simulation running
      </div>
    );
  }

  const isRunning = status === 'RUNNING';
  
  // Hardcoded for demo, normally from backend config
  const totalTicks = 100; 
  const progress = (currentTick / totalTicks) * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${isRunning ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-semibold text-slate-800">Run: {activeExpId.slice(0,8)}</span>
        </div>
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isRunning ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
          {status}
        </span>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-slate-800">{Math.round(progress)}% ({currentTick}/{totalTicks})</span>
          </div>
          <ProgressBar progress={progress} color="var(--brand-primary)" />
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Budget Burn</div>
            <div className="font-mono text-xs font-bold text-slate-800">${worldState?.kpis?.budget_burn_rate?.toLocaleString() ?? 0} <span className="text-[10px] font-normal text-slate-400">/tk</span></div>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider mb-0.5">Active Tasks</div>
            <div className="font-mono text-xs font-bold text-slate-800">{Object.values(worldState?.departments || {}).reduce((sum: number, d: any) => sum + (d.active_tasks || 0), 0)}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button 
            onClick={async () => {
              if (activeExpId) {
                if (isRunning) {
                  await experimentApi.pauseSimulation(activeExpId);
                } else {
                  await experimentApi.resumeSimulation(activeExpId);
                }
              }
            }}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isRunning ? 'Pause' : 'Resume'}
          </button>
          <button 
            onClick={() => setActiveExpId(null)}
            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
