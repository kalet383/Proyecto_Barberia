import { defineStore } from 'pinia';
import api, { setAuthToken, clearAuthToken } from '@/plugins/axios';
import axios from 'axios';

interface AuthState {
  token: string | null;
  user: Record<string, unknown> | null; // Tipo genérico hasta definir User
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    loadFromStorage() {
      const t = localStorage.getItem('auth_token');
      if (t) {
        this.token = t;
        setAuthToken(t);
      }
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        // Tu backend devuelve { accessToken: string }
        const { data } = await api.post('/auth/login', { email, password });
        const token = data?.accessToken || data?.access_token;
        if (!token) throw new Error('No se recibió token JWT');

        this.token = token;
        setAuthToken(token);
        localStorage.setItem('auth_token', token);

        // (Opcional) obtener perfil si tienes guard activado
        try {
          const { data: profile } = await api.post('/auth/profile');
          this.user = profile;
        } catch {
          // Ignorar si no tienes el guard activo todavía
        }
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

    logout() {
      this.token = null;
      this.user = null;
      clearAuthToken();
      localStorage.removeItem('auth_token');
    },
  },
});
