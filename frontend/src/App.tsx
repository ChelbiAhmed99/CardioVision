import { useEffect, useState } from 'react';
import {
  Menu,
  Activity,
  Shield,
  FileText,
  Users,
  LogOut,
  Search,
  Bell,
  Loader
} from 'lucide-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useAnalysisStore } from './store/useAnalysisStore';
import { useNotificationStore } from './store/useNotificationStore';
import { useSettingsStore } from './store/useSettingsStore';

import { ModelSelector } from './components/ModelSelector';
import { VideoUpload } from './components/VideoUpload';
import { ResultView } from './components/ResultView';
import { DeveloperInfo } from './components/DeveloperInfo';
import { CardiacInfo } from './components/CardiacInfo';
import { TeamSection } from './components/TeamSection';
import { EchoErrors } from './components/EchoErrors';
import { DemoVideos } from './components/DemoVideos';
import { ThemeToggle } from './components/ThemeToggle';
import { HistoryView } from './components/HistoryView';
import { ComparisonView } from './components/ComparisonView';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfileView } from './components/ProfileView';
import { PatientManagementView } from './components/PatientManagementView';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PatientDetailView } from './components/PatientDetailView';
import { LandingPage } from './pages/LandingPage';
import { GrowthDashboard } from './pages/GrowthDashboard';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserManagement } from './pages/UserManagement';
import { SiteSettings } from './pages/SiteSettings';
import { AuditLogs } from './pages/AuditLogs';

