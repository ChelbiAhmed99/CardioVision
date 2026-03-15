import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Target,
    Zap,
    AlertCircle,
    Info,
    Activity,
    Layers,
    Shield,
    BrainCircuit,
    Sparkles,
    DollarSign,
    TrendingUp
} from 'lucide-react';

// --- Re-Scaled Custom SVG Analytics ---

const DonutChart: React.FC<{ data: { label: string; count: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, curr) => acc + curr.count, 0);
    let cumulativePercent = 0;

    return (
        <div className="relative flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-white/[0.02] rounded-[2rem] border border-white/20 backdrop-blur-xl group hover:shadow-xl transition-all duration-700">
            <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90 filter drop-shadow-xl">
                {data.map((item, i) => {
                    const percent = (item.count / total) * 100;
                    const dashArray = `${percent} ${100 - percent}`;
                    const dashOffset = -cumulativePercent;
                    cumulativePercent += percent;
                    return (
                        <circle
                            key={i}
                            cx="50"
                            cy="50"
                            r="42"
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="9"
                            strokeDasharray={dashArray}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out hover:stroke-white dark:hover:stroke-slate-400 cursor-pointer"
                        />
                    );
                })}
                <circle cx="50" cy="50" r="34" className="fill-white dark:fill-slate-900 shadow-inner" />
            </svg>
            <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-2xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none mb-1">{total}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Total N</span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 w-full px-2">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full shadow-md" style={{ backgroundColor: item.color }}></div>
                            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-black text-slate-900 dark:text-white block tabular-nums">{Math.round((item.count / total) * 100)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdvancedMasteryChart: React.FC<{ data: { label: string; pct: number; color: string; note: string; sub: string }[] }> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.map((item, i) => (
                <div key={i} className="p-8 bg-slate-50/50 dark:bg-white/[0.01] rounded-[2.5rem] border border-slate-100 dark:border-white/[0.05] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full opacity-40" style={{ backgroundColor: item.color }}></div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <h4 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tight">{item.label}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.sub}</p>
                            </div>
                            <div className="text-3xl font-black italic tabular-nums tracking-tighter" style={{ color: item.color }}>{item.pct}%</div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-3.5 w-full bg-slate-200/50 dark:bg-white/5 rounded-2xl overflow-hidden shadow-inner flex p-0.5">
                                <div
                                    className="h-full rounded-xl transition-all duration-1000 ease-out shadow-lg"
                                    style={{
                                        width: `${item.pct}%`,
                                        backgroundColor: item.color,
                                        boxShadow: `0 0 15px ${item.color}33`
                                    }}
                                ></div>
                            </div>
                            <div className="flex items-start gap-2.5 p-3.5 bg-white dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/[0.04]">
                                <Info size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">{item.note}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const GrowthDashboard: React.FC = () => {
    const [realStats, setRealStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/growth/stats', { withCredentials: true });
                setRealStats(response.data);
            } catch (err) {
                console.error("Failed to fetch growth stats");
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Waitlist Total', value: realStats?.count || '58', sub: 'Qualified Leads', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
        { label: 'Conversion Rate', value: `${realStats?.conversion_rate || '44.6'}%`, sub: 'Benchmark Pro', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
        { label: 'Current MRR', value: '$12,450', sub: 'Recurring', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        { label: 'Projected LTV', value: '$3,200', sub: 'Per Clinical Client', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-600/10' },
    ];

    const profileData = [
        { label: 'Étudiants', count: 57, color: '#6366F1' },
        { label: 'Praticiens', count: 1, color: '#10B981' },
    ];

    const masteryData = [
        { label: 'Fraction d’Éjection (EF)', pct: 50, color: '#3B82F6', sub: 'Calcul Manuel', note: 'Standard actuel majoritairement maîtrisé en théorie.' },
        { label: 'Global Strain (GLS)', pct: 15, color: '#F59E0B', sub: 'Paramètre Avancé', note: 'Paramètre pronostique peu maîtrisé. Besoin d\'automatisation.' },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFF] dark:bg-[#020617] p-6 lg:p-10 font-sans selection:bg-indigo-500/30">
            {/* Optimized Header: Medium Scaling */}
            <div className="max-w-[1400px] mx-auto mb-12 px-4">
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 py-10 border-b-2 border-slate-100 dark:border-white/5 relative">
                    <div className="space-y-5 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-white flex items-center justify-center text-white dark:text-indigo-600 text-xl font-black italic shadow-xl">CV</div>
                            <div className="h-8 w-[1.5px] bg-slate-200 dark:bg-white/10 mx-1"></div>
                            <div className="space-y-0.5">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 block">Clinical Intelligence Unit</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block italic">Rapport v2.4</span>
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight uppercase">
                            Clinical <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-indigo-800 italic">Validation Analytics.</span>
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed italic">
                            Analyse de performance CardioVision auprès des professionnels de santé.
                        </p>
                    </div>
                </header>
            </div>

            <main className="max-w-[1400px] mx-auto space-y-10 px-4">
                {/* Executive Status Grid: Medium Scaling */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="group relative p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden">
                            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner group-hover:rotate-6 transition-transform duration-700`}>
                                    <stat.icon size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums italic">{stat.value}</h3>
                                    <p className="text-[9px] font-bold text-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10 px-3 py-1 rounded-full inline-block uppercase tracking-widest">{stat.sub}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Primary Analysis (8 Columns) */}
                    <div className="lg:col-span-8 space-y-10">
                        <section className="p-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-100 dark:border-white/5 pb-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                                        <Activity className="text-indigo-600" size={24} /> Maîtrise des Paramètres
                                    </h2>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-10">Identification de l'écart de compétence clinique.</p>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                                    <span className="text-[10px] font-black uppercase tracking-widest">n=58 Responses</span>
                                </div>
                            </div>

                            <AdvancedMasteryChart data={masteryData} />

                            <div className="mt-12 p-8 bg-indigo-600 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl">
                                <BrainCircuit className="absolute -right-8 -bottom-8 w-36 h-36 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="shrink-0">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"><AlertCircle size={28} /></div>
                                    </div>
                                    <div className="space-y-2 text-center md:text-left">
                                        <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-200">Main Insight</h4>
                                        <p className="text-xl font-black italic leading-tight tracking-tight">
                                            L'automatisation sécurise le diagnostic face au déficit de maîtrise du GLS.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="p-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl relative overflow-hidden">
                            <Sparkles className="absolute top-8 right-8 text-emerald-500/20" size={48} />
                            <div className="space-y-10">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-4">
                                        <Layers className="text-emerald-500" size={24} /> Strategic Advantage
                                    </h2>
                                    <h3 className="text-lg font-black italic text-slate-600 dark:text-slate-300 ml-10 uppercase tracking-tighter">Standard de Soin Optimisé</h3>
                                </div>
                                <p className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight max-w-3xl italic">
                                    "CardioVision démocratise l'accès aux paramètres cardiaques de pointe."
                                </p>
                                <div className="flex gap-3">
                                    <span className="px-5 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Innovation</span>
                                    <span className="px-5 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Accuracy</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Secondary Data (4 Columns) */}
                    <div className="lg:col-span-4 space-y-10">
                        <section className="p-10 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-xl space-y-10">
                            <div className="space-y-2 text-center">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600 block mb-1">Participant Profiles</h4>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Répartition des Répondants</h3>
                            </div>
                            <DonutChart data={profileData} />
                        </section>

                        <section className="space-y-6">
                            <div className="p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-lg relative group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white italic font-black text-xs shadow-lg shadow-indigo-600/20">GP</div>
                                    <div className="space-y-px">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Praticien Senior</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Insight Médical</p>
                                    </div>
                                </div>
                                <p className="text-base font-bold italic text-slate-600 dark:text-slate-300 leading-snug border-l-4 border-indigo-600/30 pl-5">
                                    "Besoin de formation rapide sur l’interprétation pour non-cardiologues."
                                </p>
                            </div>

                            <div className="p-8 bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-lg relative group">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white italic font-black text-xs shadow-lg shadow-blue-600/20">ST</div>
                                    <div className="space-y-px">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Étudiant Interne</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">Insight Académique</p>
                                    </div>
                                </div>
                                <p className="text-base font-bold italic text-slate-600 dark:text-slate-300 leading-snug border-l-4 border-blue-600/30 pl-5">
                                    "Renforcer le rôle des paramètres avancés (GLS)."
                                </p>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Brand Footprint */}
                <footer className="pt-24 pb-12 flex flex-col items-center text-center gap-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-black italic shadow-xl">CV</div>
                        <span className="text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase tracking-[0.1em]">CardioVision <span className="text-indigo-600 italic">Analytica</span></span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">
                        <span className="flex items-center gap-2"><Shield size={12} /> Certified Quality</span>
                        <span className="flex items-center gap-2"><Shield size={12} /> AI Transparency</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};
