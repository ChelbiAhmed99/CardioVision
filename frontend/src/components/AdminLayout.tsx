import React, { useState } from 'react';
import {
    Activity,
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Shield
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ThemeToggle } from './ThemeToggle';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { authUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Control Center', path: '/admin', id: 'dashboard' },
        { icon: Users, label: 'User Registry', path: '/admin/users', id: 'users' },
        { icon: TrendingUp, label: 'Growth Feed', path: '/admin/growth', id: 'growth' },
        { icon: Shield, label: 'Audit History', path: '/admin/audit', id: 'audit' },
        { icon: Settings, label: 'Site Config', path: '/admin/settings', id: 'settings' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#07090f] text-slate-900 dark:text-slate-200 overflow-hidden font-sans transition-colors duration-500">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-fuchsia-600/5 rounded-full blur-[150px]"></div>
            </div>

            {/* Sidebar */}
            <aside className={`${isCollapsed ? 'w-24' : 'w-72'} bg-white/80 dark:bg-[#040508]/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 transition-all duration-500 flex flex-col z-40 relative px-4 py-8 shadow-2xl dark:shadow-none`}>
                <div className="flex items-center gap-4 px-4 mb-20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="animate-fade-in whitespace-nowrap">
                            <h1 className="text-lg font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
                                Admin<span className="text-blue-500">Panel</span>
                            </h1>
                            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Core Unit 01</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                                        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`} />
                                {!isCollapsed && (
                                    <span className="text-[10px] font-black uppercase tracking-widest animate-fade-in">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all group border border-dashed border-slate-200 dark:border-white/5"
                    >
                        <Shield className="w-5 h-5 group-hover:text-emerald-400" />
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Public Site</span>}
                    </button>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all group"
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate</span>}
                    </button>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-[#07090f] text-white hover:scale-110 transition-transform"
                >
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
                <header className="h-20 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-10 sticky top-0 bg-white/40 dark:bg-[#07090f]/80 backdrop-blur-md z-30">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Administrative Suite</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{authUser?.fullName}</p>
                                <p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">Root Authority</p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-xs font-black text-white shadow-lg">
                                {authUser?.fullName?.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
