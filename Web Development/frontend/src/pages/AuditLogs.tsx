import React, { useEffect, useState } from 'react';
import {
    History,
    Search,
    Filter,
    Activity,
    User,
    Info,
    Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('/api/admin/audit-logs', { withCredentials: true });
                setLogs(response.data);
            } catch (err) {
                toast.error("Failed to load audit history");
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const getActionColor = (action: string) => {
        if (action.includes('DELETE')) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (action.includes('UPDATE')) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    return (
        <div className="space-y-8 animate-fade-in p-6 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">
                        <History className="w-3.5 h-3.5" />
                        System Forensics
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Audit <span className="text-blue-600">Trails</span>
                    </h2>
                </div>
            </div>

            <div className="glass-card border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by admin or action..."
                            className="w-full bg-white dark:bg-[#07090f] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Administrator</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Action Type</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject/Details</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{log.adminName}</p>
                                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium tracking-tighter italic">{log.ipAddress || 'Internal Cluster'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${getActionColor(log.action)}`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 max-w-md">
                                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">{log.details}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-900 dark:text-white tracking-widest">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium font-display">No administrative activity recorded.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
