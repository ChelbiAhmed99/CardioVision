import { Bell, X, Info, AlertTriangle, CheckCircle2, Trash2, Loader, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

interface NotificationCenterProps {
    onClose: () => void;
}

export function NotificationCenter({ onClose }: NotificationCenterProps) {
    const { notifications, isFetching, markAsRead, clearAll, markAllAsRead } = useNotificationStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <X className="w-4 h-4 text-red-500" />;
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="absolute top-full right-0 mt-4 w-96 glass-card border-slate-200 dark:border-white/10 shadow-2xl z-50 animate-fade-in overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Clinical Alerts</h3>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={clearAll}
                        className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 uppercase tracking-widest"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Alerts</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Real-time patient monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={markAllAsRead}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all group"
                        title="Mark all as read"
                    >
                        <CheckCheck className="w-5 h-5" />
                    </button>
                    <button
                        onClick={clearAll}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                        title="Clear all"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isFetching ? (
                    <div className="p-10 text-center">
                        <Loader className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center">
                        <Bell className="w-8 h-8 text-slate-200 dark:text-white/5 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {notifications.map((n) => (
                            <div
                                key={n._id}
                                className={`p - 5 hover: bg - slate - 50 dark: hover: bg - white / [0.02] transition - colors cursor - pointer relative group ${!n.read ? 'bg-blue-600/[0.02]' : ''} `}
                                onClick={() => markAsRead(n._id)}
                            >
                                {!n.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                )}
                                <div className="flex gap-4">
                                    <div className={`w - 8 h - 8 rounded - lg flex items - center justify - center shrink - 0 ${n.type === 'warning' ? 'bg-amber-500/10' :
                                        n.type === 'error' ? 'bg-red-500/10' :
                                            n.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-600/10'
                                        } `}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text - xs leading - relaxed ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'} `}>
                                            {n.message}
                                        </p>
                                        <p className="text-[9px] text-slate-400 mt-2 font-medium uppercase tracking-wider">
                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-black/40 border-t border-slate-200 dark:border-white/5 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted Session</p>
            </div>
        </div>
    );
}
