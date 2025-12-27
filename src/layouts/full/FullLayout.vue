<script setup lang="js">
import { ref, watch } from 'vue';
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/CustomizerPanel.vue';
import FooterPanel from './footer/FooterPanel.vue';
import CartModal from '@/components/shared/CartModal.vue';
import { useCustomizerStore } from '../../stores/customizer';
import { useProductosStore } from '@/stores/useProductosStore';

const customizer = useCustomizerStore();
const productosStore = useProductosStore();

const snackbar = ref(false);
const snackbarText = ref('');

watch(() => productosStore.totalProductos, (newCount, oldCount) => {
  if (newCount > oldCount) {
    snackbarText.value = '¡Producto añadido al carrito! 🛒';
    snackbar.value = true;
  }
});
</script>

<template>
  <v-locale-provider>
    <v-app
      theme="PurpleTheme"
      :class="[customizer.fontTheme, customizer.mini_sidebar ? 'mini-sidebar' : '', customizer.inputBg ? 'inputWithbg' : '']"
    >
      <Customizer />
      <!-- Ahora usamos el VerticalSidebarVue que tiene la lógica de menús -->
      <VerticalSidebarVue />
      <VerticalHeaderVue /> 
      <CartModal />
       
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

      <v-snackbar v-model="snackbar" color="black" location="top right" :timeout="3000">
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn color="primary" variant="text" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </v-locale-provider>
</template>