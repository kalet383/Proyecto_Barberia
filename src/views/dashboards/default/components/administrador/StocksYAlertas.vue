<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { AlertCircleIcon, TrendingDownIcon, AlertTriangleIcon } from 'vue-tabler-icons';

interface Producto {
  id: number;
  nombre: string;
  stock: number;
  stock_minimo?: number;
  precio: number;
}

interface Alerta {
  id: string;
  tipo: 'warning' | 'error' | 'info' | 'success';
  titulo: string;
  mensaje: string;
  fecha: string;
}

const stocksBajos = ref<Producto[]>([]);
const stocksSinStock = ref<Producto[]>([]);
const alertas = ref<Alerta[]>([]);
const citasHoy = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    // Obtener productos
    const productosRes = await api.get('/producto');
    const productos = productosRes.data || [];

    // Separar productos por stock
    stocksBajos.value = productos
      .filter((p: Producto) => p.stock > 0 && p.stock <= 10)
      .slice(0, 5);

    stocksSinStock.value = productos
      .filter((p: Producto) => p.stock === 0)
      .slice(0, 5);

    // Obtener citas de hoy
    try {
      const citasRes = await api.get('/cita');
      const hoy = new Date().toDateString();
      citasHoy.value = citasRes.data?.filter((cita: any) => {
        return new Date(cita.fechaInicio).toDateString() === hoy;
      }) || [];
    } catch (error) {
      console.error('Error cargando citas:', error);
      citasHoy.value = [];
    }

    // Construir alertas dinámicas
    const alertasArray: Alerta[] = [];

    // Alertas de stock
    if (stocksSinStock.value.length > 0) {
      alertasArray.push({
        id: 'sin-stock',
        tipo: 'error',
        titulo: '⚠️ Sin Stock',
        mensaje: `${stocksSinStock.value.length} producto(s) sin disponibilidad`,
        fecha: new Date().toLocaleDateString('es-CO')
      });
    }

    if (stocksBajos.value.length > 0) {
      alertasArray.push({
        id: 'stock-bajo',
        tipo: 'warning',
        titulo: '⚠️ Stock Bajo',
        mensaje: `${stocksBajos.value.length} producto(s) con stock bajo`,
        fecha: new Date().toLocaleDateString('es-CO')
      });
    }

    // Alerta de citas solo si hay citas hoy
    if (citasHoy.value.length > 0) {
      alertasArray.push({
        id: 'citas-hoy',
        tipo: 'info',
        titulo: '📅 Citas Programadas',
        mensaje: `${citasHoy.value.length} cita(s) programada(s) para hoy`,
        fecha: new Date().toLocaleDateString('es-CO')
      });
    }

    // Si todo está bien
    if (alertasArray.length === 0) {
      alertasArray.push({
        id: 'todo-bien',
        tipo: 'success',
        titulo: '✓ Todo en Orden',
        mensaje: 'No hay productos con stock bajo y el inventario está balanceado',
        fecha: new Date().toLocaleDateString('es-CO')
      });
    }

    alertas.value = alertasArray;
  } catch (error) {
    console.error('Error cargando datos:', error);
  } finally {
    loading.value = false;
  }
});

const getColorAlerta = (tipo: string) => {
  switch (tipo) {
    case 'error':
      return '#F44336';
    case 'warning':
      return '#FFA726';
    case 'success':
      return '#66BB6A';
    case 'info':
      return '#1976D2';
    default:
      return '#1976D2';
  }
};
</script>

<template>
  <v-row class="mb-6">
    <!-- Productos Sin Stock -->
    <v-col cols="12" md="6" lg="4">
      <v-card elevation="0" class="dashboard-card danger">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <AlertTriangleIcon :size="24" color="#F44336" stroke-width="1.5" />
          <span>Sin Stock</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <div v-if="stocksSinStock.length === 0" class="pa-4 text-center">
            <p class="text-medium-emphasis mb-0">✓ Todos los productos disponibles</p>
          </div>
          <v-list v-else class="pa-0">
            <v-list-item 
              v-for="producto in stocksSinStock" 
              :key="producto.id"
              class="stock-item danger-item"
            >
              <template v-slot:prepend>
                <div class="stock-alert-icon danger">
                  <AlertCircleIcon :size="20" color="#F44336" stroke-width="1.5" />
                </div>
              </template>
              <v-list-item-title class="font-weight-600">{{ producto.nombre }}</v-list-item-title>
              <v-list-item-subtitle class="text-error">
                Stock: 0 unidades
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Productos con Stock Bajo -->
    <v-col cols="12" md="6" lg="4">
      <v-card elevation="0" class="dashboard-card warning">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <TrendingDownIcon :size="24" color="#FFA726" stroke-width="1.5" />
          <span>Stock Bajo (≤10)</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <div v-if="stocksBajos.length === 0" class="pa-4 text-center">
            <p class="text-medium-emphasis mb-0">✓ Stock en niveles normales</p>
          </div>
          <v-list v-else class="pa-0">
            <v-list-item 
              v-for="producto in stocksBajos" 
              :key="producto.id"
              class="stock-item warning-item"
            >
              <template v-slot:prepend>
                <div class="stock-alert-icon warning">
                  <AlertCircleIcon :size="20" color="#FFA726" stroke-width="1.5" />
                </div>
              </template>
              <v-list-item-title class="font-weight-600">{{ producto.nombre }}</v-list-item-title>
              <v-list-item-subtitle>
                Stock: <span class="font-weight-bold" style="color: #FFA726;">{{ producto.stock }}</span> unidades
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Alertas -->
    <v-col cols="12" lg="4">
      <v-card elevation="0" class="dashboard-card">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <AlertCircleIcon :size="24" color="#1976D2" stroke-width="1.5" />
          <span>Alertas</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list v-if="alertas.length > 0" class="pa-0">
            <v-list-item 
              v-for="alerta in alertas" 
              :key="alerta.id"
              class="alert-item"
            >
              <template v-slot:prepend>
                <v-avatar 
                  :color="getColorAlerta(alerta.tipo)" 
                  size="32"
                  class="d-flex align-center justify-center"
                >
                  <span class="text-white text-h6">!</span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-600">{{ alerta.titulo }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ alerta.mensaje }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <div v-else class="pa-4 text-center">
            <p class="text-medium-emphasis mb-0">✓ No hay alertas pendientes</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.dashboard-card {
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  }

  &.danger {
    border-color: #FFEBEE;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFEBEE 100%);

    &:hover {
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.15) !important;
    }
  }

  &.warning {
    border-color: #FFF3E0;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF3E0 100%);

    &:hover {
      box-shadow: 0 4px 12px rgba(255, 167, 38, 0.15) !important;
    }
  }
}

.stock-item,
.alert-item {
  border-bottom: 1px solid #F5F5F5;
  transition: all 0.2s ease;

  &:hover {
    background-color: #F9F9F9;
  }

  &.danger-item {
    &:hover {
      background-color: #FFEBEE;
    }
  }

  &.warning-item {
    &:hover {
      background-color: #FFF3E0;
    }
  }

  &:last-child {
    border-bottom: none;
  }
}

.stock-alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #FFF3E0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &.danger {
    background-color: #FFEBEE;
  }

  &.warning {
    background-color: #FFF3E0;
  }
}
</style>
