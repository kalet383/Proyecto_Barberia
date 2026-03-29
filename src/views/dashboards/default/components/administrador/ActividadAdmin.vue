<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/plugins/axios';
import { CutIcon, ShoppingCartIcon, UserCheckIcon } from 'vue-tabler-icons';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

interface Actividad {
  id: string;
  tipo: 'cita' | 'venta' | 'compra';
  titulo: string;
  descripcion: string;
  monto?: number;
  estado: 'completada' | 'pendiente' | 'cancelada';
  fecha: string;
  hora: string;
}

const actividades = ref<Actividad[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [citasRes, ventasRes] = await Promise.all([
      api.get('/cita?limit=3'),
      api.get('/venta?limit=3')
    ]);

    actividades.value = [
      ...citasRes.data?.map((cita: any) => ({
        id: `cita-${cita.id}`,
        tipo: 'cita' as const,
        titulo: 'Nueva Cita Agendada',
        descripcion: `${cita.clienteId} - ${cita.barberoId}`,
        estado: 'completada' as const,
        fecha: new Date(cita.fechaInicio).toLocaleDateString('es-CO'),
        hora: new Date(cita.fechaInicio).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      })) || [],
      ...ventasRes.data?.map((venta: any, idx: number) => ({
        id: `venta-${idx}`,
        tipo: 'venta' as const,
        titulo: 'Venta Completada',
        descripcion: `${venta.cantidad} producto(s)`,
        monto: venta.total,
        estado: 'completada' as const,
        fecha: new Date(venta.fechaVenta).toLocaleDateString('es-CO'),
        hora: new Date(venta.fechaVenta).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
      })) || []
    ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 6);

  } catch (error) {
    console.error('Error cargando actividades:', error);
  } finally {
    loading.value = false;
  }
});

const getColorActividad = (tipo: string) => {
  if (isDark.value) {
    switch (tipo) {
      case 'cita': return '#a855f7'; // Purple-ish
      case 'venta': return '#22c55e'; // Green-ish
      case 'compra': return '#3b82f6'; // Blue-ish
      default: return '#94a3b8';
    }
  }
  switch (tipo) {
    case 'cita': return '#7B1FA2';
    case 'venta': return '#388E3C';
    case 'compra': return '#1976D2';
    default: return '#757575';
  }
};

const formatCurrency = (value: number | undefined) => {
  if (!value) return '';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
};

const cardStyles = computed(() => {
  if (isDark.value) {
    return {
      background: '#111827',
      borderColor: '#1e293b',
      titleColor: '#ffffff',
      itemBg: 'rgba(255,255,255,0.02)',
      itemHoverBg: 'rgba(255,255,255,0.05)',
      itemBorder: '#374151',
      txtPrimary: '#e5e7eb',
      txtSecondary: '#94a3b8'
    };
  }
  return {
    background: 'white',
    borderColor: '#E0E0E0',
    titleColor: '#1a1a2e',
    itemBg: '#F9F9F9',
    itemHoverBg: '#F5F5F5',
    itemBorder: '#E0E0E0',
    txtPrimary: '#1a1a2e',
    txtSecondary: '#666'
  };
});
</script>

<template>
  <v-card 
    elevation="0" 
    class="dashboard-card"
    :style="{ background: cardStyles.background, borderColor: cardStyles.borderColor }"
  >
    <v-card-title class="d-flex align-center gap-2 pb-4" :style="{ color: cardStyles.titleColor }">
      <UserCheckIcon :size="24" :color="isDark ? '#3b82f6' : '#1976D2'" stroke-width="1.5" />
      <span>Actividad Reciente de la Barbería</span>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <div v-if="loading" class="pa-6 text-center">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-timeline v-else direction="vertical" side="end" class="mx-4">
        <v-timeline-item
          v-for="actividad in actividades"
          :key="actividad.id"
          :dot-color="getColorActividad(actividad.tipo)"
          size="small"
        >
          <div 
            class="activity-card pa-4"
            :style="{ 
              background: cardStyles.itemBg, 
              borderLeftColor: cardStyles.itemBorder,
              '--hover-bg': cardStyles.itemHoverBg,
              '--hover-border': getColorActividad(actividad.tipo)
            }"
          >
            <div class="d-flex justify-space-between align-start mb-2">
              <div>
                <h4 class="text-base font-weight-600 mb-1" :style="{ color: cardStyles.txtPrimary }">{{ actividad.titulo }}</h4>
                <p class="text-sm mb-0" :style="{ color: cardStyles.txtSecondary }">{{ actividad.descripcion }}</p>
              </div>
              <v-chip 
                v-if="actividad.monto"
                size="small"
                :color="getColorActividad(actividad.tipo)"
                variant="tonal"
                class="ml-2"
              >
                {{ formatCurrency(actividad.monto) }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between align-center mt-3">
              <span class="text-caption" :style="{ color: cardStyles.txtSecondary }">{{ actividad.fecha }}</span>
              <span class="text-caption font-weight-600" :style="{ color: cardStyles.txtPrimary }">{{ actividad.hora }}</span>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
      <div v-if="!loading && actividades.length === 0" class="pa-10 text-center">
        <p :style="{ color: cardStyles.txtSecondary }">No hay actividad reciente registrada</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.dashboard-card {
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
}

.activity-card {
  border-radius: 8px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-bg) !important;
    border-left-color: var(--hover-border) !important;
    transform: translateX(4px);
  }
}

/* Ajustes linea de tiempo en modo oscuro */
:deep(.v-timeline-divider__line) {
  background: v-bind("isDark ? '#1e293b' : '#E0E0E0'") !important;
}
</style>
