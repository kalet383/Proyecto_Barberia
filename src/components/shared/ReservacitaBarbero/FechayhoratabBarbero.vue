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
                    :allowed-dates="esDiaDisponible"
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

        <div class="dias-grid">
          <button
            v-for="(date, index) in diasVisibles"
            :key="index"
            class="dia-btn"
            :class="{
              'dia-seleccionado': esMismaFecha(date, fechaSeleccionada),
              'dia-hoy': esHoy(date) && !esMismaFecha(date, fechaSeleccionada),
              'dia-deshabilitado': !esDiaHabilitado(date)
            }"
            :disabled="!esDiaHabilitado(date)"
            @click="seleccionarDia(date)"
            :style="!esMismaFecha(date, fechaSeleccionada) ? { background: headerBg, borderColor: cardBorder, color: txtPrimary } : {}"
          >
            <span class="dia-nombre" :style="{ color: esMismaFecha(date, fechaSeleccionada) ? 'white' : txtSecondary }">{{ obtenerNombreDia(date) }}</span>
            <span class="dia-numero" :style="{ color: esMismaFecha(date, fechaSeleccionada) ? 'white' : txtPrimary }">{{ date.getDate() }}</span>
            <span v-if="esHoy(date)" class="dia-hoy-dot"></span>
          </button>
        </div>
      </div>

      <!-- Selector de franjas horarias -->
      <div class="hora-card" :style="{ background: cardBg, border: `1.5px solid ${cardBorder}` }">
        <div class="hora-card-header">
          <i class="fas fa-clock hora-icon"></i>
          <span class="card-label">Hora de la cita</span>

          <!-- Info de duración -->
          <div v-if="duracionTotalMinutos > 0" class="duracion-badge">
            <i class="fas fa-hourglass-half"></i>
            {{ formatearDuracion(duracionTotalMinutos) }}
          </div>
        </div>

        <div v-if="!fechaSeleccionada" class="hora-placeholder">
          <i class="fas fa-calendar-day placeholder-icon" :style="{ color: isDark ? '#374151' : '#eee' }"></i>
          <p :style="{ color: txtSecondary }">Selecciona primero una fecha</p>
        </div>

        <div v-else-if="intervalosDisponibles.length === 0" class="hora-placeholder">
          <i class="fas fa-calendar-times placeholder-icon" :style="{ color: isDark ? '#374151' : '#eee' }"></i>
          <p :style="{ color: txtSecondary }">No hay horarios disponibles para este día</p>
        </div>

        <div v-else class="franjas-grid mt-3">
          <button
            v-for="intervalo in intervalosDisponibles"
            :key="intervalo.horaInicio"
            class="franja-btn"
            :class="{
              'franja-seleccionada': horaSeleccionada === intervalo.horaInicio,
              'franja-deshabilitada': intervalo.deshabilitado
            }"
            :disabled="intervalo.deshabilitado"
            @click="seleccionarIntervalo(intervalo)"
            :style="horaSeleccionada !== intervalo.horaInicio ? { background: headerBg, borderColor: cardBorder } : {}"
          >
            <!-- Badge hora pasada -->
            <div v-if="intervalo.deshabilitado" class="franja-lock">
              <i class="fas fa-lock"></i>
            </div>

            <i class="fas fa-clock franja-icono"></i>
            <span class="franja-hora" :style="horaSeleccionada === intervalo.horaInicio ? { color: 'white' } : { color: txtPrimary }">{{ formatearHora24to12(intervalo.horaInicio) }}</span>
            <span class="franja-duracion" :style="horaSeleccionada === intervalo.horaInicio ? { color: 'rgba(255,255,255,0.7)' } : { color: txtSecondary }">{{ intervalo.duracion }}</span>
          </button>
        </div>
      </div>

      <!-- Resumen de selección -->
      <div v-if="fechaSeleccionada && horaSeleccionada" class="resumen-cita mt-6">
        <div class="resumen-icon">
          <i class="fas fa-check"></i>
        </div>
        <div class="resumen-info">
          <span class="resumen-titulo">Cita con {{ reservaBarberoStore.nombreCompletoBarbero }}</span>
          <span class="resumen-detalle" :style="{ color: txtPrimary }">
            <i class="fas fa-calendar-alt mr-1"></i>
            {{ formatearFecha(fechaSeleccionada) }}
          </span>
          <span class="resumen-detalle" :style="{ color: txtPrimary }">
            <i class="fas fa-clock mr-1"></i>
            {{ formatearHora24to12(horaSeleccionada) }} · {{ formatearDuracion(duracionTotalMinutos) }}
          </span>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useReservaBarberoStore } from '@/stores/reservaBarbero'
  import { useServiceStore } from '@/stores/services'
  import { useCustomizerStore } from '@/stores/customizer'

  const reservaBarberoStore = useReservaBarberoStore()
  const serviceStore = useServiceStore()
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
  const mostrarCalendario = ref(false)
  const fechaCalendario = ref(null)
  const horaActual = ref(new Date())
  const intervalId = ref(null)
  const horasOcupadas = ref([])

  const nombresMeses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  const duracionTotalMinutos = computed(() => {
    const serviciosIds = reservaBarberoStore.serviciosSeleccionados
    if (!serviciosIds || serviciosIds.length === 0) return 30
    const servicios = serviceStore.services.filter(s => serviciosIds.includes(s.id))
    return servicios.reduce((total, servicio) => {
      const match = servicio.duracionAprox.match(/(\d+):(\d+):(\d+)/)
      if (match) return total + (parseInt(match[1]) * 60) + parseInt(match[2])
      return total
    }, 0) || 30
  })

  // Simulated for now, in a real app this would call an API
  const intervalosDisponibles = computed(() => {
    if (!fechaSeleccionada.value) return []
    const diaSemana = obtenerDiaSemanaTexto(fechaSeleccionada.value)
    const franjas = reservaBarberoStore.franjasDelDia(diaSemana)
    if (franjas.length === 0) return []

    const intervalos = []
    const duracion = duracionTotalMinutos.value
    const esHoySeleccionado = esHoy(fechaSeleccionada.value)

    franjas.forEach(franja => {
      const [horaInicioH, horaInicioM] = franja.hora_inicio.split(':').map(Number)
      const [horaFinH, horaFinM] = franja.hora_fin.split(':').map(Number)
      const inicioEnMinutos = horaInicioH * 60 + horaInicioM
      const finEnMinutos = horaFinH * 60 + horaFinM

      for (let minutos = inicioEnMinutos; minutos < finEnMinutos; minutos += duracion) {
        if (minutos + duracion <= finEnMinutos) {
          const horas = Math.floor(minutos / 60)
          const mins = minutos % 60
          const horaInicio = `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`
          const yaPaso = esHoySeleccionado && hasPasadoLaHora(horaInicio)
          
          intervalos.push({
            horaInicio,
            duracion: formatearDuracion(duracion),
            franjaId: franja.id_franja,
            deshabilitado: yaPaso
          })
        }
      }
    })
    return intervalos
  })

  const hasPasadoLaHora = (horaIntervalo) => {
    const ahora = horaActual.value
    const [horasIntervalo, minutosIntervalo] = horaIntervalo.split(':').map(Number)
    const horaActualEnMinutos = ahora.getHours() * 60 + ahora.getMinutes()
    return horasIntervalo * 60 + minutosIntervalo <= horaActualEnMinutos
  }

  const fechaMinima = computed(() => new Date().toISOString().split('T')[0])
  const fechaMaxima = computed(() => {
    const hoy = new Date()
    const max = new Date(hoy)
    max.setMonth(hoy.getMonth() + 2)
    return max.toISOString().split('T')[0]
  })

  const esDiaDisponible = (fecha) => {
    const fechaObj = new Date(fecha)
    const diaSemana = obtenerDiaSemanaTexto(fechaObj)
    const franjas = reservaBarberoStore.franjasDelDia(diaSemana)
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const limite = new Date(hoy); limite.setMonth(hoy.getMonth() + 2)
    fechaObj.setHours(0, 0, 0, 0)
    return franjas.length > 0 && fechaObj >= hoy && fechaObj <= limite
  }

  const esDiaHabilitado = (fecha) => {
    const diaSemana = obtenerDiaSemanaTexto(fecha)
    const franjas = reservaBarberoStore.franjasDelDia(diaSemana)
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
    const limite = new Date(hoy); limite.setMonth(hoy.getMonth() + 2)
    const fechaComparar = new Date(fecha); fechaComparar.setHours(0, 0, 0, 0)
    return franjas.length > 0 && fechaComparar >= hoy && fechaComparar <= limite
  }

  const obtenerDiaSemanaTexto = (fecha) => {
    const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado']
    return dias[new Date(fecha).getDay()]
  }

  const aplicarFechaCalendario = (fecha) => {
    if (fecha) {
      const fechaObj = new Date(fecha)
      fechaSeleccionada.value = fechaObj
      semanaActual.value = new Date(fechaObj)
      horaSeleccionada.value = null
      mostrarCalendario.value = false
    }
  }

  const iniciarActualizacionHora = () => {
    horaActual.value = new Date()
    const ahora = new Date()
    const segundosRestantes = 60 - ahora.getSeconds()
    const msRestantes = (segundosRestantes * 1000) - ahora.getMilliseconds()
    setTimeout(() => {
      horaActual.value = new Date()
      intervalId.value = setInterval(() => { horaActual.value = new Date() }, 60000)
    }, msRestantes)
  }

  onMounted(() => {
    iniciarActualizacionHora()
    if (reservaBarberoStore.fechaSeleccionada) {
      const f = reservaBarberoStore.fechaSeleccionada
      fechaSeleccionada.value = typeof f === 'string' ? new Date(f + 'T00:00:00') : f
      semanaActual.value = new Date(fechaSeleccionada.value)
    }
    if (reservaBarberoStore.horaSeleccionada) {
      horaSeleccionada.value = reservaBarberoStore.horaSeleccionada
    }
  })

  onUnmounted(() => {
    if (intervalId.value) clearInterval(intervalId.value)
  })

  const mesYAnioActual = computed(() => {
    const fecha = semanaActual.value
    return `${nombresMeses[fecha.getMonth()]} ${fecha.getFullYear()}`
  })

  const diasVisibles = computed(() => {
    const dias = []
    const inicio = new Date(semanaActual.value)
    inicio.setDate(inicio.getDate() - inicio.getDay())
    for (let i = 0; i < 7; i++) {
      const d = new Date(inicio)
      d.setDate(inicio.getDate() + i)
      dias.push(d)
    }
    return dias
  })

  const semanaSiguiente = () => {
    const nueva = new Date(semanaActual.value)
    nueva.setDate(nueva.getDate() + 7)
    semanaActual.value = nueva
  }

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

  const esHoy = (fecha) => {
    const hoy = new Date()
    return fecha.toDateString() === hoy.toDateString()
  }

  const esMismaFecha = (fecha1, fecha2) => {
    if (!fecha1 || !fecha2) return false
    return new Date(fecha1).toDateString() === new Date(fecha2).toDateString()
  }

  const obtenerNombreDia = (fecha) => {
    const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
    return dias[new Date(fecha).getDay()]
  }

  const seleccionarDia = (fecha) => {
    if (!esDiaHabilitado(fecha)) return
    fechaSeleccionada.value = fecha
    horaSeleccionada.value = null
  }

  const seleccionarIntervalo = (intervalo) => {
    if (intervalo.deshabilitado) return
    horaSeleccionada.value = intervalo.horaInicio
  }

  const formatearHora24to12 = (hora) => {
    if (!hora) return ''
    const [h, m] = hora.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  }

  const formatearDuracion = (minutos) => {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    if (h > 0 && m > 0) return `${h}h ${m}min`
    if (h > 0) return `${h}h`
    return `${m}min`
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return ''
    let dateObj = fecha instanceof Date ? fecha : new Date(fecha + 'T00:00:00')
    if (isNaN(dateObj)) return ''
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  watch([fechaSeleccionada, horaSeleccionada], ([fecha, hora]) => {
    if (fecha && hora) {
      const fechaISO = fecha instanceof Date ? fecha.toISOString().split('T')[0] : fecha
      reservaBarberoStore.setFechaHora(fechaISO, hora)
      emit('emit-fechay-hora', { fecha: fechaISO, hora })
      emit('estado-fechayhora-siguiente', true)
    } else {
      emit('estado-fechayhora-siguiente', false)
    }
  })
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
    max-height: 560px;
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

  .duracion-badge {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(238, 111, 56, 0.12);
    border: 1px solid rgba(238, 111, 56, 0.25);
    font-size: 0.78rem;
    color: #ee6f38;
    font-weight: 800;
  }

  .hora-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    text-align: center;
  }

  .placeholder-icon { font-size: 40px; margin-bottom: 12px; }
  .hora-placeholder p { font-size: 0.9rem; font-weight: 600; margin: 0; }

  .franjas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
    gap: 12px;
  }

  .franja-btn {
    padding: 16px 10px;
    border-radius: 14px;
    border: 1.5px solid;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }

  .franja-btn:not(.franja-deshabilitada):hover {
    border-color: #ee6f38 !important;
    transform: translateY(-4px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  .franja-seleccionada {
    background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
    border-color: transparent !important;
    color: white !important;
    box-shadow: 0 8px 18px rgba(238, 111, 56, 0.35) !important;
    transform: translateY(-4px) scale(1.05);
  }

  .franja-deshabilitada { opacity: 0.3; cursor: not-allowed; }

  .franja-lock {
    position: absolute;
    top: 6px;
    right: 8px;
    font-size: 9px;
    color: #999;
  }

  .franja-icono { font-size: 15px; color: #ee6f38; }
  .franja-seleccionada .franja-icono { color: rgba(255,255,255,0.9); }

  .franja-hora { font-size: 0.95rem; font-weight: 900; line-height: 1; }
  .franja-duracion { font-size: 0.7rem; font-weight: 600; }

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
  .resumen-titulo { font-size: 0.72rem; font-weight: 800; color: #ee6f38; text-transform: uppercase; letter-spacing: 1px; }
  .resumen-detalle { font-size: 0.9rem; font-weight: 700; text-transform: capitalize; display: flex; align-items: center; gap: 4px; }
  .resumen-detalle i { color: #ee6f38; width: 18px; }

  @media (max-width: 600px) {
    .dias-grid { grid-template-columns: repeat(4, 1fr); }
    .franjas-grid { grid-template-columns: repeat(3, 1fr); }
    .fecha-hora-container { margin-left: 0; padding: 16px; }
  }
</style>