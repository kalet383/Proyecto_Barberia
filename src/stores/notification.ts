import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import { useAuthStore } from './auth';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [] as any[],
        loading: false
    }),
    getters: {
        unreadCount: (state) => state.notifications.filter((n: any) => !n.leida).length
    },
    actions: {
        async fetchNotifications() {
            const authStore = useAuthStore();
            if (!authStore.user) return;
            
            this.loading = true;
            try {
                const { data } = await api.get('/notifications');
                this.notifications = data;
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                this.loading = false;
            }
        },
        async markAsRead(id: number) {
            try {
                await api.patch(`/notifications/${id}/leer`);
                // Optimistic update
                const notif = this.notifications.find((n: any) => n.id === id);
                if (notif) notif.leida = true;
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        },
        async markAllAsRead() {
            try {
                await api.patch('/notifications/leer-todas');
                this.notifications.forEach((n: any) => n.leida = true);
            } catch (error) {
                console.error('Error marking all as read:', error);
            }
        }
    }
});
