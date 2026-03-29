<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6" :style="{ color: txtPrimary }">Panel de Super Administrador</h1>
      </v-col>
    </v-row>

    <!-- Estadísticas Generales -->
    <v-row v-if="statistics">
      <v-col cols="12" md="3">
        <v-card color="indigo-darken-2" elevation="4" rounded="lg">
          <v-card-text>
            <div class="text-h6 opacity-70">Total Usuarios</div>
            <div class="text-h3 font-weight-bold text-white">{{ statistics.totalUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="success" elevation="4" rounded="lg">
          <v-card-text>
            <div class="text-h6 opacity-70">Usuarios Activos</div>
            <div class="text-h3 font-weight-bold text-white">{{ statistics.activeUsers }}</div>
            <div class="text-caption text-white opacity-80">{{ statistics.statistics.activePercentage }}% acumulado</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="warning" elevation="4" rounded="lg">
          <v-card-text>
            <div class="text-h6 opacity-70" style="color: #1a1a2e">Usuarios Inactivos</div>
            <div class="text-h3 font-weight-bold" style="color: #1a1a2e">{{ statistics.inactiveUsers }}</div>
            <div class="text-caption opacity-80" style="color: #1a1a2e">{{ statistics.statistics.inactivePercentage }}% del total</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="info" elevation="4" rounded="lg">
          <v-card-text>
            <div class="text-h6 opacity-70">Nuevos (7 días)</div>
            <div class="text-h3 font-weight-bold text-white">{{ statistics.recentUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Usuarios por Rol -->
    <v-row v-if="statistics" class="mt-4">
      <v-col cols="12">
        <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: cardBg }">
          <v-card-title :style="{ color: txtPrimary, fontWeight: '700' }">Distribución por Roles</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card variant="outlined" :style="{ borderColor: cardBorder, background: headerBg }">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="purple">mdi-shield-crown</v-icon>
                    <div class="text-h4 mt-2" :style="{ color: txtPrimary, fontWeight: '800' }">{{ statistics.usersByRole.superadmin }}</div>
                    <div class="text-subtitle-1" :style="{ color: txtSecondary }">Super Admins</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="outlined" :style="{ borderColor: cardBorder, background: headerBg }">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary">mdi-account-tie</v-icon>
                    <div class="text-h4 mt-2" :style="{ color: txtPrimary, fontWeight: '800' }">{{ statistics.usersByRole.administrador }}</div>
                    <div class="text-subtitle-1" :style="{ color: txtSecondary }">Administradores</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="outlined" :style="{ borderColor: cardBorder, background: headerBg }">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="success">mdi-content-cut</v-icon>
                    <div class="text-h4 mt-2" :style="{ color: txtPrimary, fontWeight: '800' }">{{ statistics.usersByRole.barbero }}</div>
                    <div class="text-subtitle-1" :style="{ color: txtSecondary }">Barberos</div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="3">
                <v-card variant="outlined" :style="{ borderColor: cardBorder, background: headerBg }">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="info">mdi-account</v-icon>
                    <div class="text-h4 mt-2" :style="{ color: txtPrimary, fontWeight: '800' }">{{ statistics.usersByRole.cliente }}</div>
                    <div class="text-subtitle-1" :style="{ color: txtSecondary }">Clientes</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estadísticas de Ventas y Citas -->
    <v-row v-if="ventasStatistics || citasStatistics" class="mt-4">
      <!-- Total Ventas e Ingresos -->
      <v-col cols="12" md="6" v-if="ventasStatistics">
        <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: cardBg }">
          <v-card-title :style="{ color: txtPrimary, fontWeight: '700' }">Operaciones y Ventas</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-card variant="tonal" color="blue-grey" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">{{ ventasStatistics.totalVentas }}</div>
                    <div class="text-subtitle-1 opacity-70">Ventas Realizadas</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card variant="tonal" color="success" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">{{ formatCurrency(ventasStatistics.totalIngresos) }}</div>
                    <div class="text-subtitle-1 opacity-70">Ingresos Totales</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <!-- Productos más vendidos -->
            <div class="mt-6">
              <div class="text-subtitle-1 font-weight-bold mb-3" :style="{ color: txtPrimary }">Productos Más Vendidos</div>
              <v-list density="compact" :style="{ background: 'transparent' }" v-if="ventasStatistics.productosMasVendidos?.length > 0">
                <v-list-item v-for="(prod, i) in ventasStatistics.productosMasVendidos.slice(0, 5)" :key="i" :style="{ borderBottom: `1px solid ${cardBorder}` }">
                  <v-list-item-title :style="{ color: txtPrimary, fontSize: '0.9rem' }">{{ prod.nombre }}</v-list-item-title>
                  <template v-slot:append>
                    <v-badge color="primary" :content="prod.cantidad" inline rounded="lg"></v-badge>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-caption" :style="{ color: txtSecondary }">No hay datos suficientes</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Total Citas y Servicios -->
      <v-col cols="12" md="6" v-if="citasStatistics">
        <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: cardBg }">
          <v-card-title :style="{ color: txtPrimary, fontWeight: '700' }">Citas y Servicios</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-card variant="tonal" color="deep-purple" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">{{ citasStatistics.totalCitas }}</div>
                    <div class="text-subtitle-1 opacity-70">Citas Agendadas</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card variant="tonal" color="teal" rounded="lg">
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">{{ citasStatistics.citasPorEstado?.completadas || 0 }}</div>
                    <div class="text-subtitle-1 opacity-70">Citas Completadas</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <!-- Servicios más solicitados -->
            <div class="mt-6">
              <div class="text-subtitle-1 font-weight-bold mb-3" :style="{ color: txtPrimary }">Servicios Más Solicitados</div>
              <v-list density="compact" :style="{ background: 'transparent' }" v-if="citasStatistics.serviciosMasSolicitados?.length > 0">
                <v-list-item v-for="(serv, i) in citasStatistics.serviciosMasSolicitados.slice(0, 5)" :key="i" :style="{ borderBottom: `1px solid ${cardBorder}` }">
                  <v-list-item-title :style="{ color: txtPrimary, fontSize: '0.9rem' }">{{ serv.nombre }}</v-list-item-title>
                  <template v-slot:append>
                    <v-badge color="success" :content="serv.cantidad" inline rounded="lg"></v-badge>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="text-caption" :style="{ color: txtSecondary }">No hay datos suficientes</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Acciones Rápidas -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: cardBg }">
          <v-card-title :style="{ color: txtPrimary, fontWeight: '700' }">Acciones Rápidas</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-btn block size="large" variant="flat" color="primary" rounded="lg" prepend-icon="mdi-account-plus" @click="$router.push('/superadmin/usuarios')" class="text-none">
                  Gestión Usuarios
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn block size="large" variant="flat" color="success" rounded="lg" prepend-icon="mdi-cash-register" @click="$router.push('/superadmin/ventas')" class="text-none">
                  Ver Ventas
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn block size="large" variant="flat" color="info" rounded="lg" prepend-icon="mdi-chart-line" @click="$router.push('/superadmin/reportes')" class="text-none">
                  Reportes
                </v-btn>
              </v-col>
              <v-col cols="12" md="3">
                <v-btn block size="large" variant="flat" color="warning" rounded="lg" prepend-icon="mdi-history" @click="$router.push('/superadmin/compras/historial')" class="text-none">
                  Historial Compras
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
import { ref, onMounted, computed } from 'vue';
import { useSuperAdminStore } from '@/stores/superadmin';
import { useCustomizerStore } from '@/stores/customizer';

const superAdminStore = useSuperAdminStore();
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

const statistics = ref<any>(null);
const ventasStatistics = ref<any>(null);
const citasStatistics = ref<any>(null);
const loading = ref(false);

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value || 0);
};

onMounted(async () => {
  loading.value = true;
  try {
    const [statsInfo, ventasInfo, citasInfo] = await Promise.all([
      superAdminStore.fetchStatistics(),
      superAdminStore.fetchVentasStatistics(),
      superAdminStore.fetchCitasStatistics()
    ]);
    statistics.value = statsInfo;
    ventasStatistics.value = ventasInfo;
    citasStatistics.value = citasInfo;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.text-h3 {
  color: inherit;
}
.opacity-70 { opacity: 0.7; }
.opacity-80 { opacity: 0.8; }
</style>