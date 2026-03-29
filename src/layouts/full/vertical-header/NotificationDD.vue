<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useCustomizerStore } from '@/stores/customizer';
import { useAuthStore } from '@/stores/auth';

const notificationStore = useNotificationStore();
const customizer = useCustomizerStore();
const authStore = useAuthStore();
const router = useRouter();

const emit = defineEmits(['close']);

const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
const txtPrimary = computed(() => isDark.value ? '#ffffff' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#94a3b8' : '#666');
const borderColor = computed(() => isDark.value ? '#1e293b' : '#f0f0f0');
const hoverBg = computed(() => isDark.value ? 'rgba(255,255,255,0.03)' : '#fff8f4');
const itemBgLeida = computed(() => isDark.value ? 'transparent' : 'white');
const itemBgNoLeida = computed(() => isDark.value ? 'rgba(238,111,56,0.05)' : '#fffaf6');

const getIcon = (tipo: string) => {
  switch (tipo) {
    case 'NUEVA_VENTA': return 'fas fa-shopping-bag';
    case 'CAMBIO_ESTADO_VENTA': return 'fas fa-exchange-alt';
    case 'VENTA_CANCELADA': return 'fas fa-times-circle';
    case 'NUEVA_CITA': return 'fas fa-calendar-plus';
    case 'CAMBIO_ESTADO_CITA': return 'fas fa-calendar-check';
    case 'CITA_CANCELADA': return 'fas fa-calendar-times';
    default: return 'fas fa-bell';
  }
};

const getColor = (tipo: string): { bg: string; text: string; dot: string } => {
  if (isDark.value) {
    switch (tipo) {
      case 'NUEVA_VENTA': return { bg: 'rgba(0,230,118,0.15)', text: '#00e676', dot: '#00e676' };
      case 'CAMBIO_ESTADO_VENTA': return { bg: 'rgba(79,142,247,0.15)', text: '#4f8ef7', dot: '#4f8ef7' };
      case 'VENTA_CANCELADA': return { bg: 'rgba(255,82,82,0.15)', text: '#ff5252', dot: '#ff5252' };
      case 'NUEVA_CITA': return { bg: 'rgba(124,92,252,0.15)', text: '#7c5cfc', dot: '#7c5cfc' };
      case 'CAMBIO_ESTADO_CITA': return { bg: 'rgba(79,142,247,0.15)', text: '#4f8ef7', dot: '#4f8ef7' };
      case 'CITA_CANCELADA': return { bg: 'rgba(255,82,82,0.15)', text: '#ff5252', dot: '#ff5252' };
      default: return { bg: 'rgba(255,193,7,0.15)', text: '#ffc107', dot: '#ffc107' };
    }
  }

  switch (tipo) {
    case 'NUEVA_VENTA': return { bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50' };
    case 'CAMBIO_ESTADO_VENTA': return { bg: '#e3f2fd', text: '#1565c0', dot: '#2196f3' };
    case 'VENTA_CANCELADA': return { bg: '#ffebee', text: '#c62828', dot: '#f44336' };
    case 'NUEVA_CITA': return { bg: '#ede7f6', text: '#4527a0', dot: '#7c5cfc' };
    case 'CAMBIO_ESTADO_CITA': return { bg: '#e3f2fd', text: '#1565c0', dot: '#2196f3' };
    case 'CITA_CANCELADA': return { bg: '#ffebee', text: '#c62828', dot: '#f44336' };
    default: return { bg: '#fff3e0', text: '#e65100', dot: '#ee6f38' };
  }
};

const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'NUEVA_VENTA': return 'Nueva Venta';
    case 'CAMBIO_ESTADO_VENTA': return 'Venta Actualizada';
    case 'VENTA_CANCELADA': return 'Venta Cancelada';
    case 'NUEVA_CITA': return 'Nueva Cita';
    case 'CAMBIO_ESTADO_CITA': return 'Cita Actualizada';
    case 'CITA_CANCELADA': return 'Cita Cancelada';
    default: return tipo.replace(/_/g, ' ');
  }
};

const formatTime = (date: string) => {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
};

// Navegación inteligente
const handleNotificationClick = async (item: any) => {
  if (!item.leida) {
    await notificationStore.markAsRead(item.id);
  }

  const role = (authStore.user?.role || authStore.user?.Role || '').toLowerCase();
  const esCita = ['NUEVA_CITA', 'CAMBIO_ESTADO_CITA', 'CITA_CANCELADA'].includes(item.tipo);
  const esVenta = ['NUEVA_VENTA', 'CAMBIO_ESTADO_VENTA', 'VENTA_CANCELADA'].includes(item.tipo);

  let targetRoute = '';

  if (esCita) {
    if (role === 'barbero') targetRoute = '/agenda-citas';
    else if (role === 'administrador') targetRoute = '/gestion-citas';
    else if (role === 'cliente') targetRoute = '/mis-citas';
  } else if (esVenta) {
     if (role === 'administrador') targetRoute = '/administrador/ventas';
     else if (role === 'superadmin') targetRoute = '/superadmin/ventas';
     else if (role === 'cliente') targetRoute = '/mis-compras';
  }

  if (targetRoute) {
    router.push(targetRoute);
  }
  
  emit('close');
};
</script>

