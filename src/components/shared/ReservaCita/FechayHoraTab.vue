<template>
  <v-container class="fecha-hora-container">
    <h3 class="text-h3 mb-4">Selecciona una fecha y hora</h3>

    <div class="scroll-fecha-hora">
      <!-- 🔹 Selector de fecha horizontal estilo moderno -->
      <v-card class="pa-4 mb-6" elevation="2" rounded="lg">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <v-label class="text-subtitle-1 d-block mb-1">Selecciona un día</v-label>
            <span class="mes-anio">{{ mesYAnioActual }}</span>
          </div>
          <div class="d-flex ga-2">
            <v-btn icon size="small" variant="outlined" color="primary"@click="semanaAnterior">
              <i class="fas fa-chevron-left"></i>
            </v-btn>
            <v-btn icon size="small" variant="outlined" color="primary"@click="semanaSiguiente">
              <i class="fas fa-chevron-right"></i>
            </v-btn>
          </div>
        </div>

        <!-- Días en formato horizontal -->
        <div class="dias-horizontales">
          <div v-for="(date, index) in diasVisibles" :key="index" class="dia-card"
            :class="{ 
              'dia-seleccionado': esMismaFecha(date, fechaSeleccionada),
              'dia-hoy': esHoy(date) && !esMismaFecha(date, fechaSeleccionada)
            }"
            @click="seleccionarDia(date)"
          >
            <span class="dia-nombre">{{ obtenerNombreDia(date) }}</span>
            <span class="dia-numero">{{ date.getDate() }}</span>
          </div>
        </div>
      </v-card>

      <!-- 🔹 Selector de hora -->
      <v-card class="pa-4" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">
          <i class="fas fa-clock mr-2"></i>
          Selecciona una hora
        </v-label>
        
        <div v-if="!fechaSeleccionada" class="text-center py-4 text-grey">
          <i class="fas fa-calendar-day mr-2"></i>
          Primero selecciona una fecha
        </div>
        
        <div v-else class="hora-selector">
          <v-text-field v-model="horaSeleccionada" type="time" variant="outlined" density="comfortable" placeholder="HH:MM" hide-details class="time-input">
            <template v-slot:prepend-inner>
              <i class="fas fa-clock" style="color: #666; font-size: 18px;"></i>
            </template>
          </v-text-field>
        </div>
      </v-card>

      <!-- 🔹 Resumen temporal -->
      <div v-if="fechaSeleccionada && horaSeleccionada" class="resumen-seleccion mt-6">
        <v-alert type="success" border="start" color="primary" variant="tonal">
          <div class="d-flex align-center mb-2">
            <i class="fas fa-check-circle mr-2"></i>
            <strong>Tu Cita:</strong>
          </div>
          <i class="fas fa-calendar-alt mr-2"></i>{{ formatearFecha(fechaSeleccionada) }}<br>
          <i class="fas fa-clock mr-2"></i>Hora: {{ formatearHora(horaSeleccionada) }}
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useReservaStore } from '@/stores/reserva'

