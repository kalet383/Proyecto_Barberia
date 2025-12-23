import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export interface UserManagement {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  foto?: string;
  role: string;
  activo: boolean;
  createdAt: string;
}

export const useSuperAdminStore = defineStore('superadmin', {
  state: () => ({
    users: [] as UserManagement[],
    statistics: null as any,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    activeUsers: (state) => state.users.filter(u => u.activo),
    inactiveUsers: (state) => state.users.filter(u => !u.activo),
    adminUsers: (state) => state.users.filter(u => u.role === 'administrador'),
    barberUsers: (state) => state.users.filter(u => u.role === 'barbero'),
    clientUsers: (state) => state.users.filter(u => u.role === 'cliente'),
  },

  actions: {
    async fetchAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/auth', { withCredentials: true });
        this.users = data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar usuarios';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUsersByRole(role: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/auth/superadmin/users-by-role/${role}`, { 
          withCredentials: true 
        });
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar usuarios por rol';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createAdmin(userData: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/superadmin/create-admin', userData, { 
          withCredentials: true 
        });
        await this.fetchAllUsers();
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear administrador';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createBarber(userData: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/superadmin/create-barber', userData, { 
          withCredentials: true 
        });
        await this.fetchAllUsers();
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear barbero';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createClient(userData: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/auth/superadmin/create-client', userData, { 
          withCredentials: true 
        });
        await this.fetchAllUsers();
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear cliente';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: number, userData: any) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.put(`/auth/superadmin/update-user/${id}`, userData, { 
          withCredentials: true 
        });
        await this.fetchAllUsers();
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleUserStatus(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.patch(`/auth/superadmin/toggle-status/${id}`, {}, { 
          withCredentials: true 
        });
        await this.fetchAllUsers();
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cambiar estado del usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/auth/superadmin/statistics', { 
          withCredentials: true 
        });
        this.statistics = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar estadísticas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/auth/${id}`, { withCredentials: true });
        await this.fetchAllUsers();
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
