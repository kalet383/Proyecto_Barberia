<template>
  <v-container fluid>
    <div class="page-header mb-6">
      <div class="d-flex align-center ga-3">
        <div class="header-icon">
          <i class="fas fa-history"></i>
        </div>
        <div>
          <h2 class="text-h5 font-weight-bold" :style="{ color: txtPrimary }">Historial de Compras</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">Registro de compras realizadas</p>
        </div>
      </div>
      <v-chip variant="tonal" color="#ee6f38" size="small" label>
        {{ compras.length }} compras
      </v-chip>
    </div>

    <v-card rounded="lg" elevation="0" class="table-card" :style="{ border: `1px solid ${cardBorder}`, background: cardBg }">
      <v-data-table :headers="headers" :items="compras" :loading="loading" hover items-per-page="10">

        <template v-slot:item.proveedor="{ item }">
          <div class="d-flex align-center ga-2 py-2">
            <v-avatar size="30" color="#ee6f38" variant="tonal">
              <span class="font-weight-bold" :style="{ fontSize: '0.65rem', color: isDark ? '#ffb74d' : '#ee6f38' }">{{ item.proveedor?.nombre?.charAt(0) }}</span>
            </v-avatar>
            <span class="font-weight-bold text-body-2" :style="{ color: txtPrimary }">{{ item.proveedor?.nombre }}</span>
          </div>
        </template>

        <template v-slot:item.total="{ item }">
          <span class="font-weight-bold" :style="{ color: txtPrimary }">{{ formatCurrency(Number(item.total || 0)) }}</span>
        </template>

        <template v-slot:item.estado="{ item }">
          <div class="d-flex align-center ga-1">
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700',
                background: statusStyles[item.estado]?.bg || '#f5f5f5',
                color: statusStyles[item.estado]?.text || '#757575',
              }"
            >
              <i :class="getStatusIcon(item.estado)" style="font-size: 10px;"></i>
              {{ item.estado }}
            </span>

            <span
              v-if="!item.activo"
              :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '700', background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: txtSecondary }"
            >
              <i class="fas fa-ban" style="font-size: 8px;"></i>
              Eliminada
            </span>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex ga-2">
            <button
              class="btn-action view"
              @click="viewCompra(item)"
            >
              <i class="fas fa-eye" style="font-size: 11px;"></i>
              Ver
            </button>

            <button
              v-if="isAdmin"
              :disabled="!item.activo"
              class="btn-action delete"
              :class="{ 'disabled': !item.activo }"
              @click="item.activo && deleteCompra(item)"
            >
              <i class="fas fa-trash" style="font-size: 11px;"></i>
              Eliminar
            </button>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-8">
            <div class="empty-icon mb-3" :style="{ background: isDark ? 'rgba(238,111,56,0.1)' : 'rgba(238,111,56,0.08)' }"><i class="fas fa-clipboard-list"></i></div>
            <p class="font-weight-bold mb-1" :style="{ color: txtPrimary }">Sin compras</p>
            <p class="text-caption text-medium-emphasis">Las compras aparecerán aquí</p>
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog Detalle -->
    <v-dialog v-model="dialog" max-width="780" scrollable>
      <v-card v-if="selectedCompra" rounded="lg" :style="{ background: cardBg }">
        <div class="dialog-header">
          <div class="d-flex align-center ga-3">
            <div class="dialog-icon" :style="{ background: isDark ? 'rgba(238,111,56,0.15)' : 'rgba(238,111,56,0.1)' }"><i class="fas fa-file-invoice"></i></div>
            <div>
              <h3 class="font-weight-bold" :style="{ fontSize: '1.1rem', color: txtPrimary }">Compra #{{ selectedCompra.id_compra }}</h3>
              <p :style="{ fontSize: '0.75rem', color: txtSecondary, marginBottom: 0 }">{{ selectedCompra.proveedor?.nombre }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: '700',
                background: statusStyles[selectedCompra.estado]?.bg,
                color: statusStyles[selectedCompra.estado]?.text,
              }"
            >
              <i :class="getStatusIcon(selectedCompra.estado)" style="font-size: 10px;"></i>
              {{ selectedCompra.estado }}
            </span>
            <v-btn icon variant="text" size="small" @click="dialog = false">
              <i class="fas fa-times" :style="{ color: txtSecondary }"></i>
            </v-btn>
          </div>
        </div>

        <v-divider />

        <v-card-text class="pa-5" style="max-height: 55vh; overflow-y: auto;">
          <p class="section-label mb-3">
            <i class="fas fa-box mr-2" style="color: #4caf50; font-size: 12px;"></i>
            Productos ({{ selectedCompra.detalles?.length || 0 }})
          </p>

          <div class="detail-list">
            <div v-for="d in selectedCompra.detalles" :key="d.id_detalle" class="detail-row">
              <div class="flex-grow-1">
                <p class="font-weight-bold text-body-2 mb-0" :style="{ color: txtPrimary }">{{ d.producto?.nombre }}</p>
                <p class="text-caption text-medium-emphasis mb-0">
                  {{ d.cantidad }} × {{ formatCurrency(Number(d.precio_compra)) }}
                </p>
              </div>
              <span class="font-weight-bold text-body-2" :style="{ color: txtPrimary }">{{ formatCurrency(Number(d.subtotal)) }}</span>

              <button
                v-if="isAdmin && selectedCompra.activo"
                class="btn-delete-detail"
                @click="deleteDetalle(d)"
              >
                <i class="fas fa-times" style="font-size: 10px;"></i>
              </button>
            </div>
          </div>

          <div class="total-bar mt-4">
            <span class="font-weight-bold" :style="{ color: txtPrimary }">Total</span>
            <span class="total-amount">{{ formatCurrency(Number(selectedCompra.total || 0)) }}</span>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <button
            v-if="isAdmin && selectedCompra.estado === 'Pendiente'"
            class="btn-footer approve"
            @click="changeStatus('Completada')"
          >
            <i class="fas fa-check-circle" style="font-size: 13px;"></i>
            Completar
          </button>

          <button
            v-if="isAdmin && selectedCompra.estado === 'Pendiente'"
            class="btn-footer cancel"
            @click="changeStatus('Cancelada')"
          >
            <i class="fas fa-ban" style="font-size: 13px;"></i>
            Cancelar Compra
          </button>

          <v-spacer />
          <v-btn variant="outlined" :color="isDark ? 'grey-lighten-1' : 'grey-darken-1'" class="text-none" rounded="lg" @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" rounded="lg">
      <div class="d-flex align-center ga-2">
        <i :class="snackbarColor === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" style="font-size: 14px;"></i>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#f0f0f0');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

