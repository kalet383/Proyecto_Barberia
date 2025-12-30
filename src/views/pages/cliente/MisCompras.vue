<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useVentaStore, EstadoVenta, type Venta } from '@/stores/venta';
import { useAuthStore } from '@/stores/auth';

const ventaStore = useVentaStore();
const authStore = useAuthStore();

const loading = ref(false);
const selectedVenta = ref<Venta | null>(null);
const showDetalleDialog = ref(false);
const showCancelarDialog = ref(false);
const ventaACancelar = ref<Venta | null>(null);

onMounted(async () => {
  await loadVentas();
});

const loadVentas = async () => {
  loading.value = true;
  try {
    await ventaStore.fetchMisVentas();
  } catch (error) {
    console.error('Error al cargar ventas:', error);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getEstadoColor = (estado: EstadoVenta) => {
  switch (estado) {
    case EstadoVenta.PENDIENTE:
      return 'warning';
    case EstadoVenta.PAGADA:
      return 'info';
    case EstadoVenta.ENTREGADA:
      return 'success';
    case EstadoVenta.CANCELADA:
      return 'error';
    default:
      return 'grey';
  }
};

const getEstadoIcon = (estado: EstadoVenta) => {
  switch (estado) {
    case EstadoVenta.PENDIENTE:
      return 'mdi-clock-outline';
    case EstadoVenta.PAGADA:
      return 'mdi-credit-card-check';
    case EstadoVenta.ENTREGADA:
      return 'mdi-package-variant-closed-check';
    case EstadoVenta.CANCELADA:
      return 'mdi-close-circle';
    default:
      return 'mdi-help-circle';
  }
};

const verDetalle = (venta: Venta) => {
  selectedVenta.value = venta;
  showDetalleDialog.value = true;
};

const confirmarCancelacion = (venta: Venta) => {
  ventaACancelar.value = venta;
  showCancelarDialog.value = true;
};

const cancelarVenta = async () => {
  if (!ventaACancelar.value) return;

  try {
    await ventaStore.cancelarVenta(ventaACancelar.value.id);
    showCancelarDialog.value = false;
    ventaACancelar.value = null;
    await loadVentas();
  } catch (error: any) {
    alert('Error al cancelar la venta: ' + (error.response?.data?.message || error.message));
  }
};

const puedeCancelar = (venta: Venta) => {
  return venta.estado === EstadoVenta.PENDIENTE;
};

const ventasOrdenadas = computed(() => {
  return [...ventaStore.misVentas].sort((a, b) => 
    new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()
  );
});
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div>
              <h2 class="text-h4 font-weight-bold">Mis Compras</h2>
              <p class="text-subtitle-1 text-grey mt-2">Historial de tus pedidos</p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-refresh" @click="loadVentas" :loading="loading">
              Actualizar
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row v-if="loading" class="mt-4">
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
              </v-col>
            </v-row>

            <v-row v-else-if="ventasOrdenadas.length === 0" class="mt-4">
              <v-col cols="12" class="text-center">
                <v-icon size="100" color="grey-lighten-2">mdi-shopping-outline</v-icon>
                <h3 class="text-h5 text-grey mt-4">No tienes compras registradas</h3>
                <p class="text-grey">Cuando realices una compra, aparecerá aquí</p>
                <v-btn color="primary" to="/" class="mt-4">
                  Ir a la tienda
                </v-btn>
              </v-col>
            </v-row>

            <v-row v-else>
              <v-col cols="12" md="6" lg="4" v-for="venta in ventasOrdenadas" :key="venta.id">
                <v-card variant="outlined" class="h-100">
                  <v-card-title class="d-flex align-center justify-space-between bg-grey-lighten-4">
                    <span class="text-h6">Pedido #{{ venta.id }}</span>
                    <v-chip :color="getEstadoColor(venta.estado)" size="small">
                      <v-icon :icon="getEstadoIcon(venta.estado)" size="small" class="mr-1"></v-icon>
                      {{ venta.estado }}
                    </v-chip>
                  </v-card-title>

                  <v-card-text>
                    <div class="mb-3">
                      <div class="text-caption text-grey">Fecha</div>
                      <div class="font-weight-medium">{{ formatDate(venta.fechaVenta) }}</div>
                    </div>

                    <div class="mb-3">
                      <div class="text-caption text-grey">Total</div>
                      <div class="text-h6 font-weight-bold text-primary">{{ formatCurrency(venta.total) }}</div>
                    </div>

                    <div class="mb-3">
                      <div class="text-caption text-grey">Método de pago</div>
                      <div class="font-weight-medium">{{ venta.tipoPago.replace('_', ' ') }}</div>
                    </div>

                    <div class="mb-3">
                      <div class="text-caption text-grey">Productos</div>
                      <div class="font-weight-medium">{{ venta.detalles.length }} artículo(s)</div>
                    </div>

                    <v-divider class="my-3"></v-divider>

                    <div class="d-flex gap-2">
                      <v-btn color="primary" variant="outlined" size="small" @click="verDetalle(venta)" block>
                        Ver Detalle
                      </v-btn>
                      <v-btn 
                        v-if="puedeCancelar(venta)" 
                        color="error" 
                        variant="outlined" 
                        size="small" 
                        @click="confirmarCancelacion(venta)"
                        block
                      >
                        Cancelar
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detalle Dialog -->
    <v-dialog v-model="showDetalleDialog" max-width="800">
      <v-card v-if="selectedVenta">
        <v-card-title class="bg-primary text-white">
          <div class="d-flex align-center justify-space-between">
            <span class="text-h5">Detalle del Pedido #{{ selectedVenta.id }}</span>
            <v-btn icon="mdi-close" variant="text" @click="showDetalleDialog = false"></v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-3">Información del Pedido</h3>
              <div class="mb-2">
                <strong>Estado:</strong>
                <v-chip :color="getEstadoColor(selectedVenta.estado)" size="small" class="ml-2">
                  {{ selectedVenta.estado }}
                </v-chip>
              </div>
              <div class="mb-2"><strong>Fecha:</strong> {{ formatDate(selectedVenta.fechaVenta) }}</div>
              <div class="mb-2"><strong>Método de pago:</strong> {{ selectedVenta.tipoPago.replace('_', ' ') }}</div>
              <div class="mb-2" v-if="selectedVenta.direccionEnvio">
                <strong>Dirección de envío:</strong> {{ selectedVenta.direccionEnvio }}
              </div>
              <div class="mb-2" v-if="selectedVenta.notas">
                <strong>Notas:</strong> {{ selectedVenta.notas }}
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <h3 class="text-h6 font-weight-bold mb-3">Resumen</h3>
              <div class="d-flex justify-space-between mb-2">
                <span>Subtotal:</span>
                <span class="font-weight-bold">{{ formatCurrency(selectedVenta.total) }}</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between text-h6 font-weight-bold">
                <span>Total:</span>
                <span class="text-primary">{{ formatCurrency(selectedVenta.total) }}</span>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <h3 class="text-h6 font-weight-bold mb-3">Productos</h3>
          <v-table>
            <thead>
              <tr>
                <th>Producto</th>
                <th class="text-center">Cantidad</th>
                <th class="text-right">Precio Unit.</th>
                <th class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="detalle in selectedVenta.detalles" :key="detalle.id">
                <td>
                  <div class="d-flex align-center">
                    <v-img 
                      v-if="detalle.producto.imagenUrl" 
                      :src="detalle.producto.imagenUrl" 
                      width="50" 
                      height="50" 
                      cover 
                      class="rounded mr-3"
                    ></v-img>
                    <span class="font-weight-medium">{{ detalle.producto.nombre }}</span>
                  </div>
                </td>
                <td class="text-center">{{ detalle.cantidad }}</td>
                <td class="text-right">{{ formatCurrency(detalle.precioUnitario) }}</td>
                <td class="text-right font-weight-bold">{{ formatCurrency(detalle.subtotal) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showDetalleDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cancelar Dialog -->
    <v-dialog v-model="showCancelarDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-error text-white">
          Cancelar Pedido
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-h6">¿Estás seguro de que deseas cancelar este pedido?</p>
          <p class="text-body-2 text-grey mt-2">
            Esta acción devolverá el stock de los productos y no se podrá deshacer.
          </p>
          <v-alert type="warning" variant="tonal" class="mt-4">
            Solo puedes cancelar pedidos en estado PENDIENTE
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-btn color="grey" variant="text" @click="showCancelarDialog = false">
            No, mantener pedido
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="flat" @click="cancelarVenta" :loading="ventaStore.loading">
            Sí, cancelar pedido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.text-primary {
  color: #ee6f38 !important;
}

.h-100 {
  height: 100%;
}
</style>
