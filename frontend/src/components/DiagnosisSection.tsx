import { AlertCircle, Heart, Stethoscope, Activity, ShieldCheck } from 'lucide-react';

interface DiagnosisSectionProps {
  ejectionFraction: number;
  problem: string;
  cause: string;
  cure: string;
  prognosticInsight: string;
}

export function DiagnosisSection({
  ejectionFraction,
  problem,
  cause,
  cure,
  prognosticInsight
}: DiagnosisSectionProps) {
  const getSeverity = (ef: number) => {
    if (ef <= 40) return 'severe';
    if (ef > 40 && ef < 50) return 'moderate';
    return 'normal';
  };

  const severity = getSeverity(ejectionFraction);

  const severityThemes = {
    severe: {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-400",
      glow: "shadow-red-500/20"
    },
    moderate: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "shadow-amber-500/20"
    },
    normal: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/20"
    }
  };

  const theme = severityThemes[severity];

  return (
    <div className="glass-card p-10 relative overflow-hidden group border-white/5">
      <div className={`absolute top-0 right-0 w-80 h-80 ${theme.bg} rounded-full blur-[120px] pointer-events-none transition-colors duration-700`}></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center shadow-lg ${theme.glow}`}>
            <Stethoscope className={`w-7 h-7 ${theme.text}`} />
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-white tracking-tighter">Clinical Diagnosis</h2>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Validated AI Intelligence</p>
            </div>
          </div>
        </div>

        <div className={`px-6 py-2.5 rounded-2xl ${theme.bg} border ${theme.border} backdrop-blur-md`}>
          <p className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>Status: {severity}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {[
          { icon: Heart, color: "blue", title: "Primary Findings", content: problem, detail: cause },
          { icon: AlertCircle, color: "cyan", title: "Recommended Action", content: "Therapeutic Plan", detail: cure },
          { icon: Activity, color: "fuchsia", title: "Prognostic Risk", content: "Future Outlook", detail: prognosticInsight }
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-[28px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mb-5`}>
              <item.icon className={`w-5 h-5 text-${item.color}-400`} />
            </div>
            <h3 className="text-white font-display font-bold text-lg mb-1 tracking-tight">{item.title}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{item.content}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium max-w-sm">
              Clinical validation required. Algorithms based on 2025 Speckle Tracking Consensus.
            </p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
            Download PDF Report →
          </button>
        </div>
      </div>
    </div>
  );
}
