<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">
        <i class="fas fa-chart-line mr-3" style="color: #ee6f38;"></i>
        Dashboard de Citas
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Resumen general de la gestión de citas
      </p>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-12">
      <v-progress-circular indeterminate color="#ee6f38" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Cargando estadísticas...</p>
    </div>

    <template v-else>
      <!-- KPIs Principales -->
      <v-row class="mb-6">
        <!-- Total de Citas -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card elevation-3" rounded="lg">
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption text-grey mb-1">Total de Citas</div>
                  <div class="text-h4 font-weight-bold">{{ estadisticas.total }}</div>
                  <div class="text-caption mt-1" style="color: #ee6f38;">
                    <i class="fas fa-calendar-alt mr-1"></i>
                    Todas las citas
                  </div>
                </div>
                <v-avatar size="60" style="background-color: rgba(238, 111, 56, 0.1);">
                  <i class="fas fa-calendar-check fa-2x" style="color: #ee6f38;"></i>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Citas Agendadas -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card elevation-3" rounded="lg">
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption text-grey mb-1">Agendadas</div>
                  <div class="text-h4 font-weight-bold text-primary">{{ estadisticas.agendadas }}</div>
                  <div class="text-caption text-success mt-1">
                    <i class="fas fa-arrow-up mr-1"></i>
                    Próximas citas
                  </div>
                </div>
                <v-avatar size="60" style="background-color: rgba(33, 150, 243, 0.1);">
                  <i class="fas fa-clock fa-2x text-primary"></i>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Citas Completadas -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card elevation-3" rounded="lg">
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption text-grey mb-1">Completadas</div>
                  <div class="text-h4 font-weight-bold text-success">{{ estadisticas.completadas }}</div>
                  <div class="text-caption text-grey mt-1">
                    <i class="fas fa-check-circle mr-1"></i>
                    Servicios realizados
                  </div>
                </div>
                <v-avatar size="60" style="background-color: rgba(76, 175, 80, 0.1);">
                  <i class="fas fa-check-circle fa-2x text-success"></i>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Citas Canceladas -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="kpi-card elevation-3" rounded="lg">
            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <div class="text-caption text-grey mb-1">Canceladas</div>
                  <div class="text-h4 font-weight-bold text-error">{{ estadisticas.canceladas }}</div>
                  <div class="text-caption text-grey mt-1">
                    <i class="fas fa-times-circle mr-1"></i>
                    Citas canceladas
                  </div>
                </div>
                <v-avatar size="60" style="background-color: rgba(244, 67, 54, 0.1);">
                  <i class="fas fa-times-circle fa-2x text-error"></i>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Ingresos y Citas de Hoy -->
      <v-row class="mb-6">
        <!-- Ingresos -->
        <v-col cols="12" md="6">
          <v-card class="elevation-3" rounded="lg" style="background: linear-gradient(135deg, #ee6f38 0%, #d85a28 100%);">
            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center">
                <div class="text-white">
                  <div class="text-subtitle-1 mb-2 opacity-90">
                    <i class="fas fa-dollar-sign mr-2"></i>
                    Ingresos Totales
                  </div>
                  <div class="text-h3 font-weight-bold mb-2">
                    ${{ estadisticas.ingresosTotales }}
                  </div>
                  <div class="text-caption opacity-80"> Solo de citas completadas </div>
                </div>
                <div>
                  <v-icon size="80" color="white" style="opacity: 0.2;"> mdi-cash-multiple </v-icon>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Citas de Hoy -->
        <v-col cols="12" md="6">
          <v-card class="elevation-3" rounded="lg" height="100%">
            <v-card-title class="d-flex align-center">
              <i class="fas fa-calendar-day mr-2" style="color: #ee6f38;"></i>
              Citas de Hoy
              <v-spacer></v-spacer>
              <v-chip color="#ee6f38" variant="flat" size="small">
                {{ citasHoy.length }} citas
              </v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text style="max-height: 200px; overflow-y: auto;">
              <div v-if="citasHoy.length === 0" class="text-center py-6 text-grey">
                <i class="fas fa-calendar-times fa-2x mb-2"></i>
                <p>No hay citas programadas para hoy</p>
              </div>
              <div v-else>
                <div v-for="cita in citasHoy" :key="cita.id_cita" class="cita-hoy-item mb-3 pa-3 rounded" :class="getEstadoClass(cita.estado)">
                  <div class="d-flex align-center">
                    <v-avatar size="40" :color="getColorEstado(cita.estado)" class="mr-3">
                      <i :class="getIconoEstado(cita.estado)" style="color: white;"></i>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="font-weight-medium">
                        {{ getNombreCliente(cita.cliente) }}
                      </div>
                      <div class="text-caption text-grey">
                        <i class="fas fa-clock mr-1"></i>
                        {{ formatearHora(cita.hora) }} - 
                        <i class="fas fa-user-tie ml-2 mr-1"></i>
                        {{ getNombreBarbero(cita.barbero) }}
                      </div>
                    </div>
                    <v-chip :color="getColorEstado(cita.estado)" size="small" variant="flat">
                      {{ cita.estado }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Barberos más solicitados y Servicios más populares -->
      <v-row class="mb-6">
        <!-- Top Barberos -->
        <v-col cols="12" md="6">
          <v-card class="elevation-3" rounded="lg">
            <v-card-title class="d-flex align-center">
              <i class="fas fa-award mr-2" style="color: #ee6f38;"></i>
              Top Barberos
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div v-if="topBarberos.length === 0" class="text-center py-6 text-grey">
                <i class="fas fa-user-slash fa-2x mb-2"></i>
                <p>No hay datos disponibles</p>
              </div>
              <div v-else>
                <div v-for="(barbero, index) in topBarberos" :key="index" class="mb-4">
                  <div class="d-flex align-center mb-2">
                    <v-chip :color="index === 0 ? '#ee6f38' : 'grey'" size="small" variant="flat" class="mr-3">
                      #{{ index + 1 }}
                    </v-chip>
                    <div class="flex-grow-1">
                      <div class="font-weight-medium">{{ barbero.nombre }}</div>
                      <div class="text-caption text-grey">{{ barbero.total }} citas</div>
                    </div>
                    <div class="text-h6 font-weight-bold" style="color: #ee6f38;">
                      ${{ barbero.ingresos }}
                    </div>
                  </div>
                  <v-progress-linear :model-value="barbero.porcentaje" color="#ee6f38" height="6" rounded></v-progress-linear>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Top Servicios -->
        <v-col cols="12" md="6">
          <v-card class="elevation-3" rounded="lg">
            <v-card-title class="d-flex align-center">
              <i class="fas fa-cut mr-2" style="color: #ee6f38;"></i>
              Servicios Más Populares
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div v-if="topServicios.length === 0" class="text-center py-6 text-grey">
                <i class="fas fa-inbox fa-2x mb-2"></i>
                <p>No hay datos disponibles</p>
              </div>
              <div v-else>
                <div v-for="(servicio, index) in topServicios" :key="index" class="mb-4">
                  <div class="d-flex align-center mb-2">
                    <v-chip :color="index === 0 ? '#ee6f38' : 'grey'" size="small" variant="flat" class="mr-3">
                      #{{ index + 1 }}
                    </v-chip>
                    <div class="flex-grow-1">
                      <div class="font-weight-medium">{{ servicio.nombre }}</div>
                      <div class="text-caption text-grey">{{ servicio.total }} veces</div>
                    </div>
                  </div>
                  <v-progress-linear :model-value="servicio.porcentaje" color="#ee6f38" height="6" rounded></v-progress-linear>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Accesos rápidos -->
      <v-row>
        <v-col cols="12">
          <v-card class="elevation-3" rounded="lg">
            <v-card-title>
              <i class="fas fa-bolt mr-2" style="color: #ee6f38;"></i>
              Accesos Rápidos
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="6" md="3">
                  <v-btn block size="large" variant="outlined" color="#ee6f38" @click="irAGestionarCitas">
                    <i class="fas fa-list mr-2"></i>
                    Ver Todas las Citas
                  </v-btn>
                </v-col>
                <v-col cols="6" md="3">
                  <v-btn block size="large" variant="outlined" color="primary" @click="irACitasAgendadas">
                    <i class="fas fa-clock mr-2"></i>
                    Citas Agendadas
                  </v-btn>
                </v-col>
                <v-col cols="6" md="3">
                  <v-btn block size="large" variant="outlined" color="success" @click="irACitasCompletadas">
                    <i class="fas fa-check-circle mr-2"></i>
                    Completadas
                  </v-btn>
                </v-col>
                <v-col cols="6" md="3">
                  <v-btn block size="large" variant="outlined" color="error" @click="irACitasCanceladas">
                    <i class="fas fa-times-circle mr-2"></i>
                    Canceladas
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useCitaStore } from '@/stores/cita'
    import { useBarberStore } from '@/stores/barber'
    import { useServiceStore } from '@/stores/services'

    const router = useRouter()
