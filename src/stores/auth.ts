import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import axios from 'axios';

interface AuthState {
  user: Record<string, unknown> | null; // Tipo genérico hasta definir User
  loading: boolean;
  error: string | null;
  returnUrl: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    returnUrl: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const res = await api.post('/auth/login', credentials, { withCredentials: true });
        this.user = res.data.user;
        return res.data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          throw err.response.data.message;
        }
        throw 'Login failed';
      }
    },

    async register(payload: { nombre: string; apellido: string; email: string; password: string; telefono?: string }) {
      try {
        const res = await api.post('/auth/register', payload, { withCredentials: true });
        this.user = res.data.user; // si tu backend devuelve el usuario creado
        return res.data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          throw err.response.data.message;
        }
        throw 'Registro fallido';
      }
    },

    async loadUser() {
      console.log('EJECUTANDO LOADUSER');
      try {
        const { data: profile } = await api.get('/auth/profile', {
          withCredentials: true,
        });
        console.log('LOADUSER EXITOSO:', profile);
        this.user = profile;
      } catch (error) {
        console.log('LOADUSER FALLÓ:', error);
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
      this.returnUrl = null;
    },
  },
});