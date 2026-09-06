import StatusDot from "./StatusDot";
import type { SystemComponent } from "../../lib/types";

export default function ServiceTile({ component }: { component: SystemComponent }) {
  const isHealthy = component.status === "healthy";
  
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <StatusDot status={isHealthy ? 'success' : 'danger'} animate={isHealthy} />
        <div>
          <h4 className="text-sm font-semibold text-slate-800">{component.name}</h4>
          <p className="text-xs text-slate-500">Uptime: {component.uptime}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold font-mono text-slate-800">{component.latency_ms}ms</div>
        <div className="text-[10px] text-slate-400 font-medium">Latency</div>
      </div>
    </div>
  );
}
