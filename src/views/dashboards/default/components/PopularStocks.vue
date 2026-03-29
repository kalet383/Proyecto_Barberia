<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCitaStore } from '@/stores/cita';
import { useServiceStore } from '@/stores/services';
import { ChevronUpIcon, ChevronDownIcon, DotsIcon, ChevronRightIcon, ScissorsIcon } from 'vue-tabler-icons';
import { useCustomizerStore } from '@/stores/customizer';

const citaStore = useCitaStore();
const serviceStore = useServiceStore();
const customizer = useCustomizerStore();
const loading = ref(true);

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

const topServices = ref<any[]>([]);

onMounted(async () => {
  try {
    await Promise.all([
      citaStore.obtenerCitas(),
      serviceStore.getServices()
    ]);

    // Calcular servicios populares
    const counts: Record<number, number> = {};
    citaStore.citas.forEach((cita: any) => {
      if (Array.isArray(cita.servicioId)) {
        cita.servicioId.forEach((id: number) => {
          counts[id] = (counts[id] || 0) + 1;
        });
      } else if (cita.servicioId) {
        const id = Number(cita.servicioId);
        counts[id] = (counts[id] || 0) + 1;
      }
    });

    const mapped = Object.entries(counts).map(([id, count]) => {
      const service = serviceStore.services.find(s => s.id === Number(id));
      return {
        id: Number(id),
        name: service?.nombre || 'Servicio Desconocido',
        count: count,
        price: service?.precio || 0
      };
    });

    topServices.value = mapped.sort((a, b) => b.count - a.count).slice(0, 5);

    if (topServices.value.length === 0) {
      topServices.value = [
        { name: 'Corte de cabello masculino', count: 0, price: 25000 },
        { name: 'Corte + Barba', count: 0, price: 35000 },
        { name: 'Limpieza Facial', count: 0, price: 15000 },
        { name: 'Tinte de cabello', count: 0, price: 45000 },
        { name: 'Exfoliación Capilar', count: 0, price: 12000 }
      ];
    }
  } catch (error) {
    console.error('Error cargando servicios populares:', error);
  } finally {
    loading.value = false;
  }
});

const totalServiciosSolicitados = computed(() => {
  return topServices.value.reduce((acc, s) => acc + s.count, 0);
});

const topService = computed(() => {
    return topServices.value[0] || null;
});

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'area',
      height: 95,
      fontFamily: `inherit`,
      foreColor: isDark.value ? '#94a3b8' : '#a1aab2',
      sparkline: { enabled: true }
    },
    colors: ['#ee6f38'],
    stroke: { curve: 'smooth', width: 2 },
    tooltip: { theme: isDark.value ? 'dark' : 'light', fixed: { enabled: false }, x: { show: false } }
  };
});

const series = computed(() => [
  {
    name: 'Solicitudes',
    data: topServices.value.map(s => s.count).reverse()
  }
]);

const cardStyles = computed(() => {
  if (isDark.value) {
    return {
      bg: '#111827',
      border: '#1f2937',
      txtPrimary: '#ffffff',
      itemHover: 'rgba(255,255,255,0.03)',
      rankBg: '#1e293b'
    };
  }
  return {
    bg: 'white',
    border: 'rgba(0,0,0,0.08)',
    txtPrimary: '#1a1a2e',
    itemHover: '#f9f9f9',
    rankBg: '#f5f5f5'
  };
});
</script>

<template>
  <v-card elevation="0" :style="{ background: 'transparent' }">
    <v-card 
      variant="outlined" 
      class="popular-card" 
      :style="{ background: cardStyles.bg, borderColor: cardStyles.border }"
    >
      <v-card-text>
        <div class="d-flex align-center">
          <h4 class="mt-1" :style="{ fontSize: '1.2rem', fontWeight: '700', color: cardStyles.txtPrimary }">Servicios Populares</h4>
          <div class="ml-auto">
            <v-menu transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn :color="isDark ? 'white' : 'primary'" size="small" icon rounded="sm" variant="text" v-bind="props">
                  <DotsIcon stroke-width="1.5" width="25" />
                </v-btn>
              </template>
              <v-sheet rounded="md" width="150" elevation="10" :theme="customizer.activeTheme">
                <v-list density="compact">
                  <v-list-item value="1">
                    <v-list-item-title>Hoy</v-list-item-title>
                  </v-list-item>
                  <v-list-item value="2">
                    <v-list-item-title>Este Mes</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-sheet>
            </v-menu>
          </div>
        </div>

        <v-card 
          class="top-service-banner mt-5" 
          elevation="0" 
          :style="{ background: 'linear-gradient(135deg, #ee6f38 0%, #ff9a6c 100%)' }"
        >
          <div class="pa-5">
            <div class="d-flex align-start justify-space-between">
              <div>
                <h6 class="text-white text-h5" style="font-weight: 700;">{{ topService?.name }}</h6>
                <span class="text-subtitle-2 text-white font-weight-bold" style="opacity: 0.9;">El más solicitado</span>
              </div>
              <h4 class="text-h4 text-white" style="font-weight: 800;">{{ topService?.count }} <small style="font-size: 0.6em; opacity: 0.8;">citas</small></h4>
            </div>
          </div>
          <div class="chart-container">
               <apexchart v-if="!loading" type="area" height="80" :options="chartOptions" :series="series"> </apexchart>
          </div>
        </v-card>

        <div class="mt-4">
          <v-list lines="two" class="py-0" :style="{ background: 'transparent' }">
            <v-list-item 
              v-for="(service, i) in topServices" 
              :key="i" 
              rounded="sm" 
              class="px-2 popular-item"
              :style="{ '--hover-bg': cardStyles.itemHover }"
            >
              <template v-slot:prepend>
                <div class="service-rank mr-3" :style="{ background: cardStyles.rankBg, color: isDark ? '#94a3b8' : '#666' }">
                    {{ i + 1 }}
                </div>
              </template>
              
              <template v-slot:append>
                <div class="d-flex flex-column align-end">
                    <span class="text-subtitle-1 font-weight-bold" :style="{ color: cardStyles.txtPrimary }">{{ service.count }}</span>
                    <span class="text-caption text-medium-emphasis">pedidos</span>
                </div>
              </template>

              <div class="d-inline-flex flex-column">
                  <h6 class="text-subtitle-1 font-weight-bold mb-0" :style="{ color: cardStyles.txtPrimary }">
                    {{ service.name }}
                  </h6>
                  <span class="text-caption text-medium-emphasis">
                      {{ service.count }} servicios totales en citas
                  </span>
              </div>
            </v-list-item>
          </v-list>

          <div class="text-center mt-3">
            <v-btn :color="isDark ? '#4f8ef7' : 'primary'" variant="text" to="/dashboard-citas" style="font-weight: 700; font-size: 0.8rem;">
              Ver Gestión de Citas
              <template v-slot:append>
                <ChevronRightIcon stroke-width="1.5" width="20" />
              </template>
            </v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<style scoped>
.popular-card {
  transition: all 0.3s ease;
}

.popular-item:hover {
  background-color: var(--hover-bg);
}

.top-service-banner {
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 15px rgba(238, 111, 56, 0.25);
}

.chart-container {
    margin-top: -20px;
    margin-bottom: -10px;
}

.service-rank {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.75rem;
    transition: all 0.3s ease;
}

.v-list-item--active .service-rank {
    background: #ee6f38 !important;
    color: white !important;
}
</style>
