<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { BuildingStoreIcon, SendIcon, MailboxIcon, PhotoIcon, BellIcon } from 'vue-tabler-icons';
import api from '@/plugins/axios';
import { useAuthStore } from '@/stores/auth';

const notifications = ref<any[]>([]);
const unreadCount = computed(() => notifications.value.filter(n => !n.leida).length);
const authStore = useAuthStore();

const fetchNotifications = async () => {
    if (!authStore.user) return;
    try {
        const { data } = await api.get('/notifications');
        notifications.value = data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

onMounted(() => {
    fetchNotifications();
});

const getIcon = (tipo: string) => {
    switch (tipo) {
        case 'NUEVA_VENTA': return BuildingStoreIcon;
        case 'CAMBIO_ESTADO_VENTA': return BellIcon;
        case 'VENTA_CANCELADA': return MailboxIcon;
        default: return BellIcon;
    }
};

const getColor = (tipo: string) => {
    switch (tipo) {
        case 'NUEVA_VENTA': return 'success';
        case 'CAMBIO_ESTADO_VENTA': return 'primary';
        case 'VENTA_CANCELADA': return 'error';
        default: return 'warning';
    }
};

const formatTime = (date: string) => {
    return new Date(date).toLocaleString();
};

const markAsRead = async (id: number) => {
    try {
        await api.patch(`/notifications/${id}/leer`);
        fetchNotifications();
    } catch (e) {
        console.error(e);
    }
};

const markAllRead = async () => {
     try {
        await api.patch(`/notifications/leer-todas`);
        fetchNotifications();
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- notifications DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <h6 class="text-subtitle-1">
        Notificaciones
        <v-chip color="warning" variant="flat" size="small" class="ml-2 text-white">{{ unreadCount }}</v-chip>
      </h6>
      <a href="#" class="text-decoration-underline text-primary text-subtitle-2" @click.prevent="markAllRead">Marcar leídas</a>
    </div>
  </div>
  <v-divider></v-divider>
  <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 650px">
    <v-list class="py-0" lines="three" v-if="notifications.length > 0">
      <template v-for="(item, index) in notifications" :key="item.id">
          <v-list-item :value="item.id" color="secondary" class="no-spacer" @click="markAsRead(item.id)">
            <template v-slot:prepend>
              <v-avatar size="40" variant="flat" :color="'light' + getColor(item.tipo)" class="mr-3 py-2" :class="'text-' + getColor(item.tipo)">
                <component :is="getIcon(item.tipo)" size="20" />
              </v-avatar>
            </template>
            <div class="d-inline-flex align-center justify-space-between w-100">
              <h6 class="text-subtitle-1 font-weight-bold">{{ item.tipo.replace(/_/g, ' ') }}</h6>
              <span class="text-caption text-medium-emphasis">{{ formatTime(item.createdAt) }}</span>
            </div>

            <p class="text-subtitle-2 text-medium-emphasis mt-1">{{ item.mensaje }}</p>
            <div class="mt-3" v-if="!item.leida">
              <v-chip size="small" text="Nueva" color="primary" variant="tonal" class="mr-2" />
            </div>
          </v-list-item>
          <v-divider v-if="index < notifications.length - 1"></v-divider>
      </template>
    </v-list>
    <div v-else class="pa-4 text-center text-grey">
        No tienes notificaciones
    </div>
  </perfect-scrollbar>
  <v-divider></v-divider>
  <div class="pa-2 text-center">
    <v-btn color="primary" variant="text">View All</v-btn>
  </div>
</template>
