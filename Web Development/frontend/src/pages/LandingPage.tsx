import React, { useState } from 'react';
import { Activity, Shield, ArrowRight, Zap, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/growth/waitlist', { email });
      toast.success(response.data.message || "Welcome to the inner circle.", {
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        },
      });
      setEmail('');
    } catch (error: any) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg, {
        style: {
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-200 selection:bg-blue-500/30 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px] animate-float"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center transform transition-transform group-hover:rotate-12 duration-500">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Cardio<span className="text-blue-500">Vision</span>
          </h1>
        </div>
        <button className="hidden md:flex items-center gap-2 px-6 py-2.5 glass-card dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:scale-105 transition-all">
          <Shield className="w-4 h-4 text-emerald-400" />
          Beta Access
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-widest mb-8 animate-fade-in">
          <Zap className="w-3.5 h-3.5 fill-current" />
          Next-Gen Echocardiography AI
        </div>
        <h2 className="text-6xl md:text-8xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[0.9] animate-slide-up">
          GLS Analysis <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">In Seconds.</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-12 animate-slide-up delay-100">
          The first clinical-grade AI platform for automated myocardial segmentation and quantitative biomechanical assessment. Designed for the modern cardiologist.
        </p>

        {/* Waitlist Form */}
        <div className="max-w-md mx-auto relative animate-slide-up delay-200">
          <form onSubmit={handleSubmit} className="relative group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your clinical email..."
              className="w-full h-16 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-6 pr-40 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
            />
            <button
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-8 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "Get Early Access"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Users className="w-3 h-3" />
            Join 450+ medical professionals already on the waitlist
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Clinical Accuracy",
              desc: "Validated against gold-standard manual measurements with 98% correlation.",
              icon: Shield
            },
            {
              title: "Pure Speed",
              desc: "Get comprehensive GLS and EF results in less than 5 seconds per view.",
              icon: Zap
            },
            {
              title: "Automated Data",
              desc: "Stop manual tracing. Our AI handles the segmentation so you can treat patients.",
              icon: Activity
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto text-center">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Trusted by clinicians at</h4>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
          <div className="text-2xl font-black italic">HOSPITAL_A</div>
          <div className="text-2xl font-black italic">MED_TECH_INST</div>
          <div className="text-2xl font-black italic">CARDIOLOGY_CLINIC</div>
          <div className="text-2xl font-black italic">VET_PRACTICE</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold">© 2026 CardioVision AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
