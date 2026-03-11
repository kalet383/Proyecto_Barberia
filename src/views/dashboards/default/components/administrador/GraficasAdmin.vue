<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { TrendingUpIcon, ShoppingBagIcon, CutIcon, CalendarIcon } from 'vue-tabler-icons';
import VueApexCharts from 'vue3-apexcharts';

interface ServicioDatos {
  nombre: string;
  cantidad: number;
}

interface VentaDatos {
  mes: string;
  total: number;
}

const serviciosMasUsuados = ref<ServicioDatos[]>([]);
const ventasPorMes = ref<VentaDatos[]>([]);
const citasEstadisticas = ref<any>({});
const loading = ref(true);

// Datos de ejemplo para servicios
const chartServiciosOptions = ref<any>({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 6,
      dataLabels: { position: 'top' }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Corte', 'Barba', 'Tinte', 'Masaje', 'Shampoo']
  },
  yaxis: {
    title: { text: 'Cantidad de Servicios' }
  },
  fill: {
    opacity: 1,
    colors: ['#7B1FA2', '#1976D2', '#388E3C', '#FFA726', '#E91E63']
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} servicios`
    }
  },
  colors: ['#7B1FA2']
});

const chartServiciosSeries = ref<any>([
  {
    name: 'Cantidad de Servicios',
    data: [12, 8, 5, 15, 7]
  }
]);

// Datos de ejemplo para ventas
const chartVentasOptions = ref<any>({
  chart: {
    type: 'line',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: ['#1976D2', '#7B1FA2']
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
  },
  yaxis: {
    title: { text: 'Ventas ($)' }
  },
  tooltip: {
    y: {
      formatter: (val: number) => `$${val.toLocaleString('es-CO')}`
    }
  },
  colors: ['#1976D2', '#7B1FA2']
});

const chartVentasSeries = ref<any>([
  {
    name: 'Ventas Productos',
    data: [150000, 180000, 220000, 195000, 250000, 210000]
  },
  {
    name: 'Ganancias Servicios',
    data: [100000, 120000, 140000, 130000, 160000, 150000]
  }
]);

// Datos de ejemplo para citas
const chartCitasOptions = ref<any>({
  chart: {
    type: 'donut',
    toolbar: { show: false }
  },
  labels: ['Completadas', 'Pendientes', 'Canceladas'],
  colors: ['#66BB6A', '#FFA726', '#F44336'],
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: {
            show: true
          },
          value: {
            show: true,
            formatter: (val: any) => `${val}`
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${Math.round(val)}%`
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val} citas`
    }
  }
});

const chartCitasSeries = ref<any>([28, 8, 4]);
const totalVentasCalculado = ref(0);
const hasVentasRegistradas = ref(false);

onMounted(async () => {
  try {
    const fetchSafe = async (url: string) => {
      try {
        const res = await api.get(url);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        return [];
      }
    };

    const [citas, ventas, serviciosGlobal] = await Promise.all([
      fetchSafe('/cita'),
      fetchSafe('/ventas'),
      fetchSafe('/servicio')
    ]);

    // ---- 1. CITAS ----
    let completadas = 0;
    let pendientes = 0;
    let canceladas = 0;

    citas.forEach((c: any) => {
      if (c.estado === 'completado') completadas++;
      else if (c.estado === 'cancelado') canceladas++;
      else pendientes++;
    });

    citasEstadisticas.value = {
      completadas,
      pendientes,
      canceladas
    };
    chartCitasSeries.value = [completadas, pendientes, canceladas];

    // ---- 2. SERVICIOS MAS PEDIDOS ----
    if (serviciosGlobal.length > 0) {
        const conteoServicios: Record<string, number> = {};
        serviciosGlobal.forEach((s: any) => {
            conteoServicios[s.id] = 0;
        });

        // Contar servicios en citas reales
        citas.forEach((c: any) => {
            if (c.servicioId && conteoServicios[c.servicioId] !== undefined) {
               conteoServicios[c.servicioId]++;
            } else if (c.servicio && c.servicio.id && conteoServicios[c.servicio.id] !== undefined) {
               conteoServicios[c.servicio.id]++;
            }
        });

        const ranking = serviciosGlobal.map((s: any) => ({
             nombre: s.nombre,
             cantidad: conteoServicios[s.id] || 0
        }));
        
        serviciosMasUsuados.value = ranking.sort((a: any, b: any) => b.cantidad - a.cantidad).slice(0, 5);

        chartServiciosOptions.value = {
            ...chartServiciosOptions.value,
            xaxis: {
                categories: serviciosMasUsuados.value.map((s: any) => s.nombre.substring(0, 10))
            }
        };
        chartServiciosSeries.value = [{
            name: 'Cantidad de Servicios',
            data: serviciosMasUsuados.value.map((s: any) => s.cantidad)
        }];
    }

    // ---- 3. VENTAS vs GANANCIAS ----
    // Agrupar ventas por mes
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentMonth = new Date().getMonth();
    
    // Tomar los últimos 6 meses
    const labelsMeses = [];
    const datosVentas = [];
    const datosGananciasServicios = []; // Simulado en proporciones si no hay cruce
    
    for (let i = 5; i >= 0; i--) {
        let m = currentMonth - i;
        if (m < 0) m += 12;
        labelsMeses.push(meses[m]);
        
        // Sumar ventas de ese mes
        const ventasMes = ventas.filter((v: any) => new Date(v.fechaVenta).getMonth() === m);
        const totalMes = ventasMes.reduce((acc: number, v: any) => acc + (Number(v.total) || 0), 0);
        datosVentas.push(totalMes);

        // Ganancias por citas en ese mes (precio servicio)
        const citasMesObj = citas.filter((c: any) => new Date(c.fechaInicio).getMonth() === m && c.estado === 'completado');
        const gananciasCitas = citasMesObj.length * 25000; // Asumiendo ~25k promedio si no hay precio en cita
        datosGananciasServicios.push(gananciasCitas);
    }

    chartVentasOptions.value = {
        ...chartVentasOptions.value,
        xaxis: { categories: labelsMeses }
    };
    
    chartVentasSeries.value = [
        { name: 'Ventas Productos', data: datosVentas },
        { name: 'Ganancias Citas', data: datosGananciasServicios }
    ];

    totalVentasCalculado.value = datosVentas.reduce((a: number, b: number) => a + b, 0);
    hasVentasRegistradas.value = (datosVentas.reduce((a: number, b: number) => a + b, 0) > 0) || (datosGananciasServicios.reduce((a: number, b: number) => a + b, 0) > 0);

  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-row class="mb-6">
    <!-- Servicios Más Pedidos -->
    <v-col cols="12" lg="6">
      <v-card elevation="0" class="dashboard-card">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <CutIcon :size="24" color="#7B1FA2" stroke-width="1.5" />
          <span>Servicios Más Pedidos</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <VueApexCharts
            v-if="serviciosMasUsuados.length > 0"
            type="bar"
            :options="chartServiciosOptions"
            :series="chartServiciosSeries"
            height="350"
          />
          <div v-else class="d-flex align-center justify-center" style="height: 350px">
            <p class="text-grey text-body-1">No hay datos de servicios aún.</p>
          </div>
          <div class="pa-4 border-top">
            <v-list class="pa-0" v-if="serviciosMasUsuados.length > 0">
              <v-list-item 
                v-for="(servicio, idx) in serviciosMasUsuados"
                :key="idx"
                class="pa-2"
              >
                <template v-slot:prepend>
                  <v-avatar size="32" :color="`hsl(${idx * 80}, 70%, 50%)`">
                    <span class="text-white text-h6">{{ idx + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-600">{{ servicio.nombre }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ servicio.cantidad }} servicios totales
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <p v-else class="text-center text-grey my-4">Agrega servicios para ver estadísticas.</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Ventas y Ganancias -->
    <v-col cols="12" lg="6">
      <v-card elevation="0" class="dashboard-card">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <ShoppingBagIcon :size="24" color="#1976D2" stroke-width="1.5" />
          <span>Ventas vs Ganancias (Últimos 6 meses)</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <VueApexCharts
            v-if="hasVentasRegistradas"
            type="line"
            :options="chartVentasOptions"
            :series="chartVentasSeries"
            height="350"
          />
          <div v-else class="d-flex align-center justify-center" style="height: 350px">
            <p class="text-grey text-body-1">Aún no hay ventas ni ganancias registradas.</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Estadísticas de Citas -->
    <v-col cols="12" md="6">
      <v-card elevation="0" class="dashboard-card">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <CalendarIcon :size="24" color="#388E3C" stroke-width="1.5" />
          <span>Estado de Citas</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <VueApexCharts
            v-if="citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas > 0"
            type="donut"
            :options="chartCitasOptions"
            :series="chartCitasSeries"
            height="350"
          />
          <div v-else class="d-flex align-center justify-center" style="height: 350px">
            <p class="text-grey text-body-1">No hay datos de citas.</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Resumen Rápido -->
    <v-col cols="12" md="6">
      <v-card elevation="0" class="dashboard-card">
        <v-card-title class="d-flex align-center gap-2 pb-4">
          <TrendingUpIcon :size="24" color="#FFA726" stroke-width="1.5" />
          <span>Resumen del Período</span>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-row class="mb-4">
            <v-col cols="6">
              <div class="stat-box">
                <p class="text-caption text-medium-emphasis mb-2">Total Servicios (Histórico)</p>
                <h3 class="text-h4 font-weight-bold" style="color: #7B1FA2;">{{ citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas || 0 }}</h3>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stat-box">
                <p class="text-caption text-medium-emphasis mb-2">Ventas de Productos</p>
                <h3 class="text-h4 font-weight-bold" style="color: #1976D2;">${{ totalVentasCalculado.toLocaleString('es-CO') }}</h3>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stat-box">
                <p class="text-caption text-medium-emphasis mb-2">Citas Completadas</p>
                <h3 class="text-h4 font-weight-bold" style="color: #66BB6A;">{{ citasEstadisticas.completadas || 0 }}</h3>
              </div>
            </v-col>
            <v-col cols="6">
              <div class="stat-box">
                <p class="text-caption text-medium-emphasis mb-2">Efectividad Citas</p>
                <h3 class="text-h4 font-weight-bold" style="color: #FFA726;">
                  {{ citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas > 0 ? 
                    Math.round((citasEstadisticas.completadas / (citasEstadisticas.completadas + citasEstadisticas.pendientes + citasEstadisticas.canceladas)) * 100) 
                    : 0 
                  }}%
                </h3>
              </div>
            </v-col>
          </v-row>
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
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  }
}

.stat-box {
  padding: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  border: 1px solid #EEEEEE;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #F0F0F0 0%, #F5F5F5 100%);
    border-color: #E0E0E0;
  }
}

.text-success {
  color: #66BB6A !important;
}

.border-top {
  border-top: 1px solid #E0E0E0;
}

:deep(.apexcharts-tooltip) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
