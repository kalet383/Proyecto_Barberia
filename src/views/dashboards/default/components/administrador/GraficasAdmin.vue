<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import api from '@/plugins/axios';
import VueApexCharts from 'vue3-apexcharts';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

interface ServicioDatos { nombre: string; cantidad: number; }
const serviciosMasUsuados = ref<ServicioDatos[]>([]);
const topProductos = ref<any[]>([]);
const citasEstadisticas = ref<any>({ completadas: 0, pendientes: 0, canceladas: 0 });
const metodosPagoStats = ref<any>({ transferencia: 0, contraEntrega: 0, efectivo: 0 });
const loading = ref(true);
const totalVentasCalculado = ref(0);
const hasVentasRegistradas = ref(false);

// Refs para categorías dinámicas
const chartServiciosCats = ref<string[]>([]);
const chartVentasCats = ref<string[]>([]);
const chartProductosCats = ref<string[]>([]);

// ═══ COMPUTED CHART OPTIONS (Más reactivos y limpios) ═══

const chartServiciosOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 6 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { 
    categories: chartServiciosCats.value, 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  yaxis: { 
    title: { text: 'Cantidad', style: { color: isDark.value ? '#94a3b8' : '#444' } }, 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  fill: { opacity: 1 },
  tooltip: { 
    theme: isDark.value ? 'dark' : 'light',
    y: { formatter: (val: number) => `${val} servicios` } 
  },
  colors: ['#ee6f38'],
  grid: { borderColor: isDark.value ? '#1e293b' : '#f0f0f0' }
}));

