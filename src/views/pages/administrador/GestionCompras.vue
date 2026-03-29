<template>
  <v-container fluid>
    <!-- ═══ HEADER ═══ -->
    <div class="page-header mb-6">
      <div class="d-flex align-center ga-3">
        <div class="header-icon">
          <i class="fas fa-file-invoice"></i>
        </div>
        <div>
          <h2 class="text-h5 font-weight-bold page-title">Registrar Compra</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">Ingreso de productos al inventario</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <v-alert v-if="loading" type="info" variant="tonal" rounded="lg" class="mb-4" density="compact">
      <i class="fas fa-spinner fa-spin mr-2"></i> Cargando datos...
    </v-alert>

    <v-form ref="form" v-model="valid">
      <!-- ═══ DATOS GENERALES ═══ -->
      <v-card rounded="lg" elevation="0" class="section-card mb-5">
        <div class="section-header">
          <div class="section-icon">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <h3 class="section-title">Datos Generales</h3>
        </div>

        <v-card-text class="pa-5 pt-4">
          <v-row dense>
            <v-col cols="12" md="4">
              <v-autocomplete
                v-model="compra.id_proveedor"
                :items="proveedores"
                item-title="nombre"
                item-value="id"
                label="Proveedor"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="[rules.required]"
                placeholder="Seleccione"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-truck" style="color: #ee6f38; font-size: 14px;"></i>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="compra.fecha_compra"
                type="date"
                label="Fecha de Compra"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                :rules="[rules.required]"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-calendar" style="color: #ee6f38; font-size: 14px;"></i>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model="compra.observacion"
                label="Observación (opcional)"
                variant="outlined"
                density="comfortable"
                rounded="lg"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-sticky-note" style="color: #ee6f38; font-size: 14px;"></i>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- ═══ PRODUCTOS ═══ -->
      <v-card rounded="lg" elevation="0" class="section-card mb-5">
        <div class="section-header">
          <div class="d-flex align-center ga-2">
            <div class="section-icon">
              <i class="fas fa-boxes"></i>
            </div>
            <h3 class="section-title">Productos</h3>
            <v-chip v-if="compra.detalles.length > 0" size="x-small" color="#ee6f38" variant="tonal">
              {{ compra.detalles.length }}
            </v-chip>
          </div>
          <v-btn
            color="#ee6f38"
            variant="tonal"
            size="small"
            class="text-none font-weight-bold"
            rounded="lg"
            @click="addProductCallback"
          >
            <i class="fas fa-plus mr-1" style="font-size: 11px;"></i>
            Agregar
          </v-btn>
        </div>

        <v-card-text class="pa-0">
          <!-- Desktop table -->
          <v-table density="comfortable" class="products-table d-none d-md-table">
            <thead>
              <tr>
                <th style="width: 38%;">Producto</th>
                <th style="width: 15%;">Cantidad</th>
                <th style="width: 20%;">Precio Unit.</th>
                <th style="width: 20%;">Total</th>
                <th style="width: 7%;"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detalle, index) in compra.detalles" :key="index" class="product-row">
                <td class="pa-2">
                  <v-autocomplete
                    v-model="detalle.id_producto"
                    :items="productos"
                    item-title="nombre"
                    item-value="id"
                    label="Seleccionar"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rounded="lg"
                    :rules="[rules.required]"
                    @update:model-value="(val: number | null) => setPrecioFromProducto(index, val)"
                  />
                </td>
                <td class="pa-2">
                  <v-text-field
                    v-model.number="detalle.cantidad"
                    type="number"
                    min="1"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rounded="lg"
                    :rules="[rules.required, rules.positive]"
                  />
                </td>
                <td class="pa-2">
                  <v-text-field
                    v-model.number="detalle.precio_compra"
                    type="number"
                    min="0"
                    prefix="$"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rounded="lg"
                    :rules="[rules.required, rules.positive]"
                  />
                </td>
                <td class="pa-2">
                  <span class="font-weight-bold" style="color: #ee6f38;">
                    {{ formatCurrency(detalle.cantidad * detalle.precio_compra) }}
                  </span>
                </td>
                <td class="text-center">
                  <v-btn icon variant="text" size="small" color="red-darken-1" @click="removeProduct(index)">
                    <i class="fas fa-times" style="font-size: 13px;"></i>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Mobile cards -->
          <div class="d-md-none pa-4">
            <v-card
              v-for="(detalle, index) in compra.detalles"
              :key="index"
              variant="outlined"
              rounded="lg"
              class="mb-3 pa-3"
            >
              <div class="d-flex justify-space-between align-start mb-2">
                <span class="text-caption font-weight-bold">Producto {{ index + 1 }}</span>
                <v-btn icon variant="text" size="x-small" color="red-darken-1" @click="removeProduct(index)">
                  <i class="fas fa-times" style="font-size: 11px;"></i>
                </v-btn>
              </div>
              <v-autocomplete
                v-model="detalle.id_producto"
                :items="productos"
                item-title="nombre"
                item-value="id"
                label="Producto"
                variant="outlined"
                density="compact"
                hide-details
                rounded="lg"
                class="mb-2"
                @update:model-value="(val: number | null) => setPrecioFromProducto(index, val)"
              />
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="detalle.cantidad"
                    type="number"
                    label="Cantidad"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rounded="lg"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model.number="detalle.precio_compra"
                    type="number"
                    label="Precio"
                    prefix="$"
                    variant="outlined"
                    density="compact"
                    hide-details
                    rounded="lg"
                  />
                </v-col>
              </v-row>
              <p class="text-right font-weight-bold mt-2 mb-0" style="color: #ee6f38;">
                Total: {{ formatCurrency(detalle.cantidad * detalle.precio_compra) }}
              </p>
            </v-card>
          </div>

          <!-- Empty -->
          <div v-if="compra.detalles.length === 0" class="text-center py-8">
            <div class="empty-icon mb-3">
              <i class="fas fa-box-open"></i>
            </div>
            <p class="font-weight-bold mb-1 section-title">Sin productos</p>
            <p class="text-caption text-medium-emphasis">Haz clic en "Agregar" para comenzar</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- ═══ TOTAL Y GUARDAR ═══ -->
      <v-row class="justify-end">
        <v-col cols="12" md="4">
          <v-card rounded="lg" elevation="0" class="total-card">
            <v-card-text class="pa-5">
              <div class="d-flex justify-space-between align-center mb-4">
                <span class="font-weight-bold">Total Compra</span>
                <span class="total-amount">{{ formatCurrency(totalGeneral) }}</span>
              </div>
              <v-btn
                block
                size="large"
                color="#ee6f38"
                class="text-none font-weight-bold"
                rounded="lg"
                elevation="2"
                @click="submitCompra"
                :loading="saving"
                :disabled="!valid || compra.detalles.length === 0"
              >
                <i class="fas fa-save mr-2" style="font-size: 14px;"></i>
                Guardar Compra
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" rounded="lg">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '@/plugins/axios';