// ═══ INTERFACES (Esto elimina los errores de VS Code) ═══
interface Detalle {
  id_detalle: number;
  producto: { nombre: string };
  cantidad: number;
  precio_compra: number;
  subtotal: number;
}

interface Compra {
  id_compra: number;
  fecha_compra: string;
  proveedor: { nombre: string };
  total: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada';
  activo: boolean;
  detalles?: Detalle[];
}

const authStore = useAuthStore();
const isAdmin = computed(() => {
  const user = authStore.user as any;
  return user && user.Role === 'administrador';
});

const compras = ref<Compra[]>([]);
const loading = ref(false);
const dialog = ref(false);
const selectedCompra = ref<Compra | null>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'ID', key: 'id_compra', sortable: true },
  { title: 'Fecha', key: 'fecha_compra', sortable: true },
  { title: 'Proveedor', key: 'proveedor', sortable: false },
  { title: 'Total', key: 'total', sortable: true },
  { title: 'Estado', key: 'estado', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const statusStyles = computed<Record<string, { bg: string; text: string }>>(() => ({
  Pendiente: { bg: isDark.value ? 'rgba(255,152,0,0.15)' : '#fff3e0', text: isDark.value ? '#ffb74d' : '#e65100' },
  Completada: { bg: isDark.value ? 'rgba(76,175,80,0.15)' : '#e8f5e9', text: isDark.value ? '#4caf50' : '#2e7d32' },
  Cancelada: { bg: isDark.value ? 'rgba(244,67,54,0.15)' : '#ffebee', text: isDark.value ? '#ef5350' : '#c62828' },
}));

const getStatusIcon = (estado: string) => {
  if (estado === 'Completada') return 'fas fa-check-circle';
  if (estado === 'Cancelada') return 'fas fa-times-circle';
  return 'fas fa-clock';
};

const fetchCompras = async () => {
  loading.value = true;
  try {
    const { data } = await api.get('/compra-producto');
    compras.value = data;
  } catch {
    showSnackbar('Error al cargar', 'error');
  } finally {
    loading.value = false;
  }
};

const viewCompra = async (item: Compra) => {
  try {
    const { data } = await api.get(`/compra-producto/${item.id_compra}`);
    selectedCompra.value = data;
    dialog.value = true;
  } catch {
    showSnackbar('Error al obtener detalles', 'error');
  }
};

const deleteCompra = async (item: Compra) => {
  try {
    await api.delete(`/compra-producto/${item.id_compra}`);
    showSnackbar('Compra eliminada', 'success');
    await fetchCompras();
  } catch (e: any) {
    showSnackbar(e.response?.data?.message || 'Error', 'error');
  }
};

const deleteDetalle = async (d: Detalle) => {
  try {
    await api.delete(`/detalle-compra/${d.id_detalle}`);
    showSnackbar('Detalle eliminado', 'success');
    if (selectedCompra.value) {
      const { data } = await api.get(`/compra-producto/${selectedCompra.value.id_compra}`);
      selectedCompra.value = data;
    }
  } catch (e: any) {
    showSnackbar(e.response?.data?.message || 'Error', 'error');
  }
};

const changeStatus = async (s: 'Completada' | 'Cancelada') => {
  if (!selectedCompra.value) return;
  try {
    const { data } = await api.patch(`/compra-producto/${selectedCompra.value.id_compra}`, { estado: s });
    selectedCompra.value = data;
    showSnackbar(`Compra: ${s}`, 'success');
    await fetchCompras();
  } catch (e: any) {
    showSnackbar(e.response?.data?.message || 'Error', 'error');
  }
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => fetchCompras());
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25); }

