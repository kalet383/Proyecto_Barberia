<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVentaStore, EstadoVenta, type Venta } from '@/stores/venta';
import { useSuperAdminStore } from '@/stores/superadmin';
import { useProductoStore } from '@/stores/producto'; // Added import for producto store

const ventaStore = useVentaStore();
const superAdminStore = useSuperAdminStore();
const productosStore = useProductoStore(); // Added instance for producto store

const search = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');

const clientes = computed(() => superAdminStore.users.filter(u => u.role === 'cliente'));
const barberos = computed(() => superAdminStore.users.filter(u => u.role === 'barbero'));
const productos = computed(() => productosStore.productos);
const detalleDialog = ref(false);
const confirmDialog = ref(false);
const loading = ref(false);
const updating = ref(false);

const selectedVenta = ref<Venta | null>(null);
const nuevoEstado = ref<EstadoVenta | null>(null);
const estadisticas = ref<any>(null);

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Fecha', key: 'fechaVenta', sortable: true },
  { title: 'Cliente', key: 'cliente', sortable: false },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Tipo Pago', key: 'tipoPago', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const estadosVenta = Object.values(EstadoVenta);

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      ventaStore.fetchVentas(),
      productosStore.getProductos(),
      loadEstadisticas()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    loading.value = false;
  }
};

