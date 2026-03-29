<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="640" persistent>
    <div class="modal-confirmar">
      <!-- Header -->
      <div class="modal-header">
        <div class="modal-header-icon">
          <i class="fa-solid fa-scissors"></i>
        </div>
        <div class="modal-header-text">
          <h2 class="modal-titulo">Confirmar Reserva</h2>
          <p class="modal-subtitulo">Revisa los detalles antes de confirmar</p>
        </div>
        <button class="modal-close" @click="$emit('update:modelValue', false)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="modal-accent"></div>

      <!-- Contenido -->
      <div class="modal-body">

        <!-- Servicios -->
        <div class="modal-seccion mb-5">
          <div class="modal-seccion-header">
            <i class="fa-solid fa-scissors"></i>
            <h3 class="modal-seccion-titulo">Servicios</h3>
            <div class="modal-badge">{{ servicios?.length || 0 }}</div>
          </div>

          <div class="servicios-list" v-if="servicios?.length">
            <div v-for="servicio in servicios" :key="servicio.id" class="servicio-row">
              <div class="servicio-row-left">
                <div class="servicio-dot"></div>
                <div>
                  <p class="servicio-nombre">{{ servicio.nombre }}</p>
                  <p class="servicio-dur">{{ servicio.duracionAprox }}</p>
                </div>
              </div>
              <span class="servicio-precio">{{ formatPrecio(servicio.precio) }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="total-box">
            <div class="total-duracion">
              <i class="fa-regular fa-clock"></i>
              <span>{{ calcularDuracionTotal }}</span>
            </div>
            <div class="total-right">
              <span class="total-label">Total</span>
              <span class="total-valor">{{ calcularPrecioTotal }}</span>
            </div>
          </div>
        </div>

        <!-- Grid: Barbero + Fecha/Hora -->
        <div class="modal-grid">
          <!-- Barbero -->
          <div class="modal-info-card">
            <div class="modal-info-label">
              <i class="fa-solid fa-user"></i>
              <span>Profesional</span>
            </div>
            <div class="barbero-info-row" v-if="barbero">
              <v-avatar size="44" class="barbero-modal-avatar">
                <v-img :src="barbero.foto" :alt="barbero.nombre"></v-img>
              </v-avatar>
              <div>
                <p class="barbero-modal-nombre">{{ barbero.nombre }} {{ barbero.apellido }}</p>
                <p class="barbero-modal-rol">Barbero Profesional</p>
              </div>
            </div>
            <div v-else class="text-caption grey--text">Cargando barbero...</div>
          </div>

          <!-- Fecha y Hora -->
          <div class="modal-info-card">
            <div class="modal-info-label">
              <i class="fa-regular fa-calendar"></i>
              <span>Cuando</span>
            </div>
            <div class="fecha-hora-info">
              <div class="fecha-hora-item">
                <i class="fa-regular fa-calendar"></i>
                <span>{{ fecha }}</span>
              </div>
              <div class="fecha-hora-item">
                <i class="fa-regular fa-clock"></i>
                <span>{{ hora }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button class="btn-editar" @click="$emit('update:modelValue', false)">
          <i class="fas fa-pencil-alt mr-2"></i>
          Editar
        </button>
        <button class="btn-confirmar" :disabled="cargando" @click="$emit('confirmar')">
          <v-progress-circular v-if="cargando" indeterminate size="20" width="2" color="white" class="mr-2"></v-progress-circular>
          <i v-else class="fas fa-check mr-2"></i>
          {{ cargando ? 'Cargando...' : 'Confirmar Cita' }}
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    servicios: Array,
    barbero: Object,
    fecha: String,
    hora: String,
    cargando: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['update:modelValue', 'confirmar'])

  const calcularPrecioTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '$0'
    const total = props.servicios.reduce((sum, s) => {
      const p = s.precio !== null && s.precio !== undefined ? String(s.precio) : '0';
      return sum + (parseFloat(p.replace(/[^0-9.-]+/g, '')) || 0)
    }, 0)
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(total)
  })

  const calcularDuracionTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '0 min'
    const totalMinutos = props.servicios.reduce((sum, s) => {
      const match = s.duracionAprox.match(/(\d+):(\d+):(\d+)/)
      if (match) return sum + (parseInt(match[1]) * 60) + parseInt(match[2])
      return sum
    }, 0)
    const h = Math.floor(totalMinutos / 60)
    const m = totalMinutos % 60
    return h > 0 ? `${h}h ${m}m` : `${m} min`
  })

  const formatPrecio = (precio) => {
    if (precio === null || precio === undefined || precio === '') return 'No registrado'
    const num = typeof precio === 'string' ? parseFloat(precio.replace(/[^0-9.-]+/g, '')) : precio
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num || 0)
  }
