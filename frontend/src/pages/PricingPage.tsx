import React from 'react';
import { Check, Shield, Zap, Activity, Crown, ArrowRight } from 'lucide-react';

const PricingPage: React.FC = () => {
  const tiers = [
    {
      name: "Solidarity Plan",
      price: "70",
      description: "Essential access for rural clinics and underserved healthcare regions.",
      icon: Activity,
      features: [
        "Core LVEF Analysis",
        "Essential Clinical Reports",
        "Simplified Interface",
        "Community Support",
        "Health Equity Subsidy"
      ],
      cta: "Join Solidarity",
      accent: "emerald"
    },
    {
      name: "Liberal Pack",
      price: "199",
      description: "Professional diagnostics for private practices and cardiologists.",
      icon: Zap,
      features: [
        "Automatic LVEF & GLS",
        "Instant Clinical Reports",
        "Standard Segment Analysis",
        "Priority Email Support",
        "Practice Branding"
      ],
      popular: true,
      cta: "Go Liberal",
      accent: "blue"
    },
    {
      name: "Center Pack",
      price: "499",
      description: "Advanced solution for imaging centers and clinical teams.",
      icon: Crown,
      features: [
        "Advanced Analysis (Regional Strain)",
        "Multi-User Team Access",
        "Patient History Management",
        "Dedicated Support",
        "Bulls-eye Mapping",
        "PACS Integration API"
      ],
      cta: "Contact Sales",
      accent: "fuchsia"
    }
  ];

  return (
    <div className="min-h-full py-12 animate-fade-in relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Transparent Clinical Pricing
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-none">
            Empower Your Practice with <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
            Choose the diagnostic depth that fits your clinical workflow. Scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`glass-card relative p-10 flex flex-col group transition-all duration-500 ${tier.popular ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10 scale-105 z-10' : 'hover:-translate-y-2'
                }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${tier.accent}-600/20 to-${tier.accent}-700/20 flex items-center justify-center mb-8`}>
                <tier.icon className={`w-7 h-7 text-${tier.accent}-500`} />
              </div>

              <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white italic">
                  {tier.price !== 'Custom' ? `$${tier.price}` : tier.price}
                </span>
                {tier.price !== 'Custom' && <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">/month</span>}
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                {tier.description}
              </p>

              <div className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${tier.popular
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02]'
                : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                }`}>
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-dashed border-slate-300 dark:border-white/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xl font-display font-black text-slate-900 dark:text-white">Enterprise PACS Gateway</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Looking for seamless integration with your hospital infrastructure?</p>
            </div>
          </div>
          <button className="px-8 py-4 glass-card dark:hover:bg-white/10 text-sm font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 transition-all rounded-2xl">
            View Integration API
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
