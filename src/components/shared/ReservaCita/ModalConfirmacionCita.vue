<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="700" persistent>
    <v-card class="rounded-xl">
      <!-- Header -->
      <v-card-title class="pa-6" style="background: linear-gradient(135deg, #ff6f00, #e65100);">
        <div class="d-flex align-items-center text-white">
          <i class="fa-solid fa-circle-check" style="font-size: 28px; margin-right: 12px;"></i>
          <div>
            <h2 class="text-h5 font-weight-bold">Confirmar Reserva</h2>
            <p class="text-body-2 mt-1" style="opacity: 0.9;">Revisa los detalles de tu cita</p>
          </div>
        </div>
        <v-btn icon variant="text" color="white" size="small" style="position: absolute; top: 16px; right: 16px;" @click="$emit('update:modelValue', false)"><i class="fa-solid fa-xmark" style="font-size: 20px;"></i></v-btn>
      </v-card-title>

      <!-- Contenido -->
      <v-card-text class="pa-6" style="max-height: 60vh; overflow-y: auto;">
        <!-- Servicios -->
        <div class="mb-6">
          <div class="d-flex align-center mb-3">
            <i class="fa-solid fa-scissors" style="color: #e65100; margin-right: 8px;"></i>
            <h3 class="text-h6 font-weight-bold">Servicios Seleccionados</h3>
            <v-chip size="small" color="orange-darken-1" class="ml-2">{{ servicios.length }}</v-chip>
          </div>

          <div v-for="servicio in servicios" :key="servicio.id" class="mb-2 pa-3 rounded-lg" style="background-color: #f5f5f5; border-left: 4px solid #ff6f00;">
            <div class="d-flex justify-space-between align-start">
              <div>
                <p class="font-weight-bold">{{ servicio.nombre }}</p>
                <p class="text-caption text-grey-darken-1">{{ servicio.duracionAprox }}</p>
              </div>
              <p class="font-weight-bold text-orange-darken-1">{{ servicio.precio }}</p>
            </div>
          </div>

          <!-- Totales -->
          <v-card variant="tonal" color="orange-lighten-5" class="mt-4 pa-4">
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex align-center">
                <i class="fa-regular fa-clock" style="color: #e65100; font-size: 16px; margin-right: 8px;"></i>
                <span class="text-body-2 mr-2">Duración total:</span>
                <span class="font-weight-bold">{{ calcularDuracionTotal }}</span>
              </div>
              <div class="text-right">
                <p class="text-caption text-grey-darken-1">Total a pagar:</p>
                <p class="text-h6 font-weight-bold text-orange-darken-1">{{ calcularPrecioTotal }}</p>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Barbero -->
        <div class="mb-6">
          <div class="d-flex align-center mb-3">
            <i class="fa-solid fa-user" style="color: #e65100; margin-right: 8px;"></i>
            <h3 class="text-h6 font-weight-bold">Profesional</h3>
          </div>

          <v-card variant="tonal" color="grey-lighten-4" class="pa-4">
            <div class="d-flex align-center">
              <v-avatar size="60" class="mr-4">
                <v-img :src="barbero.foto" :alt="barbero.nombre"></v-img>
              </v-avatar>
              <div>
                <p class="text-h6 font-weight-bold">{{ barbero.nombre }} {{ barbero.apellido }}</p>
                <p class="text-body-2 text-grey-darken-1">Barbero profesional</p>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Fecha y Hora -->
        <div>
          <div class="d-flex align-center mb-3">
            <i class="fa-regular fa-calendar" style="color: #e65100; margin-right: 8px;"></i>
            <h3 class="text-h6 font-weight-bold">Fecha y Hora</h3>
          </div>

          <div class="d-flex gap-3">
            <v-card variant="tonal" color="grey-lighten-4" class="flex-1 pa-4">
              <p class="text-caption text-grey-darken-1 mb-1">Fecha</p>
              <p class="font-weight-bold">{{ fecha }}</p>
            </v-card>
            <v-card variant="tonal" color="grey-lighten-4" class="flex-1 pa-4">
              <p class="text-caption text-grey-darken-1 mb-1">Hora</p>
              <p class="font-weight-bold">{{ hora }}</p>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <!-- Footer con botones -->
      <v-card-actions class="pa-6 bg-grey-lighten-5">
        <v-btn variant="outlined" color="grey-darken-2" size="large" class="flex-1 text-none" @click="$emit('update:modelValue', false)">
          Editar Reserva
        </v-btn>
        <v-btn color="orange-darken-1" size="large" class="flex-1 text-none" @click="$emit('confirmar')">
          Confirmar Cita
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: Boolean,
    servicios: Array,
    barbero: Object,
    fecha: String,
    hora: String
  })

  defineEmits(['update:modelValue', 'confirmar'])

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