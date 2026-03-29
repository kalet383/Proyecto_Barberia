<template>
  <v-container class="fecha-hora-container">
    <div class="section-header mb-5">
        <div class="title-accent"></div>
        <h3 class="section-title" :style="{ color: txtPrimary }">Selecciona fecha y hora</h3>
    </div>

    <div class="scroll-fecha-hora">
      <!-- Selector de fecha -->
      <div class="fecha-card mb-4" :style="{ background: cardBg, border: `1.5px solid ${cardBorder}` }">
        <div class="fecha-card-header">
          <div>
            <span class="card-label">Día de la cita</span>
            <span class="mes-anio" :style="{ color: txtPrimary }">{{ mesYAnioActual }}</span>
          </div>
          <div class="nav-controls">
            <!-- Calendario completo -->
            <v-menu v-model="mostrarCalendario" :close-on-content-click="false" location="bottom end" offset="8">
              <template v-slot:activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  class="nav-btn calendar-btn"
                  density="comfortable"
                  icon
                  variant="flat"
                  title="Ver calendario completo"
                >
                  <i class="fas fa-calendar-alt"></i>
                </v-btn>
              </template>
              <v-card min-width="320" rounded="lg" elevation="12" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
                <v-card-text class="pa-0">
                  <v-date-picker 
                    v-model="fechaCalendario" 
                    :min="fechaMinima" 
                    :max="fechaMaxima" 
                    color="#ee6f38" 
                    show-adjacent-months 
                    hide-header 
                    elevation="0" 
                    @update:model-value="aplicarFechaCalendario"
                    :theme="isDark ? 'dark' : 'light'"
                    class="custom-date-picker"
                  ></v-date-picker>
                </v-card-text>
              </v-card>
            </v-menu>
            
            <button class="nav-btn" @click="semanaAnterior" :style="{ borderColor: cardBorder, color: txtSecondary }"><i class="fas fa-chevron-left"></i></button>
            <button class="nav-btn" @click="semanaSiguiente" :style="{ borderColor: cardBorder, color: txtSecondary }"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <!-- Días horizontales -->
        <div class="dias-grid">
          <button
            v-for="(date, index) in diasVisibles"
            :key="index"
            class="dia-btn"
            :class="{ 
              'dia-seleccionado': esMismaFecha(date, fechaSeleccionada),
              'dia-hoy': esHoy(date) && !esMismaFecha(date, fechaSeleccionada),
              'dia-deshabilitado': esDiaFueraDeRango(date)
            }"
            :disabled="esDiaFueraDeRango(date)"
            @click="seleccionarDia(date)"
            :style="!esMismaFecha(date, fechaSeleccionada) ? { background: headerBg, borderColor: cardBorder, color: txtPrimary } : {}"
          >
            <span class="dia-nombre" :style="{ color: esMismaFecha(date, fechaSeleccionada) ? 'white' : txtSecondary }">{{ obtenerNombreDia(date) }}</span>
            <span class="dia-numero" :style="{ color: esMismaFecha(date, fechaSeleccionada) ? 'white' : txtPrimary }">{{ date.getDate() }}</span>
            <span v-if="esHoy(date)" class="dia-hoy-dot"></span>
          </button>
        </div>
      </div>

      <!-- Selector de hora -->
      <div class="hora-card" :style="{ background: cardBg, border: `1.5px solid ${cardBorder}` }">
        <div class="hora-card-header">
          <i class="fas fa-clock hora-icon"></i>
          <span class="card-label">Hora de la cita</span>
        </div>
        
        <div v-if="!fechaSeleccionada" class="hora-placeholder">
          <i class="fas fa-calendar-day placeholder-icon" :style="{ color: isDark ? '#374151' : '#eee' }"></i>
          <p :style="{ color: txtSecondary }">Selecciona primero una fecha</p>
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
            :base-color="cardBorder"
            :color="isDark ? 'orange' : '#ee6f38'"
          >
            <template v-slot:prepend-inner>
              <i class="fas fa-clock" style="color: #ee6f38; font-size: 16px;"></i>
            </template>
          </v-text-field>
          
          <div v-if="esHoy(fechaSeleccionada)" class="hora-hint" :class="{ error: esHoraInvalida }" :style="!esHoraInvalida ? { background: headerBg, color: txtSecondary } : {}">
            <i :class="['fas mr-1', esHoraInvalida ? 'fa-exclamation-circle' : 'fa-info-circle']"></i>
            <span v-if="esHoraInvalida">Hora inválida. Mínima: {{ formatearHoraMinima }}</span>
            <span v-else>Disponible desde las {{ formatearHoraMinima }}</span>
          </div>
        </div>
      </div>

      <!-- Resumen de selección -->
      <div v-if="fechaSeleccionada && horaSeleccionada && !esHoraInvalida" class="resumen-cita mt-6">
        <div class="resumen-icon">
            <i class="fas fa-check"></i>
        </div>
        <div class="resumen-info">
            <span class="resumen-titulo">Tu cita programada</span>
            <span class="resumen-fecha" :style="{ color: txtPrimary }">
                <i class="fas fa-calendar-alt mr-1"></i>
                {{ formatearFecha(fechaSeleccionada) }}
            </span>
            <span class="resumen-hora" :style="{ color: txtPrimary }">
                <i class="fas fa-clock mr-1"></i>
                {{ formatearHora(horaSeleccionada) }}
            </span>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useReservaStore } from '@/stores/reserva'
  import { useCustomizerStore } from '@/stores/customizer'

  const reservaStore = useReservaStore()
  const customizer = useCustomizerStore()
  
  const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
  
  // Adaptive Colors
  const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a1a');
  const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#666');
  const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
  const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eeeeee');
  const headerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');

  const emit = defineEmits(['emit-fechay-hora', 'estado-fechayhora-siguiente'])
  const fechaSeleccionada = ref(null)
  const horaSeleccionada = ref(null)
  const semanaActual = ref(new Date())
  const horaActual = ref(new Date())
  const intervalId = ref(null)
  const mostrarCalendario = ref(false)
  const fechaCalendario = ref(null)
  
  const nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  const fechaMinima = computed(() => {
    return new Date().toISOString().split('T')[0]
  })

  const fechaMaxima = computed(() => {
    const hoy = new Date()
    const max = new Date(hoy)
    max.setMonth(hoy.getMonth() + 2)
    return max.toISOString().split('T')[0]
  })

  const aplicarFechaCalendario = (fecha) => {
    if (fecha) {
      const fechaObj = new Date(fecha)
      fechaSeleccionada.value = fechaObj
      semanaActual.value = new Date(fechaObj)
      mostrarCalendario.value = false
    }
  }

  const horaMinima = computed(() => {
    if (!fechaSeleccionada.value) return '00:00'
    if (esHoy(fechaSeleccionada.value)) {
      const horas = String(horaActual.value.getHours()).padStart(2, '0')
      const minutos = String(horaActual.value.getMinutes()).padStart(2, '0')
      return `${horas}:${minutos}`
    }
    return '00:00'
  })

  const formatearHoraMinima = computed(() => {
    if (!horaMinima.value) return ''
    const [h, m] = horaMinima.value.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
  })

  const esHoraInvalida = computed(() => {
    if (!fechaSeleccionada.value || !horaSeleccionada.value) return false
    if (esHoy(fechaSeleccionada.value)) return horaSeleccionada.value < horaMinima.value
    return false
  })

  const validarHora = () => {
    if (esHoraInvalida.value) horaSeleccionada.value = null
  }

  const esDiaFueraDeRango = (fecha) => {
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const limite = new Date(hoy); limite.setMonth(hoy.getMonth() + 2)
    const fechaComparar = new Date(fecha); fechaComparar.setHours(0, 0, 0, 0)
    return fechaComparar < hoy || fechaComparar > limite
  }

  const iniciarActualizacionHora = () => {
    horaActual.value = new Date()
    const actualizarYValidar = () => {
      horaActual.value = new Date()
      if (horaSeleccionada.value && esHoraInvalida.value) horaSeleccionada.value = null
    }
    const ahora = new Date()
    const segundosRestantes = 60 - ahora.getSeconds()
    const milisegundosRestantes = (segundosRestantes * 1000) - ahora.getMilliseconds()
    setTimeout(() => {
      actualizarYValidar()
      intervalId.value = setInterval(actualizarYValidar, 60000)
    }, milisegundosRestantes)
  }

  const detenerActualizacionHora = () => {
    if (intervalId.value) { clearInterval(intervalId.value); intervalId.value = null }
  }

  onMounted(() => {
    iniciarActualizacionHora()
    if (reservaStore.fechaSeleccionada) {
      const f = reservaStore.fechaSeleccionada
      fechaSeleccionada.value = typeof f === 'string' ? new Date(f + 'T00:00:00') : f
      semanaActual.value = new Date(fechaSeleccionada.value)
      fechaCalendario.value = reservaStore.fechaSeleccionada
    }
    if (reservaStore.horaSeleccionada) {
      horaSeleccionada.value = reservaStore.horaSeleccionada
    }
  })

  onUnmounted(() => { detenerActualizacionHora() })

  const mesYAnioActual = computed(() => {
    const fecha = semanaActual.value
    return `${nombresMeses[fecha.getMonth()]} ${fecha.getFullYear()}`
  })

  const diasVisibles = computed(() => {
    const dias = []
    const inicio = new Date(semanaActual.value)
    const diaSemana = inicio.getDay()
    inicio.setDate(inicio.getDate() - diaSemana)
    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      dias.push(d)
    }
    return dias
  })

  const semanaAnterior = () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const domingoActual = new Date(semanaActual.value)
    domingoActual.setDate(domingoActual.getDate() - domingoActual.getDay())
    domingoActual.setHours(0, 0, 0, 0)
    const domingoHoy = new Date(hoy)
    domingoHoy.setDate(domingoHoy.getDate() - domingoHoy.getDay())
    domingoHoy.setHours(0, 0, 0, 0)

    if (domingoActual > domingoHoy) {
      const nueva = new Date(semanaActual.value)
      nueva.setDate(nueva.getDate() - 7)
      semanaActual.value = nueva
    }
  }

  const semanaSiguiente = () => {
    const nueva = new Date(semanaActual.value)
    nueva.setDate(nueva.getDate() + 7)
    semanaActual.value = nueva
  }

  const esMismaFecha = (a, b) => {
    if (!a || !b) return false
    const da = new Date(a); const db = new Date(b)
    return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
  }

  const esHoy = (fecha) => {
    if (!fecha) return false
    const hoy = new Date()
    return esMismaFecha(fecha, hoy)
  }

  const obtenerNombreDia = (fecha) => {
    const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
    return dias[new Date(fecha).getDay()]
  }

  const seleccionarDia = (fecha) => {
    if (esDiaFueraDeRango(fecha)) return
    fechaSeleccionada.value = fecha
  }

  const actualizarFechayHora = () => {
    if (!fechaSeleccionada.value || !horaSeleccionada.value) return
    let fechaISO = ''
    if (fechaSeleccionada.value instanceof Date && !isNaN(fechaSeleccionada.value)) {
      fechaISO = fechaSeleccionada.value.toISOString().split('T')[0]
    }
    reservaStore.setFechaHora(fechaISO, horaSeleccionada.value)
  }

  watch([fechaSeleccionada, horaSeleccionada], ([fecha, hora]) => {
    if (fecha && hora && !esHoraInvalida.value) {
      actualizarFechayHora()
      emit('emit-fechay-hora', { fecha, hora })
      emit('estado-fechayhora-siguiente', true)
    } else {
      emit('estado-fechayhora-siguiente', false)
    }
  })

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
    if (!dateObj || isNaN(dateObj)) return ''
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
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
    return String(hora)
  }
