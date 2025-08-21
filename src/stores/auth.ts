import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import axios from 'axios';

interface AuthState {
  user: Record<string, unknown> | null; // Tipo genérico hasta definir User
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        // 🔹 Importante: habilitar envío de cookies
        await api.post(
          '/auth/login',
          { email, password },
          { withCredentials: true }
        );

        // 🔹 Después de login, pedimos el perfil del usuario
        const { data: profile } = await api.get('/auth/profile', {
          withCredentials: true,
        });
        this.user = profile;

      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          this.error = e.response?.data?.message || 'Error de autenticación';
        } else {
          this.error = 'Error inesperado';
        }
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async loadUser() {
      try {
        const { data: profile } = await api.get('/auth/profile', {
          withCredentials: true,
        });
        this.user = profile;
      } catch {
        this.user = null;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout', {}, { withCredentials: true });
      } catch {
        // aunque falle, limpiamos
      }
      this.user = null;
    },
  },
});