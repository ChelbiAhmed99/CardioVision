import { useEffect, useMemo } from 'react';
import { useAnalysisStore } from '../store/useAnalysisStore';
import {
    ArrowLeft,
    Calendar,
    Activity,
    Heart,
    FileText,
    TrendingUp,
    ChevronRight,
    ShieldCheck,
    AlertCircle,
    Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PatientDetailViewProps {
    patientId: string;
    onBack: () => void;
    onSelectRecord: (record: any) => void;
}

export function PatientDetailView({ patientId, onBack, onSelectRecord }: PatientDetailViewProps) {
    const { history, getHistory } = useAnalysisStore();

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    const patientRecords = useMemo(() => {
        return history.filter(r => r.patientId === patientId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [history, patientId]);

    const stats = useMemo(() => {
        if (patientRecords.length === 0) return null;

        const efs = patientRecords.map(r => r.metrics?.ejectionFraction || r.metrics?.simpsonEF).filter(Boolean);
        const avgEf = efs.reduce((a, b) => a + b, 0) / efs.length;
        const latestEf = efs[0];
        const trend = efs.length > 1 ? latestEf - efs[efs.length - 1] : 0;

        return {
            avgEf: Math.round(avgEf),
            latestEf: Math.round(latestEf),
            trend: Math.round(trend * 10) / 10,
            totalAnalyses: patientRecords.length,
            lastSeen: patientRecords[0].createdAt
        };
    }, [patientRecords]);

    const generateBilan = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // blue-600
        doc.text("CardioVision Clinical Assessment", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${timestamp}`, 105, 28, { align: "center" });

        // Patient Info
        doc.setDrawColor(226, 232, 240);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Identification:", 20, 45);
        doc.setFont("helvetica", "normal");
        doc.text(`ID: ${patientId}`, 70, 45);

        // Summary Stats
        if (stats) {
            doc.setFont("helvetica", "bold");
            doc.text("Summary Clinical Metrics:", 20, 55);
            doc.setFont("helvetica", "normal");
            doc.text(`Total Analyses: ${stats.totalAnalyses}`, 20, 63);
            doc.text(`Average LVEF: ${stats.avgEf}%`, 20, 71);
            doc.text(`Latest LVEF: ${stats.latestEf}%`, 20, 79);
            doc.text(`Last Follow-up: ${new Date(stats.lastSeen).toLocaleDateString()}`, 20, 87);
        }

        // Table of Records
        const tableData = patientRecords.map((r, i) => [
            `Rev. ${patientRecords.length - i}`,
            new Date(r.createdAt).toLocaleDateString(),
            `${r.metrics?.ejectionFraction || r.metrics?.simpsonEF || '--'}%`,
            `${r.metrics?.gls || '--'}%`,
            r.diagnosis?.problem || 'Unspecified'
        ]);

        autoTable(doc, {
            startY: 95,
            head: [['Revision', 'Date', 'LVEF', 'GLS', 'Primary Diagnosis']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillStyle: 'fill', fillColor: [37, 99, 235], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        // Disclaimer
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("CONFIDENTIAL CLINICAL DOCUMENT", 105, finalY, { align: "center" });
        doc.text("Analysis based on 2025 Speckle Tracking Consensus - Validated AI Intelligence", 105, finalY + 5, { align: "center" });

        doc.save(`Patient_Bilan_${patientId}.pdf`);
    };

    if (patientRecords.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">No records found for this patient.</p>
                <button onClick={onBack} className="mt-4 text-blue-500 font-bold text-xs uppercase hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 hover:bg-blue-600 hover:border-blue-500 group transition-all"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                            Patient: <span className="text-blue-500">{patientId}</span>
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <Calendar className="w-3.5 h-3.5" />
                                History since {new Date(patientRecords[patientRecords.length - 1].createdAt).toLocaleDateString()}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Verified Clinical Folder
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={generateBilan}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export Patient Bilan
                    </button>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20">
                        Active File
                    </div>
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6 bg-blue-600/5 border-blue-500/20 relative overflow-hidden group">
                        <Activity className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/10 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Latest LVEF</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.latestEf}%</h3>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                            <TrendingUp className="w-3 h-3" />
                            {stats.trend > 0 ? `+${stats.trend}% improvement` : stats.trend < 0 ? `${stats.trend}% variance` : 'Stable baseline'}
                        </div>
                    </div>

                    <div className="glass-card p-6 border-slate-200 dark:border-white/5 relative overflow-hidden group">
                        <Heart className="absolute -right-4 -top-4 w-24 h-24 text-cyan-500/10 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Average EF</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.avgEf}%</h3>
                        <p className="mt-2 text-[10px] font-bold text-slate-400">Mean over {stats.totalAnalyses} sessions</p>
                    </div>

                    <div className="glass-card p-6 border-slate-200 dark:border-white/5 relative overflow-hidden group">
                        <FileText className="absolute -right-4 -top-4 w-24 h-24 text-fuchsia-500/10 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Reports</p>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalAnalyses}</h3>
                        <p className="mt-2 text-[10px] font-bold text-slate-400">Comprehensive analyses</p>
                    </div>

                    <div className="glass-card p-6 border-slate-200 dark:border-white/5 relative overflow-hidden group">
                        <Calendar className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500/10 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Analysis</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                            {new Date(stats.lastSeen).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </h3>
                        <p className="mt-2 text-[10px] font-bold text-slate-400">Standard Follow-up</p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
                    Clinical Timeline
                </h3>

                <div className="grid gap-4">
                    {patientRecords.map((record, index) => (
                        <div
                            key={record._id}
                            onClick={() => onSelectRecord(record)}
                            className="glass-card p-6 hover:border-blue-500/30 transition-all cursor-pointer group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-blue-500 uppercase">Rev.{patientRecords.length - index}</span>
                                    <div className="w-px h-8 bg-slate-200 dark:bg-white/10 my-1"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {new Date(record.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10">
                                            {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Diagnosis: <span className="text-slate-700 dark:text-slate-300">{record.diagnosis?.problem || 'Unspecified'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">LVEF</p>
                                    <p className={`text-xl font-black ${(record.metrics?.ejectionFraction || record.metrics?.simpsonEF) < 45 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {record.metrics?.ejectionFraction || record.metrics?.simpsonEF || '--'}%
                                    </p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">GLS</p>
                                    <p className="text-xl font-black text-blue-500">{record.metrics?.gls || '--'}%</p>
                                </div>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
