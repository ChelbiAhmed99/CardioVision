import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus, Mail, Lock, User, Activity, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const { signup, isSigningUp } = useAuthStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signup(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#07090f] transition-colors duration-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-6 shadow-xl shadow-blue-600/5 group">
                        <Activity className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Create <span className="text-blue-500">Account</span>
                    </h1>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">Medical Professional Registration</p>
                </div>

                <div className="glass-card p-8 border-slate-200 dark:border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all dark:text-white"
                                    placeholder="Dr. John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all dark:text-white"
                                    placeholder="name@hospital.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all dark:text-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-slate-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-slate-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-premium flex items-center justify-center gap-3 py-4"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Register Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-slate-500 font-medium">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 font-bold hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