function HomeContent() {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const { saveToHistory } = useAnalysisStore();
  const { notifications, getNotifications } = useNotificationStore();

  const [selectedModel, setSelectedModel] = useState('lung');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputVideo, setInputVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadReady, setIsUploadReady] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [comparisonRecords, setComparisonRecords] = useState<any[] | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [tempPatientId, setTempPatientId] = useState<string>('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleDemoSelect = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch demo video');
      const blob = await response.blob();
      const file = new File([blob], url.split('/').pop() || 'demo.avi', { type: 'video/x-msvideo' });
      handleVideoSelect(file);
    } catch (error) {
      console.error('Error loading demo video:', error);
    }
  };

  const handleVideoSelect = (file: File | null) => {
    if (!file) {
      if (inputVideo) URL.revokeObjectURL(inputVideo);
      setInputVideo(null);
      setUploadProgress(0);
      setAnalysisResult(null);
      setIsUploadReady(false);
      return;
    }
    const videoURL = URL.createObjectURL(file);
    setInputVideo(videoURL);
    setIsUploadReady(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(Math.min(progress, 100));
      if (progress >= 100) clearInterval(interval);
    }, 150);
  };

  const handleSubmit = async () => {
    if (!inputVideo) return;
    setIsProcessing(true);
    setAnalysisResult(null);
    try {
      const response = await fetch('/video-output');
      if (!response.ok) throw new Error('Video processing failed');
      const result = await response.json();
      setAnalysisResult(result);

      // Save to history automatically
      await saveToHistory({
        patientId: selectedPatientId || tempPatientId || `PAT_UNSPECIFIED_${Math.floor(Math.random() * 10000)}`,
        videoPath: inputVideo,
        metrics: {
          ejectionFraction: result.ejectionFraction,
          simpsonEF: result.simpsonEF,
          gls: result.gls,
          edVolume: result.edVolume,
          esVolume: result.esVolume
        },
        diagnosis: {
          problem: result.problem,
          cause: result.cause,
          cure: result.cure
        }
      });

      // Reset temp ID after successful analysis
      setTempPatientId('');
    } catch (error) {
      console.error('Processing Error:', error);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const renderContent = () => {
    switch (selectedModel) {
      case 'brain': return <CardiacInfo />;
      case 'heart': return <TeamSection />;
      case 'eye': return <EchoErrors />;
      case 'history':
        return comparisonRecords ? (
          <ComparisonView
            analysis1={comparisonRecords[0]}
            analysis2={comparisonRecords[1]}
            onClose={() => setComparisonRecords(null)}
          />
        ) : (
          <HistoryView onCompare={(records) => setComparisonRecords(records)} />
        );
      case 'patients':
        return selectedPatientId ? (
          <PatientDetailView
            patientId={selectedPatientId}
            onBack={() => setSelectedPatientId(null)}
            onSelectRecord={(record) => {
              setAnalysisResult(record.metrics ? { ...record.metrics, ...record.diagnosis } : null);
              setSelectedModel('default');
            }}
          />
        ) : (
          <PatientManagementView onSelectPatient={(id) => setSelectedPatientId(id)} />
        );
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <div className="p-8 lg:p-12 relative animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="glass-card p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="w-32 h-32 text-blue-500" />
                </div>
                <div className="max-w-2xl relative z-10">
                  <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    Precision <span className="text-blue-500">Cardiac</span> Analysis
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    Upload clinical echo sequences for automated myocardial segmentation and quantitative biomechanical assessment.
                  </p>
                </div>
              </div>

              <VideoUpload
                onVideoSelect={handleVideoSelect}
                onUploadComplete={() => setIsUploadReady(true)}
                uploadProgress={uploadProgress}
                selectedVideo={inputVideo}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                isUploadReady={isUploadReady}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                tempPatientId={tempPatientId}
                setTempPatientId={setTempPatientId}
              />

              {!inputVideo && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-slate-400 dark:text-slate-300 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Demo Case Studies
                  </h3>
                  <DemoVideos handleSubmit={handleSubmit} onVideoSelect={handleDemoSelect} />
                </div>
              )}

              <ResultView
                inputVideo={inputVideo || ''}
                isProcessing={isProcessing}
                analysisResult={analysisResult}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-500">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px] animate-float"></div>
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-fuchsia-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72 bg-white/80 dark:bg-[#040508]/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out z-40 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-10 group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center transform transition-transform group-hover:rotate-12 duration-500">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                  Cardio<span className="text-blue-500">Vision</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">v3.0 Ultra</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Patient ID or Data..."
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white"
                />
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto pt-4 px-4 space-y-2 custom-scrollbar">
            <div className="px-4 mb-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Medical Modules</p>
            </div>
            <ModelSelector selectedModel={selectedModel} onModelSelect={setSelectedModel} />

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
              <button
                onClick={() => setSelectedModel('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${selectedModel === 'history' ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                <FileText className={`w-5 h-5 ${selectedModel === 'history' ? 'text-white' : 'text-slate-400 group-hover:text-blue-50'}`} />
                <span className="text-xs font-black uppercase tracking-widest">History</span>
              </button>

              <button
                onClick={() => setSelectedModel('patients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${selectedModel === 'patients' ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                <Users className={`w-5 h-5 ${selectedModel === 'patients' ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className="text-xs font-black uppercase tracking-widest">Patients</span>
              </button>

              <button
                onClick={() => setSelectedModel('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${selectedModel === 'profile' ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
              >
                <Shield className={`w-5 h-5 ${selectedModel === 'profile' ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                <span className="text-xs font-black uppercase tracking-widest">My Profile</span>
              </button>

              {authUser?.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group text-fuchsia-500 hover:bg-fuchsia-500/10 border border-fuchsia-500/20"
                >
                  <Shield className="w-5 h-5 text-fuchsia-500" />
                  <span className="text-xs font-black uppercase tracking-widest">Admin Panel</span>
                </button>
              )}
            </div>
          </nav>

          <div className="p-6 mt-auto">
            <div onClick={logout} className="glass-card p-4 bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer group flex items-center justify-center gap-3">
              <LogOut className="w-4 h-4 text-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-red-500">Terminate Session</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="h-24 bg-white/40 dark:bg-[#07090f]/40 backdrop-blur-md border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-10 relative z-30">
          <div className="flex items-center gap-8">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-3 hover:bg-white/5 rounded-2xl transition-colors border border-white/5">
              <Menu className="w-6 h-6 text-slate-400" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/80 mb-1">
                <Shield className="w-3.5 h-3.5" />
                Encrypted Session
              </div>
              <p className="text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight">Diagnostic Workflow</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors relative border border-slate-200 dark:border-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-[#07090f] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                )}
              </button>
              {isNotificationOpen && (
                <NotificationCenter onClose={() => setIsNotificationOpen(false)} />
              )}
            </div>

            <div className="flex items-center gap-4 bg-white/5 rounded-2xl pl-2.5 pr-5 py-2 border border-white/10 hover:border-white/20 transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-600 flex items-center justify-center text-xs font-black text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                {authUser?.fullName?.substring(0, 2).toUpperCase() || 'MD'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{authUser?.fullName || 'Dr. Guest'}</p>
                <p className="text-[10px] text-slate-500 font-bold">Authenticated Professional</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative px-10 py-10">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
          <DeveloperInfo />
        </main>
      </div>
    </div>
  );
}

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, [checkAuth, fetchSettings]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#07090f]">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {settings?.maintenanceMode && authUser?.role !== 'admin' ? (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#07090f] p-6 text-center animate-fade-in relative overflow-hidden">
          {/* Ambient background */}
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-cyan-600/5 rounded-full blur-[150px]"></div>

          <div className="glass-card max-w-lg p-12 border border-slate-200 dark:border-white/5 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center mx-auto mb-8">
              <Activity className="w-10 h-10 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter mb-4">
              System <span className="text-blue-600">Optimization</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-8">
              Our clinical infrastructure is currently undergoing scheduled maintenance to ensure the highest diagnostic precision.
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
              Resuming Shortly
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={
            authUser ? (
              authUser.role === 'admin' ? <Navigate to="/admin" replace /> : <HomeContent />
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={authUser?.role === 'admin' ? "/admin" : "/"} replace />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={authUser?.role === 'admin' ? "/admin" : "/"} replace />} />
          <Route path="/waitlist" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              authUser?.role === 'admin' ? (
                <AdminLayout><AdminDashboard /></AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              authUser?.role === 'admin' ? (
                <AdminLayout><UserManagement /></AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/growth"
            element={
              authUser?.role === 'admin' ? (
                <AdminLayout><GrowthDashboard /></AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin/settings"
            element={
              authUser?.role === 'admin' ? (
                <AdminLayout><SiteSettings /></AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/admin/audit"
            element={
              authUser?.role === 'admin' ? (
                <AdminLayout><AuditLogs /></AdminLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;