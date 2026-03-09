import React from 'react';
import { Heart, Users, Calculator, AlertTriangle } from 'lucide-react';

type Model = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

const models: Model[] = [
  {
    id: 'lung',
    name: 'LV Segmentation',
    description: 'Automated myocardial segmentation from echocardiography',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: 'brain',
    name: 'Clinical Metrics',
    description: 'Biplane EF and Global Longitudinal Strain analysis',
    icon: <Calculator className="w-6 h-6" />,
  },
  {
    id: 'eye',
    name: 'Diagnostic Quality',
    description: 'AI-assisted reduction of human interpretive variability',
    icon: <AlertTriangle className="w-6 h-6" />,
  },
  {
    id: 'heart',
    name: 'Research Team',
    description: 'Clinical validation and development team',
    icon: <Users className="w-6 h-6" />,
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  return (
    <div className="flex flex-col gap-3 p-2">
      {models.map((model) => (
        <button
          key={model.id}
          onClick={() => onModelSelect(model.id)}
          className={`group flex items-center p-4 rounded-2xl transition-all duration-500 border relative overflow-hidden ${selectedModel === model.id
            ? 'bg-blue-600/15 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
            : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/10 hover:translate-x-1'
            }`}
        >
          {selectedModel === model.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none"></div>
          )}

          <div className={`mr-4 p-3 rounded-xl transition-all duration-500 ${selectedModel === model.id ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-600/10'}`}>
            <div className="w-5 h-5 flex items-center justify-center">
              {model.icon}
            </div>
          </div>
          <div className="text-left relative z-10">
            <h3 className={`font-display font-bold text-sm tracking-tight ${selectedModel === model.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
              {model.name}
            </h3>
            <p className={`text-[10px] mt-1 font-medium leading-tight ${selectedModel === model.id ? 'text-blue-300' : 'text-slate-600 group-hover:text-slate-500'}`}>
              {model.description}
            </p>
          </div>

          {selectedModel === model.id && (
            <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
          )}
        </button>
      ))}
    </div>
  );
}