const citaStore = useCitaStore()
const barberStore = useBarberStore()
const serviceStore = useServiceStore()

const cargando = ref(false)

// Estadísticas generales
const estadisticas = computed(() => {
  console.log('📊 Calculando estadísticas...')
  console.log('Citas en store:', citaStore.citas)
  
  if (!citaStore.citas || !Array.isArray(citaStore.citas)) {
    console.log('⚠️ citaStore.citas no es válido')
    return {
      total: 0,
      agendadas: 0,
      completadas: 0,
      canceladas: 0,
      ingresosTotales: '0.00'
    }
  }

  const total = citaStore.citas.length
  const agendadas = citaStore.citas.filter(c => c.estado === 'agendada').length
  const completadas = citaStore.citas.filter(c => c.estado === 'completada').length
  const canceladas = citaStore.citas.filter(c => c.estado === 'cancelada').length

  // Calcular ingresos totales (solo citas completadas)
  const ingresos = citaStore.citas
    .filter(c => c.estado === 'completada')
    .reduce((sum, cita) => {
      const precio = parseFloat(cita.servicio?.precio || 0)
      return sum + (isNaN(precio) ? 0 : precio)
    }, 0)

  console.log('✅ Estadísticas calculadas:', { total, agendadas, completadas, canceladas, ingresos })

  return {
    total,
    agendadas,
    completadas,
    canceladas,
    ingresosTotales: ingresos.toFixed(2)
  }
})