</script>

<style scoped>
  .modal-confirmar {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
  }

  /* Header */
  .modal-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 22px 22px 18px;
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  }

  .modal-header-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: rgba(238, 111, 56, 0.2);
    border: 1px solid rgba(238, 111, 56, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #ee6f38;
    flex-shrink: 0;
  }

  .modal-header-text { flex: 1; }

  .modal-titulo {
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    margin: 0 0 3px;
  }

  .modal-subtitulo {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.5);
    margin: 0;
  }

  .modal-close {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: none;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .modal-close:hover {
    background: rgba(255,255,255,0.15);
    color: white;
  }

  .modal-accent {
    height: 3px;
    background: linear-gradient(90deg, #ee6f38, #ff9a6c, transparent);
  }

  /* Body */
  .modal-body {
    padding: 22px;
    max-height: 55vh;
    overflow-y: auto;
  }

  .modal-body::-webkit-scrollbar { width: 4px; }
  .modal-body::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

  /* Sección */
  .modal-seccion { }

  .modal-seccion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
  }

  .modal-seccion-header i { color: #ee6f38; font-size: 14px; }

  .modal-seccion-titulo {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #1a1a1a;
    margin: 0;
    flex: 1;
  }

  .modal-badge {
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    color: white;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
  }

  /* Servicios */
  .servicios-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .servicio-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #fafafa;
    border-radius: 10px;
    border-left: 3px solid #ee6f38;
  }

  .servicio-row-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .servicio-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ee6f38;
    flex-shrink: 0;
  }

  .servicio-nombre {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0 0 2px;
  }

  .servicio-dur {
    font-size: 0.74rem;
    color: #aaa;
    margin: 0;
  }

  .servicio-precio {
    font-size: 0.875rem;
    font-weight: 700;
    color: #ee6f38;
  }

  /* Total box */
  .total-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(238, 111, 56, 0.08), rgba(238, 111, 56, 0.04));
    border-radius: 12px;
    border: 1px solid rgba(238, 111, 56, 0.2);
  }

  .total-duracion {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #666;
  }

  .total-duracion i { color: #ee6f38; font-size: 13px; }

  .total-right { text-align: right; }
  .total-label { display: block; font-size: 0.7rem; color: #aaa; text-transform: uppercase; letter-spacing: 0.3px; }
  .total-valor { font-size: 1.1rem; font-weight: 800; color: #ee6f38; }

  /* Grid */
  .modal-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .modal-info-card {
    padding: 14px;
    background: #fafafa;
    border-radius: 12px;
    border: 1.5px solid #f0f0f0;
  }

  .modal-info-label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }

  .modal-info-label i { color: #ee6f38; font-size: 12px; }
  .modal-info-label span { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; color: #999; }

  /* Barbero */
  .barbero-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .barbero-modal-avatar {
    border: 2px solid rgba(238, 111, 56, 0.3);
    flex-shrink: 0;
  }

  .barbero-modal-nombre {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 2px;
  }

  .barbero-modal-rol {
    font-size: 0.74rem;
    color: #aaa;
    margin: 0;
  }

  /* Fecha hora */
  .fecha-hora-info { display: flex; flex-direction: column; gap: 8px; }

  .fecha-hora-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.82rem;
    color: #333;
    font-weight: 500;
  }

  .fecha-hora-item i { color: #ee6f38; font-size: 12px; width: 14px; text-align: center; }

  /* Footer */
  .modal-footer {
    display: flex;
    gap: 10px;
    padding: 16px 22px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
  }

  .btn-editar {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: 1.5px solid #ddd;
    background: transparent;
    color: #555;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-editar:hover { border-color: #bbb; color: #333; }

  .btn-confirmar {
    flex: 2;
    padding: 12px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    color: white;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.22s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(238, 111, 56, 0.3);
  }

  .btn-confirmar:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4);
  }

  @media (max-width: 480px) {
    .modal-grid { grid-template-columns: 1fr; }
  }
</style>