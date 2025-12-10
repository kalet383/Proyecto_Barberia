<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.modelValue" transition="dialog-bottom-transition" fullscreen>
      <v-card>

        <div class="boton-cerrar">
          <i class="fa-solid fa-x" @click="closeDialog"></i>
        </div>
        
        <v-card-title class="titulo-reserva text-center justify-center py-6">
          <h3>RESERVACION DE CITAS</h3>
        </v-card-title>

        <!-- Contenedor principal con layout de dos columnas -->
        <div class="d-flex" style="height: calc(100vh - 120px);">
          
          <!-- Columna izquierda: Tabs y contenido -->
          <div style="flex: 1; overflow-y: auto;">
            <!-- Tabs - SIN tab de Profesional -->
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
                <ServiciostabBarbero
                @seleccionados="actualizarServicios" 
                @estado-servicio-siguiente="actualizarEstadoBoton"/>
              </v-tabs-window-item>

              <!-- TAB: Fecha y Hora -->
              <v-tabs-window-item value="Fecha y Hora">
                <FechayhoratabBarbero
                @emit-fechay-hora="actualizarFechayHora" 
                @estado-fechayhora-siguiente="actualizarEstadoBoton"/>
              </v-tabs-window-item>

              <!-- TAB: Confirmacion -->
              <v-tabs-window-item value="Confirmacion">
                <ConfirmaciontabBarbero @estado-confirmacion-agendar="actualizarEstadoBoton"></ConfirmacionTabBarbero>
              </v-tabs-window-item>

            </v-tabs-window>
          </div>

          <!-- Columna derecha: Detalles de la cita (fija) -->
          <div style="width: 600px; padding: 16px; overflow-y: auto; border-left: 2px solid #e0e0e0;">
            <DetallereservaBarbero
            :servicios="serviciosSeleccionados"
            :barbero="reservaBarberoStore.barberoPreseleccionado"
            :fecha="fechaFormateada"
            :hora="horaFormateada"
            :habilitar-boton="botonActivo"
            @siguiente-tab="avanzarTab"
            :ultimo-tab="currentIndex === items.length - 1"/>
          </div>

        </div>
      </v-card>
      <!-- Modales de notificación -->
      <ModalConfirmacionCita
        v-model="mostrarModalConfirmacion"
        :servicios="serviciosSeleccionados"
        :barbero="reservaBarberoStore.barberoPreseleccionado"
        :fecha="fechaFormateada"
        :hora="horaFormateada"
        @confirmar="agendarCita"
      />

      <NotificacionExito
        v-model="mostrarNotificacionExito"
        :mensaje="mensajeNotificacion"
        @cerrar-todo="closeDialog"
      />

      <NotificacionError
        v-model="mostrarNotificacionError"
        :mensaje="mensajeNotificacion"
        :horarios-alternativos="horariosAlternativos"
        :barberos-alternativos="barberosAlternativos"
      />
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useServiceStore } from '@/stores/services'
  import { useReservaBarberoStore } from '@/stores/reservaBarbero'
  import { useCitaStore } from '@/stores/cita'
  import { useAuthStore } from '@/stores/auth'
  import ServiciostabBarbero from '@/components/shared/ReservacitaBarbero/ServiciostabBarbero.vue'
  import FechayhoratabBarbero from '@/components/shared/ReservacitaBarbero/FechayhoratabBarbero.vue'
  import ConfirmaciontabBarbero from '@/components/shared/ReservacitaBarbero/ConfirmaciontabBarbero.vue'
  import DetallereservaBarbero from '@/components/shared/ReservacitaBarbero/DetallereservaBarbero.vue'
  import ModalConfirmacionCita from '@/components/shared/ReservaCita/ModalConfirmacionCita.vue'
  import NotificacionExito from '@/components/shared/ReservaCita/NotificacionExito.vue'
  import NotificacionError from '@/components/shared/ReservaCita/NotificacionError.vue'

  const ServicioStore = useServiceStore()
  const reservaBarberoStore = useReservaBarberoStore()
  const citaStore = useCitaStore()
  const authStore = useAuthStore()

  // ✅ Props y emits
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
  const emit = defineEmits(['update:modelValue'])

  // ✅ Estado - SIN tab de Profesional
  const items = ['Servicios', 'Fecha y Hora', 'Confirmacion']
  const currentIndex = ref(reservaBarberoStore.currentTab)
  const botonActivo = ref(false)
  
  // Estados para los modales
  const mostrarModalConfirmacion = ref(false)
  const mostrarNotificacionExito = ref(false)
  const mostrarNotificacionError = ref(false)
  const mensajeNotificacion = ref('')
  const horariosAlternativos = ref([])
  const barberosAlternativos = ref([])

  const currentTab = computed({
    get: () => items[currentIndex.value],
    set: (val) => {
      const index = items.indexOf(val)
      if (index <= currentIndex.value) {
        currentIndex.value = index
        reservaBarberoStore.setCurrentTab(index)
      }
    }
  })

  // ✅ Función para controlar qué tabs están activos
  const isTabEnabled = (index) => index <= currentIndex.value

  // ✅ Computed para obtener los objetos completos de los servicios
  const serviciosSeleccionados = computed(() => {
    return ServicioStore.services.filter(servicio => 
      reservaBarberoStore.serviciosSeleccionados.includes(servicio.id)
    )
  })

  // ✅ Formatear la fecha
  const fechaFormateada = computed(() => {
    if (!reservaBarberoStore.fechaSeleccionada) return null
    
    const fecha = new Date(reservaBarberoStore.fechaSeleccionada + 'T00:00:00')
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return fecha.toLocaleDateString('es-ES', opciones)
  })

  // ✅ Formatear la hora
  const horaFormateada = computed(() => {
    if (!reservaBarberoStore.horaSeleccionada) return null
    
    const [hoursStr, minutes] = reservaBarberoStore.horaSeleccionada.split(':')
    const h = parseInt(hoursStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  })

  // ✅ Watch para verificar el estado del botón
  watch(currentIndex, async (nuevoIndex) => {
    reservaBarberoStore.setCurrentTab(nuevoIndex)
    botonActivo.value = false
    await nextTick()
    verificarEstadoTabActual()
  })

  // ✅ Watch para sincronizar currentIndex cuando cambia en la store
  watch(() => reservaBarberoStore.currentTab, (nuevoTab) => {
    currentIndex.value = nuevoTab
  })

  // ⭐ NUEVO: Watch para sincronizar cuando se abre el modal
  watch(() => props.modelValue, (nuevoValor) => {
    if (nuevoValor) {
      currentIndex.value = reservaBarberoStore.currentTab
      nextTick(() => {
        verificarEstadoTabActual()
      })
    }
  })

  // ✅ Función para verificar estado del botón
  function verificarEstadoTabActual() {
    botonActivo.value = reservaBarberoStore.botonHabilitadoPorTab
  }

  // 🔥 LISTENER PARA REABRIR DIALOG
  const handleOpenReservaBarbero = () => {
    emit('update:modelValue', true)
    currentIndex.value = reservaBarberoStore.currentTab
    nextTick(() => {
      verificarEstadoTabActual()
    })
  }

  onMounted(() => {
    console.log('👂 Listener de reserva barbero montado')
    window.addEventListener('open-reserva-barbero-dialog', handleOpenReservaBarbero)
    verificarEstadoTabActual()
  })

  onUnmounted(() => {
    console.log('🔇 Listener de reserva barbero desmontado')
    window.removeEventListener('open-reserva-barbero-dialog', handleOpenReservaBarbero)
  })

  // ✅ Métodos
  function closeDialog() {
    emit('update:modelValue', false)
  }

  function actualizarServicios(idsSeleccionados) {
    reservaBarberoStore.setServicios(idsSeleccionados)
  }

  function actualizarEstadoBoton(estado) {
    botonActivo.value = estado
  }

  function actualizarFechayHora(data) {
    reservaBarberoStore.setFechaHora(data.fecha, data.hora)
  }

  // Avanzar al siguiente tab
  async function avanzarTab() {
    if (currentIndex.value === items.length - 1) {
      mostrarModalConfirmacion.value = true
    } else {
      currentIndex.value++
    }
  }

  async function agendarCita() {
    try {
      console.log('🎯 Iniciando proceso de agendado con barbero...')
      
      // Validaciones
      if (!reservaBarberoStore.serviciosSeleccionados || reservaBarberoStore.serviciosSeleccionados.length === 0) {
        mensajeNotificacion.value = 'Debes seleccionar al menos un servicio'
        mostrarNotificacionError.value = true
        return
      }
      
      if (!reservaBarberoStore.barberoPreseleccionado) {
        mensajeNotificacion.value = 'Error: No hay barbero seleccionado'
        mostrarNotificacionError.value = true
        return
      }
      
      if (!reservaBarberoStore.fechaSeleccionada || !reservaBarberoStore.horaSeleccionada) {
        mensajeNotificacion.value = 'Debes seleccionar fecha y hora'
        mostrarNotificacionError.value = true
        return
      }
      
      if (!authStore.isAuthenticated) {
        mensajeNotificacion.value = 'Debes iniciar sesión para agendar'
        mostrarNotificacionError.value = true
        return
      }

      // Preparar datos
      const datosReserva = {
        clienteId: authStore.user.id,
        barberoId: reservaBarberoStore.barberoPreseleccionado.id,
        servicioId: reservaBarberoStore.serviciosSeleccionados,
        hora: reservaBarberoStore.horaSeleccionada + ':00',
        fecha: reservaBarberoStore.fechaSeleccionada
      }

      console.log('📋 Datos a enviar:', datosReserva)

      // Llamar al store
      const resultado = await citaStore.crearCita(datosReserva)

      if (resultado.success) {
        mensajeNotificacion.value = resultado.mensaje
        mostrarModalConfirmacion.value = false
        await nextTick()
        reservaBarberoStore.resetReserva()
        currentIndex.value = 0
        mostrarNotificacionExito.value = true
        console.log('✅ Citas creadas:', resultado.citas)
      } else {
        mensajeNotificacion.value = resultado.mensaje
        horariosAlternativos.value = resultado.horariosAlternativos || []
        barberosAlternativos.value = resultado.barberosAlternativos || []
        mostrarModalConfirmacion.value = false
        mostrarNotificacionError.value = true
        console.log('🕐 Horarios alternativos:', resultado.horariosAlternativos)
        console.log('💈 Barberos alternativos:', resultado.barberosAlternativos)
      }
    } catch (error) {
      console.error('💥 Error inesperado:', error)
      mensajeNotificacion.value = 'Ocurrió un error inesperado al agendar la cita'
      mostrarModalConfirmacion.value = false
      mostrarNotificacionError.value = true
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
    top: 15px;
    right: 20px;
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