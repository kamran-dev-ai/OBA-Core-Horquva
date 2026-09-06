import { BrainCircuit, AlertTriangle, Lightbulb, Activity } from "lucide-react";
import type { Insight } from "../../lib/types";
import { formatDistanceToNow } from "date-fns";

export default function InsightCard({ insight }: { insight: Insight }) {
  const getIcon = () => {
    switch (insight.type) {
      case "optimization": return <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />;
      case "risk": return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />;
      case "anomaly": return <Activity className="w-4 h-4 text-purple-500 shrink-0" />;
      default: return <BrainCircuit className="w-4 h-4 text-indigo-500 shrink-0" />;
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="flex gap-2.5">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-700 mb-2 leading-relaxed">
            {insight.content}
          </p>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500 flex items-center gap-1">
              Confidence: <span className="font-semibold text-slate-800">{Math.round(insight.confidence * 100)}%</span>
            </span>
            <span className="text-slate-400">
              {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
