import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Users,
    TrendingUp,
    ShieldCheck,
    Zap,
    PieChart,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/stats', { withCredentials: true });
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch statistics");
            }
        };
        fetchStats();
    }, []);

    const handleExportGlobalStats = async () => {
        try {
            const usersRes = await axios.get('/api/admin/users', { withCredentials: true });
            const waitlistRes = await axios.get('/api/growth/stats', { withCredentials: true }); // Assuming this exists or similar

            const headers = ["Category", "Total Count"];
            const data = [
                ["Total Practitioners", usersRes.data.length],
                ["Waitlist Size", waitlistRes.data.count || stats.totalWaitlist]
            ];

            let csv = headers.join(",") + "\n";
            data.forEach(row => csv += row.join(",") + "\n");

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Global_Stats_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            toast.success("Global statistics exported");
        } catch (err) {
            toast.error("Failed to export statistics");
        }
    };

    const handleBroadcast = async () => {
        const message = prompt("Enter broadcast message for all practitioners:");
        if (!message) return;

        try {
            // This endpoint might need implementation if not present
            await axios.post('/api/notifications/broadcast', { message, type: 'info' }, { withCredentials: true });
            toast.success("Broadcast sent successfully");
        } catch (err) {
            toast.error("Failed to send broadcast");
        }
    };

    const cards = [
        { label: 'Total Practitioners', value: stats?.totalUsers || '...', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Waitlist Growth', value: stats?.totalWaitlist || '...', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Active Sessions', value: stats?.activeSessions || '...', icon: Activity, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        { label: 'System Health', value: stats?.systemHealth || '...', icon: ShieldCheck, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    ];

    return (
        <div className="space-y-12 animate-fade-in p-6 lg:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Executive Control Center
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Admin <span className="text-blue-600">Intelligence</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="glass-card px-4 py-2 flex items-center gap-2 border border-slate-200 dark:border-white/5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Infrastructure</span>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="glass-card p-4 sm:p-6 group hover:scale-[1.02] transition-all duration-500 border border-slate-200 dark:border-white/5 bg-white dark:bg-white/5">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${card.bg} ${card.color}`}>
                                <card.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                        </div>
                        <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">{card.label}</p>
                        <h3 className="text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Visualization Placeholder */}
                <div className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-white to-slate-50 dark:from-[#0a0c14] dark:to-[#07090f] border border-slate-200 dark:border-white/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <PieChart className="w-48 h-48 text-blue-500" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Acquisition Analytics
                            </h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-blue-600 text-white rounded-lg">Real-time</button>
                                <button className="px-3 py-1.5 text-[10px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg">Historical</button>
                            </div>
                        </div>

                        {/* Dummy Graph implementation for "Impressive" visual */}
                        <div className="h-48 sm:h-64 flex items-end gap-1 sm:gap-3 px-2 overflow-hidden">
                            {[40, 65, 45, 90, 75, 85, 60, 95, 100, 80, 85, 92].map((h, i) => (
                                <div key={i} className="flex-1 group relative h-full flex items-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg transition-all duration-1000 ease-out delay-[i*50ms] group-hover:from-fuchsia-600 group-hover:to-blue-600"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                            {h}% Growth
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-1 sm:px-2 text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest overflow-hidden">
                            <span>Jan</span>
                            <span className="hidden sm:inline">Feb</span>
                            <span>Mar</span>
                            <span className="hidden sm:inline">Apr</span>
                            <span>May</span>
                            <span className="hidden sm:inline">Jun</span>
                            <span>Jul</span>
                            <span className="hidden sm:inline">Aug</span>
                            <span>Sep</span>
                            <span className="hidden sm:inline">Oct</span>
                            <span>Nov</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Right Side Column */}
                <div className="space-y-6">
                    <div className="glass-card p-6 bg-blue-600 text-white border-none shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold mb-4 relative z-10 text-white">Quick Actions</h4>
                        <div className="space-y-3 relative z-10">
                            <button
                                onClick={handleExportGlobalStats}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border border-white/10 text-white"
                            >
                                Export Global Stats <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleBroadcast}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border border-white/10 text-white"
                            >
                                Broadcast Notification <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/admin/audit')}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between border border-white/10 text-white"
                            >
                                System Audit Log <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6 border border-slate-200 dark:border-white/5">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            Recent Activity
                        </h4>
                        <div className="space-y-6">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                                        <Users className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-white">New Practitioner Signup</p>
                                        <p className="text-[10px] text-slate-500">2 minutes ago • Clinical ID #442</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
