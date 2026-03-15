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
  Loader,
  Crown
} from 'lucide-react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
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
import PricingPage from './pages/PricingPage';

function HomeContent() {
  const { authUser, logout, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const { saveToHistory } = useAnalysisStore();
  const { notifications, getNotifications } = useNotificationStore();

  const [selectedModel, setSelectedModel] = useState('lung');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputVideos, setInputVideos] = useState<(string | null)[]>([null, null]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploadReady, setIsUploadReady] = useState<boolean[]>([false, false]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0]);
  const [analysisResults, setAnalysisResults] = useState<any[] | null>(null);
  const [comparisonRecords, setComparisonRecords] = useState<any[] | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [tempPatientId, setTempPatientId] = useState<string>('');
  const [isComparisonMode, setIsComparisonMode] = useState(false);
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
      await handleVideoSelect(file);
    } catch (error) {
      console.error('Error loading demo video:', error);
    }
  };

  const uploadToBackend = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append(isComparisonMode ? `video_${index}` : 'video', file);

    try {
      const response = await fetch('/api/ai/api/video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload video');

      setIsUploadReady(prev => {
        const nr = [...prev];
        nr[index] = true;
        return nr;
      });
    } catch (error: any) {
      console.error('Upload Error:', error);
    }
  };

  const handleVideoSelect = async (file: File | null, index: number = 0) => {
    if (!file) {
      if (inputVideos[index]) URL.revokeObjectURL(inputVideos[index]!);
      setInputVideos(prev => {
        const nv = [...prev];
        nv[index] = null;
        return nv;
      });
      setUploadProgress(prev => {
        const np = [...prev];
        np[index] = 0;
        return np;
      });
      setAnalysisResults(null);
      setIsUploadReady(prev => {
        const nr = [...prev];
        nr[index] = false;
        return nr;
      });
      return;
    }
    const videoURL = URL.createObjectURL(file);
    setInputVideos(prev => {
      const nv = [...prev];
      nv[index] = videoURL;
      return nv;
    });
    setIsUploadReady(prev => {
      const nr = [...prev];
      nr[index] = false;
      return nr;
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(prev => {
        const np = [...prev];
        np[index] = Math.min(progress, 100);
        return np;
      });
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    // Perform actual upload
    await uploadToBackend(file!, index);
  };

  const handleSubmit = async () => {
    if (!inputVideos[0]) return;
    setIsProcessing(true);
    setAnalysisResults(null);
    try {
      const response = await fetch(`/api/ai/video-output?t=${Date.now()}`, {
        cache: 'no-store',
      });

      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.limitReached) {
          toast.error(errorData.message, { duration: 6000, icon: '🚀' });
          setSelectedModel('pricing');
          return;
        }
      }

      if (!response.ok) {
        let errorMessage = 'Video processing failed';
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text.substring(0, 200));
          errorMessage = `Server Error (${response.status}): Unexpected response format.`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('Failed to parse JSON response. Raw content:', text.substring(0, 500));
        throw new Error('Server returned invalid data format. Please check logs.');
      }

      const resultsArray = Array.isArray(result) ? result : [result];
      setAnalysisResults(resultsArray);

      // Save to history automatically
      for (const res of resultsArray) {
        await saveToHistory({
          patientId: selectedPatientId || tempPatientId || `PAT_UNSPECIFIED_${Math.floor(Math.random() * 10000)}`,
          videoPath: inputVideos[res.index || 0],
          metrics: {
            ejectionFraction: res.ejectionFraction,
            simpsonEF: res.simpsonEF,
            gls: res.gls,
            edVolume: res.edVolume,
            esVolume: res.esVolume
          },
          diagnosis: {
            problem: res.problem,
            cause: res.cause,
            cure: res.cure
          }
        });

        // Update authUser context
        checkAuth(); // Refresh user data to update scan count
      }

      // Reset temp ID after successful analysis
      setTempPatientId('');
    } catch (error: any) {
      console.error('Processing Error:', error);
      toast.error(error.message || "Diagnostic failed");
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
              setAnalysisResults(record.metrics ? [{ ...record.metrics, ...record.diagnosis }] : null);
              setSelectedModel('default');
            }}
          />
        ) : (
          <PatientManagementView onSelectPatient={(id) => setSelectedPatientId(id)} />
        );
      case 'profile':
        return <ProfileView />;
      case 'pricing':
        return <PricingPage />;
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
                onUploadComplete={() => { }}
                uploadProgress={uploadProgress}
                selectedVideos={inputVideos}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                isUploadReady={isUploadReady}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                tempPatientId={tempPatientId}
                setTempPatientId={setTempPatientId}
                isComparisonMode={isComparisonMode}
                setIsComparisonMode={setIsComparisonMode}
              />

              {!inputVideos[0] && (
                <div className="mt-12">
                  <h3 className="text-lg font-bold text-slate-400 dark:text-slate-300 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Demo Case Studies
                  </h3>
                  <DemoVideos onVideoSelect={handleDemoSelect} />
                </div>
              )}

              <ResultView
                inputVideos={inputVideos}
                isProcessing={isProcessing}
                analysisResults={analysisResults}
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

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72 bg-white/80 dark:bg-[#040508]/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 transition-all duration-500 ease-in-out z-50 shadow-2xl`}>
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

              {authUser?.plan === 'Free' && (
                <div className="p-5 rounded-2xl bg-blue-600/5 border border-blue-500/10 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Monthly Quota</p>
                    <span className="text-[10px] font-black text-blue-500">{authUser?.scanCount || 0}/10 Scans</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${Math.min((authUser?.scanCount || 0) * 10, 100)}%` }}
                    />
                  </div>
                  {(authUser?.scanCount || 0) >= 8 && (
                    <p className="text-[9px] font-bold text-amber-500 mt-2 animate-pulse">Running low on clinical scans.</p>
                  )}
                </div>
              )}
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

              <button
                onClick={() => setSelectedModel('pricing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${selectedModel === 'pricing' ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' : 'text-slate-500 hover:bg-emerald-500/10 border border-emerald-500/20'}`}
              >
                <Crown className={`w-5 h-5 ${selectedModel === 'pricing' ? 'text-white' : 'text-emerald-500'}`} />
                <span className="text-xs font-black uppercase tracking-widest">Subscription</span>
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
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/80 mb-1 truncate">
                <Shield className="w-3 s:w-3.5 h-3 s:h-3.5 shrink-0" />
                <span className="truncate">Encrypted Session</span>
              </div>
              <p className="text-base sm:text-lg font-display font-bold text-slate-900 dark:text-white tracking-tight truncate">Diagnostic Workflow</p>
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

            <div className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-2xl pl-1 sm:pl-2.5 pr-2 sm:pr-5 py-1.5 sm:py-2 border border-white/10 hover:border-white/20 transition-all cursor-pointer group shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-[10px] sm:text-xs font-black text-white shadow-lg group-hover:scale-105 transition-transform duration-300 shrink-0">
                {authUser?.fullName?.substring(0, 2).toUpperCase() || 'MD'}
              </div>
              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{authUser?.fullName || 'Dr. Guest'}</p>
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">PRO</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">Authenticated Professional</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4 sm:px-10 py-6 sm:py-10">
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