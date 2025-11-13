<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500" persistent>
    <v-card class="rounded-xl overflow-hidden">
      <div class="pa-8 text-center text-white" style="background: linear-gradient(135deg, #4caf50, #2e7d32);">
        <div class="d-inline-flex align-center justify-center pa-4 mb-4 rounded-circle" style="background: rgba(255,255,255,0.2);">
          <i class="fa-solid fa-circle-check" style="font-size: 48px;"></i>
        </div>
        <h2 class="text-h4 font-weight-bold mb-2">¡Cita Agendada!</h2>
        <p style="opacity: 0.9;">{{ mensaje }}</p>
      </div>

      <v-card-text class="pa-6 text-center">
        <p class="text-body-1 text-grey-darken-1 mb-4"> Recibirás una confirmación por correo electrónico y SMS con todos los detalles de tu cita. </p>
        <v-btn block color="green-darken-1" size="large" @click="handleClose">
          Entendido
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  defineProps({
    modelValue: Boolean,
    mensaje: String
  })

  const emit = defineEmits(['update:modelValue', 'cerrar-todo'])

  function handleClose() {
    emit('update:modelValue', false)
    emit('cerrar-todo') // Nuevo evento
  }
</script>