<template>
  <div style="width: 100%; max-width: 380px;">
    <!-- ═══ Header ═══ -->
    <div style="padding: 16px 18px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; box-shadow: 0 3px 10px rgba(238,111,56,0.2);">
          <i class="fas fa-bell"></i>
        </div>
        <div>
          <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary }">Notificaciones</span>
          <span
            v-if="unreadCount > 0"
            style="display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; border-radius: 10px; background: #ee6f38; color: white; font-size: 0.65rem; font-weight: 800; padding: 0 6px; margin-left: 6px;"
          >
            {{ unreadCount }}
          </span>
        </div>
      </div>

      <!-- Marcar leídas -->
      <span
        v-if="unreadCount > 0"
        style="font-size: 0.75rem; font-weight: 600; color: #ee6f38; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s ease;"
        @click="notificationStore.markAllAsRead()"
        class="mark-read-btn"
      >
        <i class="fas fa-check-double" style="font-size: 10px; margin-right: 3px;"></i>
        Marcar leídas
      </span>
    </div>

    <div :style="{ height: '1px', background: borderColor }"></div>

    <!-- ═══ Lista ═══ -->
    <div style="max-height: 420px; overflow-y: auto;" class="notif-scroll">
      <!-- Con notificaciones -->
      <div v-if="notifications.length > 0">
        <div
          v-for="(item, index) in notifications"
          :key="item.id"
          :class="['notif-item', { 'is-dark': isDark }]"
          :style="{
            display: 'flex', gap: '12px', padding: '14px 18px', cursor: 'pointer',
            background: item.leida ? itemBgLeida : itemBgNoLeida,
            borderBottom: index < notifications.length - 1 ? `1px solid ${borderColor}` : 'none',
            transition: 'all 0.2s ease',
          }"
          @click="handleNotificationClick(item)"
        >
          <!-- Icono -->
          <div
            :style="{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: '0',
              background: getColor(item.tipo).bg, color: getColor(item.tipo).text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', position: 'relative',
            }"
          >
            <i :class="getIcon(item.tipo)"></i>
            <!-- Dot no leída -->
            <span
              v-if="!item.leida"
              :style="{
                position: 'absolute', top: '-2px', right: '-2px',
                width: '10px', height: '10px', borderRadius: '50%',
                background: getColor(item.tipo).dot,
                border: `2px solid ${isDark ? '#12192b' : 'white'}`,
              }"
            ></span>
          </div>

          <!-- Contenido -->
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px;">
              <span
                :style="{
                  fontSize: '0.82rem', fontWeight: item.leida ? '600' : '700',
                  color: item.leida ? (isDark ? '#94a3b8' : '#555') : txtPrimary,
                }"
              >
                {{ getTipoLabel(item.tipo) }}
              </span>
              <span :style="{ fontSize: '0.68rem', color: isDark ? '#4b5563' : '#bbb', whiteSpace: 'nowrap', flexShrink: '0' }">
                {{ formatTime(item.createdAt) }}
              </span>
            </div>

            <p
              :style="{
                fontSize: '0.78rem', color: item.leida ? (isDark ? '#4b5563' : '#aaa') : txtSecondary,
                margin: '0', lineHeight: '1.4',
                overflow: 'hidden', display: '-webkit-box',
                WebkitLineClamp: '2', WebkitBoxOrient: 'vertical',
              }"
            >
              {{ item.mensaje }}
            </p>

            <!-- Badge nueva -->
            <span
              v-if="!item.leida"
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '6px', 
                padding: '2px 8px', borderRadius: '4px', 
                background: isDark ? 'rgba(238,111,56,0.15)' : '#fff3e0', 
                color: isDark ? '#ee6f38' : '#e65100', 
                fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px'
              }"
            >
              <i class="fas fa-circle" style="font-size: 5px;"></i>
              Nueva
            </span>
          </div>
        </div>
      </div>

      <!-- Sin notificaciones -->
      <div v-else style="text-align: center; padding: 48px 20px;">
        <div :style="{ width: '56px', height: '56px', borderRadius: '50%', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px', color: '#ee6f38' }">
          <i class="fas fa-bell-slash"></i>
        </div>
        <p :style="{ fontWeight: '700', color: txtPrimary, margin: '0 0 4px', fontSize: '0.95rem' }">Sin notificaciones</p>
        <p :style="{ fontSize: '0.78rem', color: txtSecondary, margin: '0' }">Cuando tengas novedades aparecerán aquí</p>
      </div>
    </div>

    <div :style="{ height: '1px', background: borderColor }"></div>

    <!-- ═══ Footer ═══ -->
    <div style="padding: 10px 18px; text-align: center;">
      <span
        style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 600; color: #ee6f38; cursor: pointer; padding: 4px 10px; border-radius: 6px; transition: all 0.2s ease;"
        class="view-all-btn"
      >
        Ver todas
        <i class="fas fa-arrow-right" style="font-size: 10px;"></i>
      </span>
    </div>
  </div>
</template>

<style scoped>
.notif-item:hover {
  background: v-bind(hoverBg) !important;
}

.notif-scroll::-webkit-scrollbar {
  width: 4px;
}

.notif-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.notif-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ee6f38, #ff9a6c);
  border-radius: 10px;
}

.mark-read-btn:hover {
  background: rgba(238, 111, 56, 0.08);
}

.view-all-btn:hover {
  background: rgba(238, 111, 56, 0.08);
}
</style>