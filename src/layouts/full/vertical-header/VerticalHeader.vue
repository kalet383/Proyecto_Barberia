<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';
import { useProductosStore } from '@/stores/useProductosStore';
import { useNotificationStore } from '@/stores/notification';
import NotificationDD from './NotificationDD.vue';
import ProfileDD from './ProfileDD.vue';
import Searchbar from './SearchBarPanel.vue';
import ThemeToggle from './ThemeToggle.vue';
import { useAuthStore } from '@/stores/auth';

const customizer = useCustomizerStore();
const productosStore = useProductosStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

onMounted(() => {
  if (typeof (productosStore as any).hydrate === 'function') {
    (productosStore as any).hydrate();
  }
  notificationStore.fetchNotifications();
});

const showSearch = ref(false);
const notificationMenu = ref(false);
function searchbox() {
  showSearch.value = !showSearch.value;
}

// Colores adaptativos para el header (elementos hardcodeados)
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
const itemBg = computed(() => isDark.value ? '#1e293b' : '#f5f5f5');
const itemColor = computed(() => isDark.value ? '#94a3b8' : '#666');
const borderColor = computed(() => isDark.value ? '#1e293b' : '#f0f0f0');
const nameColor = computed(() => isDark.value ? '#e2e8f0' : '#1a1a2e');
</script>

<template>
  <v-app-bar elevation="0" height="70" :style="`border-bottom: 1px solid ${borderColor};`" :color="isDark ? '#0a0e1a' : '#ffffff'">
    <!-- Menu toggle desktop -->
    <span
      :style="{
        width: '36px', height: '36px', borderRadius: '10px',
        background: itemBg, color: itemColor,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '16px', marginLeft: '16px',
        transition: 'all 0.2s ease',
      }"
      class="d-none d-lg-flex menu-toggle"
      @click.stop="customizer.SET_SIDEBAR_DRAWER()"
    >
      <i class="fas fa-bars"></i>
    </span>

    <!-- Menu toggle mobile -->
    <span
      :style="{
        width: '36px', height: '36px', borderRadius: '10px',
        background: itemBg, color: itemColor,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '16px', marginLeft: '12px',
        transition: 'all 0.2s ease',
      }"
      class="d-flex d-lg-none menu-toggle"
      @click.stop="customizer.SET_SIDEBAR_DRAWER"
    >
      <i class="fas fa-bars"></i>
    </span>

    <!-- Search mobile toggle -->
    <span
      :style="{
        width: '36px', height: '36px', borderRadius: '10px',
        background: itemBg, color: itemColor,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', fontSize: '14px', marginLeft: '8px',
        transition: 'all 0.2s ease',
      }"
      class="d-flex d-lg-none menu-toggle"
      @click="searchbox"
    >
      <i class="fas fa-search"></i>
    </span>

    <!-- Mobile search sheet -->
    <v-sheet v-if="showSearch" class="search-sheet v-col-12" :color="isDark ? '#12192b' : '#ffffff'">
      <Searchbar :closesearch="searchbox" />
    </v-sheet>

    <!-- Desktop search -->
    <v-sheet class="mx-4 v-col-3 v-col-xl-2 v-col-lg-4 d-none d-lg-block" style="background: transparent;">
      <Searchbar />
    </v-sheet>

    <v-spacer />

    <!-- Toggle de tema centralizado -->
    <div class="mr-4">
      <ThemeToggle />
    </div>

    <!-- ═══ RIGHT ACTIONS ═══ -->
    <div style="display: flex; align-items: center; gap: 10px; margin-right: 16px;">
      <!-- 🛒 Carrito -->
      <span
        :style="{
          width: '38px', height: '38px', borderRadius: '10px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '16px', position: 'relative',
          background: itemBg, color: itemColor,
          transition: 'all 0.2s ease',
        }"
        class="action-btn"
        @click="productosStore.abrirCarrito()"
      >
        <i class="fas fa-shopping-cart"></i>
        <!-- Badge -->
        <span
          v-if="productosStore.totalProductos > 0"
          style="
            position: absolute; top: -4px; right: -4px;
            min-width: 18px; height: 18px; border-radius: 9px;
            background: #ee6f38; color: white;
            font-size: 0.6rem; font-weight: 800;
            display: flex; align-items: center; justify-content: center;
            padding: 0 4px; border: 2px solid white;
          "
        >
          {{ productosStore.totalProductos }}
        </span>
      </span>

      <!-- 🔔 Notificaciones -->
      <v-menu v-model="notificationMenu" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <span
            v-bind="props"
            :style="{
              width: '38px', height: '38px', borderRadius: '10px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '16px', position: 'relative',
              background: itemBg, color: itemColor,
              transition: 'all 0.2s ease',
            }"
            class="action-btn"
          >
            <i class="fas fa-bell"></i>
            <span
              v-if="notificationStore.unreadCount > 0"
              style="
                position: absolute; top: -4px; right: -4px;
                min-width: 18px; height: 18px; border-radius: 9px;
                background: #f44336; color: white;
                font-size: 0.6rem; font-weight: 800;
                display: flex; align-items: center; justify-content: center;
                padding: 0 4px; border: 2px solid white;
              "
            >
              {{ notificationStore.unreadCount }}
            </span>
          </span>
        </template>
        <v-sheet rounded="lg" width="360" elevation="12" style="overflow: hidden;">
          <NotificationDD @close="notificationMenu = false" />
        </v-sheet>
      </v-menu>

      <!-- 👤 Perfil -->
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <div
            v-bind="props"
            :style="{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '4px 12px 4px 4px', borderRadius: '12px',
              background: itemBg, cursor: 'pointer',
              transition: 'all 0.2s ease', marginLeft: '4px',
            }"
            class="profile-btn"
          >
            <!-- Avatar -->
            <div
              v-if="!authStore.user?.foto"
              style="
                width: 32px; height: 32px; border-radius: 10px;
                background: linear-gradient(135deg, #ee6f38, #ff9a6c);
                display: flex; align-items: center; justify-content: center;
                color: white; font-size: 0.7rem; font-weight: 800;
              "
            >
              {{ authStore.user?.nombre?.charAt(0) }}{{ authStore.user?.apellido?.charAt(0) }}
            </div>
            <v-img
              v-else
              :src="authStore.user.foto"
              cover
              style="
                width: 32px; max-width: 32px; height: 32px; border-radius: 10px;
              "
            ></v-img>

            <!-- Nombre (solo desktop) -->
            <div class="d-none d-md-block">
              <p :style="{ fontSize: '0.78rem', fontWeight: '700', color: nameColor, margin: '0', lineHeight: '1.2' }">
                {{ authStore.user?.nombre }}
              </p>
              <p style="font-size: 0.62rem; color: #94a3b8; margin: 0;">
                {{ authStore.user?.role || authStore.user?.Role }}
              </p>
            </div>

            <i class="fas fa-chevron-down" style="font-size: 9px; color: #94a3b8; margin-left: 2px;"></i>
          </div>
        </template>
        <v-sheet rounded="lg" width="280" elevation="12" style="overflow: hidden;">
          <ProfileDD />
        </v-sheet>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.menu-toggle:hover {
  background: rgba(238, 111, 56, 0.1) !important;
  color: #ee6f38 !important;
}

.action-btn:hover {
  background: rgba(238, 111, 56, 0.1) !important;
  color: #ee6f38 !important;
}

.profile-btn:hover {
  filter: brightness(0.95);
}

.search-sheet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>