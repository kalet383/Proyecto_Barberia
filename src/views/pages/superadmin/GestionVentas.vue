<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Gestión de Ventas</h1>
      </v-col>
    </v-row>

    <!-- Estadísticas de Ventas -->
    <v-row v-if="estadisticas">
      <v-col cols="12" md="3">
        <v-card color="primary" dark>
          <v-card-text>
            <div class="text-h6">Total Ventas</div>
            <div class="text-h3 font-weight-bold">{{ estadisticas.totalVentas }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="text-h6">Ingresos Totales</div>
            <div class="text-h3 font-weight-bold">${{ estadisticas.ingresoTotal }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="text-h6">Promedio por Venta</div>
            <div class="text-h3 font-weight-bold">${{ estadisticas.promedioVenta }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="text-h6">Efectivo</div>
            <div class="text-h3 font-weight-bold">{{ estadisticas.ventasPorTipoPago?.efectivo || 0 }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mt-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar"
          variant="outlined"
          density="comfortable"
          clearable
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="fechaInicio"
          label="Fecha Inicio"
          type="date"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-text-field
          v-model="fechaFin"
          label="Fecha Fin"
          type="date"
          variant="outlined"
          density="comfortable"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="2">
        <v-btn
          block
          color="primary"
          size="large"
          @click="filtrarPorFecha"
        >
          Filtrar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Ventas -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Historial de Ventas</span>
            <v-btn
              color="success"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              Nueva Venta
            </v-btn>
          </v-card-title>

          <v-data-table
            :headers="headers"
            :items="ventas"
            :search="search"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.fechaVenta="{ item }">
              {{ formatDate(item.fechaVenta) }}
            </template>

            <template v-slot:item.cliente="{ item }">
              {{ item.cliente?.nombre }} {{ item.cliente?.apellido }}
            </template>

            <template v-slot:item.barbero="{ item }">
              {{ item.barbero ? `${item.barbero.nombre} ${item.barbero.apellido}` : 'N/A' }}
            </template>

            <template v-slot:item.producto="{ item }">
              {{ item.producto?.nombre }}
            </template>

            <template v-slot:item.total="{ item }">
              ${{ parseFloat(item.total).toFixed(2) }}
            </template>

            <template v-slot:item.tipoPago="{ item }">
              <v-chip :color="getPaymentColor(item.tipoPago)" size="small">
                {{ item.tipoPago }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn
                icon="mdi-delete"
                size="small"
                variant="text"
                color="error"
                @click="confirmDelete(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Nueva Venta -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Nueva Venta</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.clienteId"
                  :items="clientes"
                  item-title="nombre"
                  item-value="id"
                  label="Cliente"
                  variant="outlined"
                  :rules="[rules.required]"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="`${item.raw.nombre} ${item.raw.apellido}`" :subtitle="item.raw.email"></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.productoId"
                  :items="productos"
                  item-title="nombre"
                  item-value="id"
                  label="Producto"
                  variant="outlined"
                  :rules="[rules.required]"
                  @update:model-value="updatePrecio"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="item.raw.nombre" :subtitle="`$${item.raw.precio} - Stock: ${item.raw.stock}`"></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.cantidad"
                  label="Cantidad"
                  type="number"
                  variant="outlined"
                  :rules="[rules.required, rules.minValue]"
                  @input="calcularTotal"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.tipoPago"
                  :items="tiposPago"
                  label="Tipo de Pago"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="formData.barberoId"
                  :items="barberos"
                  item-title="nombre"
                  item-value="id"
                  label="Barbero (Opcional)"
                  variant="outlined"
                  clearable
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :title="`${item.raw.nombre} ${item.raw.apellido}`"></v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.notas"
                  label="Notas (Opcional)"
                  variant="outlined"
                  rows="2"
                ></v-textarea>
              </v-col>

              <v-col cols="12" v-if="totalCalculado > 0">
                <v-alert type="info" variant="tonal">
                  <strong>Total a pagar: ${{ totalCalculado.toFixed(2) }}</strong>
                </v-alert>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveVenta" :loading="saving">
            Registrar Venta
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro que desea eliminar esta venta? El stock del producto será restaurado.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteVenta" :loading="deleting">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVentaStore } from '@/stores/venta';
import { useSuperAdminStore } from '@/stores/superadmin';
import { useProductosStore } from '@/stores/useProductosStore';

const ventaStore = useVentaStore();
const superAdminStore = useSuperAdminStore();
const productosStore = useProductosStore();

const search = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');
const dialog = ref(false);
const deleteDialog = ref(false);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const ventaToDelete = ref<any>(null);
const estadisticas = ref<any>(null);
const totalCalculado = ref(0);
const precioUnitario = ref(0);

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Fecha', key: 'fechaVenta', sortable: true },
  { title: 'Cliente', key: 'cliente', sortable: false },
  { title: 'Producto', key: 'producto', sortable: false },
  { title: 'Cantidad', key: 'cantidad', sortable: true },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Tipo Pago', key: 'tipoPago', sortable: true },
  { title: 'Barbero', key: 'barbero', sortable: false },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const tiposPago = [
  { title: 'Efectivo', value: 'efectivo' },
  { title: 'Tarjeta', value: 'tarjeta' },
  { title: 'Transferencia', value: 'transferencia' },
];

const formData = ref({
  clienteId: null,
  barberoId: null,
  productoId: null,
  cantidad: 1,
  tipoPago: 'efectivo',
  notas: '',
});

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  minValue: (v: number) => v > 0 || 'Debe ser mayor a 0',
};

const ventas = computed(() => ventaStore.ventas);
const clientes = computed(() => superAdminStore.users.filter(u => u.role === 'cliente'));
const barberos = computed(() => superAdminStore.users.filter(u => u.role === 'barbero'));
const productos = computed(() => productosStore.productos);

const getPaymentColor = (tipo: string) => {
  const colors: Record<string, string> = {
    efectivo: 'success',
    tarjeta: 'primary',
    transferencia: 'info',
  };
  return colors[tipo] || 'grey';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const updatePrecio = () => {
  const producto = productos.value.find(p => p.id === formData.value.productoId);
  if (producto) {
    precioUnitario.value = parseFloat(producto.precio);
    calcularTotal();
  }
};

const calcularTotal = () => {
  totalCalculado.value = precioUnitario.value * formData.value.cantidad;
};

const openCreateDialog = () => {
  formData.value = {
    clienteId: null,
    barberoId: null,
    productoId: null,
    cantidad: 1,
    tipoPago: 'efectivo',
    notas: '',
  };
  totalCalculado.value = 0;
  precioUnitario.value = 0;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const saveVenta = async () => {
  saving.value = true;
  try {
    await ventaStore.createVenta(formData.value as any);
    showSnackbar('Venta registrada exitosamente', 'success');
    closeDialog();
    await loadEstadisticas();
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al registrar venta', 'error');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (venta: any) => {
  ventaToDelete.value = venta;
  deleteDialog.value = true;
};

const deleteVenta = async () => {
  deleting.value = true;
  try {
    await ventaStore.deleteVenta(ventaToDelete.value.id);
    showSnackbar('Venta eliminada exitosamente', 'success');
    deleteDialog.value = false;
    await loadEstadisticas();
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar venta', 'error');
  } finally {
    deleting.value = false;
  }
};

const filtrarPorFecha = async () => {
  loading.value = true;
  try {
    estadisticas.value = await ventaStore.getEstadisticas(fechaInicio.value, fechaFin.value);
  } catch (error) {
    showSnackbar('Error al filtrar ventas', 'error');
  } finally {
    loading.value = false;
  }
};

const loadEstadisticas = async () => {
  try {
    estadisticas.value = await ventaStore.getEstadisticas();
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      ventaStore.fetchVentas(),
      superAdminStore.fetchAllUsers(),
      productosStore.fetchProductos(),
      loadEstadisticas(),
    ]);
  } catch (error) {
    showSnackbar('Error al cargar datos', 'error');
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
