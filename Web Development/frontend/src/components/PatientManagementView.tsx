import { useEffect, useState } from 'react';
import { useAnalysisStore } from '../store/useAnalysisStore';
import { Users, Search, ChevronRight, User, Activity, Calendar, ArrowRight } from 'lucide-react';

interface PatientManagementProps {
    onSelectPatient: (id: string) => void;
}

export function PatientManagementView({ onSelectPatient }: PatientManagementProps) {
    const { history, getHistory } = useAnalysisStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    // Group history by patientId
    const patients = history.reduce((acc: any, record: any) => {
        const id = record.patientId || 'Anonymous';
        if (!acc[id]) {
            acc[id] = {
                id,
                records: [],
                lastAnalysis: record.createdAt,
                count: 0
            };
        }
        acc[id].records.push(record);
        acc[id].count++;
        if (new Date(record.createdAt) > new Date(acc[id].lastAnalysis)) {
            acc[id].lastAnalysis = record.createdAt;
        }
        return acc;
    }, {});

    const patientList = Object.values(patients).filter((p: any) =>
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Patient Management</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Holistic view of your patient population</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search Patient ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patientList.length === 0 ? (
                    <div className="col-span-full py-20 text-center glass-card border-dashed">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No patients found matches your search.</p>
                    </div>
                ) : (
                    patientList.map((patient: any) => (
                        <div
                            key={patient.id}
                            onClick={() => onSelectPatient(patient.id)}
                            className="glass-card p-6 group hover:border-blue-500/30 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                                    <User className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reports</p>
                                    <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                                        {patient.count} Analyses
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1 mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{patient.id}</h3>
                                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase">
                                    <Calendar className="w-3 h-3" />
                                    Last seen: {new Date(patient.lastAnalysis).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. LVEF</p>
                                    <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span className="text-sm">Consistently Stable</span>
                                    </div>
                                </div>
                                <div className="space-y-1 flex flex-col items-end">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Latest Trend</p>
                                    <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                        <span className="text-sm">Follow-up Due</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 flex items-center justify-between px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all group/btn">
                                <span className="text-[10px] font-black uppercase tracking-widest">Open Patient Folder</span>
                                <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
