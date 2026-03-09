import { create } from "zustand";
import axios from "axios";

interface SettingsState {
    settings: {
        siteName: string;
        maintenanceMode: boolean;
    } | null;
    isFetchingSettings: boolean;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
    settings: null,
    isFetchingSettings: false,
    fetchSettings: async () => {
        set({ isFetchingSettings: true });
        try {
            const response = await axios.get("/api/settings/public");
            set({ settings: response.data, isFetchingSettings: false });
        } catch (error) {
            console.error("Error fetching settings:", error);
            set({ isFetchingSettings: false });
        }
    },
}));
