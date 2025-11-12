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
            :barbero="reservaStore.barberoSeleccionado"
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
        :barbero="reservaStore.barberoSeleccionado"
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
  import { useReservaStore } from '@/stores/reserva'
  import { useCitaStore } from '@/stores/cita'
  import { useAuthStore } from '@/stores/auth'
  import ServiciosTab from '@/components/shared/ReservaCita/ServiciosTab.vue'
  import BarberoTab from '@/components/shared/ReservaCita/BarberoTab.vue'
  import FechayHoraTab from '@/components/shared/ReservaCita/FechayHoraTab.vue'
  import ConfirmacionTab from '@/components/shared/ReservaCita/ConfirmacionTab.vue'
  import DetalleReserva from '@/components/shared/ReservaCita/DetalleReserva.vue'
  import ModalConfirmacionCita from '@/components/shared/ReservaCita/ModalConfirmacionCita.vue'
  import NotificacionExito from '@/components/shared/ReservaCita/NotificacionExito.vue'
  import NotificacionError from '@/components/shared/ReservaCita/NotificacionError.vue'

  const ServicioStore = useServiceStore()
  const reservaStore = useReservaStore()
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

  // ✅ Estado
  const items = ['Servicios', 'Fecha y Hora', 'Profesional', 'Confirmacion']
  const currentIndex = ref(reservaStore.currentTab) // ✅ Obtener de la store
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
        reservaStore.setCurrentTab(index) // ✅ Sincronizar con store
      }
    }
  })

  // ✅ Función para controlar qué tabs están activos
  const isTabEnabled = (index) => index <= currentIndex.value

  // ✅ Computed para obtener los objetos completos de los servicios DESDE LA STORE
  const serviciosSeleccionados = computed(() => {
    return ServicioStore.services.filter(servicio => 
      reservaStore.serviciosSeleccionados.includes(servicio.id)
    )
  })

  // ✅ NUEVO: Formatear la fecha para mostrar en DetalleReserva
  const fechaFormateada = computed(() => {
    if (!reservaStore.fechaSeleccionada) return null
    
    const fecha = new Date(reservaStore.fechaSeleccionada + 'T00:00:00')
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return fecha.toLocaleDateString('es-ES', opciones)
  })

  // ✅ NUEVO: Formatear la hora para mostrar en DetalleReserva
  const horaFormateada = computed(() => {
    if (!reservaStore.horaSeleccionada) return null
    
    const [hoursStr, minutes] = reservaStore.horaSeleccionada.split(':')
    const h = parseInt(hoursStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  })

  // ✅ Watch para verificar el estado del botón al cambiar de tab
  watch(currentIndex, async (nuevoIndex) => {
    reservaStore.setCurrentTab(nuevoIndex) // ✅ Sincronizar con store
    botonActivo.value = false
    await nextTick()
    verificarEstadoTabActual()
  })

  // ✅ Función para verificar si el tab actual debe tener el botón habilitado
  function verificarEstadoTabActual() {
    // ✅ Usar el getter de la store que ya tiene esta lógica
    botonActivo.value = reservaStore.botonHabilitadoPorTab
  }

  // 🔥 LISTENER PARA REABRIR DIALOG DESPUÉS DEL LOGIN
  const handleOpenReserva = () => {
    emit('update:modelValue', true)
    
    // ✅ Restaurar el tab desde la store
    currentIndex.value = reservaStore.currentTab
    
    // ✅ Verificar estado del botón
    nextTick(() => {
      verificarEstadoTabActual()
    })
  }

  onMounted(() => {
    console.log('👂 Listener de reserva montado')
    window.addEventListener('open-reserva-dialog', handleOpenReserva)
    
    // ✅ Al montar, verificar estado del tab actual
    verificarEstadoTabActual()
  })

  onUnmounted(() => {
    console.log('🔇 Listener de reserva desmontado')
    window.removeEventListener('open-reserva-dialog', handleOpenReserva)
  })

  // ✅ Métodos - AHORA ACTUALIZAN LA STORE
  function closeDialog() {
    emit('update:modelValue', false)
  }

  function actualizarServicios(idsSeleccionados) {
    reservaStore.setServicios(idsSeleccionados) // ✅ Guardar en store
  }

  function actualizarEstadoBoton(estado) {
    botonActivo.value = estado
  }

  function actualizarBarbero(barbero) {
    reservaStore.setBarbero(barbero) // ✅ Guardar en store
  }

  function actualizarFechayHora(data) {
    reservaStore.setFechaHora(data.fecha, data.hora) // ✅ Guardar en store
  }

  // Avanzar al siguiente tab
  async function avanzarTab() {
    // Si es el último tab (Confirmación), mostrar modal de confirmación
    if (currentIndex.value === items.length - 1) {
      mostrarModalConfirmacion.value = true
    } else {
      // Si no, avanzar al siguiente tab
      currentIndex.value++
    }
  }

  async function agendarCita() {
    try {
      console.log('🎯 Iniciando proceso de agendado...')
      
      // Validaciones
      if (!reservaStore.serviciosSeleccionados || reservaStore.serviciosSeleccionados.length === 0) {
        mensajeNotificacion.value = 'Debes seleccionar al menos un servicio'
        mostrarNotificacionError.value = true
        return
      }
      
      if (!reservaStore.barberoSeleccionado) {
        mensajeNotificacion.value = 'Debes seleccionar un barbero'
        mostrarNotificacionError.value = true
        return
      }
      
      if (!reservaStore.fechaSeleccionada || !reservaStore.horaSeleccionada) {
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
        barberoId: reservaStore.barberoSeleccionado.id,
        servicioId: reservaStore.serviciosSeleccionados,
        hora: reservaStore.horaSeleccionada + ':00',
        fecha: reservaStore.fechaSeleccionada
      }

      console.log('📋 Datos a enviar:', datosReserva)

      // Llamar al store
      const resultado = await citaStore.crearCita(datosReserva)

      if (resultado.success) {
        // ✅ ÉXITO
        mensajeNotificacion.value = resultado.mensaje
        
        // ⭐ IMPORTANTE: Primero cerrar el modal de confirmación
        mostrarModalConfirmacion.value = false
        
        // ⭐ Esperar un poco para que el modal se cierre completamente
        await nextTick()
        
        // ⭐ Luego limpiar la reserva (esto resetea los datos)
        reservaStore.resetReserva()
        
        // ⭐ Resetear el índice del tab
        currentIndex.value = 0
        
        // ⭐ Mostrar notificación de éxito
        mostrarNotificacionExito.value = true
        
        console.log('✅ Citas creadas:', resultado.citas)

      } else {
        // ❌ ERROR
        mensajeNotificacion.value = resultado.mensaje
        horariosAlternativos.value = resultado.horariosAlternativos || []
        barberosAlternativos.value = resultado.barberosAlternativos || []
        
        // Cerrar modal de confirmación
        mostrarModalConfirmacion.value = false
        
        // Mostrar notificación de error
        mostrarNotificacionError.value = true
        
        console.log('🕐 Horarios alternativos:', resultado.horariosAlternativos)
        console.log('💈 Barberos alternativos:', resultado.barberosAlternativos)
      }

    } catch (error) {
      console.error('💥 Error inesperado:', error)
      mensajeNotificacion.value = 'Ocurrió un error inesperado al agendar la cita'
      
      // Cerrar modal de confirmación si está abierto
      mostrarModalConfirmacion.value = false
      
      // Mostrar notificación de error
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