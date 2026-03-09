import { Heart, Activity, Waves, Brain } from 'lucide-react';
import { MetricCard } from './MetricCard.tsx';

interface CardiacMetricsProps {
  ejectionFraction: number;
  simpsonEF: number;
  gls: number;
  endDiastolicVolume: number;
  endSystolicVolume: number;
}

export function CardiacMetrics({
  ejectionFraction,
  simpsonEF,
  gls,
  endDiastolicVolume,
  endSystolicVolume
}: CardiacMetricsProps) {
  return (
    <div className="space-y-8">
      {/* Primary KPI - Hero Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <MetricCard
          title="CNN Ejection Fraction"
          value={ejectionFraction}
          unit="%"
          icon={<Brain className="w-8 h-8" />}
          description="Percentage of blood leaving the left ventricle with each contraction, calculated via automated deep neural networks (EchoNet-Dynamic protocol)."
        />
      </div>

      <div className="space-y-6">
        {/* Global Function Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Global Function Analysis</h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <MetricCard
              title="Simpson's Biplane EF"
              value={simpsonEF}
              unit="%"
              icon={<Heart className="w-6 h-6" />}
              description="Gold-standard volumetric assessment of ejection fraction using the biplane method of disks (AHA/ASE standard)."
            />
            <MetricCard
              title="Global Longitudinal Strain"
              value={gls}
              unit="%"
              icon={<Activity className="w-6 h-6" />}
              description="Longitudinal myocardial shortening (absolute value). Reduced strain often precedes a drop in EF as an early indicator of dysfunction."
            />
          </div>
        </div>

        {/* Cardiac Morphometry */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Waves className="w-4 h-4 text-cyan-500" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Cardiac Morphometry</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="EDV"
              value={endDiastolicVolume}
              unit="mL"
              icon={<Waves className="w-5 h-5" />}
              description="End-Diastolic Volume: Maximum ventricular volume reached at the end of the filling phase."
            />
            <MetricCard
              title="ESV"
              value={endSystolicVolume}
              unit="mL"
              icon={<Waves className="w-5 h-5" />}
              description="End-Systolic Volume: Minimum ventricular volume remaining immediately following ejection."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
