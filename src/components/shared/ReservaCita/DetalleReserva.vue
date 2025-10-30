<template>
  <div style="height: 100%; display: flex; flex-direction: column;">
    <!-- 🔹 La card SIEMPRE está visible con layout flex -->
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

      <!-- 🔹 Contenedor con scroll para el contenido -->
      <v-card-text class="contenido-scroll">
        <!-- 🔹 Sección de Servicios Seleccionados -->
        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-solid fa-scissors mr-2"></i>
            Servicios Seleccionados
            <v-chip v-if="servicios && servicios.length > 0" size="small" color="#ee6f38" class="ml-2">
              {{ servicios.length }}
            </v-chip>
          </h4>
          
          <!-- Si hay servicios seleccionados, mostrarlos -->
          <div v-if="servicios && servicios.length > 0">
            <!-- Detalles de cada servicio -->
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

            <!-- Resumen de precio y duración total -->
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

          <!-- Si NO hay servicios seleccionados -->
          <div v-else class="text-center py-4">
            <i class="fa-regular fa-calendar" style="font-size: 48px; color: #bdbdbd;"></i>
            <p class="text-body-2 text-grey mt-2">
              No has seleccionado ningún servicio aún
            </p>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- 🔹 Otras secciones (Barbero, Fecha, Hora) -->
        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-solid fa-user mr-2"></i>
            Profesional
          </h4>
          <!-- Si hay barbero seleccionado -->
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
            </v-list-item>
          </div>
          <!-- Si NO hay barbero -->
          <p v-else class="text-body-2 text-grey">Por seleccionar</p>
        </div>

        <div class="mb-4">
          <h4 class="text-h6 mb-2">
            <i class="fa-regular fa-calendar-days mr-2"></i>
            Fecha y Hora
          </h4>
          <!-- Si hay barbero seleccionado -->
          <div v-if="FechayHora && FechayHora.fecha && FechayHora.hora">
            <p class="text-body-2">
              <i class="fa-regular fa-calendar mr-2"></i>{{ FechayHora.fecha }}
            </p>
            <p class="text-body-2">
              <i class="fa-regular fa-clock mr-2"></i>{{ FechayHora.hora }}
            </p>
          </div>
          <p v-else class="text-body-2 text-grey">Por seleccionar</p>
        </div>
      </v-card-text>

      <!-- 🔹 Botón FIJO en la parte inferior -->
      <v-card-actions class="acciones-fijas">
        <v-btn block color="#ee6f38" size="large" :disabled="!props.habilitarBoton" elevation="2" @click="emit('siguiente-tab')">
          Siguiente
          <i class="fa-solid fa-arrow-right ml-2"></i>
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
  FechayHora: {
    type: Object,
    default: () => ({ fecha: null, hora: null })
  },
  habilitarBoton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['siguiente-tab'])

// 🔹 Calcular precio total
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

// 🔹 Calcular duración total
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
/* 🔹 Card con flexbox para mantener estructura */
.detalle-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 🔹 Contenido con scroll */
.contenido-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
}

/* 🔹 Estilo del scrollbar */
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

/* 🔹 Botón fijo en la parte inferior */
.acciones-fijas {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

/* 🔹 Lista de servicios más compacta */
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

/* 🔹 Resumen más compacto y visual */
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