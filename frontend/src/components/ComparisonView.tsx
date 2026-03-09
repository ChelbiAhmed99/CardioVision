import React from 'react';
import { Activity, ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface ComparisonViewProps {
    analysis1: any;
    analysis2: any;
    onClose: () => void;
}

export function ComparisonView({ analysis1, analysis2, onClose }: ComparisonViewProps) {
    const getDelta = (v1: number, v2: number) => {
        const diff = v2 - v1;
        const percent = ((v2 - v1) / v1) * 100;
        return { diff: diff.toFixed(1), percent: percent.toFixed(1) };
    };

    const renderMetricRow = (label: string, v1: number, v2: number, unit: string = '%') => {
        const delta = getDelta(v1, v2);
        const isImproved = label.includes('GLS') ? v2 < v1 : v2 > v1;
        const isNeutral = Math.abs(parseFloat(delta.diff)) < 0.5;

        return (
            <div className="grid grid-cols-4 gap-4 py-4 border-b border-slate-200 dark:border-white/5 items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</span>
                <div className="text-center">
                    <span className="text-lg font-display font-black text-slate-900 dark:text-white">{v1}{unit}</span>
                </div>
                <div className="text-center">
                    <span className="text-lg font-display font-black text-slate-900 dark:text-white">{v2}{unit}</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                    {isNeutral ? (
                        <Minus className="w-4 h-4 text-slate-400" />
                    ) : isImproved ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-bold ${isNeutral ? 'text-slate-400' : isImproved ? 'text-emerald-500' : 'text-red-500'}`}>
                        {delta.diff}{unit}
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in p-2">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Comparative Analysis</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Longitudinal Delta Assessment</p>
                </div>
                <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white transition-all border border-slate-200 dark:border-white/10"
                >
                    Exit Comparison
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Previous Session */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-t-2xl border-t border-x border-slate-200 dark:border-white/10">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Baseline Session</span>
                    </div>
                    <div className="glass-card aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                        <img src="/api/placeholder/400/300" alt="Baseline" className="opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Baseline Echo Sequence</p>
                        </div>
                    </div>
                </div>

                {/* Current Session */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-blue-600/10 rounded-t-2xl border-t border-x border-blue-500/20">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Latest Assessment</span>
                    </div>
                    <div className="glass-card aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                        <img src="/api/placeholder/400/300" alt="Current" className="opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest">Follow-up Echo Sequence</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 border-slate-200 dark:border-white/5">
                <div className="grid grid-cols-4 gap-4 pb-4 border-b border-slate-200 dark:border-white/10 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biological Marker</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400">Baseline</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-center text-slate-400">Follow-up</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-right text-slate-400">Variance</span>
                </div>

                {renderMetricRow('Simpson\'s EF', analysis1.metrics?.simpsonEF || 55, analysis2.metrics?.simpsonEF || 52)}
                {renderMetricRow('Global L. Strain', analysis1.metrics?.gls || -18.5, analysis2.metrics?.gls || -16.2)}
                {renderMetricRow('LV EDV', analysis1.metrics?.edVolume || 120, analysis2.metrics?.edVolume || 125, 'mL')}
                {renderMetricRow('LV ESV', analysis1.metrics?.esVolume || 54, analysis2.metrics?.esVolume || 60, 'mL')}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass-card p-6 bg-slate-100/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        Baseline Diagnosis
                    </h4>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">"{analysis1.diagnosis?.problem || 'Stable baseline function detected.'}"</p>
                </div>
                <div className="glass-card p-6 bg-blue-600/[0.03] border-blue-500/10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-3.5 h-3.5" />
                        Follow-up Deviation
                    </h4>
                    <p className="text-sm font-bold text-slate-900 dark:text-white italic">"{analysis2.diagnosis?.problem || 'Slight progression in wall motion abnormality.'}"</p>
                </div>
            </div>
        </div>
    );
}