const chartVentasOptions = computed(() => ({
  chart: { type: 'area', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [20, 100] } },
  xaxis: { 
    categories: chartVentasCats.value, 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  yaxis: { 
    title: { text: 'Monto ($)', style: { color: isDark.value ? '#94a3b8' : '#444' } }, 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  tooltip: { 
    theme: isDark.value ? 'dark' : 'light',
    y: { formatter: (val: number) => `$${val.toLocaleString('es-CO')}` } 
  },
  colors: ['#4f8ef7', '#ee6f38'],
  grid: { borderColor: isDark.value ? '#1e293b' : '#f0f0f0' }
}));

const chartCitasOptions = computed(() => ({
  chart: { type: 'donut', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Completadas', 'Pendientes', 'Canceladas'],
  colors: ['#00e676', '#ffc107', '#ff5252'],
  plotOptions: { 
    pie: { 
      donut: { 
        size: '72%', 
        labels: { 
          show: true, 
          name: { show: true, color: isDark.value ? '#fff' : '#1a1a2e' }, 
          value: { show: true, color: isDark.value ? '#fff' : '#1a1a2e' }, 
          total: { show: true, label: 'Total', color: isDark.value ? '#94a3b8' : '#444' } 
        } 
      } 
    } 
  },
  dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
  stroke: { show: false },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}));

const chartPagosOptions = computed(() => ({
  chart: { type: 'donut', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  labels: ['Transferencia', 'Contra Entrega', 'Efectivo'],
  colors: ['#4f8ef7', '#ee6f38', '#00e676'],
  plotOptions: { 
    pie: { 
      donut: { 
        size: '70%', 
        labels: { 
          show: true, 
          name: { show: true, color: isDark.value ? '#fff' : '#1a1a2e' }, 
          value: { show: true, color: isDark.value ? '#fff' : '#1a1a2e' } 
        } 
      } 
    } 
  },
  dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` },
  stroke: { show: false },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}));

const chartProductosOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, background: 'transparent' },
  theme: { mode: isDark.value ? 'dark' : 'light' },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: { 
    categories: chartProductosCats.value, 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  yaxis: { 
    labels: { style: { colors: isDark.value ? '#94a3b8' : '#444' } } 
  },
  colors: ['#00e5ff'],
  grid: { borderColor: isDark.value ? '#1e293b' : '#f0f0f0' },
  tooltip: { theme: isDark.value ? 'dark' : 'light' }
}));

const chartServiciosSeries = ref<any>([{ name: 'Servicios', data: [] }]);
const chartVentasSeries = ref<any>([{ name: 'Venta Productos', data: [] }, { name: 'Servicios Citas', data: [] }]);
const chartCitasSeries = ref<any>([0, 0, 0]);
const chartPagosSeries = ref<any>([0, 0, 0]);
const chartProductosSeries = ref<any>([{ name: 'Unidades', data: [] }]);

// Style Computeds para contenedores
const cardStyles = computed(() => {
  if (isDark.value) {
    return {
      bg: '#111827',
      border: '#1e293b',
      borderInner: '#1f2937',
      txtPrimary: '#ffffff',
      txtSecondary: '#94a3b8',
      headerBg: 'rgba(255,255,255,0.02)',
      itemHover: 'rgba(255,255,255,0.03)',
    };
  }
  return {
    bg: 'white',
    border: '#eee',
    borderInner: '#f0f0f0',
    txtPrimary: '#1a1a2e',
    txtSecondary: '#444',
    headerBg: 'transparent',
    itemHover: '#fafafa',
  };
});

// ═══ LOAD DATA ═══

onMounted(async () => {
  try {
    const fetchSafe = async (url: string) => {
      try { return (await api.get(url)).data || []; } catch { return []; }
    };

    const [citas, ventas, serviciosGlobal] = await Promise.all([
      fetchSafe('/cita'), fetchSafe('/ventas'), fetchSafe('/servicio')
    ]);

    // Citas
    let completadas = 0, pendientes = 0, canceladas = 0;
    (citas as any[]).forEach((c: any) => {
      if (c.estado === 'completado') completadas++;
      else if (c.estado === 'cancelado') canceladas++;
      else pendientes++;
    });
    citasEstadisticas.value = { completadas, pendientes, canceladas };
    chartCitasSeries.value = [completadas, pendientes, canceladas];

    // Servicios ranking
    if (serviciosGlobal.length > 0) {
      const conteo: Record<string, number> = {};
      serviciosGlobal.forEach((s: any) => { conteo[s.id] = 0; });
      (citas as any[]).forEach((c: any) => {
        const sid = c.servicioId || c.servicio?.id;
        if (sid && conteo[sid] !== undefined) conteo[sid]++;
      });
      const ranking = serviciosGlobal.map((s: any) => ({ nombre: s.nombre, id: s.id, cantidad: conteo[s.id] || 0 }));
      serviciosMasUsuados.value = ranking.sort((a: any, b: any) => b.cantidad - a.cantidad).slice(0, 5);
      chartServiciosCats.value = serviciosMasUsuados.value.map(s => s.nombre.substring(0, 12));
      chartServiciosSeries.value = [{ name: 'Servicios', data: serviciosMasUsuados.value.map(s => s.cantidad) }];
    }

    // Ventas por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const cm = new Date().getMonth();
    const labels: string[] = [], dVentas: number[] = [], dCitas: number[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = cm - i; if (m < 0) m += 12;
      labels.push(meses[m]);
      const vMes = (ventas as any[]).filter((v: any) => new Date(v.fechaVenta).getMonth() === m);
      dVentas.push(vMes.reduce((a: number, v: any) => a + (Number(v.total) || 0), 0));
      dCitas.push((citas as any[]).filter((c: any) => new Date(c.fechaInicio).getMonth() === m && c.estado === 'completado').length * 25000);
    }
    chartVentasCats.value = labels;
    chartVentasSeries.value = [{ name: 'Venta Productos', data: dVentas }, { name: 'Servicios Citas', data: dCitas }];
    totalVentasCalculado.value = dVentas.reduce((a, b) => a + b, 0) || 0;
    hasVentasRegistradas.value = dVentas.some(v => v > 0) || dCitas.some(v => v > 0);

    // Métodos de pago y productos
    let transf = 0, contra = 0, efec = 0;
    const cProd: Record<string, { nombre: string; cantidad: number }> = {};
    (ventas as any[]).forEach((v: any) => {
      if (v.tipoPago === 'TRANSFERENCIA') transf++;
      else if (v.tipoPago === 'PAGO_CONTRA_ENTREGA') contra++;
      else efec++;
      if (v.items && Array.isArray(v.items)) {
        v.items.forEach((item: any) => {
          if (item.producto?.nombre) {
            if (!cProd[item.producto.id]) cProd[item.producto.id] = { nombre: item.producto.nombre, cantidad: 0 };
            cProd[item.producto.id].cantidad += item.cantidad;
          }
        });
      }
    });
    metodosPagoStats.value = { transferencia: transf, contraEntrega: contra, efectivo: efec };
    chartPagosSeries.value = [transf, contra, efec];
    const pRank = Object.values(cProd).sort((a: any, b: any) => b.cantidad - a.cantidad).slice(0, 5);
    topProductos.value = pRank;
    chartProductosCats.value = pRank.map(p => p.nombre.substring(0, 15));
    chartProductosSeries.value = [{ name: 'Unidades', data: pRank.map(p => p.cantidad) }];
  } catch (error) {
    console.error('Error cargando gráficas:', error);
  } finally {
    loading.value = false;
  }
});

// Flag para forzar refresco limpio si es necesario
const renderReady = ref(true);
watch(isDark, () => {
  renderReady.value = false;
  nextTick(() => {
    renderReady.value = true;
  });
});
</script>

<template>
  <v-row v-if="loading" class="mb-6">
    <v-col v-for="n in 4" :key="n" cols="12" md="6">
      <v-skeleton-loader type="card" rounded="lg" height="420" />
    </v-col>
  </v-row>

  <v-row v-else class="mb-6">
    <!-- SERVICIOS MÁS PEDIDOS -->
    <v-col cols="12" lg="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-scissors" :style="{ color: isDark ? '#d8b4fe' : '#6a1b9a' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Servicios Más Pedidos</span>
        </div>
        <div style="padding: 16px; min-height: 332px;">
          <VueApexCharts v-if="renderReady && serviciosMasUsuados.length > 0" type="bar" :options="chartServiciosOptions" :series="chartServiciosSeries" height="300" />
          <div v-else-if="!loading && serviciosMasUsuados.length === 0" style="height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
             <p :style="{ color: cardStyles.txtSecondary }">Sin datos de servicios</p>
          </div>
        </div>
      </div>
    </v-col>

    <!-- FLUJO DE INGRESOS -->
    <v-col cols="12" lg="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-chart-line" :style="{ color: isDark ? '#93c5fd' : '#1565c0' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Flujo de Ingresos (6 meses)</span>
        </div>
        <div style="padding: 16px; min-height: 372px;">
          <VueApexCharts v-if="renderReady && hasVentasRegistradas" type="area" :options="chartVentasOptions" :series="chartVentasSeries" height="340" />
          <div v-else-if="!loading && !hasVentasRegistradas" style="height: 340px; display: flex; align-items: center; justify-content: center;">
             <p :style="{ color: cardStyles.txtSecondary }">Sin flujo registrado</p>
          </div>
        </div>
      </div>
    </v-col>

    <!-- ESTADO DE CITAS -->
    <v-col cols="12" md="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-calendar-check" :style="{ color: isDark ? '#00e676' : '#2e7d32' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Estado de Citas</span>
        </div>
        <div style="padding: 16px; min-height: 332px;">
          <VueApexCharts v-if="renderReady && (citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas > 0)" type="donut" :options="chartCitasOptions" :series="chartCitasSeries" height="300" />
          <div v-else style="height: 300px; display: flex; align-items: center; justify-content: center;">
             <p :style="{ color: cardStyles.txtSecondary }">Sin datos de citas</p>
          </div>
        </div>
      </div>
    </v-col>

    <!-- TOP PRODUCTOS -->
    <v-col cols="12" md="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-box-open" :style="{ color: isDark ? '#4dd0e1' : '#00838f' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Top Productos Vendidos</span>
        </div>
        <div style="padding: 16px; min-height: 332px;">
          <VueApexCharts v-if="renderReady && topProductos.length > 0" type="bar" :options="chartProductosOptions" :series="chartProductosSeries" height="300" />
          <div v-else style="height: 300px; display: flex; align-items: center; justify-content: center;">
             <p :style="{ color: cardStyles.txtSecondary }">Sin ventas de productos</p>
          </div>
        </div>
      </div>
    </v-col>

    <!-- MÉTODOS DE PAGO -->
    <v-col cols="12" md="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-credit-card" :style="{ color: isDark ? '#93c5fd' : '#1565c0' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Métodos de Pago</span>
        </div>
        <div style="padding: 16px; min-height: 332px;">
          <VueApexCharts v-if="renderReady && (metodosPagoStats.transferencia + metodosPagoStats.contraEntrega + metodosPagoStats.efectivo > 0)" type="donut" :options="chartPagosOptions" :series="chartPagosSeries" height="300" />
          <div v-else style="height: 300px; display: flex; align-items: center; justify-content: center;">
             <p :style="{ color: cardStyles.txtSecondary }">Sin pagos registrados</p>
          </div>
        </div>
      </div>
    </v-col>

    <!-- RESUMEN DEL PERÍODO -->
    <v-col cols="12" md="6">
      <div :style="{ border: `1px solid ${cardStyles.border}`, borderRadius: '12px', background: cardStyles.bg, transition: 'all 0.3s ease', overflow: 'hidden' }">
        <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardStyles.borderInner}`, background: cardStyles.headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
          <i class="fas fa-chart-pie" :style="{ color: isDark ? '#ff9a6c' : '#e65100' }"></i>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: cardStyles.txtPrimary }">Resumen del Período</span>
        </div>
        <div style="padding: 20px;">
          <v-row dense>
             <v-col cols="6">
                <div :style="{ padding: '16px', borderRadius: '10px', background: isDark ? 'rgba(106,27,154,0.1)' : '#f3e5f5', border: `1px solid ${isDark ? '#4c1d95' : '#e1bee7'}`, textAlign: 'center' }">
                   <p :style="{ fontSize: '0.72rem', color: cardStyles.txtSecondary, margin: '0 0 4px', fontWeight: '600' }">Total Citas</p>
                   <p :style="{ fontSize: '1.5rem', fontWeight: '800', color: isDark ? '#fff' : '#6a1b9a', margin: '0' }">{{ citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas }}</p>
                </div>
             </v-col>
             <v-col cols="6">
                <div :style="{ padding: '16px', borderRadius: '10px', background: isDark ? 'rgba(79,142,247,0.1)' : '#e3f2fd', border: `1px solid ${isDark ? '#1e40af' : '#bbdefb'}`, textAlign: 'center' }">
                   <p :style="{ fontSize: '0.72rem', color: cardStyles.txtSecondary, margin: '0 0 4px', fontWeight: '600' }">Ventas</p>
                   <p :style="{ fontSize: '1.2rem', fontWeight: '800', color: isDark ? '#fff' : '#1565c0', margin: '0' }">${{ totalVentasCalculado.toLocaleString('es-CO') }}</p>
                </div>
             </v-col>
          </v-row>
          <div :style="{ marginTop: '16px', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#fafafa', borderRadius: '8px', border: `1px solid ${cardStyles.borderInner}` }">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span :style="{ fontSize: '0.78rem', fontWeight: '600', color: cardStyles.txtSecondary }">Tasa de completado</span>
                <span :style="{ fontSize: '0.78rem', fontWeight: '700', color: isDark ? '#00e676' : '#2e7d32' }">
                  {{ (citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas > 0) ? Math.round((citasEstadisticas.completadas / (citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas)) * 100) : 0 }}%
                </span>
              </div>
              <div :style="{ height: '8px', background: isDark ? '#1e293b' : '#eee', borderRadius: '4px', overflow: 'hidden' }">
                <div :style="{ height: '100%', width: ((citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas > 0) ? Math.round((citasEstadisticas.completadas / (citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas)) * 100) : 0) + '%', background: isDark ? '#00e676' : '#2e7d32', transition: 'width 1s ease' }"></div>
              </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
div { transition: background-color 0.3s ease, border-color 0.3s ease; }
</style>