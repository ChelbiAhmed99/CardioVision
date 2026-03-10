import { useEffect, useState } from 'react';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { Calendar, User, ChevronRight, FileText, Loader, CheckCircle2, Circle, Search, Download } from 'lucide-react';

interface HistoryViewProps {
    onCompare?: (records: any[]) => void;
}

export function HistoryView({ onCompare }: HistoryViewProps) {
    const { history, getHistory, isFetchingHistory } = useAnalysisStore();
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    const handleSelect = (record: any) => {
        // Use record._id as the unique identifier for selection
        if (selectedRecords.find(r => r._id === record._id)) {
            setSelectedRecords(selectedRecords.filter(r => r._id !== record._id));
        } else if (selectedRecords.length < 2) {
            setSelectedRecords([...selectedRecords, record]);
        }
    };

    const handleCompare = () => {
        if (onCompare && selectedRecords.length === 2) {
            onCompare(selectedRecords);
        }
    };

    const handleExportCSV = () => {
        const headers = ["Patient ID", "Date", "Ejection Fraction (%)", "GLS (%)", "ED Volume (mL)", "ES Volume (mL)", "Diagnosis"];
        const rows = filteredHistory.map(r => [
            r.patientId || "Anonymous",
            new Date(r.createdAt).toLocaleDateString(),
            r.metrics?.ejectionFraction || r.metrics?.simpsonEF || "",
            r.metrics?.gls || "",
            r.metrics?.edVolume || "",
            r.metrics?.esVolume || "",
            r.diagnosis?.problem || ""
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `cardiovision_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredHistory = history.filter(record =>
        record.patientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.diagnosis?.problem?.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming diagnosis is an object with a 'problem' field
    );

    if (isFetchingHistory) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Records...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Analysis History</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Longitudinal Patient Tracking</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Patient ID or Diagnosis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all dark:text-white"
                        />
                    </div>
                    {selectedRecords.length > 0 && (
                        <button
                            onClick={handleCompare}
                            disabled={selectedRecords.length !== 2}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedRecords.length === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-white/10'}`}
                        >
                            Compare {selectedRecords.length}/2
                        </button>
                    )}
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 hover:bg-slate-200 transition-all"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export All CSV
                    </button>
                    <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                        <span className="text-xs font-bold text-blue-500">{filteredHistory.length} Records Found</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredHistory.length === 0 ? (
                    <div className="glass-card p-12 sm:p-20 text-center border-dashed border-2 border-slate-200 dark:border-white/5">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-white/10 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium font-display">No clinical records found matches your search.</p>
                    </div>
                ) : (
                    filteredHistory.map((record) => (
                        <div
                            key={record._id}
                            onClick={() => handleSelect(record)}
                            className={`glass-card p-4 sm:p-6 transition-all group cursor-pointer border-2 ${selectedRecords.find(r => r._id === record._id) ? 'border-blue-500 bg-blue-600/5' : 'border-slate-200 dark:border-white/5 hover:border-blue-500/30'}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                                <div className="flex items-center gap-4 min-w-0 sm:min-w-[200px]">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 ${selectedRecords.find(r => r._id === record._id) ? 'text-blue-500' : 'text-slate-300 dark:text-white/10 group-hover:text-blue-500'}`}>
                                        {selectedRecords.find(r => r._id === record._id) ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                    </div>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-colors shrink-0">
                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">Patient Identity</p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{record.patientId || 'Anonymous_ID'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 flex-1 border-t border-b sm:border-none border-slate-100 dark:border-white/5 py-3 sm:py-0">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">EF</p>
                                        <p className="text-base sm:text-lg font-display font-black text-emerald-500">{record.metrics?.ejectionFraction || record.metrics?.simpsonEF || '--'}%</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GLS</p>
                                        <p className="text-base sm:text-lg font-display font-black text-blue-500">{record.metrics?.gls || '--'}%</p>
                                    </div>
                                    <div className="hidden xl:block">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Primary Diagnosis</p>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{record.diagnosis?.problem || 'Not Specified'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                    <div className="text-left sm:text-right">
                                        <div className="flex items-center sm:justify-end gap-2 text-slate-500 text-[9px] font-bold uppercase">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(record.createdAt).toLocaleDateString()}
                                        </div>
                                        <p className="text-[9px] text-slate-400 mt-0.5">{new Date(record.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all shrink-0">
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
