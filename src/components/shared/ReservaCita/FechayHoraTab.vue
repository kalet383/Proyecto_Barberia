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
            <v-btn icon size="small" variant="outlined" color="black" @click="semanaAnterior">
              <i class="fas fa-chevron-left"></i>
            </v-btn>
            <v-btn icon size="small" variant="outlined" color="black" @click="semanaSiguiente">
              <i class="fas fa-chevron-right"></i>
            </v-btn>
          </div>
        </div>

        <!-- Días en formato horizontal -->
        <div class="dias-horizontales">
          <div v-for="(date, index) in diasVisibles" :key="index" class="dia-card"
            :class="{ 'dia-seleccionado': esMismaFecha(date, fechaSeleccionada),'dia-hoy': esHoy(date) && !esMismaFecha(date, fechaSeleccionada),'dia-deshabilitado': esDiaPasado(date)}"
            @click="seleccionarDia(date)"
          >
            <span class="dia-nombre">{{ obtenerNombreDia(date) }}</span>
            <span class="dia-numero">{{ date.getDate() }}</span>
          </div>
        </div>
      </v-card>

      <!-- 🔹 Selector de hora con input type="time" -->
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
          <v-text-field 
            v-model="horaSeleccionada" 
            type="time" 
            variant="outlined" 
            density="comfortable" 
            placeholder="HH:MM" 
            hide-details
            class="time-input"
            :min="horaMinima"
            :class="{ 'hora-invalida': esHoraInvalida }"
            @blur="validarHora"
          >
            <template v-slot:prepend-inner>
              <i class="fas fa-clock" style="color: #666; font-size: 18px;"></i>
            </template>
          </v-text-field>
          
          <!-- Mensaje de ayuda/error -->
          <div v-if="esHoy(fechaSeleccionada)" class="mt-2">
            <div v-if="esHoraInvalida" class="text-caption error-text">
              <i class="fas fa-exclamation-circle mr-1"></i>
              No puedes seleccionar una hora que ya pasó. Hora mínima: {{ formatearHoraMinima }}
            </div>
            <div v-else class="text-caption text-grey">
              <i class="fas fa-info-circle mr-1"></i>
              Puedes seleccionar desde las {{ formatearHoraMinima }} en adelante
            </div>
          </div>
        </div>
      </v-card>

      <!-- 🔹 Resumen temporal -->
      <div v-if="fechaSeleccionada && horaSeleccionada && !esHoraInvalida" class="resumen-seleccion mt-6">
        <v-alert type="success" border="start" color="#ee6f38" variant="tonal">
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

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useReservaStore } from '@/stores/reserva'

  const reservaStore = useReservaStore()
  const emit = defineEmits(['emit-fechay-hora', 'estado-fechayhora-siguiente'])
  const fechaSeleccionada = ref(null)
  const horaSeleccionada = ref(null)
  const semanaActual = ref(new Date())
  const horaActual = ref(new Date()) // 🆕 Ref para la hora actual que se actualiza
  const intervalId = ref(null) // 🆕 Para guardar el ID del intervalo
  
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  // 🆕 Computed reactivo que usa horaActual en lugar de new Date()
  const horaMinima = computed(() => {
    if (!fechaSeleccionada.value) return '00:00'
    
    if (esHoy(fechaSeleccionada.value)) {
      const horas = String(horaActual.value.getHours()).padStart(2, '0')
      const minutos = String(horaActual.value.getMinutes()).padStart(2, '0')
      return `${horas}:${minutos}`
    }
    
    return '00:00'
  })

  // Computed para formatear la hora mínima en formato legible
  const formatearHoraMinima = computed(() => {
    if (!horaMinima.value) return ''
    const [h, m] = horaMinima.value.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
  })

  // Computed para verificar si la hora seleccionada es inválida
  const esHoraInvalida = computed(() => {
    if (!fechaSeleccionada.value || !horaSeleccionada.value) return false
    
    // Solo validar si es hoy
    if (esHoy(fechaSeleccionada.value)) {
      return horaSeleccionada.value < horaMinima.value
    }
    
    return false
  })

  // Función para validar la hora cuando el usuario termina de editarla
  const validarHora = () => {
    if (esHoraInvalida.value) {
      // Limpiar la hora si es inválida
      horaSeleccionada.value = null
    }
  }

  // Función para verificar si un día ya pasó
  const esDiaPasado = (fecha) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaComparar = new Date(fecha)
    fechaComparar.setHours(0, 0, 0, 0)
    return fechaComparar < hoy
  }

  // 🆕 Iniciar intervalo para actualizar la hora sincronizado con el reloj del sistema
  const iniciarActualizacionHora = () => {
    // Actualizar inmediatamente
    horaActual.value = new Date()
    
    // Función que actualiza la hora y valida
    const actualizarYValidar = () => {
      horaActual.value = new Date()
      console.log('⏰ Hora actualizada:', horaActual.value.toLocaleTimeString())
      
      // Si hay una hora seleccionada y ahora es inválida, limpiarla
      if (horaSeleccionada.value && esHoraInvalida.value) {
        console.log('⚠️ La hora seleccionada ahora es inválida. Limpiando...')
        horaSeleccionada.value = null
      }
    }
    
    // Calcular cuántos milisegundos faltan para el próximo minuto
    const ahora = new Date()
    const segundosRestantes = 60 - ahora.getSeconds()
    const milisegundosRestantes = (segundosRestantes * 1000) - ahora.getMilliseconds()
    
    // Programar la primera actualización exactamente cuando cambie el minuto
    setTimeout(() => {
      actualizarYValidar()
      
      // Después de la primera sincronización, actualizar cada minuto exacto
      intervalId.value = setInterval(actualizarYValidar, 60000)
    }, milisegundosRestantes)
  }

  // 🆕 Detener el intervalo cuando el componente se desmonte
  const detenerActualizacionHora = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  // Cargar valores previos si existen
  onMounted(() => {
    // Iniciar actualización de hora
    iniciarActualizacionHora()
    
    if (reservaStore.fechaSeleccionada) {
      const f = reservaStore.fechaSeleccionada
      fechaSeleccionada.value = typeof f === 'string' ? new Date(f + 'T00:00:00') : f
      semanaActual.value = new Date(fechaSeleccionada.value)
    }
    if (fechaSeleccionada.value) {
      semanaActual.value = new Date(fechaSeleccionada.value)
    }
    if (reservaStore.horaSeleccionada) {
      horaSeleccionada.value = reservaStore.horaSeleccionada
    }
  })

  // 🆕 Limpiar intervalo al desmontar
  onUnmounted(() => {
    detenerActualizacionHora()
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

  // Watch para detectar cambios y validar
  watch([fechaSeleccionada, horaSeleccionada], ([nuevaFecha, nuevaHora]) => {
    const ambosSeleccionados = !!(nuevaFecha && nuevaHora && nuevaHora.trim() !== '')
    
    // Solo habilitar el botón si ambos están seleccionados Y la hora es válida
    const esValido = ambosSeleccionados && !esHoraInvalida.value
    
    emit('estado-fechayhora-siguiente', esValido)
    
    if (esValido) {
      actualizarFechayHora()
    }
  }, { deep: true })

  // Watch para limpiar hora si cambia la fecha y la hora ya no es válida
  watch(fechaSeleccionada, (nuevaFecha) => {
    if (nuevaFecha && horaSeleccionada.value) {
      if (esHoy(nuevaFecha) && horaSeleccionada.value < horaMinima.value) {
        horaSeleccionada.value = null
      }
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
    if (esDiaPasado(fecha)) {
      return
    }
    fechaSeleccionada.value = fecha
  }

  const actualizarFechayHora = () => {
    if (!fechaSeleccionada.value || !horaSeleccionada.value) return

    let fechaISO = ''

    if (fechaSeleccionada.value instanceof Date && !isNaN(fechaSeleccionada.value)) {
      fechaISO = fechaSeleccionada.value.toISOString().split('T')[0]
    } 
    else if (typeof fechaSeleccionada.value === 'string') {
      const partes = fechaSeleccionada.value.match(/(\d{1,2}) de (\w+) de (\d{4})/)
      if (partes) {
        const [_, dia, mesTexto, año] = partes
        const meses = {
          enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
          julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
        }
        const fecha = new Date(año, meses[mesTexto.toLowerCase()], dia)
        fechaISO = fecha.toISOString().split('T')[0]
      }
    }
    reservaStore.setFechaHora(fechaISO, horaSeleccionada.value)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''

    let dateObj = null

    if (fecha instanceof Date && !isNaN(fecha)) {
      dateObj = fecha
    } else if (typeof fecha === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        dateObj = new Date(fecha + 'T00:00:00')
      } else {
        const partes = fecha.match(/(\d{1,2})\s+de\s+([a-zA-Záéíóúñ]+)\s+de\s+(\d{4})/i)
        if (partes) {
          const [, dia, mesTexto, anio] = partes
          const meses = {
            enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
            julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
          }
          const mesIndex = meses[mesTexto.toLowerCase()]
          if (mesIndex !== undefined) {
            dateObj = new Date(Number(anio), mesIndex, Number(dia))
          }
        } else {
          const intento = new Date(fecha)
          if (!isNaN(intento)) dateObj = intento
        }
      }
    }

    if (!dateObj || isNaN(dateObj)) return 'Invalid Date'

    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return dateObj.toLocaleDateString('es-ES', opciones)
  }

  const formatearHora = (hora) => {
    if (!hora) return ''

    if (/^\d{1,2}:\d{2}$/.test(hora)) {
      const [hoursStr, minutes] = hora.split(':')
      const h = parseInt(hoursStr, 10)
      const ampm = h >= 12 ? 'PM' : 'AM'
      const h12 = h % 12 || 12
      return `${h12}:${minutes} ${ampm}`
    }

    if (typeof hora === 'string') {
      const normalized = hora.replace(/\./g, '').trim()
      return normalized.toUpperCase()
    }

    return String(hora)
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

.mes-anio {
  font-size: 0.95rem;
  font-weight: 600;
  color: black;
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

.dia-deshabilitado {
  background-color: #fafafa;
  color: #bdbdbd;
  cursor: not-allowed;
  opacity: 0.5;
}

.dia-deshabilitado:hover {
  background-color: #fafafa;
  transform: none;
}

.dia-seleccionado {
  background: linear-gradient(135deg, #ee6f38 0%, #ee6f38 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(238, 111, 56, 0.3);
  transform: scale(1.05);
}

.dia-hoy {
  border: 2px solid #ee6f38;
}

.dia-hoy::after {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ee6f38;
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

/* Selector de hora */
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

/* Estilo para hora inválida */
.hora-invalida :deep(.v-field) {
  border: 2px solid #d32f2f !important;
  background-color: #ffebee;
}

.hora-invalida :deep(input) {
  color: #d32f2f;
}

.error-text {
  color: #d32f2f;
  font-weight: 500;
}

.text-grey {
  color: #757575;
  font-size: 0.95rem;
}

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