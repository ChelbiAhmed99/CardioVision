import React, { useEffect, useState } from 'react';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    Edit3,
    X,
    Lock,
    Mail,
    User as UserIcon,
    Stethoscope,
    Shield,
    Trash2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        specialty: 'Cardiologist',
        role: 'user'
    });

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users', { withCredentials: true });
            setUsers(response.data);
        } catch (err) {
            toast.error("Failed to load users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, { withCredentials: true });
            toast.success(`User role updated to ${newRole}`);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update user role");
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
            toast.success("User deleted successfully");
            fetchUsers();
        } catch (err) {
            toast.error("Failed to delete user");
        }
    };

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                email: user.email,
                password: '', // Don't show password for editing
                specialty: user.specialty,
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                fullName: '',
                email: '',
                password: '',
                specialty: 'Cardiologist',
                role: 'user'
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editingUser) {
                await axios.put(`/api/admin/users/${editingUser.id}`, formData, { withCredentials: true });
                toast.success("Practitioner updated successfully");
            } else {
                await axios.post('/api/admin/users', formData, { withCredentials: true });
                toast.success("Account provisioned successfully");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-6 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-2">
                        <Users className="w-3.5 h-3.5" />
                        Personnel Directory
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                        User <span className="text-blue-600">Management</span>
                    </h2>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" />
                    Provision Account
                </button>
            </div>

            <div className="glass-card border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-white/5">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find practitioners by name or email..."
                            className="w-full bg-white dark:bg-[#07090f] border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors">
                            <Filter className="w-3.5 h-3.5" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Practitioner</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Specialty</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Access Level</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                                                {user.fullName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full">{user.specialty}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'admin' ? (
                                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded-lg border border-fuchsia-500/20">
                                                    <Shield className="w-3 h-3" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                                    User
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                                                title="Edit Profile"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => toggleRole(user.id, user.role)}
                                                className="p-2 hover:bg-fuchsia-500/10 text-fuchsia-500 rounded-lg transition-colors"
                                                title="Toggle Admin Rights"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="p-20 text-center">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium font-display">No clinical personnel profiles found.</p>
                    </div>
                )}
            </div>

            {/* User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="glass-card w-full max-w-lg bg-white dark:bg-[#07090f] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden rounded-[2rem]">
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
                            <div>
                                <h3 className="text-xl font-display font-black text-slate-900 dark:text-white tracking-tight">
                                    {editingUser ? 'Update Profile' : 'Provision Account'}
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Personnel Authorization Module</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#040508] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-[#040508] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                            placeholder="john@clinic.com"
                                        />
                                    </div>
                                </div>

                                {!editingUser && (
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Initial Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-[#040508] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Specialty</label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                value={formData.specialty}
                                                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-[#040508] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white appearance-none"
                                            >
                                                <option value="Cardiologist">Cardiologist</option>
                                                <option value="Sonographer">Sonographer</option>
                                                <option value="Research">Research</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Role</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-[#040508] border border-slate-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white appearance-none"
                                            >
                                                <option value="user">Standard User</option>
                                                <option value="admin">Administrator</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : (editingUser ? 'Update Account' : 'Confirm Provisioning')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