// Citas de hoy
const citasHoy = computed(() => {
  if (!Array.isArray(citaStore.citas)) return []

  const hoy = new Date()
  const year = hoy.getFullYear()
  const month = String(hoy.getMonth() + 1).padStart(2, '0')
  const day = String(hoy.getDate()).padStart(2, '0')
  const fechaHoy = `${year}-${month}-${day}`

  return citaStore.citas
    .filter(cita => {
      const fechaCita = cita.fecha.split('T')[0]
      return fechaCita === fechaHoy
    })
    .sort((a, b) => a.hora.localeCompare(b.hora))
})

// Top barberos
const topBarberos = computed(() => {
  if (!Array.isArray(citaStore.citas)) return []

  const barberosMap = new Map()

  citaStore.citas.forEach(cita => {
    if (cita.barbero && cita.estado === 'completada') {
      const id = cita.barbero.id
      const nombre = `${cita.barbero.nombre} ${cita.barbero.apellido}`
      const precio = parseFloat(cita.servicio?.precio || 0)

      if (barberosMap.has(id)) {
        const data = barberosMap.get(id)
        data.total++
        data.ingresos += isNaN(precio) ? 0 : precio
      } else {
        barberosMap.set(id, {
          nombre,
          total: 1,
          ingresos: isNaN(precio) ? 0 : precio
        })
      }
    }
  })

  const barberos = Array.from(barberosMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const maxTotal = barberos[0]?.total || 1

  return barberos.map(b => ({
    ...b,
    ingresos: b.ingresos.toFixed(2),
    porcentaje: (b.total / maxTotal) * 100
  }))
})

// Top servicios
const topServicios = computed(() => {
  if (!Array.isArray(citaStore.citas)) return []

  const serviciosMap = new Map()

  citaStore.citas.forEach(cita => {
    if (cita.servicio && cita.estado === 'completada') {
      const id = cita.servicio.id
      const nombre = cita.servicio.nombre

      if (serviciosMap.has(id)) {
        serviciosMap.get(id).total++
      } else {
        serviciosMap.set(id, { nombre, total: 1 })
      }
    }
  })

  const servicios = Array.from(serviciosMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  const maxTotal = servicios[0]?.total || 1

  return servicios.map(s => ({
    ...s,
    porcentaje: (s.total / maxTotal) * 100
  }))
})

// Métodos
const cargarDatos = async () => {
  console.log('🔄 Dashboard: Iniciando carga de datos...')
  cargando.value = true
  try {
    await Promise.all([
      citaStore.obtenerCitas(),
      barberStore.getBarbers(),
      serviceStore.getServices()
    ])
    console.log('✅ Dashboard: Datos cargados')
    console.log('📊 Citas disponibles:', citaStore.citas)
  } catch (error) {
    console.error('❌ Dashboard: Error al cargar datos:', error)
  } finally {
    cargando.value = false
  }
}

const formatearHora = (hora) => {
  const [hours, minutes] = hora.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

const getNombreCliente = (cliente) => {
  if (!cliente) return 'Cliente no disponible'
  return `${cliente.nombre} ${cliente.apellido}`
}

const getNombreBarbero = (barbero) => {
  if (!barbero) return 'Barbero no asignado'
  return `${barbero.nombre} ${barbero.apellido}`
}

const getEstadoClass = (estado) => {
  const classes = {
    agendada: 'bg-blue-lighten-5',
    completada: 'bg-green-lighten-5',
    cancelada: 'bg-red-lighten-5'
  }
  return classes[estado] || ''
}

const getColorEstado = (estado) => {
  const colores = {
    agendada: 'primary',
    completada: 'success',
    cancelada: 'error'
  }
  return colores[estado] || 'grey'
}

const getIconoEstado = (estado) => {
  const iconos = {
    agendada: 'fas fa-clock',
    completada: 'fas fa-check-circle',
    cancelada: 'fas fa-times-circle'
  }
  return iconos[estado] || 'fas fa-question-circle'
}

// Accesos Rapidos
const irAGestionarCitas = () => {
  router.push('@/views/dashboards/default/components/administrador/gestion-de-citas/GestionarCitas.vue')
}

const irACitasAgendadas = () => {
  router.push('/admin/citas/gestionar?estado=agendada')
}

const irACitasCompletadas = () => {
  router.push('/admin/citas/gestionar?estado=completada')
}

const irACitasCanceladas = () => {
  router.push('/admin/citas/gestionar?estado=cancelada')
}

onMounted(async () => {
  console.log('🚀 Dashboard montado')
  await cargarDatos()
})
</script>

<style scoped>
  .kpi-card {
    transition: all 0.3s ease;
  }

  .kpi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  }

  .cita-hoy-item {
    transition: all 0.2s ease;
  }

  .cita-hoy-item:hover {
    transform: translateX(4px);
  }
</style>