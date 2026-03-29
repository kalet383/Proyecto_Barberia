<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/plugins/axios';
import { useCustomizerStore } from '@/stores/customizer';

const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

interface Stat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const stats = ref<Stat[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const fetchSafe = async (url: string) => {
      try {
        const res = await api.get(url);
        return Array.isArray(res.data) ? res.data : [];
      } catch { return []; }
    };

    const [clientes, servicios, citas, productos, ventas, proveedores] = await Promise.all([
      fetchSafe('/auth'),
      fetchSafe('/servicio'),
      fetchSafe('/cita'),
      fetchSafe('/producto'),
      fetchSafe('/ventas'),
      fetchSafe('/proveedor')
    ]);

    const mesActual = new Date().getMonth();
    const citasMes = citas.filter((c: any) => new Date(c.fechaInicio).getMonth() === mesActual);
    const ingresosVentas = ventas.reduce((acc: number, v: any) => acc + (Number(v.total) || 0), 0);
    const citasCompletadas = citas.filter((c: any) => c.estado === 'completado');
    const ingresosCitas = citasCompletadas.length * 25000;
    const ingresosTotales = ingresosVentas + ingresosCitas;
    const productosPublicados = productos.filter((p: any) => p.publicado).length;
    const productosOferta = productos.filter((p: any) => p.en_oferta).length;

    stats.value = [
      {
        title: 'Ingresos Totales',
        value: `$${ingresosTotales.toLocaleString('es-CO')}`,
        icon: 'fas fa-dollar-sign',
        color: '#2e7d32',
        bgColor: '#e8f5e9',
        borderColor: '#c8e6c9'
      },
      {
        title: 'Total Usuarios',
        value: clientes.length,
        icon: 'fas fa-users',
        color: '#1565c0',
        bgColor: '#e3f2fd',
        borderColor: '#bbdefb'
      },
      {
        title: 'Citas del Mes',
        value: citasMes.length,
        icon: 'fas fa-calendar-check',
        color: '#e65100',
        bgColor: '#fff3e0',
        borderColor: '#ffe0b2'
      },
      {
        title: 'Proveedores',
        value: proveedores.length,
        icon: 'fas fa-truck',
        color: '#546e7a',
        bgColor: '#eceff1',
        borderColor: '#cfd8dc'
      },
      {
        title: 'Total Ventas',
        value: ventas.length,
        icon: 'fas fa-shopping-cart',
        color: '#ad1457',
        bgColor: '#fce4ec',
        borderColor: '#f8bbd0'
      },
      {
        title: 'Productos Publicados',
        value: productosPublicados,
        icon: 'fas fa-box-open',
        color: '#00838f',
        bgColor: '#e0f7fa',
        borderColor: '#b2ebf2'
      },
      {
        title: 'En Oferta',
        value: productosOferta,
        icon: 'fas fa-bolt',
        color: '#f9a825',
        bgColor: '#fffde7',
        borderColor: '#fff9c4'
      },
      {
        title: 'Servicios Activos',
        value: servicios.length,
        icon: 'fas fa-scissors',
        color: '#6a1b9a',
        bgColor: '#f3e5f5',
        borderColor: '#e1bee7'
      }
    ];
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  } finally {
    loading.value = false;
  }
});

// Colores adaptativos para modo oscuro
const cardBg = computed(() => isDark.value ? '#111827' : 'white');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#e0e0e0');
const valueColor = computed(() => isDark.value ? '#ffffff' : '#1a1a2e');

const getStatColor = (stat: Stat) => {
  if (!isDark.value) return stat.color;
  // En modo oscuro, usamos una versión más brillante del color para mejorar el contraste
  const brightColors: Record<string, string> = {
    '#2e7d32': '#4ade80', // Verde
    '#1565c0': '#60a5fa', // Azul
    '#e65100': '#fbbf24', // Naranja
    '#546e7a': '#94a3b8', // Gris azulado
    '#ad1457': '#f472b6', // Rosa/Vino
    '#00838f': '#22d3ee', // Cian
    '#f9a825': '#facc15', // Amarillo
    '#6a1b9a': '#c084fc', // Púrpura
  };
  return brightColors[stat.color.toLowerCase()] || stat.color;
};

const getIconBg = (stat: Stat) => {
  if (!isDark.value) return stat.bgColor;
  // En modo oscuro usamos el mismo color pero con baja opacidad
  return `${stat.color}20`; // 20 es ~12% de opacidad en hex
};

</script>

<template>
  <!-- Loading -->
  <v-row v-if="loading" class="mb-6">
    <v-col v-for="n in 8" :key="n" cols="6" sm="6" md="3">
      <v-skeleton-loader type="card" rounded="lg" />
    </v-col>
  </v-row>

  <!-- Stats -->
  <v-row v-else class="mb-6">
    <v-col v-for="stat in stats" :key="stat.title" cols="6" sm="6" md="3">
      <div
        :style="{
          border: `1px solid ${isDark ? cardBorder : stat.borderColor}`,
          borderRadius: '12px',
          padding: '20px',
          background: cardBg,
          transition: 'all 0.25s ease',
          cursor: 'default',
          height: '100%',
          boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : 'none'
        }"
        class="stat-card-item"
      >
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="flex: 1; min-width: 0;">
            <p style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 6px;" :style="{ color: getStatColor(stat) }">
              {{ stat.title }}
            </p>
            <p
              :style="{ fontSize: '1.4rem', fontWeight: '800', color: valueColor, margin: '0', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }"
              :title="stat.value.toString()"
            >
              {{ stat.value.toString().length > 14 ? stat.value.toString().substring(0, 14) + '...' : stat.value }}
            </p>
          </div>
          <div
            :style="{
              width: '48px', height: '48px', borderRadius: '12px',
              background: getIconBg(stat),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: '0', marginLeft: '12px',
            }"
          >
            <i :class="stat.icon" :style="{ color: getStatColor(stat), fontSize: '18px' }"></i>
          </div>
        </div>

        <!-- Barra decorativa inferior -->
        <div
          :style="{
            height: '3px', borderRadius: '2px', marginTop: '14px',
            background: `linear-gradient(90deg, ${getStatColor(stat)}, ${isDark ? 'transparent' : stat.bgColor})`,
          }"
        ></div>
      </div>
    </v-col>
  </v-row>
</template>

<style scoped>
.stat-card-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>