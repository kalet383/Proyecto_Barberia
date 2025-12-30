<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const SuperGestionCompras = defineAsyncComponent(() => import('@/views/pages/superadmin/GestionCompras.vue'));
</script>

<template>
  <!-- Reutilizamos la misma vista que SuperAdmin para Nueva Compra -->
  <component :is="SuperGestionCompras" />
</template>
