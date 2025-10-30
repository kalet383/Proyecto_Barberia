<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.modelValue" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-btn icon="mdi-close" @click="closeDialog"></v-btn>

        <v-card-title class="text-center justify-center py-2">
          <h3>RESERVACION DE CITAS</h3>
        </v-card-title>

        <!-- Contenedor principal con layout de dos columnas -->
        <div class="d-flex" style="height: calc(100vh - 120px);">
          
          <!-- Columna izquierda: Tabs y contenido -->
          <div style="flex: 1; overflow-y: auto;">
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
                <ServiciosTab
                @seleccionados="actualizarServicios" />
              </v-tabs-window-item>

              <!-- TAB: Fecha y Hora -->
              <v-tabs-window-item value="Fecha y Hora">
                <FechayHoraTab @emit-fechay-hora="actualizarFechayHora" />
              </v-tabs-window-item>
              
              <!-- TAB: Barberos -->
              <v-tabs-window-item value="Profesional">
                <BarberoTab @emit-barbero="actualizarBarbero"/>
              </v-tabs-window-item>

              <!-- TAB: Confirmacion -->
              <v-tabs-window-item value="Confirmacion">
                
              </v-tabs-window-item>

            </v-tabs-window>
          </div>

          <!-- Columna derecha: Detalles de la cita (fija) -->
          <div style="width: 600px; padding: 16px; overflow-y: auto; border-left: 2px solid #e0e0e0;">
            <DetalleReserva
            :servicios="serviciosSeleccionados"
            :barbero="barberoSeleccionado"
            :-fechay-hora="fechayhoraseleccionada"/>
          </div>

        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useServiceStore } from '@/stores/services'
  import ServiciosTab from '@/components/shared/ReservaCita/ServiciosTab.vue'
  import BarberoTab from '@/components/shared/ReservaCita/BarberoTab.vue'
  import FechayHoraTab from '@/components/shared/ReservaCita/FechayHoraTab.vue'
  import DetalleReserva from '@/components/shared/ReservaCita/DetalleReserva.vue'

  const ServicioStore = useServiceStore()

  // ✅ Props y emits
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
  const emit = defineEmits(['update:modelValue'])

  // ✅ Estado
  const currentTab = ref('Servicios')
  const items = ['Servicios', 'Fecha y Hora', 'Profesional', 'Confirmacion']
  const serviciosSeleccionadosIds = ref([])
  const barberoSeleccionado = ref(null)
  const fechayhoraseleccionada = ref({
    fecha: null,
    hora: null
  })

  // ✅ Computed para obtener los objetos completos de los servicios
  const serviciosSeleccionados = computed(() => {
    return ServicioStore.services.filter(servicio => 
      serviciosSeleccionadosIds.value.includes(servicio.id)
    )
  })

  // ✅ Métodos
  function closeDialog() {
    emit('update:modelValue', false)
  }

  function actualizarServicios(idsSeleccionados) {
    serviciosSeleccionadosIds.value = idsSeleccionados
  }

  function actualizarBarbero(barbero) {
    console.log('📥 Padre recibió:', barbero);
    barberoSeleccionado.value = barbero; // Guarda el objeto completo directamente
    console.log('💾 Barbero guardado:', barberoSeleccionado.value);
  }

  function actualizarFechayHora(data) {
    console.log('📅 Padre recibió fecha y hora:', data)
    fechayhoraseleccionada.value = data
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
    color: black;
  }

  .arrow-icon {
    font-size: 0.75rem;
    opacity: 0.7;
  }
</style>