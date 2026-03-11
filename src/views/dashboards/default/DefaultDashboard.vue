<script setup>
  // imported components
  import { computed } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import TotalEarning from './components/TotalEarning.vue';
  import TotalOrder from './components/TotalOrder.vue';
  import TotalIncome from './components/TotalIncome.vue';
  import TotalGrowth from './components/TotalGrowth.vue';
  import PopularStocks from './components/PopularStocks.vue';
  import BannerbienvenidaAdmin from './components/administrador/BannerbienvenidaAdmin.vue';
  import EstadisticasAdmin from './components/administrador/EstadisticasAdmin.vue';
  import StocksYAlertas from './components/administrador/StocksYAlertas.vue';
  import ActividadAdmin from './components/administrador/ActividadAdmin.vue';
  import GraficasAdmin from './components/administrador/GraficasAdmin.vue';

  const authStore = useAuthStore();
  const userRole = computed(() => authStore.user?.Role);

  console.log('Usuario:', authStore.user);
  console.log('Role:', userRole.value);
</script>

<template>
  <v-row v-if="userRole === 'administrador'">
    <!-- DASHBOARD ADMINISTRADOR -->
    
    <!-- Banner de Bienvenida -->
    <v-col cols="12">
      <BannerbienvenidaAdmin></BannerbienvenidaAdmin>
    </v-col>

    <!-- Estadísticas -->
    <v-col cols="12">
      <EstadisticasAdmin></EstadisticasAdmin>
    </v-col>

    <!-- Stocks Bajos y Alertas -->
    <v-col cols="12">
      <StocksYAlertas></StocksYAlertas>
    </v-col>

    <!-- Actividad Reciente -->
    <v-col cols="12">
      <ActividadAdmin></ActividadAdmin>
    </v-col>

    <!-- Estadísticas y Gráficas -->
    <v-col cols="12">
      <GraficasAdmin></GraficasAdmin>
    </v-col>
  </v-row>

  <!-- DASHBOARD PARA OTROS ROLES -->
  <v-row v-else>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Earning -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12">
      <TotalEarning></TotalEarning>
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Order -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <br> <br> <br> <br>
      <TotalOrder />
    </v-col>
    <!-- -------------------------------------------------------------------- -->
    <!-- Total Income -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" md="4">
      <TotalIncome />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Total Growth -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="8">
      <TotalGrowth />
    </v-col>

    <!-- -------------------------------------------------------------------- -->
    <!-- Popular Stocks -->
    <!-- -------------------------------------------------------------------- -->
    <v-col cols="12" lg="4">
      <PopularStocks />
    </v-col>
  </v-row>
</template>
