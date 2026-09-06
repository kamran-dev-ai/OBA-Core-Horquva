import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick?: () => void;
  primary?: boolean;
}

export default function QuickActionButton({ icon: Icon, label, description, onClick, primary = false }: QuickActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all flex flex-col gap-3 group
        ${primary 
          ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-sm' 
          : 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300 hover:shadow-sm'
        }`}
    >
      <div className={`p-2 rounded-lg w-fit transition-colors ${primary ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-50'}`}>
        <Icon className={`w-5 h-5 ${primary ? 'text-white' : 'text-indigo-600'}`} />
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-0.5">{label}</h4>
        <p className={`text-xs ${primary ? 'text-indigo-100' : 'text-slate-500'}`}>{description}</p>
      </div>
    </button>
  );
}
