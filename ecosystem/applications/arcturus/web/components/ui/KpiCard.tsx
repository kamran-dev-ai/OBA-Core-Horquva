import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Sparkline from "./Sparkline";
import type { KpiMetric } from "../../lib/types";

export default function KpiCard({ metric }: { metric: KpiMetric }) {
  const isUp = metric.trendDirection === "up";
  const isDown = metric.trendDirection === "down";
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.label}</h3>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
          metric.status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
          metric.status === 'danger' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
          'bg-indigo-50 text-indigo-700 border border-indigo-200'
        }`}>
          {isUp && <TrendingUp className="w-3 h-3" />}
          {isDown && <TrendingDown className="w-3 h-3" />}
          {!isUp && !isDown && <Minus className="w-3 h-3" />}
          {metric.trend}
        </span>
      </div>
      
      <div className="flex items-end justify-between mt-3">
        <div className="text-3xl font-bold font-heading text-slate-900">
          {metric.value}
        </div>
        <div className="w-24">
          <Sparkline 
            data={metric.sparkline} 
            color={metric.status === 'success' ? '#10b981' : metric.status === 'danger' ? '#ef4444' : '#4f46e5'} 
          />
        </div>
      </div>
    </div>
  );
}
