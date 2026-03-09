import { Info } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  description?: string;
}

export function MetricCard({ title, value, unit, icon, description }: MetricCardProps) {
  const getStatus = (val: number, t: string) => {
    if (t.includes("Ejection Fraction")) {
      if (val <= 40) return { label: "Reduced (HFrEF)", color: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" };
      if (val < 52) return { label: "Mildly Reduced (HFmrEF)", color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" };
      if (val > 75) return { label: "Hyperdynamic", color: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" };
      return { label: "Normal (ASE Standard)", color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" };
    }
    if (t.includes("Strain")) {
      if (val > -16) return { label: "Reduced", color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" };
      return { label: "Normal", color: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" };
    }
    if (t === "EDV") {
      if (val > 150) return { label: "Dilated", color: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" };
      return { label: "Normal", color: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" };
    }
    return { label: "Active", color: "bg-slate-300 shadow-none" };
  };

  const status = getStatus(value, title);

  return (
    <div className="glass-card p-6 flex items-center gap-6 relative group overflow-hidden border-white/5 hover:border-blue-500/30 transition-all duration-300">
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
        <div className="text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">
          {icon}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1 group/info">
          <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">{title}</p>
          {description && (
            <div className="relative has-tooltip">
              <Info className="w-3 h-3 text-slate-400 cursor-help" />
              <div className="tooltip-custom bottom-full left-1/2 -translate-x-1/2 mb-2 w-48">
                {description}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
            {value.toFixed(1)}
          </h4>
          <span className="text-sm font-bold text-blue-400 opacity-60 uppercase">{unit}</span>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden flex">
            {title.includes("Ejection Fraction") ? (
              <>
                <div className="h-full bg-red-500/20 w-[40%] border-r border-white/10"></div>
                <div className="h-full bg-amber-500/20 w-[10%] border-r border-white/10"></div>
                <div className="h-full bg-emerald-500/20 w-[25%] border-r border-white/10"></div>
                <div className="h-full bg-yellow-500/20 w-[25%]"></div>
              </>
            ) : (
              <div className="h-full bg-blue-500/20 w-full"></div>
            )}
          </div>
          <div className="relative h-1 w-full -mt-2.5">
            <div
              className={`absolute h-1 rounded-full transition-all duration-1000 ease-out ${status.color.split(' ')[0]}`}
              style={{ width: `${Math.min(value, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}