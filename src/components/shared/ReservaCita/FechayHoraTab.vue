<template>
  <v-container class="fecha-hora-container">
    <h3 class="text-h3 mb-4">Selecciona una fecha y hora</h3>

    <!-- 🔹 Contenedor con scroll -->
    <div class="scroll-fecha-hora">
      <!-- 🔹 Selector de fecha -->
      <v-card class="pa-4 mb-6" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">Selecciona un día</v-label>
        <v-date-picker
          v-model="fechaSeleccionada"
          color="primary"
          show-adjacent-months
          elevation="0"
          class="date-picker-custom"
        />
      </v-card>

      <!-- 🔹 Lista de horas -->
      <v-card class="pa-4" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">Horas disponibles</v-label>
        <div class="horas-grid">
          <v-btn
            v-for="(hora, index) in horasDisponibles"
            :key="index"
            variant="outlined"
            size="small"
            :class="{ 'hora-seleccionada': horaSeleccionada === hora }"
            @click="seleccionarHora(hora)"
          >
            {{ hora }}
          </v-btn>
        </div>
      </v-card>

      <!-- 🔹 Resumen temporal -->
      <div
        v-if="fechaSeleccionada && horaSeleccionada"
        class="resumen-seleccion mt-6"
      >
        <v-alert type="info" border="start" color="primary" variant="tonal">
          <strong>Seleccionado:</strong>
          {{ formatearFecha(fechaSeleccionada) }} - {{ horaSeleccionada }}
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FechaHoraTab',
  setup() {
    const fechaSeleccionada = ref(null)
    const horaSeleccionada = ref(null)

    // 🔹 Horas ficticias por ahora (se conectará al barbero más adelante)
    const horasDisponibles = ref([
      '08:00 AM',
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '01:00 PM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM',
      '05:00 PM',
    ])

    const seleccionarHora = (hora) => {
      horaSeleccionada.value = hora
    }

    const formatearFecha = (fecha) => {
      if (!fecha) return ''
      const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(fecha).toLocaleDateString('es-ES', opciones)
    }

    return {
      fechaSeleccionada,
      horaSeleccionada,
      horasDisponibles,
      seleccionarHora,
      formatearFecha,
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

/* 🔹 Scroll personalizado */
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

/* 🔹 Estilo moderno para el calendario */
.date-picker-custom {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 🔹 Grid de horas */
.horas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

/* 🔹 Botón de hora */
.v-btn {
  transition: all 0.2s ease;
}

.hora-seleccionada {
  border: 2px solid #1976d2 !important;
  background-color: #e3f2fd !important;
}
</style>