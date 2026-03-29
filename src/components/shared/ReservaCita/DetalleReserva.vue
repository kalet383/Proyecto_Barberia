<template>
  <div class="detalle-wrapper">
    <div class="detalle-card" :style="{ background: cardBg, border: `1.5px solid ${cardBorder}` }">
      <!-- Header barbería -->
      <div class="detalle-header" :style="{ background: headerBg }">
        <div class="header-logo-wrap">
          <v-avatar size="48" class="header-logo" :style="{ border: `2px solid ${isDark ? 'rgba(238, 111, 56, 0.4)' : 'rgba(238, 111, 56, 0.2)'}` }">
            <v-img src="/public/imagenes/logo/logo2.png" alt="Logo"></v-img>
          </v-avatar>
        </div>
        <div class="header-info">
          <span class="header-nombre" :style="{ color: txtPrimary }">StyleHub</span>
          <span class="header-dir" :style="{ color: txtSecondary }">
            <i class="fas fa-map-marker-alt mr-1"></i>
            Calle 30 Cr 4 - n° 3 - Local #5
          </span>
        </div>
        <div class="header-badge" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.1)', border: `1px solid ${isDark ? 'rgba(238, 111, 56, 0.3)' : 'rgba(238, 111, 56, 0.2)'}` }">
          <i class="fas fa-cut"></i>
        </div>
      </div>

      <div class="detalle-accent-line"></div>

      <!-- Contenido con scroll -->
      <div class="detalle-contenido">

        <!-- Servicios -->
        <div class="seccion mb-6">
          <div class="seccion-header">
            <div class="seccion-icon" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.1)' }">
              <i class="fa-solid fa-scissors"></i>
            </div>
            <h4 class="seccion-titulo" :style="{ color: txtPrimary }">Servicios</h4>
            <div v-if="servicios && servicios.length > 0" class="seccion-badge">{{ servicios.length }}</div>
          </div>

          <div v-if="servicios && servicios.length > 0" class="servicios-lista">
            <div v-for="servicio in servicios" :key="servicio.id" class="servicio-item" :style="{ background: innerBg, borderColor: '#ee6f38' }">
              <div class="servicio-dot"></div>
              <div class="servicio-datos">
                <span class="servicio-nombre" :style="{ color: txtPrimary }">{{ servicio.nombre }}</span>
                <span class="servicio-meta" :style="{ color: txtSecondary }">{{ formatPrecio(servicio.precio) }} · {{ servicio.duracionAprox }}</span>
              </div>
            </div>

            <!-- Totales -->
            <div class="servicios-totales" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.08)' : 'rgba(238, 111, 56, 0.04)', borderColor: isDark ? 'rgba(238, 111, 56, 0.2)' : 'rgba(238, 111, 56, 0.15)' }">
              <div class="total-item" :style="{ color: txtSecondary }">
                <i class="fa-regular fa-clock"></i>
                <span :style="{ fontWeight: '700' }">{{ calcularDuracionTotal }}</span>
              </div>
              <div class="total-precio">{{ calcularPrecioTotal }}</div>
            </div>
          </div>

          <div v-else class="seccion-vacia">
            <i class="fa-regular fa-calendar-plus" :style="{ color: isDark ? '#1e293b' : '#eee' }"></i>
            <p :style="{ color: txtSecondary }">Sin servicios seleccionados</p>
          </div>
        </div>

        <!-- Profesional -->
        <div class="seccion mb-6">
          <div class="seccion-header">
            <div class="seccion-icon" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.1)' }">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <h4 class="seccion-titulo" :style="{ color: txtPrimary }">Profesional</h4>
          </div>

          <div v-if="barbero" class="barbero-preview" :style="{ background: innerBg }">
            <v-avatar size="44" class="barbero-preview-avatar" :style="{ border: `2px solid ${isDark ? 'rgba(238, 111, 56, 0.4)' : 'rgba(238, 111, 56, 0.2)'}` }">
              <v-img :src="barbero.foto" :alt="barbero.nombre"></v-img>
            </v-avatar>
            <div class="ml-2">
              <span class="barbero-preview-nombre" :style="{ color: txtPrimary }">{{ barbero.nombre }} {{ barbero.apellido }}</span>
              <span class="barbero-preview-rol" :style="{ color: txtSecondary }">Esquilador Profesional</span>
            </div>
          </div>
          <div v-else class="pendiente-texto" :style="{ background: innerBg, color: txtSecondary }">
            <i class="fas fa-user mr-2" style="opacity: 0.5;"></i>
            Pendiente selección
          </div>
        </div>

        <!-- Fecha y Hora -->
        <div class="seccion">
          <div class="seccion-header">
            <div class="seccion-icon" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.1)' }">
              <i class="fa-regular fa-calendar-days"></i>
            </div>
            <h4 class="seccion-titulo" :style="{ color: txtPrimary }">Fecha y Hora</h4>
          </div>

          <div v-if="fecha && hora" class="fecha-hora-preview" :style="{ background: innerBg }">
            <div class="fecha-item" :style="{ color: txtPrimary }">
              <i class="fa-solid fa-calendar-day" style="color: #ee6f38;"></i>
              <span>{{ fecha }}</span>
            </div>
            <div class="fecha-item mt-2" :style="{ color: txtPrimary }">
              <i class="fa-solid fa-clock" style="color: #ee6f38;"></i>
              <span>{{ hora }}</span>
            </div>
          </div>
          <div v-else class="pendiente-texto" :style="{ background: innerBg, color: txtSecondary }">
            <i class="fas fa-clock mr-2" style="opacity: 0.5;"></i>
            Por configurar
          </div>
        </div>
      </div>

      <!-- Botón acción -->
      <div class="detalle-footer" :style="{ background: headerBg, borderTop: `1px solid ${cardBorder}` }">
        <button
          class="accion-btn"
          :class="{ disabled: !habilitarBoton }"
          :disabled="!habilitarBoton"
          @click="handleSiguiente"
        >
          <span class="btn-text">{{ TextoBtn }}</span>
          <i :class="`fa-solid ${IconoBtn}`"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useCustomizerStore } from '@/stores/customizer'

  const props = defineProps({
    servicios: { type: Array, default: () => [] },
    barbero: { type: Object, default: null },
    fecha: { type: String, default: null },
    hora: { type: String, default: null },
    habilitarBoton: { type: Boolean, default: false },
    ultimoTab: { type: Boolean, default: false }
  })

  const customizer = useCustomizerStore()
  const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
  
  // Adaptive Colors
  const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
  const txtSecondary = computed(() => isDark.value ? '#a1a1aa' : '#64748b');
  const cardBg = computed(() => isDark.value ? '#0f172a' : '#ffffff');
  const cardBorder = computed(() => isDark.value ? '#1e293b' : '#f0f0f0');
  const headerBg = computed(() => isDark.value ? '#161d2f' : '#ffffff');
  const innerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');

  const emit = defineEmits(['siguiente-tab'])

  function handleSiguiente() { emit('siguiente-tab') }

  const TextoBtn = computed(() => props.ultimoTab ? 'CONFIRMAR RESERVA' : 'CONTINUAR')
  const IconoBtn = computed(() => props.ultimoTab ? 'fa-check-double' : 'fa-chevron-right')

  const calcularPrecioTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '$0'
    const total = props.servicios.reduce((sum, s) => {
      const p = s.precio !== null && s.precio !== undefined ? String(s.precio) : '0';
      return sum + (parseFloat(p.replace(/[^0-9.-]+/g, '')) || 0)
    }, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(total)
  })

  const calcularDuracionTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '0 min'
    const totalMinutos = props.servicios.reduce((sum, s) => {
      const match = s.duracionAprox.match(/(\d+):(\d+):(\d+)/)
      if (match) return sum + (parseInt(match[1]) * 60) + parseInt(match[2])
      return sum
    }, 0)
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60
    return horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`
  })

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined || precio === '') return 'No registrado'
    const num = typeof precio === 'string' ? parseFloat(precio.replace(/[^0-9.-]+/g, '')) : precio
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num || 0)
  }
</script>

<style scoped>
  .detalle-wrapper { height: 100%; display: flex; flex-direction: column; }

  .detalle-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }

  .detalle-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 24px 20px;
  }

  .header-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .header-nombre { font-size: 1.1rem; font-weight: 900; letter-spacing: 0.5px; }
  .header-dir { font-size: 0.78rem; font-weight: 600; }

  .header-badge {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #ee6f38;
    transform: rotate(-10deg);
  }

  .detalle-accent-line { height: 4px; background: linear-gradient(90deg, #ee6f38, #ff9a6c, transparent); }

  .detalle-contenido {
    flex: 1;
    overflow-y: auto;
    padding: 24px 20px;
  }

  .detalle-contenido::-webkit-scrollbar { width: 4px; }
  .detalle-contenido::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

  .seccion-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }

  .seccion-icon {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #ee6f38;
    flex-shrink: 0;
  }

  .seccion-titulo {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    flex: 1;
  }

  .seccion-badge {
    min-width: 24px;
    height: 24px;
    border-radius: 8px;
    background: #ee6f38;
    color: white;
    font-size: 0.75rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    box-shadow: 0 4px 8px rgba(238, 111, 56, 0.3);
  }

  .servicios-lista { display: flex; flex-direction: column; gap: 10px; }

  .servicio-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    border-radius: 14px;
    border-left: 4px solid;
    transition: transform 0.2s ease;
  }

  .servicio-item:hover { transform: scale(1.02); }

  .servicio-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ee6f38;
    flex-shrink: 0;
    margin-top: 6px;
  }

  .servicio-datos { display: flex; flex-direction: column; gap: 2px; }
  .servicio-nombre { font-size: 0.85rem; font-weight: 700; }
  .servicio-meta { font-size: 0.75rem; font-weight: 600; }

  .servicios-totales {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px dashed;
    margin-top: 8px;
  }

  .total-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
  .total-item i { color: #ee6f38; font-size: 14px; }
  .total-precio { font-size: 1.1rem; font-weight: 900; color: #ee6f38; }

  .seccion-vacia {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 20px;
    text-align: center;
    border: 2px dashed rgba(156, 163, 175, 0.2);
    border-radius: 20px;
  }

  .seccion-vacia i { font-size: 32px; margin-bottom: 12px; opacity: 0.5; }
  .seccion-vacia p { font-size: 0.85rem; font-weight: 600; margin: 0; }

  .barbero-preview { display: flex; align-items: center; padding: 12px; border-radius: 14px; }
  .barbero-preview-avatar { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  .barbero-preview-nombre { display: block; font-size: 0.9rem; font-weight: 800; }
  .barbero-preview-rol { display: block; font-size: 0.75rem; font-weight: 600; opacity: 0.8; }

  .fecha-hora-preview { display: flex; flex-direction: column; padding: 14px; border-radius: 14px; }
  .fecha-item { display: flex; align-items: center; gap: 10px; font-size: 0.88rem; font-weight: 700; }
  .fecha-item i { width: 18px; text-align: center; font-size: 14px; }

  .pendiente-texto {
    font-size: 0.82rem;
    font-weight: 600;
    padding: 12px 16px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    border: 1px solid rgba(156, 163, 175, 0.1);
  }

  .detalle-footer { padding: 20px; }

  .accion-btn {
    width: 100%;
    padding: 16px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    color: white;
    font-weight: 900;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    letter-spacing: 1px;
    box-shadow: 0 6px 20px rgba(238, 111, 56, 0.4);
  }

  .accion-btn:not(.disabled):hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(238, 111, 56, 0.5);
  }

  .accion-btn:not(.disabled):active { transform: translateY(-1px); }

  .accion-btn.disabled {
    background: #4b5563 !important;
    color: #9ca3af !important;
    cursor: not-allowed;
    box-shadow: none;
    opacity: 0.6;
  }

  .btn-text { text-transform: uppercase; }
</style>