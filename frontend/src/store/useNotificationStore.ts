import { create } from "zustand";
import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/notifications` : "/api/notifications");
axios.defaults.withCredentials = true;

interface Notification {
    _id: string;
    type: "info" | "warning" | "success" | "error";
    message: string;
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    isFetching: boolean;
    getNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
    addNotification: (notification: Partial<Notification>) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    isFetching: false,

    getNotifications: async () => {
        set({ isFetching: true });
        try {
            const res = await axios.get(`${API_URL}/all`);
            set({ notifications: res.data });
        } catch (error) {
            console.log("Error in getNotifications:", error);
        } finally {
            set({ isFetching: false });
        }
    },

    markAsRead: async (id) => {
        try {
            await axios.put(`${API_URL}/${id}/read`);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n._id === id ? { ...n, read: true } : n
                ),
            }));
        } catch (error) {
            console.log("Error marking notification as read:", error);
        }
    },

    clearAll: async () => {
        try {
            await axios.delete(`${API_URL}/clear`);
            set({ notifications: [] });
        } catch (error) {
            console.log("Error clearing notifications:", error);
        }
    },

    markAllAsRead: async () => {
        try {
            await axios.put(`${API_URL}/mark-all-read`);
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, read: true })),
            }));
        } catch (error) {
            console.log("Error marking all notifications as read:", error);
        }
    },

    addNotification: async () => {
        get().getNotifications();
    },
}));
