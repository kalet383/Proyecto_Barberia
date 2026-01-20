<script setup lang="ts">
import { computed } from 'vue';
import { BuildingStoreIcon, SendIcon, MailboxIcon, PhotoIcon, BellIcon } from 'vue-tabler-icons';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

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
      <a href="#" class="text-decoration-underline text-primary text-subtitle-2" @click.prevent="notificationStore.markAllAsRead()">Marcar leídas</a>
    </div>
  </div>
  <v-divider></v-divider>
  <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 650px">
    <v-list class="py-0" lines="three" v-if="notifications.length > 0">
      <template v-for="(item, index) in notifications" :key="item.id">
          <v-list-item :value="item.id" color="secondary" class="no-spacer" @click="notificationStore.markAsRead(item.id)">
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
