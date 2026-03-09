import React, { useCallback, useState, useMemo } from 'react';
import { Upload, FileVideo, CheckCircle2, Search, User } from 'lucide-react';
import { useAnalysisStore } from '../store/useAnalysisStore';

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  onUploadComplete: () => void;
  uploadProgress: number;
  selectedVideo: string | null;
  onSubmit: () => void;
  isProcessing: boolean;
  isUploadReady: boolean;
  selectedPatientId?: string | null;
  setSelectedPatientId?: (id: string | null) => void;
  tempPatientId?: string;
  setTempPatientId?: (id: string) => void;
}

export function VideoUpload({
  onVideoSelect,
  onUploadComplete,
  uploadProgress,
  selectedVideo,
  onSubmit,
  isProcessing,
  isUploadReady,
  selectedPatientId,
  setSelectedPatientId,
  tempPatientId,
  setTempPatientId,
}: VideoUploadProps) {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const { history } = useAnalysisStore();
  const [showPatientList, setShowPatientList] = useState(false);

  const existingPatients = useMemo(() => {
    const ids = new Set(history.map(r => r.patientId).filter(Boolean));
    return Array.from(ids);
  }, [history]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.avi')) {
        onVideoSelect(file);
        uploadToBackend(file);
      }
    },
    [onVideoSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith('.avi')) {
        onVideoSelect(file);
        uploadToBackend(file);
      }
    },
    [onVideoSelect]
  );

  const uploadToBackend = async (file: File) => {
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('http://localhost:5000/api/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload video');

      onUploadComplete();
      setUploadMessage('Network Authenticated: Video Ready');
    } catch (error: any) {
      setUploadMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedVideo && (
        <div className="glass-card p-6 border-slate-200 dark:border-white/5 mb-6">
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
      )}

      {!selectedVideo ? (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="group block w-full p-16 transition-all duration-500 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[32px] cursor-pointer bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:border-blue-500/50 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden text-slate-900"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex flex-col items-center justify-center relative z-10 text-center">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all duration-500 shadow-xl group-hover:shadow-blue-500/20">
              <Upload className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors" />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-2 group-hover:neon-text-blue transition-all">Import Echo Sequence</h3>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">Drag & Drop AVI or Browse Files</p>
            <input
              type="file"
              accept=".avi"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </label>
      ) : (
        <div className="space-y-6 animate-scale-in">
          {uploadProgress < 100 ? (
            <div className="glass-card p-8 border-white/5">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Upload Protocol</p>
                  <h4 className="text-slate-900 dark:text-white font-display font-bold">Encrypting Data Stream...</h4>
                </div>
                <span className="text-2xl font-display font-black text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-6 p-8 glass-card border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                <FileVideo className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h4 className="text-slate-900 dark:text-white font-display font-black tracking-tight text-xl">Sequence Loaded</h4>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{uploadMessage || 'Verification Complete'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => onVideoSelect(null as any)}
                  className="px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={onSubmit}
                  disabled={isProcessing || !isUploadReady}
                  className={`btn-premium ${(isProcessing || !isUploadReady) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Run Diagnostics'
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
