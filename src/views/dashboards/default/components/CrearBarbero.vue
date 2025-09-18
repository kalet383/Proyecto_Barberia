<template>
  <v-card>
    <v-card-title>Crear Barbero</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitBarber">
        <v-text-field v-model="form.nombre" label="Nombre" required />
        <v-text-field v-model="form.apellido" label="Apellido" required />
        <v-text-field v-model="form.email" label="Email" required />
        <v-text-field v-model="form.password" label="Contraseña" type="password" required />
        <v-text-field v-model="form.telefono" label="Teléfono" />
        <v-text-field v-model="form.foto" label="URL/Foto base64" /> <!-- opcional -->

        <v-btn type="submit" color="primary">Crear</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useBarberStore } from '@/stores/barber'

const store = useBarberStore()

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  telefono: '',
  foto: '', // en tu caso string/base64
})

const submitBarber = async () => {
  try {
    await store.createBarber(form)
    alert('Barbero creado correctamente')
    // limpiar formulario si quieres
  } catch (error) {
    console.error(error)
    alert('Error creando barbero')
  }
}
</script>
