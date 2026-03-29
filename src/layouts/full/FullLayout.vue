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
    <!-- Quitamos v-app porque ya está en App.vue, usamos div con clases necesarias -->
    <div 
      class="layout-container" 
      :class="[customizer.fontTheme, customizer.inputBg ? 'inputWithbg' : '']"
    >
      <Customizer />
      <VerticalSidebarVue />
      <VerticalHeaderVue /> 
      <CartModal />
       
      <v-main>
        <v-container fluid class="page-wrapper pt-6">
          <RouterView />
          
          <!-- Botón de configuración lateral (opcional si ya está en el header) -->
          <v-btn
            class="customizer-btn"
            size="large"
            icon
            variant="flat"
            color="secondary"
            @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
          >
            <i class="fas fa-cog"></i>
          </v-btn>
        </v-container>
        
        <v-container fluid class="pt-0">
          <FooterPanel />
        </v-container>
      </v-main>

      <!-- Snackbar global de notificaciones rápidas -->
      <v-snackbar v-model="snackbar" elevation="12" location="top right" :timeout="3000">
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn color="primary" variant="text" @click="snackbar = false">
            Cerrar
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-locale-provider>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.customizer-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(94, 53, 177, 0.4);
}

.page-wrapper {
  /* Espaciado para mejorar el enfoque del contenido visual */
  max-width: 1600px;
  margin: 0 auto;
}
</style>