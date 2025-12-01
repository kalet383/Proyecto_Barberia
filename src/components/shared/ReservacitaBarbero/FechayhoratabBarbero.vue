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
          <div class="d-flex ga-2 align-center position-relative">
            <v-menu v-model="mostrarCalendario" :close-on-content-click="false" location="bottom end" offset="8">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="outlined" color="#ee6f38" v-bind="props" title="Ver calendario completo">
                  <i class="fas fa-calendar-alt"></i>
                </v-btn>
              </template>

              <v-card min-width="320">
                <v-card-text class="pa-0">
                  <v-date-picker 
                    v-model="fechaCalendario" 
                    :min="fechaMinima" 
                    :allowed-dates="esDiaDisponible"
                    color="#ee6f38" 
                    show-adjacent-months 
                    hide-header 
                    elevation="0" 
                    @update:model-value="aplicarFechaCalendario"
                  ></v-date-picker>
                </v-card-text>
              </v-card>
            </v-menu>
            
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
            :class="{ 
              'dia-seleccionado': esMismaFecha(date, fechaSeleccionada),
              'dia-hoy': esHoy(date) && !esMismaFecha(date, fechaSeleccionada),
              'dia-deshabilitado': !esDiaHabilitado(date)
            }"
            @click="seleccionarDia(date)"
          >
            <span class="dia-nombre">{{ obtenerNombreDia(date) }}</span>
            <span class="dia-numero">{{ date.getDate() }}</span>
          </div>
        </div>
      </v-card>

      <!-- 🔹 Selector de FRANJAS HORARIAS -->
      <v-card class="pa-4" elevation="2" rounded="lg">
        <v-label class="text-subtitle-1 mb-2">
          <i class="fas fa-clock mr-2"></i>
          Selecciona una franja horaria
        </v-label>
        
        <div v-if="!fechaSeleccionada" class="text-center py-4 text-grey">
          <i class="fas fa-calendar-day mr-2"></i>
          Primero selecciona una fecha
        </div>
        
        <div v-else-if="franjasDisponibles.length === 0" class="text-center py-4 text-grey">
          <i class="fas fa-calendar-times mr-2"></i>
          No hay franjas disponibles para este día
        </div>
        
        <div v-else class="franjas-grid mt-3">
          <div 
            v-for="franja in franjasDisponibles" 
            :key="franja.id_franja"
            class="franja-card"
            :class="{ 'franja-seleccionada': franjaSeleccionada?.id_franja === franja.id_franja }"
            @click="seleccionarFranja(franja)"
          >
            <i class="fas fa-clock"></i>
            <div class="franja-horario">
              <span>{{ formatearHora24to12(franja.hora_inicio) }}</span>
              <span class="separador">-</span>
              <span>{{ formatearHora24to12(franja.hora_fin) }}</span>
            </div>
          </div>
        </div>
      </v-card>

      <!-- 🔹 Resumen temporal -->
      <div v-if="fechaSeleccionada && franjaSeleccionada" class="resumen-seleccion mt-6">
        <v-alert type="success" border="start" color="#ee6f38" variant="tonal">
          <div class="d-flex align-center mb-2">
            <i class="fas fa-check-circle mr-2"></i>
            <strong>Tu Cita con {{ reservaBarberoStore.nombreCompletoBarbero }}:</strong>
          </div>
          <i class="fas fa-calendar-alt mr-2"></i>{{ formatearFecha(fechaSeleccionada) }}<br>
          <i class="fas fa-clock mr-2"></i>Hora: {{ formatearHora24to12(franjaSeleccionada.hora_inicio) }}
        </v-alert>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useReservaBarberoStore } from '@/stores/reservaBarbero'

  const reservaBarberoStore = useReservaBarberoStore()
  const emit = defineEmits(['emit-fechay-hora', 'estado-fechayhora-siguiente'])
  
  const fechaSeleccionada = ref(null)
  const franjaSeleccionada = ref(null)
  const semanaActual = ref(new Date())
  const mostrarCalendario = ref(false)
  const fechaCalendario = ref(null)
  
  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  // Computed para las franjas disponibles del día seleccionado
  const franjasDisponibles = computed(() => {
    if (!fechaSeleccionada.value) return []
    const diaSemana = obtenerDiaSemanaTexto(fechaSeleccionada.value)
    return reservaBarberoStore.franjasDelDia(diaSemana)
  })

  const fechaMinima = computed(() => {
    const hoy = new Date()
    return hoy.toISOString().split('T')[0]
  })

  // Función para verificar si un día está disponible (para el date picker)
  const esDiaDisponible = (fecha) => {
    const fechaObj = new Date(fecha)
    return esDiaHabilitado(fechaObj)
  }

  const aplicarFechaCalendario = (fecha) => {
    if (fecha) {
      const fechaObj = new Date(fecha)
      fechaSeleccionada.value = fechaObj
      semanaActual.value = new Date(fechaObj)
      mostrarCalendario.value = false
    }
  }

  // Función para verificar si un día está habilitado
  const esDiaHabilitado = (fecha) => {
    if (esDiaPasado(fecha)) return false
    const diaSemana = obtenerDiaSemanaTexto(fecha)
    const diasDisponibles = reservaBarberoStore.diasDisponiblesBarbero
    return diasDisponibles.includes(diaSemana)
  }

  // Obtener día de la semana en texto
  const obtenerDiaSemanaTexto = (fecha) => {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
    return dias[fecha.getDay()]
  }

  // Seleccionar franja
  const seleccionarFranja = (franja) => {
    franjaSeleccionada.value = franja
    console.log('⏰ Franja seleccionada:', franja)
  }

  // Formatear hora de 24h a 12h
  const formatearHora24to12 = (hora24) => {
    const [horasStr, minutos] = hora24.split(':')
    const h = parseInt(horasStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${minutos} ${ampm}`
  }

  const esDiaPasado = (fecha) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaComparar = new Date(fecha)
    fechaComparar.setHours(0, 0, 0, 0)
    return fechaComparar < hoy
  }

  onMounted(() => {
    if (reservaBarberoStore.fechaSeleccionada) {
      const f = reservaBarberoStore.fechaSeleccionada
      fechaSeleccionada.value = typeof f === 'string' ? new Date(f + 'T00:00:00') : f
      semanaActual.value = new Date(fechaSeleccionada.value)
      fechaCalendario.value = reservaBarberoStore.fechaSeleccionada
    }
    if (reservaBarberoStore.horaSeleccionada) {
      // Intentar encontrar la franja que corresponde a esa hora
      const horaGuardada = reservaBarberoStore.horaSeleccionada
      if (fechaSeleccionada.value) {
        const franjas = franjasDisponibles.value
        franjaSeleccionada.value = franjas.find(f => f.hora_inicio === horaGuardada)
      }
    }
  })

  onUnmounted(() => {
    // Cleanup si es necesario
  })

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

  // Watch para detectar cambios
  watch([fechaSeleccionada, franjaSeleccionada], () => {
    const ambosSeleccionados = !!(fechaSeleccionada.value && franjaSeleccionada.value)
    emit('estado-fechayhora-siguiente', ambosSeleccionados)
    
    if (ambosSeleccionados) {
      actualizarFechayHora()
    }
  }, { deep: true })

  // Limpiar franja al cambiar fecha
  watch(fechaSeleccionada, () => {
    franjaSeleccionada.value = null
  })

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
    if (!esDiaHabilitado(fecha)) {
      return
    }
    fechaSeleccionada.value = fecha
  }

  const actualizarFechayHora = () => {
    if (!fechaSeleccionada.value || !franjaSeleccionada.value) return

    let fechaISO = ''
    if (fechaSeleccionada.value instanceof Date && !isNaN(fechaSeleccionada.value)) {
      fechaISO = fechaSeleccionada.value.toISOString().split('T')[0]
    }
    
    // Guardar la hora de inicio de la franja
    reservaBarberoStore.setFechaHora(fechaISO, franjaSeleccionada.value.hora_inicio)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    let dateObj = null
    if (fecha instanceof Date && !isNaN(fecha)) {
      dateObj = fecha
    } else if (typeof fecha === 'string') {
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        dateObj = new Date(fecha + 'T00:00:00')
      }
    }
    if (!dateObj || isNaN(dateObj)) return 'Invalid Date'
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return dateObj.toLocaleDateString('es-ES', opciones)
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

  /* Estilos para franjas horarias */
  .franjas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .franja-card {
    padding: 16px 12px;
    background-color: #f5f5f5;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    border: 2px solid transparent;
  }

  .franja-card:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
    border-color: #ee6f38;
  }

  .franja-seleccionada {
    background: linear-gradient(135deg, #ee6f38 0%, #ee6f38 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(238, 111, 56, 0.3);
    transform: scale(1.05);
    border-color: #ee6f38;
  }

  .franja-horario {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    font-size: 1rem;
  }

  .separador {
    color: #999;
    font-weight: normal;
  }

  .franja-seleccionada .separador {
    color: rgba(255,255,255,0.8);
  }

  .text-grey {
    color: #757575;
    font-size: 0.95rem;
  }

  .fas {
    vertical-align: middle;
  }

  @media (max-width: 600px) {
    .dias-horizontales {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .franjas-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .fecha-hora-container {
      margin-left: 0;
    }
  }
</style>