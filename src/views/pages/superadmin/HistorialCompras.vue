<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Historial de Compras</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table :headers="headers" :items="compras" :loading="loading">
            <template v-slot:item.proveedor="{ item }">
              {{ item.proveedor?.nombre }}
            </template>

            <template v-slot:item.total="{ item }">
              {{ formatCurrency(Number(item.total || 0)) }}
            </template>

            <template v-slot:item.estado="{ item }">
              <v-chip :color="item.activo ? 'success' : 'grey'" size="small">{{ item.activo ? 'Activa' : 'Eliminada' }}</v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn size="small" color="primary" variant="tonal" @click="viewCompra(item)">Ver</v-btn>
              <v-btn size="small" color="error" variant="tonal" @click="deleteCompra(item)" :disabled="!item.activo">Eliminar</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>
          Detalles de compra #{{ selectedCompra?.id_compra }}
          <v-chip v-if="selectedCompra && !selectedCompra.activo" color="grey" size="small" class="ml-4">Eliminada</v-chip>
        </v-card-title>
        <v-card-text>
          <div v-if="selectedCompra">
            <div class="mb-4">Proveedor: <strong>{{ selectedCompra.proveedor?.nombre }}</strong></div>
            <v-table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio de compra</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in selectedCompra.detalles" :key="d.id_detalle">
                  <td>{{ d.producto?.nombre }}</td>
                  <td>{{ d.cantidad }}</td>
                  <td>{{ formatCurrency(Number(d.precio_compra)) }}</td>
                  <td>{{ formatCurrency(Number(d.subtotal)) }}</td>
                  <td>
                    <v-btn size="small" color="error" variant="text" @click="deleteDetalle(d)" :disabled="!selectedCompra.activo">Eliminar</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>

            <div class="mt-4 d-flex justify-space-between">
              <div>Total: <strong>{{ formatCurrency(Number(selectedCompra.total || 0)) }}</strong></div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">{{ snackbarText }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const compras = ref<any[]>([]);
const loading = ref(false);
const dialog = ref(false);
const selectedCompra = ref<any | null>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'ID', key: 'id_compra' },
  { title: 'Fecha', key: 'fecha_compra' },
  { title: 'Proveedor', key: 'proveedor' },
  { title: 'Total', key: 'total' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'actions' },
];

const fetchCompras = async () => {
  loading.value = true;
  try {
    const res = await api.get('/compra-producto');
    compras.value = res.data;
  } catch (error) {
    showSnackbar('Error al cargar compras', 'error');
  } finally {
    loading.value = false;
  }
};

const viewCompra = async (item: any) => {
  try {
    const res = await api.get(`/compra-producto/${item.id_compra}`);
    selectedCompra.value = res.data;
    dialog.value = true;
  } catch (error) {
    showSnackbar('Error al obtener detalles', 'error');
  }
};

const deleteCompra = async (item: any) => {
  try {
    await api.delete(`/compra-producto/${item.id_compra}`);
    showSnackbar('Compra eliminada', 'success');
    await fetchCompras();
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar compra', 'error');
  }
};

const deleteDetalle = async (detalle: any) => {
  try {
    await api.delete(`/detalle-compra/${detalle.id_detalle}`);
    showSnackbar('Detalle eliminado exitosamente', 'success');
    // refrescar compra
    if (selectedCompra.value) {
      const res = await api.get(`/compra-producto/${selectedCompra.value.id_compra}`);
      selectedCompra.value = res.data;
    }
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar detalle', 'error');
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchCompras();
});
</script>

<style scoped>
.text-h3 { color: rgb(var(--v-theme-primary)); }
</style>