const loadEstadisticas = async () => {
  try {
    estadisticas.value = await ventaStore.getEstadisticas(fechaInicio.value, fechaFin.value);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
};

const getEstadoColor = (estado: EstadoVenta) => {
  const colors: Record<string, string> = {
    [EstadoVenta.PENDIENTE]: 'warning',
    [EstadoVenta.PAGADA]: 'info',
    [EstadoVenta.ENTREGADA]: 'success',
    [EstadoVenta.CANCELADA]: 'error'
  };
  return colors[estado] || 'grey';
};

const verDetalle = (venta: Venta) => {
  selectedVenta.value = venta;
  nuevoEstado.value = venta.estado;
  detalleDialog.value = true;
};

const guardarCambioEstado = async () => {
  if (!selectedVenta.value || !nuevoEstado.value) return;
  
  updating.value = true;
  try {
    await ventaStore.updateEstadoVenta(selectedVenta.value.id, nuevoEstado.value);
    detalleDialog.value = false;
    await loadData(); // Recargar para ver cambios y actualizar estadísticas
  } catch (error: any) {
    alert('Error al actualizar: ' + error.message);
  } finally {
    updating.value = false;
  }
};

const filtrar = async () => {
  loading.value = true;
  await loadEstadisticas();
  loading.value = false;
};
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6 text-primary">Gestión de Ventas</h1>
      </v-col>
    </v-row>

    <!-- Estadísticas -->
    <v-row v-if="estadisticas" class="mb-6">
      <v-col cols="12" md="3">
        <v-card elevation="2" class="rounded-lg">
          <v-card-text>
            <div class="text-overline mb-1">Ventas Totales</div>
            <div class="text-h4 font-weight-bold">{{ estadisticas.totalVentas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="2" class="rounded-lg">
          <v-card-text>
            <div class="text-overline mb-1 text-success">Ingresos</div>
            <div class="text-h4 font-weight-bold text-success">{{ formatCurrency(estadisticas.totalIngresos) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="2" class="rounded-lg">
          <v-card-text>
            <div class="text-overline mb-1 text-warning">Pendientes</div>
            <div class="text-h4 font-weight-bold text-warning">{{ estadisticas.ventasPorEstado.pendientes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card elevation="2" class="rounded-lg">
          <v-card-text>
            <div class="text-overline mb-1 text-info">Pagadas</div>
            <div class="text-h4 font-weight-bold text-info">{{ estadisticas.ventasPorEstado.pagadas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros y Tabla -->
    <v-card>
      <v-card-title class="d-flex align-center flex-wrap gap-4 py-4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar venta o cliente..."
          variant="outlined"
          density="compact"
          hide-details
          class="flex-grow-1"
          style="max-width: 300px;"
        ></v-text-field>

        <v-divider vertical class="mx-4 hidden-sm-and-down"></v-divider>

        <div class="d-flex gap-2 align-center">
          <v-text-field
            v-model="fechaInicio"
            type="date"
            label="Desde"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
          <v-text-field
            v-model="fechaFin"
            type="date"
            label="Hasta"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
          <v-btn icon="mdi-filter" variant="text" @click="filtrar"></v-btn>
        </div>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="ventaStore.ventas"
        :search="search"
        :loading="loading"
        hover
      >
        <template v-slot:item.fechaVenta="{ item }">
          {{ formatDate(item.fechaVenta) }}
        </template>

        <template v-slot:item.cliente="{ item }">
          <div v-if="item.cliente">
            <div class="font-weight-bold">{{ item.cliente.nombre }} {{ item.cliente.apellido }}</div>
            <div class="text-caption text-grey">{{ item.cliente.email }}</div>
          </div>
        </template>

        <template v-slot:item.total="{ item }">
          <span class="font-weight-black">{{ formatCurrency(item.total) }}</span>
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip :color="getEstadoColor(item.estado)" size="small" class="font-weight-bold">
            {{ item.estado }}
          </v-chip>
        </template>

        <template v-slot:item.tipoPago="{ item }">
          <div class="text-capitalize">{{ item.tipoPago?.toLowerCase().replace('_', ' ') }}</div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn color="primary" variant="text" size="small" @click="verDetalle(item)">
            Ver / Editar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialogo de Detalle -->
    <v-dialog v-model="detalleDialog" max-width="900" scrollable>
      <v-card v-if="selectedVenta">
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title>Venta #{{ selectedVenta.id }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" @click="detalleDialog = false"></v-btn>
        </v-toolbar>

        <v-card-text class="pa-4">
          <v-row>
            <!-- Info General -->
            <v-col cols="12" md="4" class="border-right">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">Información del Cliente</h3>
              <div class="mb-4">
                <div class="text-caption text-grey">Nombre</div>
                <div>{{ selectedVenta.cliente.nombre }} {{ selectedVenta.cliente.apellido }}</div>
              </div>
              <div class="mb-4">
                <div class="text-caption text-grey">Contacto</div>
                <div>{{ selectedVenta.cliente.email }}</div>
                <div>{{ selectedVenta.cliente.telefono }}</div>
              </div>
              <div class="mb-4" v-if="selectedVenta.direccionEnvio">
                <div class="text-caption text-grey">Dirección de Envío</div>
                <div>{{ selectedVenta.direccionEnvio }}</div>
              </div>
              
              <v-divider class="my-4"></v-divider>
              
              <h3 class="text-subtitle-1 font-weight-bold mb-4">Gestión de Estado</h3>
              <v-select
                v-model="nuevoEstado"
                :items="estadosVenta"
                label="Estado de la Venta"
                variant="outlined"
                density="compact"
              ></v-select>
              
              <div class="d-flex flex-column gap-2 mt-2">
                <div class="text-caption text-grey">
                  Nota: Al cambiar a 'CANCELADA', se restaurará el stock automáticamente.
                </div>
              </div>
            </v-col>

            <!-- Productos -->
            <v-col cols="12" md="8">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">Productos ({{ selectedVenta.detalles.length }})</h3>
              
              <v-table density="comfortable" class="border rounded mb-4">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th class="text-center">Cant.</th>
                    <th class="text-right">Precio</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in selectedVenta.detalles" :key="detalle.id">
                    <td>
                      <div class="d-flex align-center py-2">
                        <v-avatar rounded size="40" class="mr-3 bg-grey-lighten-3">
                          <v-img v-if="detalle.producto.imagenUrl" :src="detalle.producto.imagenUrl" cover></v-img>
                          <v-icon v-else>mdi-image</v-icon>
                        </v-avatar>
                        <div>
                          <div class="font-weight-medium">{{ detalle.producto.nombre }}</div>
                          <div class="text-caption text-grey">ID: {{ detalle.producto.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{{ detalle.cantidad }}</td>
                    <td class="text-right">{{ formatCurrency(detalle.precioUnitario) }}</td>
                    <td class="text-right font-weight-bold">{{ formatCurrency(detalle.subtotal) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-grey-lighten-4"> 
                  <tr>
                    <td colspan="3" class="text-right font-weight-bold">Total</td>
                    <td class="text-right font-weight-black">{{ formatCurrency(selectedVenta.total) }}</td>
                  </tr>
                </tfoot>
              </v-table>

              <div v-if="selectedVenta.notas" class="bg-amber-lighten-5 pa-3 rounded border border-amber-lighten-4">
                <div class="text-caption font-weight-bold text-amber-darken-4">Notas del Cliente:</div>
                <div class="text-body-2">{{ selectedVenta.notas }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 border-top">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="detalleDialog = false">Cerrar</v-btn>
          <v-btn 
            color="primary" 
            prepend-icon="mdi-content-save"
            @click="guardarCambioEstado"
            :loading="updating"
            :disabled="nuevoEstado === selectedVenta.estado"
          >
            Guardar Cambios
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.text-primary {
  color: rgb(var(--v-theme-primary));
}
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }
.border-right { border-right: 1px solid rgba(0,0,0,0.12); }

@media (max-width: 960px) {
  .border-right { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.12); padding-bottom: 16px; margin-bottom: 16px; }
}
</style>
