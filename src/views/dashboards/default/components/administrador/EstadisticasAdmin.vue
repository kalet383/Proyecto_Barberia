<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { UsersIcon, CutIcon, ShoppingCartIcon, CalendarIcon } from 'vue-tabler-icons';

interface Stat {
  title: string;
  value: number;
  icon: any;
  color: string;
  bgColor: string;
}

const stats = ref<Stat[]>([]);
const loading = ref(true);

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

    const [clientes, servicios, citas, productos] = await Promise.all([
      fetchSafe('/cliente'),
      fetchSafe('/servicio'),
      fetchSafe('/cita'),
      fetchSafe('/producto')
    ]);

    const stockTotal = productos.reduce((acc: number, p: any) => acc + (Number(p.stock) || 0), 0);

    const mesActual = new Date().getMonth();
    const citasMes = citas.filter((c: any) => new Date(c.fechaInicio).getMonth() === mesActual);

    stats.value = [
      {
        title: 'Clientes Activos',
        value: clientes.length,
        icon: UsersIcon,
        color: '#1976D2',
        bgColor: '#E3F2FD'
      },
      {
        title: 'Servicios',
        value: servicios.length,
        icon: CutIcon,
        color: '#7B1FA2',
        bgColor: '#F3E5F5'
      },
      {
        title: 'Productos en Stock',
        value: stockTotal,
        icon: ShoppingCartIcon,
        color: '#388E3C',
        bgColor: '#E8F5E9'
      },
      {
        title: 'Citas Este Mes',
        value: citasMes.length,
        icon: CalendarIcon,
        color: '#F57C00',
        bgColor: '#FFF3E0'
      }
    ];
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-row class="mb-6">
    <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
      <v-card class="stat-card" elevation="0">
        <v-card-text class="pa-6">
          <div class="d-flex align-center justify-space-between">
            <div>
              <p class="text-caption text-medium-emphasis mb-2">{{ stat.title }}</p>
              <h2 class="text-h4 font-weight-bold">{{ stat.value }}</h2>
            </div>
            <div 
              class="stat-icon-wrapper" 
              :style="{ backgroundColor: stat.bgColor }"
            >
              <component :is="stat.icon" :size="28" :style="{ color: stat.color }" stroke-width="1.5"/>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.stat-card {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  }
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}
</style>