const valid = ref(false);
const saving = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const proveedores = ref<any[]>([]);
const productos = ref<any[]>([]);

const compra = ref({
  id_proveedor: null as number | null,
  fecha_compra: new Date().toISOString().substr(0, 10),
  observacion: '',
  detalles: [] as any[]
});

const rules = {
  required: (v: any) => !!v || 'Requerido',
  positive: (v: number) => v > 0 || 'Debe ser mayor a 0',
};

const totalGeneral = computed(() => {
  return compra.value.detalles.reduce((acc: number, item: any) => {
    return acc + (Number(item.cantidad || 0) * Number(item.precio_compra || 0));
  }, 0);
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const addProductCallback = () => {
  compra.value.detalles.push({ id_producto: null, cantidad: 1, precio_compra: 0 });
};

const setPrecioFromProducto = (index: number, productId: number | null) => {
  if (!productId) return;
  const prod = productos.value.find((p: any) => p.id === productId);
  if (prod) compra.value.detalles[index].precio_compra = Number(prod.precio_venta) || 0;
};

const removeProduct = (index: number) => {
  compra.value.detalles.splice(index, 1);
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [provRes, prodRes] = await Promise.all([api.get('/proveedor'), api.get('/producto')]);
    proveedores.value = provRes.data;
    productos.value = prodRes.data;
  } catch (error) {
    showSnackbar('Error al cargar datos', 'error');
  } finally {
    loading.value = false;
  }
};

const submitCompra = async () => {
  if (!valid.value) return;
  saving.value = true;
  try {
    const payloadCreate = {
      fecha_compra: compra.value.fecha_compra,
      id_proveedor: compra.value.id_proveedor,
      detalles: []
    };
    const createRes = await api.post('/compra-producto', payloadCreate);
    const createdCompra = createRes.data;

    for (const d of compra.value.detalles) {
      await api.post('/detalle-compra', {
        id_compra: createdCompra.id_compra,
        id_producto: d.id_producto,
        cantidad: Number(d.cantidad),
        precio_compra: Number(d.precio_compra)
      });
    }

    showSnackbar('Compra registrada exitosamente', 'success');
    compra.value = { id_proveedor: null, fecha_compra: new Date().toISOString().substr(0, 10), observacion: '', detalles: [] };
  } catch (error: any) {
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

onMounted(async () => { await fetchData(); });
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(238, 111, 56, 0.25);
}

.section-card {
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid;
  background: #fafafa;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(238, 111, 56, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ee6f38;
  font-size: 14px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: inherit;
  margin: 0;
}

.page-title {
  color: #1a1a2e;
}

.products-table th {
  background: #fafafa;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
}

/* ═══════════════════════════════════════
   THEME SWITCHING (DARK MODE)
═══════════════════════════════════════ */

/* Defaults for DarkTheme selector */
:deep(.v-theme--DarkTheme) {
  .section-card {
    border-color: rgba(255, 255, 255, 0.08) !important;
    background: #111827 !important;
  }
  
  .section-header, .products-table th {
    background: #1f2937 !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
  }
  
  .page-title, .section-title {
    color: #ffffff !important;
  }

  .products-table {
    border-color: rgba(255, 255, 255, 0.08);
  }

  .total-card {
    border-color: #ee6f38 !important;
    background: linear-gradient(135deg, #1e1b4b, #111827) !important;
    color: #ffffff !important;
  }

  .total-card .font-weight-bold {
    color: #e5e7eb !important;
  }
}

.v-theme--PurpleTheme .section-card,
.v-theme--PurpleTheme .section-header {
  border-color: #f0f0f0;
}


.product-row:hover {
  background: rgba(238, 111, 56, 0.03);
}

.empty-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(238, 111, 56, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 22px;
  color: #ee6f38;
}

.total-card {
  border: 2px solid #ee6f38;
  background: linear-gradient(135deg, #fff8f5, #ffffff);
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ee6f38;
}

@media (max-width: 600px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>