import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/analysis` : "/api/analysis");
axios.defaults.withCredentials = true;

interface AnalysisState {
    history: any[];
    isFetchingHistory: boolean;
    getHistory: () => Promise<void>;
    saveToHistory: (data: any) => Promise<void>;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
    history: [],
    isFetchingHistory: false,

    getHistory: async () => {
        set({ isFetchingHistory: true });
        try {
            const res = await axios.get(`${API_URL}/history`);
            set({ history: res.data });
        } catch (error) {
            console.log("Error in getHistory:", error);
        } finally {
            set({ isFetchingHistory: false });
        }
    },

    saveToHistory: async (data) => {
        try {
            const res = await axios.post(`${API_URL}/save`, data);
            set((state) => ({ history: [res.data, ...state.history] }));
            toast.success("Analysis report saved to history.");
        } catch (error) {
            console.log("Error in saveToHistory:", error);
            toast.error("Failed to save analysis report.");
        }
    },
}));
