<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Panel de Super Administrador</h1>
      </v-col>
    </v-row>

    <!-- Estadísticas Generales -->
    <v-row v-if="statistics">
      <v-col cols="12" md="3">
        <v-card color="indigo-darken-2" dark>
          <v-card-text>
            <div class="text-h6">Total Usuarios</div>
            <div class="text-h3 font-weight-bold text-white">{{ statistics.totalUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="text-h6">Usuarios Activos</div>
            <div class="text-h3 font-weight-bold">{{ statistics.activeUsers }}</div>
            <div class="text-caption">{{ statistics.statistics.activePercentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="text-h6">Usuarios Inactivos</div>
            <div class="text-h3 font-weight-bold">{{ statistics.inactiveUsers }}</div>
            <div class="text-caption">{{ statistics.statistics.inactivePercentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="text-h6">Nuevos (7 días)</div>
            <div class="text-h3 font-weight-bold">{{ statistics.recentUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Usuarios por Rol -->
    <v-row v-if="statistics" class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Distribución por Roles</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-icon size="48" color="purple">mdi-shield-crown</v-icon>
                    <div class="text-h4 mt-2">{{ statistics.usersByRole.superadmin }}</div>
                    <div class="text-subtitle-1">Super Admins</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-account-tie</v-icon>
                    <div class="text-h4 mt-2">{{ statistics.usersByRole.administrador }}</div>
                    <div class="text-subtitle-1">Administradores</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-icon size="48" color="success">mdi-content-cut</v-icon>
                    <div class="text-h4 mt-2">{{ statistics.usersByRole.barbero }}</div>
                    <div class="text-subtitle-1">Barberos</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card outlined>
                  <v-card-text class="text-center">
                    <v-icon size="48" color="info">mdi-account</v-icon>
                    <div class="text-h4 mt-2">{{ statistics.usersByRole.cliente }}</div>
                    <div class="text-subtitle-1">Clientes</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Acciones Rápidas -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>Acciones Rápidas</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-btn
                  block
                  size="large"
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  @click="$router.push('/superadmin/usuarios')"
                >
                  Gestionar Usuarios
                </v-btn>
              </v-col>

              <v-col cols="12" md="4">
                <v-btn
                  block
                  size="large"
                  color="success"
                  prepend-icon="mdi-cash-register"
                  @click="$router.push('/superadmin/ventas')"
                >
                  Ver Ventas
                </v-btn>
              </v-col>

              <v-col cols="12" md="4">
                <v-btn
                  block
                  size="large"
                  color="info"
                  prepend-icon="mdi-chart-line"
                  @click="$router.push('/superadmin/reportes')"
                >
                  Reportes
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSuperAdminStore } from '@/stores/superadmin';

const superAdminStore = useSuperAdminStore();
const statistics = ref<any>(null);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    statistics.value = await superAdminStore.fetchStatistics();
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.text-h3 {
  color: rgb(var(--v-theme-primary));
}
</style>
