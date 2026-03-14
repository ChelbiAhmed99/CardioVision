import React, { useCallback, useState, useMemo } from 'react';
import { Upload, FileVideo, CheckCircle2, Search, User, Activity } from 'lucide-react';
import { useAnalysisStore } from '../store/useAnalysisStore';

interface VideoUploadProps {
  onVideoSelect: (file: File | null, index?: number) => void | Promise<void>;
  onUploadComplete: (index?: number) => void;
  uploadProgress: number[];
  selectedVideos: (string | null)[];
  onSubmit: () => void;
  isProcessing: boolean;
  isUploadReady: boolean[];
  selectedPatientId?: string | null;
  setSelectedPatientId?: (id: string | null) => void;
  tempPatientId?: string;
  setTempPatientId?: (id: string) => void;
  isComparisonMode: boolean;
  setIsComparisonMode: (mode: boolean) => void;
}

export function VideoUpload({
  onVideoSelect,
  onUploadComplete,
  uploadProgress,
  selectedVideos,
  onSubmit,
  isProcessing,
  isUploadReady,
  selectedPatientId,
  setSelectedPatientId,
  tempPatientId,
  setTempPatientId,
  isComparisonMode,
  setIsComparisonMode,
}: VideoUploadProps) {
  // No internal state for upload messages anymore, managed by App or implicit
  const { history } = useAnalysisStore();
  const [showPatientList, setShowPatientList] = useState(false);

  const existingPatients = useMemo(() => {
    const ids = new Set(history.map(r => r.patientId).filter(Boolean));
    return Array.from(ids);
  }, [history]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>, index: number = 0) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      const isVideo = file && (file.name.endsWith('.avi') || file.name.endsWith('.mp4'));
      if (isVideo) {
        onVideoSelect(file, index);
      }
    },
    [onVideoSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number = 0) => {
      const file = e.target.files?.[0];
      const isVideo = file && (file.name.endsWith('.avi') || file.name.endsWith('.mp4'));
      if (isVideo) {
        onVideoSelect(file as File, index);
      }
    },
    [onVideoSelect]
  );

  const renderUploadSlot = (index: number, label: string) => {
    const selectedVideo = selectedVideos[index];
    const progress = uploadProgress[index];
    // removed local uploadMessage as it's now managed externally or simplified

    return (
      <div className="flex-1 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-cyan-500'}`}></div>
          {label}
        </h4>

        {!selectedVideo ? (
          <label
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
            className="group block w-full p-8 transition-all duration-500 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[24px] cursor-pointer bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-blue-500/50 relative overflow-hidden text-slate-900"
          >
            <div className="flex flex-col items-center justify-center relative z-10 text-center">
              <div className="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-tighter mb-1">Import {label}</p>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">AVI/MP4 Format</p>
              <input
                type="file"
                accept=".avi,.mp4"
                onChange={(e) => handleFileInput(e, index)}
                className="hidden"
              />
            </div>
          </label>
        ) : (
          <div className="space-y-4 animate-scale-in">
            {progress < 100 ? (
              <div className="glass-card p-6 border-white/5">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uploading...</span>
                  <span className="text-xl font-display font-black text-blue-600 dark:text-blue-400">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 glass-card border-white/10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <FileVideo className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-center">
                  <h4 className="text-slate-900 dark:text-white font-display font-black tracking-tight text-sm">Sequence {index + 1} Loaded</h4>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verified</p>
                  </div>
                </div>
                <button
                  onClick={() => onVideoSelect(null, index)}
                  className="px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all border border-slate-200 dark:border-white/10"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const allReady = isComparisonMode
    ? (isUploadReady[0] && isUploadReady[1])
    : isUploadReady[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 glass-card p-6 border-slate-200 dark:border-white/5">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            Assign Clinical Record to Patient
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="New Patient ID..."
                value={tempPatientId}
                onChange={(e) => {
                  setTempPatientId?.(e.target.value);
                  setSelectedPatientId?.(null);
                }}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500/50 transition-all dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 text-slate-400 relative">
              <span className="text-[10px] font-bold uppercase">OR</span>
              <div className="flex-1 relative">
                <button
                  onClick={() => setShowPatientList(!showPatientList)}
                  className="w-full bg-blue-600/10 border border-blue-500/20 text-blue-500 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-between"
                >
                  {selectedPatientId || 'Select Existing Patient'}
                  <Search className="w-3.5 h-3.5 ml-2" />
                </button>

                {showPatientList && (
                  <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto custom-scrollbar">
                    {existingPatients.length === 0 ? (
                      <p className="p-4 text-[10px] text-slate-500 font-bold uppercase text-center">No history found</p>
                    ) : (
                      existingPatients.map(id => (
                        <button
                          key={id}
                          onClick={() => {
                            setSelectedPatientId?.(id);
                            setTempPatientId?.('');
                            setShowPatientList(false);
                          }}
                          className="w-full text-left p-3 hover:bg-blue-600 hover:text-white rounded-lg transition-all flex items-center gap-3 group"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-200" />
                          <span className="text-xs font-bold">{id}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {(selectedPatientId || tempPatientId) && (
            <p className="mt-4 text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Target ID: {selectedPatientId || tempPatientId}
            </p>
          )}
        </div>

        <div className="md:w-64 glass-card p-6 border-slate-200 dark:border-white/5 flex flex-col justify-center gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            Analysis Mode
          </h4>
          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
            <button
              onClick={() => setIsComparisonMode(false)}
              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${!isComparisonMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Single
            </button>
            <button
              onClick={() => setIsComparisonMode(true)}
              className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isComparisonMode ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Dual
            </button>
          </div>
          <p className="text-[9px] text-slate-500 font-medium uppercase text-center">
            {isComparisonMode ? 'Compare two sequences side-by-side' : 'Standard clinical assessment'}
          </p>
        </div>
      </div>

      <div className={`grid ${isComparisonMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {renderUploadSlot(0, isComparisonMode ? 'Baseline Sequence' : 'Echo Sequence')}
        {isComparisonMode && renderUploadSlot(1, 'Follow-up Sequence')}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={onSubmit}
          disabled={isProcessing || !allReady}
          className={`btn-premium min-w-[240px] ${(isProcessing || !allReady) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="flex items-center justify-center gap-3">
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Concurrent Processing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                {isComparisonMode ? 'Run Comparative Analysis' : 'Run Diagnostics'}
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
