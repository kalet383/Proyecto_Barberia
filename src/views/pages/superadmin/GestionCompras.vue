<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Registrar Compra de Productos</h1>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="valid">
      <!-- 1️⃣ Datos generales de la compra -->
      <v-card class="mb-6">
        <v-card-title class="text-h5 pa-4 bg-light-primary text-primary">
          <v-icon start>mdi-file-document-outline</v-icon>
          Datos Generales
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="compra.id_proveedor"
                :items="proveedores"
                item-title="nombre"
                item-value="id"
                label="Proveedor"
                variant="outlined"
                :rules="[rules.required]"
                prepend-icon="mdi-account-tie"
                placeholder="Seleccione un proveedor"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="compra.fecha_compra"
                type="date"
                label="Fecha de Compra"
                variant="outlined"
                :rules="[rules.required]"
                prepend-icon="mdi-calendar"
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="compra.observacion"
                label="Observación (Opcional)"
                variant="outlined"
                prepend-icon="mdi-text"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2️⃣ Productos comprados -->
      <v-card class="mb-6">
        <v-card-title class="text-h5 pa-4 bg-light-primary text-primary d-flex justify-space-between align-center">
          <div>
            <v-icon start>mdi-package-variant</v-icon>
            Productos
          </div>
          <v-btn color="secondary" @click="addProductCallback" prepend-icon="mdi-plus">
            Agregar Producto
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <v-table>
            <thead>
              <tr>
                <th width="40%">Producto</th>
                <th width="15%">Cantidad</th>
                <th width="20%">Precio Unitario</th>
                <th width="20%">Total</th>
                <th width="5%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, index) in compra.detalles" :key="index">
                <td class="pa-2">
                  <v-autocomplete
                    v-model="detalle.id_producto"
                    :items="productos"
                    item-title="nombre"
                    item-value="id"
                    label="Seleccionar Producto"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :rules="[rules.required]"
                  ></v-autocomplete>
                </td>
                <td class="pa-2">
                  <v-text-field
                    v-model.number="detalle.cantidad"
                    type="number"
                    min="1"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :rules="[rules.required, rules.positive]"
                  ></v-text-field>
                </td>
                <td class="pa-2">
                  <v-text-field
                    v-model.number="detalle.precio_unitario"
                    type="number"
                    min="0"
                    prefix="$"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :rules="[rules.required, rules.positive]"
                  ></v-text-field>
                </td>
                <td class="pa-2">
                  <v-text-field
                    :value="formatCurrency(detalle.cantidad * detalle.precio_unitario)"
                    readonly
                    variant="filled"
                    density="compact"
                    hide-details
                    flat
                  ></v-text-field>
                </td>
                <td class="text-center">
                  <v-btn icon color="error" variant="text" size="small" @click="removeProduct(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="compra.detalles.length === 0">
                <td colspan="5" class="text-center py-6 text-grey">
                  No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Totales y Guardar -->
      <v-row class="justify-end">
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="pa-4 bg-grey-lighten-4">
            <div class="d-flex justify-space-between mb-2">
              <span class="text-subtitle-1">Total Compra:</span>
              <span class="text-h5 font-weight-bold text-primary">{{ formatCurrency(totalGeneral) }}</span>
            </div>
            
            <v-btn
              block
              color="primary"
              size="large"
              @click="submitCompra"
              :loading="saving"
              :disabled="!valid || compra.detalles.length === 0"
              class="mt-4"
              prepend-icon="mdi-content-save"
            >
              Guardar Compra
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const valid = ref(false);
const saving = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const proveedores = ref<any[]>([]);
const productos = ref<any[]>([]);

const compra = ref({
  id_proveedor: null,
  fecha_compra: new Date().toISOString().substr(0, 10),
  observacion: '',
  detalles: [] as any[]
});

const rules = {
  required: (v: any) => !!v || 'Requerido',
  positive: (v: number) => v > 0 || 'Debe ser mayor a 0',
};

const totalGeneral = computed(() => {
  return compra.value.detalles.reduce((acc, item) => {
    return acc + (Number(item.cantidad || 0) * Number(item.precio_unitario || 0));
  }, 0);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

const addProductCallback = () => {
  compra.value.detalles.push({
    id_producto: null,
    cantidad: 1,
    precio_unitario: 0
  });
};

const removeProduct = (index: number) => {
  compra.value.detalles.splice(index, 1);
};

const fetchData = async () => {
  try {
    const [provRes, prodRes] = await Promise.all([
      api.get('/proveedor'),
      api.get('/producto')
    ]);
    proveedores.value = provRes.data;
    productos.value = prodRes.data;
  } catch (error) {
    showSnackbar('Error al cargar datos necesarios', 'error');
  }
};

const submitCompra = async () => {
  if (!valid.value || compra.value.detalles.length === 0) return;

  saving.value = true;
  try {
    // Preparar el payload correcto
    const payload = {
      fecha_compra: compra.value.fecha_compra,
      id_proveedor: compra.value.id_proveedor,
      detalles: compra.value.detalles.map(d => ({
        id_producto: d.id_producto,
        cantidad: Number(d.cantidad),
        precio_unitario: Number(d.precio_unitario)
      }))
    };

    await api.post('/compra-producto', payload);
    showSnackbar('Compra registrada exitosamente', 'success');
    
    // Resetear formulario
    compra.value = {
      id_proveedor: null,
      fecha_compra: new Date().toISOString().substr(0, 10),
      observacion: '',
      detalles: []
    };
    
  } catch (error: any) {
    console.error(error);
    showSnackbar(error.response?.data?.message || 'Error al registrar compra', 'error');
  } finally {
    saving.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.text-h3 {
  color: rgb(var(--v-theme-primary));
}
.bg-light-primary {
  background-color: rgb(var(--v-theme-primary), 0.1);
}
</style>
