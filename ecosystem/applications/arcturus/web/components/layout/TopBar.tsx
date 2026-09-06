import { Search, Bell, Settings, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white shrink-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search experiments, runs, or insights..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-slate-500">
        <button className="p-2 hover:bg-slate-100 rounded-full relative text-slate-600 transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors" aria-label="Settings">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button className="flex items-center gap-2.5 hover:bg-slate-50 p-1 pr-3 rounded-full border border-slate-200 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Admin</span>
        </button>
      </div>
    </header>
  );
}
