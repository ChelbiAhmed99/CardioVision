import React, { useState, useEffect } from 'react';
import {
    Settings,
    Shield,
    Database,
    Globe,
    Bell,
    Save,
    RefreshCw,
    Lock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const SiteSettings: React.FC = () => {
    const [config, setConfig] = useState<any>({
        siteName: 'CardioVision',
        maintenanceMode: false,
        allowSignups: true,
        requireEmailVerification: true,
        maxUploadSize: 50,
        apiRateLimit: 100
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('/api/admin/settings', { withCredentials: true });
                if (response.data) setConfig(response.data);
            } catch (err) {
                toast.error("Failed to load clinical settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await axios.put('/api/admin/settings', config, { withCredentials: true });
            toast.success("System configurations synchronized");
        } catch (err) {
            toast.error("Critical: Failed to sync configurations");
        }
    };

    if (loading) return (
        <div className="h-full flex items-center justify-center p-20">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in p-6 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">
                        <Settings className="w-3.5 h-3.5" />
                        Infrastructure Control
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        Site <span className="text-blue-600">Configurations</span>
                    </h2>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <Save className="w-4 h-4" />
                    Apply Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="glass-card p-8 border border-slate-200 dark:border-white/5 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" />
                            General Environment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Name</label>
                                <input
                                    type="text"
                                    value={config.siteName}
                                    onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Max Video Upload (MB)</label>
                                <input
                                    type="number"
                                    value={config.maxUploadSize}
                                    onChange={(e) => setConfig({ ...config, maxUploadSize: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">Disable public access during updates</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-fuchsia-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">New Practitioner Signups</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest">Allow clinicians to create new accounts</p>
                                </div>
                                <button
                                    onClick={() => setConfig({ ...config, allowSignups: !config.allowSignups })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${config.allowSignups ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.allowSignups ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="glass-card p-8 border border-slate-200 dark:border-white/5 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            Security Protocol
                        </h3>
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-500">End-to-End Encryption Active</p>
                                <p className="text-[10px] text-emerald-600/60 uppercase font-black tracking-widest">SSL/TLS 1.3 enforced across all nodes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Database Info */}
                    <div className="glass-card p-6 border border-slate-200 dark:border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                            <Database className="w-3.5 h-3.5" />
                            Storage Cluster
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                                    <span className="text-slate-400">Database Size</span>
                                    <span className="text-white">1.2 GB / 5 GB</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[24%] bg-blue-500"></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 hover:bg-white/10 transition-colors rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <RefreshCw className="w-3.5 h-3.5" />
                                Optimization Sync
                            </button>
                        </div>
                    </div>

                    {/* Notification Config */}
                    <div className="glass-card p-6 border border-slate-200 dark:border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5" />
                            Alert Routing
                        </h4>
                        <div className="space-y-3">
                            {['Critical Errors', 'New Signups', 'System Performance', 'Security Alerts'].map((label) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
                                    <input type="checkbox" defaultChecked className="accent-blue-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
