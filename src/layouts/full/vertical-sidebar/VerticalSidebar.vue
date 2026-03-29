<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useAuthStore } from '@/stores/auth';
import menus from "../../../config/dashboardConfig.js";
import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';

const customizer = useCustomizerStore();
const authStore = useAuthStore();

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Definir el tipo para los elementos del menú
type MenuItem = {
  header?: string;
  hiddenOnCollapse?: boolean;
  href?: string;
  title?: string;
  icon?: string | any;
  divider?: boolean;
  children?: MenuItem[];
};

const menu = ref<MenuItem[]>([]);

onMounted(() => {
  const role = (authStore.user && typeof authStore.user === 'object' && typeof (authStore.user as any).Role === 'string')
    ? ((authStore.user as any).Role as string).toLowerCase()
    : '';
  switch (role) {
    case 'superadmin':
      menu.value = menus.menusuperadmin;
      break;
    case 'administrador':
      menu.value = menus.menuadministrador;
      break;
    case 'barbero':
      menu.value = menus.menubarbero;
      break;
    case 'cliente':
      menu.value = menus.menucliente;
      break;
    default:
      menu.value = [];
  }
});

const sidebarMenu = computed(() => menu.value);
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    mobile-breakpoint="lg"
    app
    :class="['leftSidebar', { 'is-dark': isDark }]"
    :color="isDark ? '#0f172a' : '#ffffff'"
    style="border-right-width: 1px;"
    :style="{ borderRightColor: isDark ? '#1e293b' : '#f0f0f0' }"
  >
    <!---Logo part -->
    <div class="logo-wrapper d-flex justify-center align-center my-6">
      <div 
        class="logo-container" 
        :class="{ 'is-dark': isDark }"
      >
        <img src="/imagenes/logo/logo2.png" alt="Logo" style="width: 100px; max-width: 100%; transition: all 0.3s ease;"/>
      </div>
    </div>
    
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4" :style="{ background: 'transparent' }">
        <!---Menu Loop -->
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <!---Item Sub Header -->
          <NavGroup :item="item" v-if="item.header" :key="item.title" />
          <!---Item Divider -->
          <v-divider class="my-3" v-else-if="item.divider" />
          <!---If Has Child -->
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <!---Single Item-->
          <NavItem :item="item" v-else class="leftPadding" />
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style scoped>
.leftSidebar {
  transition: all 0.4s ease !important;
}

.logo-wrapper {
  padding: 0 20px;
}

.logo-container {
  padding: 10px;
  border-radius: 12px;
  transition: all 0.4s ease;
  background: transparent;
}

/* En modo oscuro, si el logo tiene fondo blanco, le damos un tratamiento premium */
.is-dark .logo-container {
  background: rgba(255, 255, 255, 0.03);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Ajuste del scrollbar para modo oscuro */
.scrollnavbar {
  height: calc(100vh - 120px);
}

/* Mejora de brillo para items del menú en modo oscuro */
.is-dark :deep(.v-list-item-title),
.is-dark :deep(.v-list-item__prepend .v-icon) {
  color: #ffffff !important;
  opacity: 1 !important;
}

/* Evitar que los items inactivos se opaquen demasiado */
.is-dark :deep(.v-list-item:not(.v-list-item--active)) {
  opacity: 0.88;
}
.is-dark :deep(.v-list-item:not(.v-list-item--active):hover) {
  opacity: 1;
}
</style>