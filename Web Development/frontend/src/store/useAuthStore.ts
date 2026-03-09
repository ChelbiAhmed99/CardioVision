import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "/api";
const API_URL = import.meta.env.VITE_API_URL || `${BASE_URL}/auth`;
axios.defaults.withCredentials = true;

interface AuthState {
    authUser: any | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    signup: (data: any) => Promise<void>;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axios.get(`${API_URL}/check`);
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    updateProfile: async (data) => {
        try {
            const res = await axios.put(`${API_URL}/profile`, data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Profile update failed");
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axios.post(`${API_URL}/signup`, data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (error: any) {
            toast.error(error.response.data.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post(`${API_URL}/login`, data);
            set({ authUser: res.data });
            toast.success("Logged in successfully!");
        } catch (error: any) {
            toast.error(error.response.data.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            set({ authUser: null });
            toast.success("Logged out successfully!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },
}));
