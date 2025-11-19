<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">
        <i class="fas fa-calendar-check mr-3" style="color: #1976d2;"></i>
        Mis Citas
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Gestiona tus reservaciones en la barbería
      </p>
    </div>

    <!-- Filtros -->
    <v-card class="mb-6 elevation-2" rounded="lg">
      <v-card-text>
        <v-chip-group v-model="filtroEstado" mandatory color="primary">
          <v-chip value="todas" variant="outlined">
            <i class="fas fa-list mr-2"></i>
            Todas
          </v-chip>
          <v-chip value="agendada" variant="outlined">
            <i class="fas fa-clock mr-2"></i>
            Agendadas
          </v-chip>
          <v-chip value="completada" variant="outlined">
            <i class="fas fa-check-circle mr-2"></i>
            Completadas
          </v-chip>
          <v-chip value="cancelada" variant="outlined">
            <i class="fas fa-times-circle mr-2"></i>
            Canceladas
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Cargando citas...</p>
    </div>

    <!-- Sin citas -->
    <v-card v-else-if="citasFiltradas.length === 0" class="text-center py-12 elevation-2" rounded="lg">
      <i class="fas fa-calendar-times fa-4x text-grey mb-4"></i>
      <h3 class="text-h5 mb-2">No tienes citas {{ filtroEstado !== 'todas' ? filtroEstado + 's' : '' }}</h3>
      <p class="text-grey">{{ getMensajeSinCitas() }}</p>
    </v-card>

    <!-- Lista de Citas -->
    <v-row v-else>
      <v-col
        v-for="cita in citasFiltradas"
        :key="cita.id_cita"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card
          class="cita-card elevation-3"
          rounded="lg"
          :class="getCardClass(cita.estado)"
        >
          <!-- Estado Badge -->
          <div class="estado-badge" :class="getEstadoClass(cita.estado)">
            <i :class="getEstadoIcon(cita.estado)" class="mr-1"></i>
            {{ cita.estado.toUpperCase() }}
          </div>

          <v-card-text class="pb-2">
            <!-- Fecha y Hora -->
            <div class="mb-4">
              <div class="d-flex align-center mb-2">
                <i class="fas fa-calendar-alt fa-lg mr-3" style="color: #1976d2; width: 24px;"></i>
                <div>
                  <div class="text-subtitle-2 text-grey">Fecha</div>
                  <div class="text-h6 font-weight-bold">
                    {{ formatearFecha(cita.fecha) }}
                  </div>
                </div>
              </div>
              
              <div class="d-flex align-center">
                <i class="fas fa-clock fa-lg mr-3" style="color: #1976d2; width: 24px;"></i>
                <div>
                  <div class="text-subtitle-2 text-grey">Hora</div>
                  <div class="text-h6 font-weight-bold">
                    {{ formatearHora(cita.hora) }}
                  </div>
                </div>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Barbero -->
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" color="primary" class="mr-3">
                <i class="fas fa-user-tie" style="color: white;"></i>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 text-grey">Barbero</div>
                <div class="text-body-1 font-weight-medium">
                  {{ getNombreBarbero(cita.barbero) }}
                </div>
              </div>
            </div>

            <!-- Servicio -->
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" color="secondary" class="mr-3">
                <i class="fas fa-cut" style="color: white;"></i>
              </v-avatar>
              <div>
                <div class="text-subtitle-2 text-grey">Servicio</div>
                <div class="text-body-1 font-weight-medium">
                  {{ getNombreServicio(cita.servicio) }}
                </div>
              </div>
            </div>

            <!-- Precio -->
            <div class="d-flex align-center">
              <i class="fas fa-dollar-sign fa-lg mr-3" style="color: #4caf50; width: 24px;"></i>
              <div>
                <div class="text-subtitle-2 text-grey">Precio</div>
                <div class="text-h6 font-weight-bold" style="color: #4caf50;">
                  ${{ getPrecioServicio(cita.servicio) }}
                </div>
              </div>
            </div>
          </v-card-text>

          <!-- Botón Cancelar -->
          <v-card-actions v-if="cita.estado === 'agendada'" class="px-4 pb-4">
            <v-btn
              block
              color="error"
              variant="outlined"
              @click="abrirModalCancelar(cita)"
              :disabled="cargandoCancelacion"
            >
              <i class="fas fa-times-circle mr-2"></i>
              Cancelar Cita
            </v-btn>
          </v-card-actions>

          <!-- Info adicional para citas completadas/canceladas -->
          <v-card-actions v-else class="px-4 pb-4">
            <v-chip
              block
              :color="cita.estado === 'completada' ? 'success' : 'error'"
              variant="flat"
              class="justify-center"
            >
              <i :class="getEstadoIcon(cita.estado)" class="mr-2"></i>
              {{ cita.estado === 'completada' ? 'Servicio Completado' : 'Cita Cancelada' }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmación -->
    <v-dialog v-model="modalCancelar" max-width="500" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h5 pa-6 bg-error">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Confirmar Cancelación
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">
            ¿Estás seguro de que deseas cancelar esta cita?
          </p>
          
          <v-alert
            type="warning"
            variant="tonal"
            class="mb-4"
          >
            Esta acción no se puede deshacer
          </v-alert>

          <div v-if="citaSeleccionada" class="pa-4 bg-grey-lighten-4 rounded">
            <div class="mb-2">
              <strong>Fecha:</strong> {{ formatearFecha(citaSeleccionada.fecha) }}
            </div>
            <div class="mb-2">
              <strong>Hora:</strong> {{ formatearHora(citaSeleccionada.hora) }}
            </div>
            <div class="mb-2">
              <strong>Barbero:</strong> {{ getNombreBarbero(citaSeleccionada.barbero) }}
            </div>
            <div>
              <strong>Servicio:</strong> {{ getNombreServicio(citaSeleccionada.servicio) }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn
            variant="text"
            @click="cerrarModalCancelar"
            :disabled="cargandoCancelacion"
          >
            No, mantener cita
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmarCancelacion"
            :loading="cargandoCancelacion"
          >
            <i class="fas fa-times mr-2"></i>
            Sí, cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de notificaciones -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top"
    >
      <i :class="snackbarIcon" class="mr-2"></i>
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCitaStore } from '@/stores/cita'
import { useBarberStore } from '@/stores/barber'
import { useServiceStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth' // Asume que tienes un store de auth con el usuario actual

const citaStore = useCitaStore()
const barberStore = useBarberStore()
const serviceStore = useServiceStore()
const authStore = useAuthStore()

// Estado
const filtroEstado = ref('todas')
const cargando = ref(false)
const cargandoCancelacion = ref(false)
const modalCancelar = ref(false)
const citaSeleccionada = ref<any>(null)

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const snackbarIcon = ref('fas fa-check-circle')

// Computed
const citasFiltradas = computed(() => {
  // Validar que citas sea un array
  if (!Array.isArray(citaStore.citas)) {
    console.log('❌ citaStore.citas no es un array:', citaStore.citas)
    return []
  }

  console.log('📋 Total de citas en el store:', citaStore.citas.length)
  console.log('🔍 Citas completas:', citaStore.citas)
  console.log('👤 Usuario actual ID:', authStore.user?.id)

  let citas = citaStore.citas.filter(
    (cita: any) => {
      console.log('Comparando - Cliente ID:', cita.cliente?.id, 'con Usuario ID:', authStore.user?.id)
      return cita.cliente?.id === authStore.user?.id
    }
  )

  console.log('✅ Citas del usuario filtradas:', citas.length)

  if (filtroEstado.value !== 'todas') {
    citas = citas.filter((cita: any) => cita.estado === filtroEstado.value)
    console.log(`🎯 Citas con estado "${filtroEstado.value}":`, citas.length)
  }

  // Ordenar por fecha y hora (más recientes primero)
  return citas.sort((a: any, b: any) => {
    const fechaA = new Date(`${a.fecha} ${a.hora}`)
    const fechaB = new Date(`${b.fecha} ${b.hora}`)
    return fechaB.getTime() - fechaA.getTime()
  })
})

// Métodos
const cargarDatos = async () => {
  cargando.value = true
  try {
    await Promise.all([
      citaStore.obtenerCitas(),
      barberStore.getBarbers(),
      serviceStore.getServices()
    ])
  } catch (error) {
    mostrarNotificacion('Error al cargar los datos', 'error')
  } finally {
    cargando.value = false
  }
}

const formatearFecha = (fecha: string) => {
  const date = new Date(fecha)
  const opciones: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('es-ES', opciones)
}

const formatearHora = (hora: string) => {
  // Convierte "14:30:00" a "2:30 PM"
  const [hours, minutes] = hora.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

const getNombreBarbero = (barbero: any) => {
  if (!barbero) return 'Barbero no asignado'
  return `${barbero.nombre} ${barbero.apellido}`
}

const getNombreServicio = (servicio: any) => {
  if (!servicio) return 'Servicio no disponible'
  return servicio.nombre
}

const getPrecioServicio = (servicio: any) => {
  if (!servicio || !servicio.precio) return '0.00'
  // Convertir a número por si viene como string
  const precio = parseFloat(servicio.precio)
  return isNaN(precio) ? '0.00' : precio.toFixed(2)
}

const getCardClass = (estado: string) => {
  return {
    'border-left-agendada': estado === 'agendada',
    'border-left-completada': estado === 'completada',
    'border-left-cancelada': estado === 'cancelada'
  }
}

const getEstadoClass = (estado: string) => {
  return {
    'estado-agendada': estado === 'agendada',
    'estado-completada': estado === 'completada',
    'estado-cancelada': estado === 'cancelada'
  }
}

const getEstadoIcon = (estado: string) => {
  const icons: Record<string, string> = {
    agendada: 'fas fa-clock',
    completada: 'fas fa-check-circle',
    cancelada: 'fas fa-times-circle'
  }
  return icons[estado] || 'fas fa-question-circle'
}

const getMensajeSinCitas = () => {
  const mensajes: Record<string, string> = {
    todas: '¡Agenda tu primera cita con nosotros!',
    agendada: 'No tienes citas agendadas. ¡Reserva una ahora!',
    completada: 'Aún no has completado ninguna cita.',
    cancelada: 'No tienes citas canceladas.'
  }
  return mensajes[filtroEstado.value] || ''
}

const abrirModalCancelar = (cita: any) => {
  citaSeleccionada.value = cita
  modalCancelar.value = true
}

const cerrarModalCancelar = () => {
  modalCancelar.value = false
  citaSeleccionada.value = null
}

const confirmarCancelacion = async () => {
  if (!citaSeleccionada.value) return

  cargandoCancelacion.value = true
  try {
    await citaStore.eliminarCita(citaSeleccionada.value.id_cita)
    mostrarNotificacion('Cita cancelada exitosamente', 'success')
    cerrarModalCancelar()
    // Recargar citas
    await citaStore.obtenerCitas()
  } catch (error) {
    mostrarNotificacion('Error al cancelar la cita. Intenta nuevamente.', 'error')
  } finally {
    cargandoCancelacion.value = false
  }
}

const mostrarNotificacion = (texto: string, tipo: 'success' | 'error') => {
  snackbarText.value = texto
  snackbarColor.value = tipo
  snackbarIcon.value = tipo === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
  snackbar.value = true
}

// Lifecycle
onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.cita-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.cita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.border-left-agendada {
  border-left: 5px solid #1976d2;
}

.border-left-completada {
  border-left: 5px solid #4caf50;
}

.border-left-cancelada {
  border-left: 5px solid #f44336;
}

.estado-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.estado-agendada {
  background-color: #1976d2;
  color: white;
}

.estado-completada {
  background-color: #4caf50;
  color: white;
}

.estado-cancelada {
  background-color: #f44336;
  color: white;
}

.v-chip-group {
  display: flex;
  gap: 8px;
}

@media (max-width: 600px) {
  .estado-badge {
    font-size: 0.65rem;
    padding: 4px 8px;
  }
}
</style>