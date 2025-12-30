<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const SuperHistorialCompras = defineAsyncComponent(() => import('@/views/pages/superadmin/HistorialCompras.vue'));
</script>

<template>
  <!-- Reutilizamos la misma vista que SuperAdmin para Historial -->
  <component :is="SuperHistorialCompras" />
</template>