</script>

<style scoped>
  .fecha-hora-container {
    max-width: 600px;
    margin-left: 32px;
    text-align: left;
    padding: 8px 0;
  }

  .section-header { display: flex; align-items: center; gap: 12px; }

  .title-accent {
    width: 4px;
    height: 28px;
    background: linear-gradient(180deg, #ee6f38, #ff9a6c);
    border-radius: 4px;
    flex-shrink: 0;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .scroll-fecha-hora {
    max-height: 540px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .scroll-fecha-hora::-webkit-scrollbar { width: 4px; }
  .scroll-fecha-hora::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

  .fecha-card, .hora-card {
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: all 0.3s ease;
  }

  .fecha-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-label {
    display: block;
    font-size: 0.72rem;
    color: #9e9e9e;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-weight: 700;
    margin-bottom: 3px;
  }

  .mes-anio {
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: capitalize;
  }

  .nav-controls { display: flex; gap: 8px; align-items: center; }

  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1.5px solid;
    background: transparent;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .nav-btn:hover { border-color: #ee6f38 !important; color: #ee6f38 !important; }

  .calendar-btn {
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    border-color: transparent !important;
    color: white !important;
  }

  .dias-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }

  .dia-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 4px;
    border-radius: 14px;
    border: 1.5px solid;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
    user-select: none;
  }

  .dia-btn:not(.dia-deshabilitado):hover {
    border-color: #ee6f38 !important;
    transform: translateY(-4px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  }

  .dia-deshabilitado { opacity: 0.2; cursor: not-allowed; }

  .dia-seleccionado {
    background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
    border-color: transparent !important;
    color: white !important;
    box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4) !important;
    transform: translateY(-4px) scale(1.05);
  }

  .dia-hoy { border-color: rgba(238, 111, 56, 0.6) !important; }

  .dia-hoy-dot {
    position: absolute;
    bottom: 6px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #ee6f38;
  }

  .dia-seleccionado .dia-hoy-dot { background: white; }

  .dia-nombre { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .dia-numero { font-size: 1.4rem; font-weight: 900; line-height: 1; }

  .hora-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .hora-icon { color: #ee6f38; font-size: 18px; }

  .hora-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    text-align: center;
  }

  .placeholder-icon { font-size: 40px; margin-bottom: 12px; }
  .hora-placeholder p { font-size: 0.9rem; font-weight: 600; margin: 0; }

  .time-input { max-width: 260px; }
  .time-input :deep(.v-field) { border-radius: 14px !important; }
  .time-input :deep(input[type="time"]) { font-size: 1.1rem; font-weight: 800; color: v-bind(txtPrimary); }
  .time-input :deep(input[type="time"]::-webkit-calendar-picker-indicator) { filter: v-bind(isDark ? 'invert(1)' : 'none'); }

  .hora-invalida :deep(.v-field) { background-color: rgba(229, 57, 53, 0.05) !important; border-color: #e53935 !important; }

  .hora-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 10px 16px;
    border-radius: 10px;
    max-width: 360px;
  }

  .hora-hint.error { color: #e53935; background: rgba(229, 57, 53, 0.1); }

  .resumen-cita {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(238, 111, 56, 0.12), rgba(238, 111, 56, 0.05));
    border: 1px solid rgba(238, 111, 56, 0.3);
  }

  .resumen-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #ee6f38;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(238, 111, 56, 0.4);
  }

  .resumen-info { display: flex; flex-direction: column; gap: 4px; }
  .resumen-titulo { font-size: 0.7rem; font-weight: 800; color: #ee6f38; text-transform: uppercase; letter-spacing: 1px; }
  .resumen-fecha, .resumen-hora { font-size: 0.95rem; font-weight: 700; text-transform: capitalize; display: flex; align-items: center; }
  .resumen-fecha i, .resumen-hora i { color: #ee6f38; width: 20px; }

  @media (max-width: 600px) {
    .dias-grid { grid-template-columns: repeat(4, 1fr); }
    .fecha-hora-container { margin-left: 0; padding: 16px; }
  }
</style>