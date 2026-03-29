<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useVentaStore, EstadoVenta, type Venta } from '@/stores/venta';
import { useSuperAdminStore } from '@/stores/superadmin';
import { useProductoStore } from '@/stores/producto';
import { useAuthStore } from '@/stores/auth';
import { useCustomizerStore } from '@/stores/customizer';

const authStore = useAuthStore();
const customizer = useCustomizerStore();
const isAdmin = computed(() => authStore.user && (authStore.user as any).Role === 'administrador');
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#f0f0f0');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');
const innerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');
const shadowColor = computed(() => isDark.value ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)');
const ventaStore = useVentaStore();
const superAdminStore = useSuperAdminStore();
const productosStore = useProductoStore();

const search = ref('');
const fechaInicio = ref('');
const fechaFin = ref('');
const detalleDialog = ref(false);
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

onMounted(async () => { await loadData(); });

const loadData = async () => {
  loading.value = true;
  try { await Promise.all([ventaStore.fetchVentas(), productosStore.getProductos(), loadEstadisticas()]); }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const loadEstadisticas = async () => {
  try { estadisticas.value = await ventaStore.getEstadisticas(fechaInicio.value, fechaFin.value); }
  catch (e) { console.error(e); }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const getEstadoColor = (estado: EstadoVenta) => {
  const c: Record<string, string> = {
    [EstadoVenta.PENDIENTE]: 'amber-darken-2',
    [EstadoVenta.PAGADA]:    'blue-darken-1',
    [EstadoVenta.ENTREGADA]: 'green-darken-1',
    [EstadoVenta.CANCELADA]: 'red-darken-1',
  };
  return c[estado] || 'grey';
};

const getEstadoIcon = (estado: EstadoVenta) => {
  const i: Record<string, string> = {
    [EstadoVenta.PENDIENTE]: 'fas fa-clock',
    [EstadoVenta.PAGADA]:    'fas fa-credit-card',
    [EstadoVenta.ENTREGADA]: 'fas fa-check-circle',
    [EstadoVenta.CANCELADA]: 'fas fa-times-circle',
  };
  return i[estado] || 'fas fa-question';
};

// ✅ NUEVO: color de texto para la palabra del estado
const getEstadoTextColor = (estado: string) => {
  const c: Record<string, string> = {
    PENDIENTE: isDark.value ? '#fbbf24' : '#f59e0b', // amber
    PAGADA:    isDark.value ? '#60a5fa' : '#2563eb', // blue
    ENTREGADA: isDark.value ? '#4ade80' : '#16a34a', // green
    CANCELADA: isDark.value ? '#f87171' : '#dc2626', // red
  };
  return c[estado] || (isDark.value ? '#9ca3af' : '#555');
};

const getEstadoLabel = (e: string) => {
  if (e === 'ENTREGADA') return 'Entregada';
  if (e === 'PAGADA')    return 'Pagada';
  if (e === 'PENDIENTE') return 'Pendiente';
  if (e === 'CANCELADA') return 'Cancelada';
  return e;
};

const formatTipoPago = (tipo: string) => {
  if (!tipo) return 'N/A';
  switch (tipo) {
    case 'TRANSFERENCIA': return 'Transferencia';
    case 'TRANSFERENCIA_BANCOLOMBIA': return 'Transferencia Bancolombia';
    case 'TRANSFERENCIA_DAVIVIENDA': return 'Transferencia Davivienda';
    case 'WOMPI': return 'Pago con Wompi';
    case 'EFECTIVO': return 'Efectivo';
    case 'PAGO_CONTRA_ENTREGA': return 'Pago Contra Entrega';
    default: return tipo.replace(/_/g, ' ');
  }
};

const getStatIcon = (key: string) => {
  const m: Record<string, { icon: string; bg: string; color: string }> = {
    total:       { icon: 'fas fa-shopping-bag', bg: 'rgba(238,111,56,0.1)', color: '#ee6f38' },
    ingresos:    { icon: 'fas fa-dollar-sign',  bg: 'rgba(76,175,80,0.1)',  color: '#4caf50' },
    pendientes:  { icon: 'fas fa-clock',         bg: 'rgba(255,193,7,0.1)', color: '#ffc107' },
    completadas: { icon: 'fas fa-check-double',  bg: 'rgba(33,150,243,0.1)',color: '#2196f3' },
  };
  return m[key];
};

const verDetalle = (venta: Venta) => { selectedVenta.value = venta; nuevoEstado.value = venta.estado; detalleDialog.value = true; };

const guardarCambioEstado = async () => {
  if (!selectedVenta.value || !nuevoEstado.value) return;
  updating.value = true;
  try { await ventaStore.updateEstadoVenta(selectedVenta.value.id, nuevoEstado.value); detalleDialog.value = false; await loadData(); }
  catch (e: any) { alert('Error: ' + e.message); }
  finally { updating.value = false; }
};

const filtrar = async () => { loading.value = true; await loadEstadisticas(); loading.value = false; };
</script>

<template>
  <v-container fluid>
    <!-- ═══ HEADER ═══ -->
    <div class="page-header mb-6">
      <div class="d-flex align-center ga-3">
        <div class="header-icon"><i class="fas fa-receipt"></i></div>
        <div>
          <h2 class="text-h5 font-weight-bold" :style="{ color: txtPrimary }">Gestión de Ventas</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">Control y seguimiento de ventas</p>
        </div>
      </div>
      <v-btn variant="tonal" color="#ee6f38" size="small" class="text-none font-weight-medium" rounded="lg" @click="loadData" :loading="loading">
        <i class="fas fa-sync-alt mr-2" style="font-size: 11px;"></i> Actualizar
      </v-btn>
    </div>

    <!-- ═══ STATS ═══ -->
    <v-row v-if="estadisticas" class="mb-6">
      <v-col v-for="(stat, idx) in [
        { key: 'total',       label: 'Ventas Totales', value: estadisticas.totalVentas, color: '#ee6f38', icon: 'fas fa-shopping-bag' },
        { key: 'ingresos',    label: 'Ingresos',       value: formatCurrency(estadisticas.totalIngresos), color: '#4caf50', icon: 'fas fa-dollar-sign' },
        { key: 'pendientes',  label: 'Pendientes',     value: estadisticas.ventasPorEstado.pendientes, color: '#ffb300', icon: 'fas fa-clock' },
        { key: 'completadas', label: 'Completadas',    value: (estadisticas.ventasPorEstado.pagadas || 0) + (estadisticas.ventasPorEstado.entregadas || 0), color: '#2196f3', icon: 'fas fa-check-double' },
      ]" :key="idx" cols="6" md="3">
        <v-card class="stat-card" rounded="lg" elevation="0" :style="{ background: cardBg, borderColor: cardBorder }">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="stat-label" :style="{ color: isDark ? '#9ca3af' : '#666', fontWeight: '800' }">{{ stat.label }}</p>
                <p class="stat-value" :style="{ color: isDark ? '#fafafa' : '#1a1a2e' }">{{ stat.value }}</p>
              </div>
              <div class="stat-icon-box" :style="{ 
                background: isDark ? `${stat.color}15` : `${stat.color}10`, 
                color: stat.color,
                border: `1px solid ${isDark ? `${stat.color}40` : `${stat.color}20`}`
              }">
                <i :class="stat.icon"></i>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else-if="loading" class="mb-6">
      <v-col v-for="n in 4" :key="n" cols="6" md="3"><v-skeleton-loader type="card" rounded="lg" /></v-col>
    </v-row>

    <!-- ═══ TABLA ═══ -->
    <v-card rounded="lg" elevation="0" class="table-card">
      <div class="table-toolbar">
        <v-text-field v-model="search" placeholder="Buscar venta o cliente..." variant="outlined" density="compact" hide-details rounded="lg" class="search-field" :style="{ background: innerBg }">
          <template v-slot:prepend-inner><i class="fas fa-search" :style="{ color: isDark ? '#4b5563' : '#aaa', fontSize: '13px' }"></i></template>
        </v-text-field>
        <div class="filter-group">
          <v-text-field v-model="fechaInicio" type="date" label="Desde" variant="outlined" density="compact" hide-details rounded="lg" class="date-field" />
          <v-text-field v-model="fechaFin" type="date" label="Hasta" variant="outlined" density="compact" hide-details rounded="lg" class="date-field" />
          <v-tooltip text="Filtrar por fechas" location="top">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="tonal" color="#ee6f38" size="small" rounded="lg" @click="filtrar">
                <i class="fas fa-filter" style="font-size: 13px;"></i>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </div>

      <v-data-table :headers="headers" :items="ventaStore.ventas" :search="search" :loading="loading" hover items-per-page="10">
        <template v-slot:item.fechaVenta="{ item }">
          <div class="d-flex align-center ga-2">
            <div class="mini-icon" style="background: rgba(33,150,243,0.08); color: #2196f3;"><i class="far fa-calendar"></i></div>
            <span class="text-body-2">{{ formatDate(item.fechaVenta) }}</span>
          </div>
        </template>

        <template v-slot:item.cliente="{ item }">
          <div v-if="item.cliente" class="d-flex align-center ga-2 py-2">
            <v-avatar size="32" color="#ee6f38"><span class="text-white text-caption font-weight-bold">{{ item.cliente.nombre?.charAt(0) }}{{ item.cliente.apellido?.charAt(0) }}</span></v-avatar>
            <div>
              <p class="font-weight-bold text-body-2 mb-0" style="line-height: 1.3;">{{ item.cliente.nombre }} {{ item.cliente.apellido }}</p>
              <p class="text-caption text-medium-emphasis mb-0">{{ item.cliente.email }}</p>
            </div>
          </div>
        </template>

        <template v-slot:item.total="{ item }">
          <span class="font-weight-bold" :style="{ color: isDark ? '#fafafa' : '#1a1a2e' }">{{ formatCurrency(item.total) }}</span>
        </template>

        <!-- ✅ Estado en tabla: icono + palabra coloreada, sin chip -->
        <template v-slot:item.estado="{ item }">
          <div class="d-flex align-center ga-1">
            <i
              :class="getEstadoIcon(item.estado)"
              :style="{ color: getEstadoTextColor(item.estado), fontSize: '12px' }"
            ></i>
            <span
              class="font-weight-bold text-body-2"
              :style="{ color: getEstadoTextColor(item.estado) }"
            >
              {{ getEstadoLabel(item.estado) }}
            </span>
          </div>
        </template>

        <template v-slot:item.tipoPago="{ item }">
          <v-chip size="x-small" variant="tonal" color="grey-darken-1" label>
            <i class="fas fa-wallet mr-1" style="font-size: 9px;"></i>
            {{ formatTipoPago(item.tipoPago) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="text-center">
            <v-tooltip :text="isAdmin ? 'Gestionar venta' : 'Ver detalles'" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="tonal" color="#ee6f38" size="x-small" class="text-none font-weight-bold" rounded="lg" @click="verDetalle(item)">
                  <i :class="isAdmin ? 'fas fa-cog' : 'fas fa-eye'" class="mr-1" style="font-size: 10px;"></i>
                  {{ isAdmin ? 'Gestionar' : 'Ver' }}
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template v-slot:loading><v-skeleton-loader type="table-row@5" /></template>
        <template v-slot:no-data>
          <div class="text-center py-8">
            <div class="empty-icon mb-3" :style="{ background: isDark ? 'rgba(238,111,56,0.15)' : 'rgba(238,111,56,0.08)' }"><i class="fas fa-receipt"></i></div>
            <p class="font-weight-bold mb-1" :style="{ color: txtPrimary }">Sin ventas</p>
            <p class="text-caption text-medium-emphasis">Las ventas aparecerán aquí</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ═══ DIALOG DETALLE ═══ -->
    <v-dialog v-model="detalleDialog" max-width="880" scrollable>
      <v-card v-if="selectedVenta" rounded="lg">
        <div class="dialog-header">
          <div class="d-flex align-center ga-3">
            <div class="dialog-icon" :style="{ background: isDark ? 'rgba(238,111,56,0.15)' : 'rgba(238,111,56,0.1)' }"><i class="fas fa-file-invoice-dollar"></i></div>
            <div>
              <h3 class="font-weight-bold" :style="{ color: txtPrimary, fontSize: '1.1rem' }">Venta #{{ selectedVenta.id }}</h3>
              <p class="text-caption text-medium-emphasis mb-0">{{ formatDate(selectedVenta.fechaVenta) }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <!-- ✅ Estado en header del dialog: icono + palabra coloreada -->
            <div class="d-flex align-center ga-1">
              <i :class="getEstadoIcon(selectedVenta.estado)" :style="{ color: getEstadoTextColor(selectedVenta.estado), fontSize: '13px' }"></i>
              <span class="font-weight-bold text-body-2" :style="{ color: getEstadoTextColor(selectedVenta.estado) }">
                {{ getEstadoLabel(selectedVenta.estado) }}
              </span>
            </div>
            <v-btn icon variant="text" size="small" @click="detalleDialog = false"><i class="fas fa-times"></i></v-btn>
          </div>
        </div>
        <v-divider />
        <v-card-text class="pa-0" style="max-height: 65vh; overflow-y: auto;">
          <v-row no-gutters>
            <!-- Sidebar -->
            <v-col cols="12" md="4" class="sidebar-col">
              <div class="pa-5">
                <p class="section-label mb-3"><i class="fas fa-user-circle mr-2" style="color: #ee6f38; font-size: 13px;"></i>Cliente</p>
                <v-card variant="flat" rounded="lg" :color="isDark ? '#1e293b' : 'grey-lighten-5'" class="pa-3 mb-5">
                  <div class="d-flex align-center ga-3">
                    <v-avatar size="40" color="#ee6f38"><span class="text-white font-weight-bold text-caption">{{ selectedVenta.cliente.nombre?.charAt(0) }}{{ selectedVenta.cliente.apellido?.charAt(0) }}</span></v-avatar>
                    <div>
                      <p class="font-weight-bold text-body-2 mb-0">{{ selectedVenta.cliente.nombre }} {{ selectedVenta.cliente.apellido }}</p>
                      <p class="text-caption text-medium-emphasis mb-0">{{ selectedVenta.cliente.email }}</p>
                      <p class="text-caption text-medium-emphasis mb-0" v-if="selectedVenta.cliente.telefono">{{ selectedVenta.cliente.telefono }}</p>
                    </div>
                  </div>
                </v-card>

                <div class="mb-5" v-if="selectedVenta.direccionEnvio">
                  <p class="section-label mb-2"><i class="fas fa-map-marker-alt mr-2" style="color: #2196f3; font-size: 12px;"></i>Envío</p>
                  <p class="text-body-2 text-medium-emphasis">{{ selectedVenta.direccionEnvio }}</p>
                </div>

                <div class="mb-5">
                  <p class="section-label mb-2"><i class="fas fa-wallet mr-2" style="color: #9c27b0; font-size: 12px;"></i>Pago</p>
                  <v-chip size="small" variant="tonal" color="grey-darken-1" label>{{ formatTipoPago(selectedVenta.tipoPago) }}</v-chip>
                </div>

                <v-divider class="mb-5" />

                <template v-if="isAdmin">
                  <p class="section-label mb-3">
                    <i class="fas fa-sliders-h mr-2" style="color: #ff8f00; font-size: 12px;"></i>Cambiar Estado
                  </p>
                  <v-select
                    v-model="nuevoEstado"
                    :items="estadosVenta"
                    label="Estado"
                    variant="outlined"
                    density="compact"
                    rounded="lg"
                    color="#ee6f38"
                    hide-details
                  >
                    <!-- ✅ Valor seleccionado: icono + palabra coloreada -->
                    <template v-slot:selection="{ item }">
                      <div class="d-flex align-center ga-2">
                        <i
                          :class="getEstadoIcon(item.value as EstadoVenta)"
                          :style="{ color: getEstadoTextColor(item.value), fontSize: '12px' }"
                        ></i>
                        <span
                          class="font-weight-bold text-body-2"
                          :style="{ color: getEstadoTextColor(item.value) }"
                        >
                          {{ getEstadoLabel(item.value) }}
                        </span>
                      </div>
                    </template>

                    <!-- ✅ Cada opción: icono + palabra coloreada, sin fondo -->
                    <template v-slot:item="{ item, props }">
                      <v-list-item v-bind="props" title="">
                        <template v-slot:title>
                          <div class="d-flex align-center ga-2">
                            <i
                              :class="getEstadoIcon(item.value as EstadoVenta)"
                              :style="{ color: getEstadoTextColor(item.value), fontSize: '12px' }"
                            ></i>
                            <span
                              class="font-weight-bold text-body-2"
                              :style="{ color: getEstadoTextColor(item.value) }"
                            >
                              {{ getEstadoLabel(item.value) }}
                            </span>
                          </div>
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>
                  <p class="text-caption text-medium-emphasis mt-2">
                    <i class="fas fa-info-circle mr-1" style="font-size: 10px; color: #ffc107;"></i>Al cancelar se restaura el stock.
                  </p>
                </template>

                <template v-else>
                  <p class="section-label mb-3"><i class="fas fa-info-circle mr-2" style="color: #2196f3; font-size: 12px;"></i>Estado</p>
                  <!-- ✅ Estado sidebar no-admin: icono + palabra coloreada -->
                  <div class="d-flex align-center ga-2">
                    <i :class="getEstadoIcon(selectedVenta.estado)" :style="{ color: getEstadoTextColor(selectedVenta.estado), fontSize: '13px' }"></i>
                    <span class="font-weight-bold text-body-2" :style="{ color: getEstadoTextColor(selectedVenta.estado) }">
                      {{ getEstadoLabel(selectedVenta.estado) }}
                    </span>
                  </div>
                </template>
              </div>
            </v-col>

            <!-- Productos -->
            <v-col cols="12" md="8">
              <div class="pa-5">
                <p class="section-label mb-3">
                  <i class="fas fa-box mr-2" style="color: #4caf50; font-size: 12px;"></i>Productos
                  <v-chip size="x-small" color="#4caf50" variant="tonal" class="ml-2">{{ selectedVenta.detalles.length }}</v-chip>
                </p>
                <div class="detail-list">
                  <div v-for="detalle in selectedVenta.detalles" :key="detalle.id" class="detail-row">
                    <v-avatar rounded="lg" size="44" class="product-thumb">
                      <v-img v-if="detalle.producto.imagenUrl" :src="detalle.producto.imagenUrl" cover />
                      <i v-else class="fas fa-image" style="color: #ccc; font-size: 16px;"></i>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <p class="font-weight-bold text-body-2 mb-0">{{ detalle.producto.nombre }}</p>
                      <p class="text-caption text-medium-emphasis mb-0">
                        {{ detalle.cantidad }} ×
                        <template v-if="detalle.en_oferta">
                          <span class="text-green-darken-2 font-weight-bold">{{ formatCurrency(detalle.precioUnitario) }}</span>
                          <span class="text-decoration-line-through ml-1">{{ formatCurrency(detalle.precio_original ?? 0) }}</span>
                        </template>
                        <template v-else>{{ formatCurrency(detalle.precioUnitario) }}</template>
                      </p>
                    </div>
                    <v-chip v-if="detalle.en_oferta" size="x-small" color="green" variant="tonal" label class="mr-2">
                      <i class="fas fa-bolt mr-1" style="font-size: 8px;"></i>Oferta
                    </v-chip>
                    <span class="font-weight-bold text-body-2" :class="detalle.en_oferta ? 'text-green-darken-2' : ''">{{ formatCurrency(detalle.subtotal) }}</span>
                  </div>
                </div>
                <div class="total-bar mt-4" :style="{ background: headerBg, borderColor: cardBorder }">
                  <span class="font-weight-bold" :style="{ color: txtPrimary }">Total</span>
                  <span class="total-amount">{{ formatCurrency(selectedVenta.total) }}</span>
                </div>
                <v-alert v-if="selectedVenta.notas" color="amber-lighten-5" border="start" border-color="amber-darken-1" density="compact" rounded="lg" class="mt-4">
                  <p class="text-caption font-weight-bold mb-1" style="color: #f57f17;"><i class="fas fa-sticky-note mr-1"></i>Notas</p>
                  <p class="text-body-2 mb-0">{{ selectedVenta.notas }}</p>
                </v-alert>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" color="grey-darken-1" class="text-none" rounded="lg" @click="detalleDialog = false">Cerrar</v-btn>
          <v-btn v-if="isAdmin" color="#ee6f38" variant="flat" class="text-none font-weight-bold" rounded="lg" @click="guardarCambioEstado" :loading="updating" :disabled="nuevoEstado === selectedVenta.estado">
            <i class="fas fa-save mr-2" style="font-size: 13px;"></i>Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25); }
.stat-card { border: 1px solid v-bind('cardBorder'); transition: all 0.25s ease; }
.stat-card:hover { border-color: rgba(238,111,56,0.3) !important; box-shadow: 0 10px 20px v-bind('shadowColor') !important; transform: translateY(-3px); }
.stat-label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-size: 1.5rem; font-weight: 900; line-height: 1.2; margin: 0; }
.stat-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.table-card { border: 1px solid v-bind('cardBorder'); overflow: hidden; background: v-bind('cardBg'); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 16px 20px; border-bottom: 1px solid v-bind('cardBorder'); }
.search-field { max-width: 280px; }
.filter-group { display: flex; align-items: center; gap: 8px; }
.date-field { max-width: 160px; }
.mini-icon { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
.empty-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(238,111,56,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 22px; color: #ee6f38; }
.dialog-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; flex-wrap: wrap; gap: 10px; background: v-bind('headerBg'); }
.dialog-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ee6f38; font-size: 15px; }
.sidebar-col { border-right: 1px solid v-bind('cardBorder'); background: v-bind('headerBg'); }
.section-label { font-size: 0.82rem; font-weight: 800; text-transform: uppercase; margin: 0; display: flex; align-items: center; letter-spacing: 0.5px; }
.detail-list { display: flex; flex-direction: column; }
.detail-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid v-bind('cardBorder'); }
.detail-row:last-child { border-bottom: none; }
.product-thumb { background: v-bind('innerBg'); border: 1px solid v-bind('cardBorder'); flex-shrink: 0; }
.total-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-radius: 14px; border: 1.5px solid v-bind('cardBorder'); transition: all 0.3s ease; }
.total-amount { font-size: 1.25rem; font-weight: 800; color: #ee6f38; }
@media (max-width: 960px) { .sidebar-col { border-right: none; border-bottom: 1px solid #f0f0f0; } .table-toolbar { flex-direction: column; align-items: stretch; } .search-field { max-width: 100%; } .date-field { max-width: 100%; flex: 1; } .stat-value { font-size: 1.2rem; } }
@media (max-width: 600px) { .page-header { flex-direction: column; align-items: flex-start; } .dialog-header { flex-direction: column; align-items: flex-start; } }
</style>