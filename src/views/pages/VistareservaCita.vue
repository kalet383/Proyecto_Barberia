<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.modelValue" transition="dialog-bottom-transition" fullscreen>
      <v-card>

        <div class="boton-cerrar">
          <!-- <v-btn icon="mdi-close" @click="closeDialog"></v-btn> -->
          <i class="fa-solid fa-x" @click="closeDialog"></i>
        </div>
        
        <v-card-title class="titulo-reserva text-center justify-center py-6">
          <h3>RESERVACION DE CITAS</h3>
        </v-card-title>

        <!-- Contenedor principal con layout de dos columnas -->
        <div class="d-flex" style="height: calc(100vh - 120px);">
          
          <!-- Columna izquierda: Tabs y contenido -->
          <div style="flex: 1; overflow-y: auto;">
            <!-- Tabs -->
            <v-tabs v-model="currentTab" class="custom-tabs" bg-color="transparent">
              <v-tab v-for="(item, index) in items" :key="item" :value="item" :disabled="!isTabEnabled(index)"> 
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
                @seleccionados="actualizarServicios" 
                @estado-servicio-siguiente="actualizarEstadoBoton"/>
              </v-tabs-window-item>

              <!-- TAB: Fecha y Hora -->
              <v-tabs-window-item value="Fecha y Hora">
                <FechayHoraTab @emit-fechay-hora="actualizarFechayHora" 
                @estado-fechayhora-siguiente="actualizarEstadoBoton"/>
              </v-tabs-window-item>
              
              <!-- TAB: Barberos -->
              <v-tabs-window-item value="Profesional">
                <BarberoTab @emit-barbero="actualizarBarbero"
                @estado-barbero-siguiente="actualizarEstadoBoton"/>
              </v-tabs-window-item>

              <!-- TAB: Confirmacion -->
              <v-tabs-window-item value="Confirmacion">
                <ConfirmacionTab @estado-confirmacion-agendar="actualizarEstadoBoton"></ConfirmacionTab>
              </v-tabs-window-item>

            </v-tabs-window>
          </div>

          <!-- Columna derecha: Detalles de la cita (fija) -->
          <div style="width: 600px; padding: 16px; overflow-y: auto; border-left: 2px solid #e0e0e0;">
            <DetalleReserva
            :servicios="serviciosSeleccionados"
            :barbero="barberoSeleccionado"
            :-fechay-hora="fechayhoraseleccionada"
            :habilitar-boton="botonActivo"
            @siguiente-tab="avanzarTab"/>
          </div>

        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useServiceStore } from '@/stores/services'
  import ServiciosTab from '@/components/shared/ReservaCita/ServiciosTab.vue'
  import BarberoTab from '@/components/shared/ReservaCita/BarberoTab.vue'
  import FechayHoraTab from '@/components/shared/ReservaCita/FechayHoraTab.vue'
  import ConfirmacionTab from '@/components/shared/ReservaCita/ConfirmacionTab.vue'
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
  const items = ['Servicios', 'Fecha y Hora', 'Profesional', 'Confirmacion']
  const currentIndex = ref(0)
  const serviciosSeleccionadosIds = ref([])
  const barberoSeleccionado = ref(null)
  const fechayhoraseleccionada = ref({
    fecha: null,
    hora: null
  })
  const botonActivo = ref(false)

  const currentTab = computed({
    get: () => items[currentIndex.value],
    set: (val) => {
      const index = items.indexOf(val)
      if (index <= currentIndex.value) currentIndex.value = index
    }
  })

  // ✅ Función para controlar qué tabs están activos
  const isTabEnabled = (index) => index <= currentIndex.value

  // ✅ Computed para obtener los objetos completos de los servicios
  const serviciosSeleccionados = computed(() => {
    return ServicioStore.services.filter(servicio => 
      serviciosSeleccionadosIds.value.includes(servicio.id)
    )
  })

  // ✅ Watch para verificar el estado del botón al cambiar de tab
  watch(currentIndex, async (nuevoIndex) => {
    // Resetear el botón inicialmente
    botonActivo.value = false
    
    // Esperar a que se monte el nuevo componente
    await nextTick()
    
    // Verificar si el tab actual tiene datos válidos
    verificarEstadoTabActual()
  })

  // ✅ Función para verificar si el tab actual debe tener el botón habilitado
  function verificarEstadoTabActual() {
    const tabActual = items[currentIndex.value]
    
    switch(tabActual) {
      case 'Servicios':
        // Si hay servicios seleccionados, habilitar el botón
        if (serviciosSeleccionadosIds.value.length > 0) {
          botonActivo.value = true
        }
        break
      
      case 'Fecha y Hora':
        // Si hay fecha y hora seleccionadas, habilitar el botón
        if (fechayhoraseleccionada.value.fecha && fechayhoraseleccionada.value.hora) {
          botonActivo.value = true
        }
        break
      
      case 'Profesional':
        // Si hay barbero seleccionado, habilitar el botón
        if (barberoSeleccionado.value) {
          botonActivo.value = true
        }
        break
      
      case 'Confirmacion':
        // Este caso se maneja por el emit del ConfirmacionTab
        // No forzamos true aquí
        break
    }
  }

  // 🔥 LISTENER PARA REABRIR DIALOG DESPUÉS DEL LOGIN
  const handleOpenReserva = () => {
    console.log('🔔 Evento recibido: reabrir dialog de reserva')
    emit('update:modelValue', true)
    
    // Ir al tab de Confirmación
    currentIndex.value = 3 // Índice del tab "Confirmacion"
  }

  onMounted(() => {
    console.log('👂 Listener de reserva montado')
    window.addEventListener('open-reserva-dialog', handleOpenReserva)
  })

  onUnmounted(() => {
    console.log('🔇 Listener de reserva desmontado')
    window.removeEventListener('open-reserva-dialog', handleOpenReserva)
  })

  // ✅ Métodos
  function closeDialog() {
    emit('update:modelValue', false)
  }

  function actualizarServicios(idsSeleccionados) {
    serviciosSeleccionadosIds.value = idsSeleccionados
  }

  function actualizarEstadoBoton(estado) {
    botonActivo.value = estado
  }

  function actualizarBarbero(barbero) {
    barberoSeleccionado.value = barbero
  }

  function actualizarFechayHora(data) {
    fechayhoraseleccionada.value = data
  }

  // Avanzar al siguiente tab
  function avanzarTab() {
    if (currentIndex.value < items.length - 1) {
      currentIndex.value++
    }
  }
</script>

<style scoped>

  .titulo-reserva {
    background-color: #f8f9fa;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
  

  .titulo-reserva h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: #222;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .boton-cerrar {
    position: absolute;
    top: 15px;      /* separa del borde superior */
    right: 20px;    /* separa del borde derecho */
    font-size: 20px;
    cursor: pointer;
    color: #333;
    transition: transform 0.2s ease, color 0.2s ease;
  }

  .boton-cerrar:hover {
    transform: scale(1.2);
    color: #000;
  }

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