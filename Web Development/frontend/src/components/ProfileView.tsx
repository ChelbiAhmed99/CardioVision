import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Shield, Save, Camera, Briefcase, FileText } from 'lucide-react';

export function ProfileView() {
    const { authUser, updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        fullName: authUser?.fullName || '',
        specialty: authUser?.specialty || 'Cardiologist',
        bio: authUser?.bio || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile(formData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 dark:text-white tracking-tighter">My Profile</h2>
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px] mt-1">Manage your professional identity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 flex flex-col items-center text-center">
                        <div className="relative group mb-6">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                                {formData.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <button className="absolute bottom-[-10px] right-[-10px] p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 text-blue-500 hover:scale-110 transition-transform">
                                <Camera className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{formData.fullName}</h3>
                        <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest mt-1">{formData.specialty}</p>
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 w-full flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail className="w-4 h-4" />
                                <span className="text-xs font-medium">{authUser?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <Shield className="w-4 h-4 text-emerald-500" />
                                <span className="text-xs font-medium">Verified Expert</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Specialty</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 transition-all dark:text-white resize-none"
                                    placeholder="Brief description of your expertise..."
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
