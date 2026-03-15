import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { UserPlus, Mail, Lock, User, Activity, Eye, EyeOff, Check, Crown, Zap, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SignupPage() {
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        plan: ""
    });
    const { signup, isSigningUp } = useAuthStore();

    const tiers = [
        {
            id: 'Solidarity',
            name: "Solidarity Plan",
            price: "70",
            icon: Activity,
            features: ["Core LVEF Analysis", "Health Equity Subsidy", "Basic Support"],
            color: "emerald"
        },
        {
            id: 'Liberal',
            name: "Liberal Pack",
            price: "199",
            icon: Zap,
            popular: true,
            features: ["Automatic LVEF & GLS", "Clinical Reports", "Priority Support"],
            color: "blue"
        },
        {
            id: 'Center',
            name: "Center Pack",
            price: "499",
            icon: Crown,
            features: ["Regional Strain", "Team Access", "PACS Integration API"],
            color: "fuchsia"
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else {
            signup(formData);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-[#07090f] transition-colors duration-500">
            <div className={`w-full ${step === 2 ? 'max-w-5xl' : 'max-w-md'} transition-all duration-500`}>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/10 border border-blue-500/20 mb-6 shadow-xl shadow-blue-600/5 group">
                        <Activity className="w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        {step === 1 ? 'Create ' : 'Choose '}
                        <span className="text-blue-500">{step === 1 ? 'Account' : 'Your Plan'}</span>
                    </h1>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">
                        {step === 1 ? 'Medical Professional Registration' : 'Select your clinical authorization level'}
                    </p>
                </div>

                <div className="glass-card p-8 border-slate-200 dark:border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {step === 1 ? (
                            <div className="space-y-6 animate-fade-in">
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
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                                {tiers.map((tier) => (
                                    <button
                                        key={tier.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, plan: tier.id })}
                                        className={`relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300 group ${formData.plan === tier.id
                                            ? 'border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10'
                                            : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
                                            }`}
                                    >
                                        {tier.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">Most Popular</div>
                                        )}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`p-3 rounded-2xl ${formData.plan === tier.id ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
                                                <tier.icon className="w-5 h-5" />
                                            </div>
                                            {formData.plan === tier.id && (
                                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{tier.name}</h3>
                                        <div className="flex items-baseline gap-1 mb-4">
                                            <span className="text-2xl font-black italic">{tier.price === 'Custom' ? tier.price : `$${tier.price}`}</span>
                                            {tier.price !== 'Custom' && (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/mo</span>
                                            )}
                                        </div>
                                        <ul className="space-y-3">
                                            {tier.features.map((f, i) => (
                                                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                    <Check className={`w-3 h-3 ${formData.plan === tier.id ? 'text-blue-500' : 'text-slate-300'}`} />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-4">
                            {step === 2 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all text-[10px]"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-[2] btn-premium flex items-center justify-center gap-3 py-4"
                                disabled={isSigningUp || (step === 2 && !formData.plan)}
                            >
                                {isSigningUp ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {step === 1 ? (
                                            <>
                                                <span>Continue to Plans</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                <span>Complete Registration</span>
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
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
