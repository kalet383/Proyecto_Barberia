<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.modelValue" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-btn icon="mdi-close" @click="closeDialog"></v-btn>

        <v-card-title class="text-center justify-center py-2">
          <h3>RESERVACION DE CITAS</h3>
        </v-card-title>

        <!-- Tabs -->
        <v-tabs v-model="currentTab" class="custom-tabs" bg-color="transparent">
          <v-tab v-for="(item, index) in items" :key="item" :value="item">
            <span class="tab-content">
              <span class="tab-number">
                <i :class="`fa-solid fa-${index + 1}`"></i>
              </span>
              {{ item }}
              <i v-if="index < items.length - 1" class="fa-solid fa-arrow-right arrow-icon"></i>
            </span>
          </v-tab>
        </v-tabs>

        <!-- Contenido de tabs -->
        <v-tabs-window v-model="currentTab">
          
          <!-- TAB: Servicios -->
          <v-tabs-window-item value="Servicios">
            <ServiciosTab />
          </v-tabs-window-item>

          <!-- TAB: Fecha y Hora -->
          <v-tabs-window-item value="Fecha y Hora">
            <FechayHoraTab />
          </v-tabs-window-item>
          
          <!-- TAB: Barberos -->
          <v-tabs-window-item value="Profesional">
            <BarberoTab />
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import ServiciosTab from '@/components/shared/ReservaCita/ServiciosTab.vue';
import BarberoTab from '@/components/shared/ReservaCita/BarberoTab.vue';
import FechayHoraTab from '@/components/shared/ReservaCita/FechayHoraTab.vue';

export default {
  name: 'VistareservaCita',
  components: {
    ServiciosTab,
    BarberoTab,
    FechayHoraTab
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const currentTab = ref('Servicios')
    const items = ['Servicios', 'Fecha y Hora', 'Profesional', 'Confirmacion']

    function closeDialog() {
      emit('update:modelValue', false)
    }

    return {
      props,
      currentTab,
      items,
      closeDialog,
    }
  }
}
</script>

<style scoped>
  .custom-tabs {
    padding-left: 30px;
  }

  .custom-tabs :deep(.v-slide-group__content) {
    gap: 0;
    justify-content: flex-start;
  }

  .custom-tabs :deep(.v-tab) {
    min-width: auto !important;
    padding: 10px 16px !important;
    text-transform: none !important;
    letter-spacing: normal !important;
    font-size: 0.813rem;
    min-height: 40px !important;
  }

  .tab-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tab-number {
    display: inline-flex;
    align-items: center;
    color: #1976d2;
  }

  .arrow-icon {
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>