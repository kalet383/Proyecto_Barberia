<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>Reservar Cita</v-card-title>
      <v-card-text>
        <!-- Paso 1: Servicios -->
        <h3 class="text-h6">1. Selecciona un servicio</h3>
        <v-select
          v-model="reservaStore.servicioSeleccionado"
          :items="serviceStore.services"
          item-title="nombre"
          item-value="id"
          label="Servicios"
          :loading="serviceStore.loading"
        />

        <!-- Paso 2: Barberos -->
        <h3 class="text-h6 mt-4">2. Selecciona un barbero</h3>
        <v-select
          v-model="reservaStore.barberoSeleccionado"
          :items="barberStore.barbers"
          item-title="nombre"
          item-value="id"
          label="Barberos"
          :loading="barberStore.loading"
        />

        <!-- Paso 3: Correo -->
        <h3 class="text-h6 mt-4">3. Tu correo electrónico</h3>
        <v-text-field
          v-model="reservaStore.email"
          label="Correo electrónico"
          type="email"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="cerrarModal">Cancelar</v-btn>
        <v-btn color="primary" @click="confirmarCita">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useServiceStore } from '@/stores/services'
import { useBarberStore } from '@/stores/barber'
import { useReservaStore } from '@/stores/reserva'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const dialog = ref(props.modelValue)

// Stores
const serviceStore = useServiceStore()
const barberStore = useBarberStore()
const reservaStore = useReservaStore()

onMounted(() => {
  // Cargar datos
  serviceStore.getServices()
  barberStore.getBarbers()
})

// Sincronizar v-model
watch(() => props.modelValue, (val) => (dialog.value = val))
watch(dialog, (val) => emit('update:modelValue', val))

function cerrarModal() {
  dialog.value = false
  reservaStore.reset()
}

async function confirmarCita() {
  try {
    const data = await reservaStore.confirmarReserva()
    console.log('Reserva confirmada', data)
    dialog.value = false
    reservaStore.reset()
  } catch (error) {
    console.error(error)
  }
}
</script>