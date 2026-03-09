import React, { useEffect, useState } from 'react';
import {
    MessageSquare,
    Star,
    CheckCircle2,
    User as UserIcon,
    TrendingUp,
    Search,
    Filter,
    ArrowRight,
    Briefcase,
    GraduationCap,
    Stethoscope
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const FeedbackView: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get('/api/admin/feedback-stats', { withCredentials: true });
                setStats(response.data);
            } catch (err) {
                toast.error("Failed to load feedback analysis");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    const filteredEntries = stats?.entries?.filter((f: any) =>
        f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.profile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.suggestions?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Helper to get icon for profile
    const getProfileIcon = (profile: string) => {
        if (profile?.toLowerCase().includes('étudiant')) return GraduationCap;
        if (profile?.toLowerCase().includes('cardiologue')) return Stethoscope;
        return Briefcase;
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* KPI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Submissions</span>
                    </div>
                    <div className="text-4xl font-display font-black text-slate-900 dark:text-white">
                        {stats?.count || 0}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Aggregate from Fillout Form 1</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Star className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Global Usefulness</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        High Sentiment
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Majority rated "Very Useful"</p>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-fuchsia-500">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-500">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Actionable Suggestions</span>
                    </div>
                    <div className="text-4xl font-display font-black text-slate-900 dark:text-white">
                        {stats?.entries?.filter((f: any) => f.suggestions?.length > 10).length || 0}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">Detailed user feedback items</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Breakdown */}
                <div className="glass-card p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-blue-500" />
                        Professional Profiles
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats?.profiles || {}).map(([profile, count]: any) => {
                            const Icon = getProfileIcon(profile);
                            return (
                                <div key={profile} className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-colors hover:border-blue-500/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-32">{profile}</span>
                                        </div>
                                        <span className="text-xs font-black text-blue-500">{count}</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-200 dark:bg-white/10 rounded-full">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(count / stats.count) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search suggestions, emails or profiles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>

                    <div className="space-y-4">
                        {filteredEntries.map((f: any) => (
                            <div key={f.id} className="glass-card p-6 hover:border-blue-500/30 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                            {f.email ? f.email.substring(0, 2).toUpperCase() : '??'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                {f.email || "Anonymous Clinician"}
                                            </h4>
                                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                                                {f.profile} • {f.experienceLevel}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black">
                                            <CheckCircle2 className="w-3 h-3" />
                                            {f.usefulness}
                                        </div>
                                    </div>
                                </div>
                                {f.suggestions && (
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed">
                                            "{f.suggestions}"
                                        </p>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="text-[10px] font-bold text-slate-400">
                                        EF Familiarity: <span className="text-slate-600 dark:text-slate-300">{f.familiarityEF}</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400">
                                        GLS Familiarity: <span className="text-slate-600 dark:text-slate-300">{f.familiarityGLS}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
