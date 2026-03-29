import { defineStore } from 'pinia';
import config from '@/config';

export type ThemeMode = 'light' | 'dark' | 'system';

export const useCustomizerStore = defineStore({
  id: 'customizer',
  state: () => ({
    Sidebar_drawer: config.Sidebar_drawer,
    Customizer_drawer: config.Customizer_drawer,
    mini_sidebar: config.mini_sidebar,
    fontTheme: config.fontTheme,
    inputBg: config.inputBg,
    // Persist theme choice
    themeMode: (localStorage.getItem('themeMode') as ThemeMode) || 'light',
  }),

  getters: {
    activeTheme(state) {
      if (state.themeMode === 'system') {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return isDark ? 'DarkTheme' : 'PurpleTheme';
      }
      return state.themeMode === 'dark' ? 'DarkTheme' : 'PurpleTheme';
    }
  },

  actions: {
    SET_SIDEBAR_DRAWER() {
      this.Sidebar_drawer = !this.Sidebar_drawer;
    },
    SET_MINI_SIDEBAR(payload: boolean) {
      this.mini_sidebar = payload;
    },
    SET_CUSTOMIZER_DRAWER(payload: boolean) {
      this.Customizer_drawer = payload;
    },
    SET_FONT(payload: string) {
      this.fontTheme = payload;
    },
    SET_THEME_MODE(mode: ThemeMode) {
      this.themeMode = mode;
      localStorage.setItem('themeMode', mode);
    }
  }
});