export default {
  name: 'FechaHoraTab',
  setup() {
    const reservaStore = useReservaStore()
    const fechaSeleccionada = ref(null)
    const horaSeleccionada = ref(null)
    const semanaActual = ref(new Date())

    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    // Cargar valores previos si existen
    onMounted(() => {
      if (reservaStore.fechaSeleccionada) {
        fechaSeleccionada.value = reservaStore.fechaSeleccionada
      }
      if (reservaStore.horaSeleccionada) {
        horaSeleccionada.value = reservaStore.horaSeleccionada
      }
    })

    // Generar 7 días visibles desde la semana actual
    const diasVisibles = computed(() => {
      const dias = []
      const inicio = new Date(semanaActual.value)
      
      for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicio)
        fecha.setDate(inicio.getDate() + i)
        dias.push(fecha)
      }
      return dias
    })

    // Watch para actualizar cuando cambie la hora
    watch(horaSeleccionada, (nuevaHora) => {
      if (nuevaHora && fechaSeleccionada.value) {
        actualizarFecha()
      }
    })

    // Obtener mes y año actual de la semana visible
    const mesYAnioActual = computed(() => {
      const fechaMedia = diasVisibles.value[3] || semanaActual.value
      return `${nombresMeses[fechaMedia.getMonth()]} ${fechaMedia.getFullYear()}`
    })

    const semanaSiguiente = () => {
      const nuevaFecha = new Date(semanaActual.value)
      nuevaFecha.setDate(nuevaFecha.getDate() + 7)
      semanaActual.value = nuevaFecha
    }

    const semanaAnterior = () => {
      const nuevaFecha = new Date(semanaActual.value)
      nuevaFecha.setDate(nuevaFecha.getDate() - 7)
      semanaActual.value = nuevaFecha
    }

    const esHoy = (fecha) => {
      const hoy = new Date()
      return fecha.toDateString() === hoy.toDateString()
    }

    const esMismaFecha = (fecha1, fecha2) => {
      if (!fecha1 || !fecha2) return false
      const f1 = new Date(fecha1)
      const f2 = new Date(fecha2)
      return f1.toDateString() === f2.toDateString()
    }

    const obtenerNombreDia = (fecha) => {
      const nombres = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
      return nombres[fecha.getDay()]
    }

    const seleccionarDia = (fecha) => {
      fechaSeleccionada.value = fecha
      actualizarFecha()
    }

    const actualizarFecha = () => {
      if (fechaSeleccionada.value && horaSeleccionada.value) {
        reservaStore.setFechaHora(fechaSeleccionada.value, horaSeleccionada.value)
      }
    }

    const actualizarHora = () => {
      if (fechaSeleccionada.value && horaSeleccionada.value) {
        reservaStore.setFechaHora(fechaSeleccionada.value, horaSeleccionada.value)
      }
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return ''
      const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(fecha).toLocaleDateString('es-ES', opciones)
    }

    const formatearHora = (hora) => {
      if (!hora) return ''
      const [hours, minutes] = hora.split(':')
      const h = parseInt(hours)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12}:${minutes} ${ampm}`
    }

    return {
      fechaSeleccionada,
      horaSeleccionada,
      diasVisibles,
      mesYAnioActual,
      semanaSiguiente,
      semanaAnterior,
      esHoy,
      esMismaFecha,
      obtenerNombreDia,
      seleccionarDia,
      actualizarFecha,
      actualizarHora,
      formatearFecha,
      formatearHora,
    }
  },
}
</script>

<style scoped>
.fecha-hora-container {
  max-width: 700px;
  margin-left: 40px;
  text-align: left;
}

.scroll-fecha-hora {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.scroll-fecha-hora::-webkit-scrollbar {
  width: 8px;
}

.scroll-fecha-hora::-webkit-scrollbar-thumb {
  background-color: #b0b0b0;
  border-radius: 10px;
}

.scroll-fecha-hora::-webkit-scrollbar-thumb:hover {
  background-color: #8c8c8c;
}

/* Mes y año */
.mes-anio {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1976d2;
  text-transform: capitalize;
}

/* Diseño horizontal de días */
.dias-horizontales {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

.dia-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background-color: #f5f5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  user-select: none;
}

.dia-card:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.dia-seleccionado {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
  transform: scale(1.05);
}

.dia-hoy {
  border: 2px solid #1976d2;
}

.dia-hoy::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #1976d2;
}

.dia-seleccionado.dia-hoy::after {
  background-color: white;
}

.dia-nombre {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 4px;
  opacity: 0.8;
}

.dia-numero {
  font-size: 1.5rem;
  font-weight: 700;
}

.hora-selector {
  margin-top: 12px;
}

.time-input {
  max-width: 250px;
}

.time-input :deep(input[type="time"]) {
  font-size: 1.1rem;
  font-weight: 500;
}

.time-input :deep(input[type="time"]::-webkit-calendar-picker-indicator) {
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.time-input :deep(input[type="time"]::-webkit-calendar-picker-indicator:hover) {
  opacity: 1;
}

.text-grey {
  color: #757575;
  font-size: 0.95rem;
}

/* Font Awesome icons styling */
.fas {
  vertical-align: middle;
}

/* Responsive */
@media (max-width: 600px) {
  .dias-horizontales {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .fecha-hora-container {
    margin-left: 0;
  }
}
</style>