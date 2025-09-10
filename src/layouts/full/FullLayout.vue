<script setup lang="js">
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/CustomizerPanel.vue';
import FooterPanel from './footer/FooterPanel.vue';
import { useCustomizerStore } from '../../stores/customizer';
import menus from "../../config/dashboardConfig.js";
import { ref, onMounted } from 'vue';
const customizer = useCustomizerStore();

const propiedades = ref([]);
const campo = ref("");
const tipoMenu = "Administrador"; // Cambia esto según el rol del usuario
onMounted(() => {
  // Aquí puedes realizar acciones cuando el componente se monte
  console.log("menu:",menus);
  propiedades.value = Object.keys(menus);
  campo.value = propiedades.value[1];
  console.log("menu estructra : ", campo.value)
});

</script>

<template>
  <v-locale-provider>
    <v-app
      theme="PurpleTheme"
      :class="[customizer.fontTheme, customizer.mini_sidebar ? 'mini-sidebar' : '', customizer.inputBg ? 'inputWithbg' : '']"
    >
      <Customizer />
      <sidebar-menu :menu='menus.menuadministrador'></sidebar-menu>
      <!-- <VerticalSidebarVue /> 
      <VerticalHeaderVue /> -->

      <v-main>
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
            <v-btn
              class="customizer-btn"
              size="large"
              icon
              variant="flat"
              color="secondary"
              @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
            >
              <SettingsIcon class="icon" />
            </v-btn>
          </div>
        </v-container>
        <v-container fluid class="pt-0">
          <div>
            <FooterPanel />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
