import { defineStore } from 'pinia';
import api from '@/plugins/axios';
import axios from 'axios';

export interface User {
  id: number | string;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  Role?: string;
  foto?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  returnUrl: string | null;
  menu: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    returnUrl: null,
    menu: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isMenu: (state) => state.menu,
  },

  actions: {
    async login(credentials: { email: string; password: string }) {
      try {
        const res = await api.post('/auth/login', credentials, { withCredentials: true });
        this.user = res.data.user;

        // Normalizar rol en minúsculas para uso consistente en la app
        const rawRole = (this.user as any).Role || (this.user as any).role;
        if (rawRole) {
          (this.user as any).role = String(rawRole).toLowerCase();
        }

        if (this.user && (this.user as any).role == 'cliente') {
          this.menu = 2;
        }
        if (this.user && (this.user as any).role == 'administrador') {
          this.menu = 0;
        }
        if (this.user && (this.user as any).role == 'barbero') {
          this.menu = 1;
        }
        if (this.user && (this.user as any).role == 'superadmin') {
          this.menu = 3;
        }

        // 🎯 RETORNAR EL ROL (normalizado)
        return {
          ...res.data,
          role: (this.user as any).role
        };
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          throw err.response.data.message;
        }
        throw 'Login failed';
      }
    },

    async loginWithGoogle(idToken: string) {
      try {
        // Enviar el token de Google al backend
        const res = await api.post('/auth/google', { token: idToken }, { withCredentials: true });
        this.user = res.data.user;

        // Normalizar rol en minúsculas para uso consistente en la app
        const rawRole = (this.user as any).Role || (this.user as any).role;
        if (rawRole) {
          (this.user as any).role = String(rawRole).toLowerCase();
        }

        if (this.user && (this.user as any).role == 'cliente') {
          this.menu = 2;
        }
        if (this.user && (this.user as any).role == 'administrador') {
          this.menu = 0;
        }
        if (this.user && (this.user as any).role == 'barbero') {
          this.menu = 1;
        }
        if (this.user && (this.user as any).role == 'superadmin') {
          this.menu = 3;
        }

        return {
          ...res.data,
          role: (this.user as any).role
        };
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          throw err.response.data.message;
        }
        throw 'Fallo en la autenticación con Google';
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
      try {
        const { data: profile } = await api.get('/auth/profile', {
          withCredentials: true,
        });
        console.log('LOADUSER EXITOSO:', profile);
        this.user = profile;

        // Normalizar rol en minúsculas para uso consistente
        const rawRole = (this.user as any).Role || (this.user as any).role;
        if (rawRole) {
          (this.user as any).role = String(rawRole).toLowerCase();
        }

        // También debes setear el menu según el rol
        if (this.user && (this.user as any).role == 'cliente') {
          this.menu = 2
        }
        if (this.user && (this.user as any).role == 'barbero') {
          this.menu = 1
        }
        if (this.user && (this.user as any).role == 'administrador') {
          this.menu = 0
        }
        if (this.user && (this.user as any).role == 'superadmin') {
          this.menu = 3
        }

      } catch (error) {
        console.log('LOADUSER FALLÓ:', error);
        // 🎯 Si falla, resetear el estado completamente
        this.resetAuthState();
        throw error;
      }
    },


    // 🎯 NUEVA FUNCIÓN para resetear el estado completamente
    resetAuthState() {
      this.user = null;
      this.returnUrl = null;
      this.menu = null;
      this.loading = false;
      this.error = null;
    },

    async logout() {
      try {
        await api.post('/auth/logout', {}, { withCredentials: true });
      } catch {
        // aunque falle, limpiamos
      }
      
      // 🎯 Resetear estado
      this.resetAuthState();
      
      // 🎯 Limpiar datos de sesión pero PRESERVAR la preferencia de tema
      const themeMode = localStorage.getItem('themeMode');
      localStorage.clear();
      if (themeMode) {
        localStorage.setItem('themeMode', themeMode);
      }
      
      sessionStorage.clear();
      
      // 🎯 Limpiar cookies (si existen)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    },
  },
});