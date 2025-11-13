<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500" persistent>
    <v-card class="rounded-xl overflow-hidden">
      <div class="pa-8 text-center text-white" style="background: linear-gradient(135deg, #f44336, #d32f2f);">
        <div class="d-inline-flex align-center justify-center pa-4 mb-4 rounded-circle" style="background: rgba(255,255,255,0.2);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 48px;"></i>
        </div>
        <h2 class="text-h4 font-weight-bold mb-2">No Disponible</h2>
        <p style="opacity: 0.9;">{{ mensaje }}</p>
      </div>

      <v-card-text class="pa-6">
        <div v-if="horariosAlternativos && horariosAlternativos.length > 0" class="mb-4">
          <h3 class="font-weight-bold text-grey-darken-2 mb-2">Horarios Disponibles:</h3>
          <div v-for="(horario, index) in horariosAlternativos.slice(0, 3)" :key="index" class="text-body-2 text-grey-darken-1 pa-2 mb-1 rounded bg-grey-lighten-4">
            • {{ horario }}
          </div>
        </div>

        <div v-if="barberosAlternativos && barberosAlternativos.length > 0" class="mb-4">
          <h3 class="font-weight-bold text-grey-darken-2 mb-2">Barberos Disponibles:</h3>
          <div v-for="(barbero, index) in barberosAlternativos.slice(0, 3)" :key="index" class="text-body-2 text-grey-darken-1 pa-2 mb-1 rounded bg-grey-lighten-4">
            • {{ barbero }}
          </div>
        </div>

        <v-btn block color="red-darken-1" size="large" @click="$emit('update:modelValue', false)">
          Entendido
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({
    modelValue: Boolean,
    mensaje: String,
    horariosAlternativos: Array,
    barberosAlternativos: Array
  })

  defineEmits(['update:modelValue'])
</script>