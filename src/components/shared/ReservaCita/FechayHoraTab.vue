<template>
  <v-container class="fecha-hora-container">
    <h3 class="text-h3 mb-4">Selecciona una fecha y hora</h3>

    <div class="scroll-fecha-hora">
      <!-- 🔹 Selector de fecha -->
      <v-card class="pa-4 mb-6" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">Selecciona un día</v-label>
        <v-date-picker v-model="fechaSeleccionada" color="primary" show-adjacent-months elevation="0" class="date-picker-custom" @update:model-value="actualizarFecha"/>
      </v-card>

      <!-- 🔹 Selector de hora -->
      <v-card class="pa-4" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">Selecciona una hora</v-label>
        
        <div v-if="!fechaSeleccionada" class="text-center py-4 text-grey">
          Primero selecciona una fecha
        </div>
        
        <div v-else class="hora-selector">
          <v-text-field v-model="horaSeleccionada" type="time" variant="outlined" density="comfortable" prepend-inner-icon="mdi-clock-outline" placeholder="HH:MM" hide-details class="time-input" @update:model-value="actualizarHora"/>
        </div>
      </v-card>

      <!-- 🔹 Resumen temporal -->
      <div v-if="fechaSeleccionada && horaSeleccionada" class="resumen-seleccion mt-6">
        <v-alert type="success" border="start" color="primary" variant="tonal">
          <strong>Seleccionado:</strong><br>
          {{ formatearFecha(fechaSeleccionada) }}<br>
          Hora: {{ formatearHora(horaSeleccionada) }}
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useReservaStore } from '@/stores/reserva'

export default {
  name: 'FechaHoraTab',
  setup() {
    const reservaStore = useReservaStore()
    const fechaSeleccionada = ref(null)
    const horaSeleccionada = ref(null)

    // Cargar valores previos si existen
    onMounted(() => {
      if (reservaStore.fechaSeleccionada) {
        fechaSeleccionada.value = reservaStore.fechaSeleccionada
      }
      if (reservaStore.horaSeleccionada) {
        horaSeleccionada.value = reservaStore.horaSeleccionada
      }
    })

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
  max-width: 500px;
  margin-left: 40px;
  text-align: left;
}

.scroll-fecha-hora {
  max-height: 450px;
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

.date-picker-custom {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
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
</style>