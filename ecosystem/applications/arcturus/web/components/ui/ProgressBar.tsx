interface ProgressBarProps {
  progress: number;
  color?: string;
  className?: string;
}

export default function ProgressBar({ progress, color = "var(--brand-primary)", className = "" }: ProgressBarProps) {
  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60 ${className}`}>
      <div 
        className="h-full transition-all duration-500 ease-out rounded-full" 
        style={{ width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: color }}
      />
    </div>
  );
}
