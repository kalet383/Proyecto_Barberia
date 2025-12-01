<template>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <v-card class="detalle-card" elevation="2">
      <template v-slot:prepend>
        <v-avatar size="75">
          <v-img src="/public/imagenes/logo/logo2.png" alt="Logo"></v-img>
        </v-avatar>
      </template>

      <template v-slot:title>
        <span class="font-weight-black">Barberia StyleHub</span>
      </template>

      <template v-slot:subtitle>
        <strong>Calle 30 Cr 4 - n° 3 - Local #5</strong>
        <br>
        Aqui tendras los detalles de tu cita
      </template>

      <v-divider class="my-3"></v-divider>

      <v-card-text class="contenido-scroll">
        <!-- Sección de Servicios Seleccionados -->
        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-solid fa-scissors mr-2"></i>
            Servicios Seleccionados
            <v-chip v-if="servicios && servicios.length > 0" size="small" color="#ee6f38" class="ml-2">
              {{ servicios.length }}
            </v-chip>
          </h4>
          
          <div v-if="servicios && servicios.length > 0">
            <v-list class="mt-3 servicios-list" density="compact">
              <v-list-item v-for="servicio in servicios" :key="servicio.id" class="servicio-item">
                <template v-slot:prepend>
                  <i class="fa-solid fa-circle-check" style="color: #ee6f38; font-size: 16px;"></i>
                </template>
                
                <v-list-item-title class="text-body-2">
                  <strong>{{ servicio.nombre }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ servicio.precio }} - {{ servicio.duracionAprox}}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-3"></v-divider>
            <div class="resumen-container">
              <div class="resumen-item">
                <i class="fa-regular fa-clock mr-1" style="font-size: 14px;"></i>
                <span class="text-body-2">{{ calcularDuracionTotal }} Aprox</span>
              </div>
              <div class="resumen-item precio-total">
                <i class="fa-solid fa-money-bill-wave mr-1" style="font-size: 14px;"></i>
                <span class="text-h6">{{ calcularPrecioTotal }}</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4">
            <i class="fa-regular fa-calendar" style="font-size: 48px; color: #bdbdbd;"></i>
            <p class="text-body-2 text-grey mt-2">
              No has seleccionado ningún servicio aún
            </p>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Sección de Barbero (siempre visible y pre-seleccionado) -->
        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-solid fa-user mr-2"></i>
            Profesional
          </h4>
          <div v-if="barbero" class="barbero-seleccionado">
            <v-list-item class="px-0">
              <template v-slot:prepend>
                <v-avatar size="40">
                  <v-img :src="barbero.foto" :alt="barbero.nombre"></v-img>
                </v-avatar>
              </template>
              <v-list-item-title>
                {{ barbero.nombre }} {{ barbero.apellido }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" color="success" variant="flat">
                  Pre-seleccionado
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </div>
          <p v-else class="text-body-2 text-grey">No hay barbero seleccionado</p>
        </div>

        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-regular fa-calendar-days mr-2"></i>
            Fecha y Hora
          </h4>
          <div v-if="fecha && hora">
            <p class="text-body-2">
              <i class="fa-regular fa-calendar mr-2"></i>{{ fecha }}
            </p>
            <p class="text-body-2">
              <i class="fa-regular fa-clock mr-2"></i>{{ hora }}
            </p>
          </div>
          <p v-else class="text-body-2 text-grey">Por seleccionar</p>
        </div>
      </v-card-text>

      <v-card-actions class="acciones-fijas">
        <v-btn block color="#ee6f38" size="large" :disabled="!habilitarBoton" elevation="2" @click="handleSiguiente" class="boton-accion">
          {{ TextoBtn }}
          <i :class="`fa-solid ${ IconoBtn } ml-2`"></i>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    servicios: {
      type: Array,
      default: () => []
    },
    barbero: {
      type: Object,
      default: null
    },
    fecha: {
      type: String,
      default: null
    },
    hora: {
      type: String,
      default: null
    },
    habilitarBoton: {
      type: Boolean,
      default: false
    },
    ultimoTab: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['siguiente-tab'])

  function handleSiguiente() {
    emit('siguiente-tab')
  }

  const TextoBtn = computed(() => {
    return props.ultimoTab ? 'Agendar cita' : 'Siguiente'
  })

  const IconoBtn = computed(() => {
    return props.ultimoTab ? 'fa-check' : 'fa-arrow-right'
  })

  const calcularPrecioTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '$0.00'
    
    const total = props.servicios.reduce((sum, servicio) => {
      const precio = parseFloat(servicio.precio.replace(/[^0-9.-]+/g, '')) || 0
      return sum + precio
    }, 0)
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(total)
  })

  const calcularDuracionTotal = computed(() => {
    if (!props.servicios || props.servicios.length === 0) return '0 min'
    
    const totalMinutos = props.servicios.reduce((sum, servicio) => {
      const match = servicio.duracionAprox.match(/(\d+):(\d+):(\d+)/)
      if (match) {
        const horas = parseInt(match[1])
        const minutos = parseInt(match[2])
        return sum + (horas * 60) + minutos
      }
      return sum
    }, 0)
    
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60
    
    if (horas > 0) {
      return `${horas}h ${minutos}min`
    }
    return `${minutos}min`
  })
</script>

<style scoped>
  .detalle-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .contenido-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
  }

  .contenido-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .contenido-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .contenido-scroll::-webkit-scrollbar-thumb {
    background: #1976d2;
    border-radius: 10px;
  }

  .contenido-scroll::-webkit-scrollbar-thumb:hover {
    background: #1565c0;
  }

  .acciones-fijas {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    border-top: 1px solid #e0e0e0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .boton-accion {
    transition: all 0.3s ease;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .boton-accion:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(238, 111, 56, 0.4) !important;
  }

  .servicios-list {
    background: transparent;
    padding: 0;
  }

  .servicio-item {
    border-left: 3px solid #ee6f38;
    margin-bottom: 8px;
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 8px !important;
    min-height: auto !important;
  }

  .servicio-item:hover {
    background-color: #e3f2fd;
  }

  .resumen-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: rgb(231, 230, 230);
    border-radius: 8px;
    margin-top: 8px;
  }

  .resumen-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .precio-total {
    font-weight: bold;
  }
</style>