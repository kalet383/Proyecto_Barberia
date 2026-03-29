<template>
  <div>
    <v-dialog v-model="isOpen" transition="dialog-bottom-transition" fullscreen persistent no-click-animation class="reserva-dialog">
      <v-card class="reserva-modal-card" :style="{ background: cardBg }">

        <div class="boton-cerrar" :style="{ background: isDark ? '#1f2937' : 'white', color: isDark ? '#f3f4f6' : '#333' }">
          <i class="fa-solid fa-xmark" @click="closeDialog"></i>
        </div>
        
        <v-card-title class="titulo-reserva text-center justify-center py-8" :style="{ background: headerBg, borderBottom: `2px solid ${cardBorder}` }">
          <h3 :style="{ color: txtPrimary, fontWeight: '900', letterSpacing: '2px' }">RESERVACIÓN DE CITAS</h3>
        </v-card-title>

        <!-- Contenedor principal con layout de dos columnas -->
        <div class="d-flex flex-container">
          
          <!-- Columna izquierda: Tabs y contenido -->
          <div style="flex: 1; overflow-y: auto;" class="tab-content-wrapper">
            <!-- Tabs -->
            <v-tabs v-model="currentTab" class="custom-tabs" bg-color="transparent" :color="isDark ? '#ee6f38' : '#ee6f38'">
              <v-tab v-for="(item, index) in items" :key="item" :value="item" :disabled="!isTabEnabled(index)"> 
                <span class="tab-content">
                  <span class="tab-number" :style="{ color: currentTab === item ? '#ee6f38' : (isDark ? '#4b5563' : '#999') }">
                    <i :class="`fa-solid fa-${index + 1}`"></i>
                  </span>
                  <span :style="{ color: currentTab === item ? (isDark ? '#f3f4f6' : '#1a1a1a') : (isDark ? '#4b5563' : '#999'), fontWeight: currentTab === item ? '800' : '600' }">{{ item }}</span>
                  <i v-if="index < items.length - 1" class="fa-solid fa-chevron-right arrow-icon" :style="{ color: isDark ? '#1e293b' : '#eee' }"></i>
                </span>
              </v-tab>
            </v-tabs>

            <!-- Contenido de tabs -->
            <v-tabs-window v-model="currentTab" class="mt-4">
              
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
          <div :style="{ width: '420px', padding: '24px', overflowY: 'auto', borderLeft: `2px solid ${cardBorder}`, background: headerBg }" class="detalle-sidebar">
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
    </v-dialog>
    
    <!-- Modales de notificación (afuera del diálogo principal) -->
    <ModalConfirmacionCita
      v-model="mostrarModalConfirmacion"
      :servicios="serviciosSeleccionados"
      :barbero="reservaStore.barberoSeleccionado"
      :fecha="fechaFormateada"
      :hora="horaFormateada"
      :cargando="agendando"
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
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
  import { useServiceStore } from '@/stores/services'
  import { useReservaStore } from '@/stores/reserva'
  import { useCitaStore } from '@/stores/cita'
  import { useAuthStore } from '@/stores/auth'
  import { useCustomizerStore } from '@/stores/customizer'
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
  const customizer = useCustomizerStore()

  const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
  
  // Adaptive Colors
  const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#111827');
  const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#64748b');
  const cardBg = computed(() => isDark.value ? '#0f172a' : '#ffffff');
  const cardBorder = computed(() => isDark.value ? '#1e293b' : '#f0f0f0');
  const headerBg = computed(() => isDark.value ? '#161d2f' : '#f8f9fa');

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
      default: false,
    },
  })
  const emit = defineEmits(['update:modelValue'])

  const items = ['Servicios', 'Fecha y Hora', 'Profesional', 'Confirmacion']
  const currentIndex = ref(reservaStore.currentTab)
  const botonActivo = ref(false)
  const mostrarModalConfirmacion = ref(false)
  const mostrarNotificacionExito = ref(false)
  const mostrarNotificacionError = ref(false)
  const mensajeNotificacion = ref('')
  const agendando = ref(false)
  const horariosAlternativos = ref([])
  const barberosAlternativos = ref([])

  const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const currentTab = computed({
    get: () => items[currentIndex.value],
    set: (val) => {
      const index = items.indexOf(val)
      if (index <= currentIndex.value) {
        currentIndex.value = index
        reservaStore.setCurrentTab(index)
      }
    }
  })

  const isTabEnabled = (index) => index <= currentIndex.value

  const serviciosSeleccionados = computed(() => {
    return ServicioStore.services.filter(servicio => 
      reservaStore.serviciosSeleccionados.includes(servicio.id)
    )
  })

  const fechaFormateada = computed(() => {
    if (!reservaStore.fechaSeleccionada) return null
    const fecha = new Date(reservaStore.fechaSeleccionada + 'T00:00:00')
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return fecha.toLocaleDateString('es-ES', opciones)
  })

  const horaFormateada = computed(() => {
    if (!reservaStore.horaSeleccionada) return null
    const [hoursStr, minutes] = reservaStore.horaSeleccionada.split(':')
    const h = parseInt(hoursStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutes} ${ampm}`
  })

  watch(currentIndex, async (nuevoIndex) => {
    reservaStore.setCurrentTab(nuevoIndex)
    botonActivo.value = false
    await nextTick()
    verificarEstadoTabActual()
  })

  function verificarEstadoTabActual() {
    botonActivo.value = reservaStore.botonHabilitadoPorTab
  }

  watch(() => props.modelValue, (nuevoValor) => {
    if (nuevoValor) {
      currentIndex.value = reservaStore.currentTab
      nextTick(() => { verificarEstadoTabActual() })
    } else {
      reservaStore.resetReserva()
      currentIndex.value = 0
    }
  })

  const handleOpenReserva = () => { emit('update:modelValue', true) }

  onMounted(async () => {
    window.addEventListener('open-reserva-dialog', handleOpenReserva)
    if (ServicioStore.services.length === 0) await ServicioStore.getServices()
    verificarEstadoTabActual()
  })

  onUnmounted(() => {
    window.removeEventListener('open-reserva-dialog', handleOpenReserva)
  })

  function closeDialog() { emit('update:modelValue', false) }
  function actualizarServicios(idsSeleccionados) { reservaStore.setServicios(idsSeleccionados) }
  function actualizarEstadoBoton(estado) { botonActivo.value = estado }
  function actualizarBarbero(barbero) { reservaStore.setBarbero(barbero) }
  function actualizarFechayHora(data) { reservaStore.setFechaHora(data.fecha, data.hora) }

  async function avanzarTab() {
    if (currentIndex.value === items.length - 1) {
      mostrarModalConfirmacion.value = true
    } else {
      currentIndex.value++
    }
  }

  async function agendarCita() {
    try {
      if (!reservaStore.serviciosSeleccionados?.length) {
        mensajeNotificacion.value = 'Debes seleccionar al menos un servicio'
        mostrarNotificacionError.value = true; return
      }
      if (!reservaStore.barberoSeleccionado) {
        mensajeNotificacion.value = 'Debes seleccionar un barbero'
        mostrarNotificacionError.value = true; return
      }
      if (!reservaStore.fechaSeleccionada || !reservaStore.horaSeleccionada) {
        mensajeNotificacion.value = 'Debes seleccionar fecha y hora'
        mostrarNotificacionError.value = true; return
      }
      if (!authStore.isAuthenticated) {
        mensajeNotificacion.value = 'Debes iniciar sesión para agendar'
        mostrarNotificacionError.value = true; return
      }

      const datosReserva = {
        clienteId: authStore.user.id,
        barberoId: reservaStore.barberoSeleccionado.id,
        servicioId: reservaStore.serviciosSeleccionados,
        hora: reservaStore.horaSeleccionada + ':00',
        fecha: reservaStore.fechaSeleccionada
      }

      agendando.value = true
      const resultado = await citaStore.crearCita(datosReserva)

      if (resultado.success) {
        mensajeNotificacion.value = resultado.mensaje
        mostrarModalConfirmacion.value = false
        reservaStore.resetReserva()
        currentIndex.value = 0
        emit('update:modelValue', false)
        setTimeout(() => { mostrarNotificacionExito.value = true }, 400)
      } else {
        mensajeNotificacion.value = resultado.mensaje
        horariosAlternativos.value = resultado.horariosAlternativos || []
        barberosAlternativos.value = resultado.barberosAlternativos || []
        mostrarModalConfirmacion.value = false
        mostrarNotificacionError.value = true
      }
    } catch (error) {
      console.error('Error agendando:', error)
      mensajeNotificacion.value = 'Error inesperado al agendar'
      mostrarModalConfirmacion.value = false
      mostrarNotificacionError.value = true
    } finally {
      agendando.value = false
    }
  }
</script>

<style scoped>
  .reserva-dialog { z-index: 2000 !important; }

  .titulo-reserva {
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .reserva-modal-card {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding-top: 0;
  }

  .boton-cerrar {
    position: fixed;
    top: 28px;
    right: 32px;
    font-size: 1.2rem;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .boton-cerrar:hover {
    transform: rotate(90deg) scale(1.1);
    background: #ee6f38 !important;
    color: white !important;
  }

  .flex-container {
    flex: 1;
    display: flex;
    height: calc(100vh - 120px);
    overflow: hidden;
  }

  .tab-content-wrapper {
    padding: 30px;
  }

  .custom-tabs :deep(.v-tab) {
    min-width: auto !important;
    padding: 12px 20px !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-size: 0.75rem;
    font-weight: 800;
  }

  .tab-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tab-number {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
  }

  .arrow-icon {
    font-size: 10px;
    margin-left: 8px;
    opacity: 0.3;
  }

  @media (max-width: 960px) {
    .flex-container { flex-direction: column; height: auto; overflow: visible; }
    .detalle-sidebar { width: 100% !important; border-left: none !important; border-top: 2px solid v-bind(cardBorder); }
    .reserva-modal-card { overflow-y: auto; }
  }
</style>