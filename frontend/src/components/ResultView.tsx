import { useEffect, useRef, useState } from 'react';
import { LoadingAnimation } from './LoadingAnimation';
import { CardiacMetrics } from './CardiacMetrics';
import { DiagnosisSection } from './DiagnosisSection';
import { HeartVideo } from './HeartVideo';
import { Activity, Heart, Printer, Share2 } from 'lucide-react';
import { BullsEye } from './BullsEye';

interface ResultViewProps {
  inputVideo: string;
  isProcessing: boolean;
  analysisResult: {
    ejectionFraction: number;
    simpsonEF: number;
    problem: string;
    cause: string;
    cure: string;
    gls: number;
    prognosticInsight: string;
    bullsEyeData: number[];
    edVolume: number;
    esVolume: number;
  } | null;
}

export function ResultView({
  inputVideo,
  isProcessing,
  analysisResult
}: ResultViewProps) {
  const inputVideoRef = useRef<HTMLVideoElement>(null);
  const [maskGif, setMaskGif] = useState<string | null>(null);
  const [ecgGif, setEcgGif] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (isProcessing) {
      if (maskGif) URL.revokeObjectURL(maskGif);
      if (ecgGif) URL.revokeObjectURL(ecgGif);
      setMaskGif(null);
      setEcgGif(null);
      return;
    }

    if (!isProcessing && analysisResult) {
      const fetchResources = async () => {
        try {
          // Fetch mask GIF
          const maskResponse = await fetch(`http://127.0.0.1:5000/get-video/mask`);
          if (!maskResponse.ok) {
            throw new Error('Failed to fetch mask GIF');
          }
          const maskBlob = await maskResponse.blob();
          const maskUrl = URL.createObjectURL(maskBlob);
          setMaskGif(maskUrl);

          // Fetch ECG GIF
          const ecgResponse = await fetch(`http://127.0.0.1:5000/get-video/ecg`);
          if (!ecgResponse.ok) {
            throw new Error('Failed to fetch ECG GIF');
          }
          const ecgBlob = await ecgResponse.blob();
          const ecgUrl = URL.createObjectURL(ecgBlob);
          setEcgGif(ecgUrl);
        } catch (error) {
          console.error('Error fetching resources:', error);
        }
      };

      fetchResources();
    }

    return () => {
      if (maskGif) URL.revokeObjectURL(maskGif);
      if (ecgGif) URL.revokeObjectURL(ecgGif);
    };
  }, [isProcessing, analysisResult, maskGif, ecgGif]);

  return (
    <div className="space-y-12">
      {/* Print-only Header */}
      <div className="print-header hidden print:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-blue-600">CardioVision Clinical Report</h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Automated Echocardiography Diagnostic Output</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">Date: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-400">System ID: CV-X800-PRO</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
          <div className="w-6 h-1 bg-blue-500 rounded-full"></div>
          Diagnostic Visualization
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all group"
          >
            <Printer className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            Export Clinical Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10 hover:bg-slate-200 transition-all">
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-8">
        <div className="w-full lg:w-3/4 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3 no-print">
            <div className="w-6 h-1 bg-blue-500 rounded-full"></div>
            Original Echocardiogram
          </h3>
          <div className="relative overflow-hidden glass-card aspect-video border-white/5 group">
            <video
              ref={inputVideoRef}
              src={inputVideo}
              className="absolute inset-0 object-contain w-full h-full transition-transform duration-700 group-hover:scale-[1.02]"
              controls
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cardio-dark/40 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
            <div className="w-6 h-1 bg-cyan-500 rounded-full"></div>
            AI Myocardial Segmentation
          </h3>
          <div className="relative overflow-hidden glass-card aspect-video border-white/5 bg-cardio-darker/50 group">
            {isProcessing ? (
              <LoadingAnimation />
            ) : maskGif ? (
              <img
                src={maskGif}
                alt="Segmented Mask"
                className="absolute inset-0 object-contain w-full h-full transition-all duration-500 group-hover:opacity-100 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-4">
                <Activity className="w-10 h-10 animate-pulse-soft opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for processing...</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
            <div className="w-6 h-1 bg-fuchsia-500 rounded-full"></div>
            ECG Feature Extraction
          </h3>
          <div className="relative overflow-hidden glass-card aspect-video border-white/5 bg-cardio-darker/50 group">
            {isProcessing ? (
              <LoadingAnimation />
            ) : ecgGif ? (
              <img
                src={ecgGif}
                alt="ECG Tracking"
                className="absolute inset-0 object-cover w-full h-full opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-4">
                <Activity className="w-10 h-10 animate-pulse-soft opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Waiting for ECG data...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isProcessing && analysisResult && (
        <div className="space-y-16 animate-fade-in-up">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
            <div className="xl:col-span-5 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-600/5">
                  <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Clinical Metrics</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Cardiovascular Assessment</p>
                </div>
              </div>
              <CardiacMetrics
                ejectionFraction={analysisResult.ejectionFraction}
                simpsonEF={analysisResult.simpsonEF}
                gls={analysisResult.gls}
                endDiastolicVolume={analysisResult.edVolume}
                endSystolicVolume={analysisResult.esVolume}
              />
            </div>

            <div className="xl:col-span-7 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-600/5">
                  <Heart className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter">Regional Myodynamics</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AHA 17-Segment Polar Mapping</p>
                </div>
              </div>
              <BullsEye data={analysisResult.bullsEyeData} />
            </div>
          </div>

          <DiagnosisSection
            ejectionFraction={analysisResult.ejectionFraction}
            problem={analysisResult.problem}
            cause={analysisResult.cause}
            cure={analysisResult.cure}
            prognosticInsight={analysisResult.prognosticInsight}
          />
          <HeartVideo />
        </div>
      )}
    </div>
  );
}
