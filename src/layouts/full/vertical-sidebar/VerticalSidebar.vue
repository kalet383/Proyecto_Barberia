<script setup lang="ts">
import { shallowRef, ref, onMounted, computed } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { useAuthStore } from '@/stores/auth';
import menus from "../../../config/dashboardConfig.js";
import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
import NavCollapse from './NavCollapse/NavCollapse.vue';
//import Logo from '../logo/LogoMain.vue';

const customizer = useCustomizerStore();
const authStore = useAuthStore();

// Definir el tipo para los elementos del menú
type MenuItem = {
  header?: string;
  hiddenOnCollapse?: boolean;
  href?: string;
  title?: string;
  icon?: string | any; // Permitir string o componente
  divider?: boolean;
  children?: MenuItem[];
  // Agregar otras propiedades según sea necesario
};

const menu = ref<MenuItem[]>([]);

// Cargar el menú según el rol del usuario
onMounted(() => {
  const role = (authStore.user && typeof authStore.user === 'object' && typeof (authStore.user as any).Role === 'string')
    ? ((authStore.user as any).Role as string).toLowerCase()
    : '';
  switch (role) {
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
      menu.value = []; // O algún otro valor por defecto
  }
  console.log("Menu cargado:", menu.value);
});

// Computed para usar el menú dinámico
const sidebarMenu = computed(() => menu.value);
</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="customizer.mini_sidebar"
    expand-on-hover
  >
    <!---Logo part -->
    <div class="d-flex justify-center align-center my-4">
      <img src="/imagenes/logo/logo2.png" alt="Logo" style="width: 100px; max-width: 100%;"/>
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
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
          <!---End Single Item-->
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>