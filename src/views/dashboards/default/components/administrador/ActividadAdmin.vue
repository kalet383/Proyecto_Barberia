<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { CutIcon, ShoppingCartIcon, UserCheckIcon } from 'vue-tabler-icons';

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

const getIconActividad = (tipo: string) => {
  switch (tipo) {
    case 'cita':
      return CutIcon;
    case 'venta':
      return ShoppingCartIcon;
    case 'compra':
      return UserCheckIcon;
    default:
      return CutIcon;
  }
};

const getColorActividad = (tipo: string) => {
  switch (tipo) {
    case 'cita':
      return '#7B1FA2';
    case 'venta':
      return '#388E3C';
    case 'compra':
      return '#1976D2';
    default:
      return '#757575';
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
</script>

<template>
  <v-card elevation="0" class="dashboard-card">
    <v-card-title class="d-flex align-center gap-2 pb-4">
      <UserCheckIcon :size="24" color="#1976D2" stroke-width="1.5" />
      <span>Actividad Reciente de la Barbería</span>
    </v-card-title>
    
    <v-card-text class="pa-0">
      <v-timeline direction="vertical" side="end">
        <v-timeline-item
          v-for="actividad in actividades"
          :key="actividad.id"
          :dot-color="getColorActividad(actividad.tipo)"
          size="small"
        >
          <div class="activity-card pa-4">
            <div class="d-flex justify-space-between align-start mb-2">
              <div>
                <h4 class="text-base font-weight-600 mb-1">{{ actividad.titulo }}</h4>
                <p class="text-sm text-medium-emphasis mb-0">{{ actividad.descripcion }}</p>
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
              <span class="text-caption text-medium-emphasis">{{ actividad.fecha }}</span>
              <span class="text-caption font-weight-600">{{ actividad.hora }}</span>
            </div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.dashboard-card {
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  }
}

.activity-card {
  border-radius: 8px;
  border-left: 3px solid #E0E0E0;
  background-color: #F9F9F9;
  transition: all 0.2s ease;

  &:hover {
    background-color: #F5F5F5;
    border-left-color: #1976D2;
  }
}
</style>