.table-card { border: 1px solid v-bind('cardBorder'); overflow: hidden; background: v-bind('cardBg'); }
.empty-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(238,111,56,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 22px; color: #ee6f38; }

.btn-action {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 14px; border-radius: 8px; border: none; cursor: pointer;
  font-size: 0.78rem; font-weight: 700; transition: all 0.2s ease;
}
.btn-action.view { background: v-bind('isDark ? "rgba(30,136,229,0.15)" : "#e3f2fd"'); color: v-bind('isDark ? "#90caf9" : "#1565c0"'); }
.btn-action.delete { background: v-bind('isDark ? "rgba(244,67,54,0.15)" : "#ffebee"'); color: v-bind('isDark ? "#ef5350" : "#c62828"'); }
.btn-action.disabled { opacity: 0.5; cursor: not-allowed; background: #f5f5f5; color: #bdbdbd; }

.dialog-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; flex-wrap: wrap; gap: 10px; }
.dialog-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ee6f38; font-size: 15px; }

.section-label { font-size: 0.85rem; font-weight: 700; margin: 0; display: flex; align-items: center; }
.detail-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid v-bind('cardBorder'); }

.btn-delete-detail {
  width: 28px; height: 28px; border-radius: 8px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  background: v-bind('isDark ? "rgba(244,67,54,0.15)" : "#ffebee"'); color: v-bind('isDark ? "#ef5350" : "#c62828"'); transition: all 0.2s ease; margin-left: 8px;
}

.total-bar { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-radius: 10px; transition: all 0.3s ease; }
.total-amount { font-size: 1.25rem; font-weight: 800; color: #ee6f38; }

.btn-footer {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 10px; border: none; cursor: pointer;
  font-size: 0.85rem; font-weight: 700; transition: all 0.2s ease;
}
.btn-footer.approve { background: v-bind('isDark ? "rgba(76,175,80,0.15)" : "#e8f5e9"'); color: v-bind('isDark ? "#4caf50" : "#2e7d32"'); }
.btn-footer.cancel { background: v-bind('isDark ? "rgba(244,67,54,0.15)" : "#ffebee"'); color: v-bind('isDark ? "#ef5350" : "#c62828"'); margin-left: 8px; }

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .dialog-header { flex-direction: column; align-items: flex-start; }
}
</style>