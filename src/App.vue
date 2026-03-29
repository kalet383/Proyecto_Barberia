<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed, watchEffect } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const route = useRoute();

const activeTheme = computed(() => {
  // 🎯 Rutas públicas que siempre deben estar en Modo Claro
  const publicPaths = ['/', '/login', '/login1', '/register', '/checkout'];
  if (publicPaths && route && publicPaths.includes(route.path)) {
    return 'PurpleTheme';
  }
  return customizer.activeTheme;
});

// Forzar actualización si cambia el tema del sistema (cuando el modo es 'system')
watchEffect(() => {
  const mode = customizer.themeMode;
  if (mode === 'system') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // Pinia getters se recalculan solos, pero esto fuerza la reactividad
      // solo por seguridad en algunos navegadores
      customizer.themeMode = 'light';
      customizer.themeMode = 'system';
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }
});
</script>

<template>
  <!-- Este es el ÚNICO v-app de la aplicación para evitar conflictos -->
  <v-app :theme="activeTheme">
    <RouterView></RouterView>
  </v-app>
</template>

<style>
  html, body {
    margin: 0;
    padding: 0;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  /* Transición suave premium entre temas */
  .v-application {
    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.15s ease !important;
  }
  
  /* Evitar saltos de layout en transiciones */
  .v-main {
    transition: background-color 0.4s ease !important;
  }
</style>