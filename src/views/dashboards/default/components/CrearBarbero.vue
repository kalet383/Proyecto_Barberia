<template>
  <v-card>
    <v-card-title>Crear Barbero</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitBarber" v-model="valid">
        <v-text-field v-model="form.nombre" label="Nombre" :rules="[v => !!v || 'El nombre es requerido']" required />
        <v-text-field v-model="form.apellido" label="Apellido" :rules="[v => !!v || 'El apellido es requerido']" required />
        <v-text-field v-model="form.email" label="Email" :rules="[v => !!v || 'El email es requerido']" required />
        <v-text-field v-model="form.password" label="Contraseña" type="password" :rules="[v => !!v || 'La contraseña es requerida']" required />
        <v-text-field v-model="form.telefono" label="Teléfono" :rules="[v => !!v || 'El teléfono es requerido']" required />
        <v-text-field v-model="form.foto" label="URL/Foto base64" :rules="[v => !!v || 'La URL/Foto es requerida']" required />

        <v-btn type="submit" color="primary" :disabled="!valid">Crear barbero</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
  import { ref } from 'vue'
  import { useBarberStore } from '@/stores/barber'

  export default {
    name: 'CrearBarbero',
    setup() {
      const form = ref({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        telefono: '',
        foto: ''
      });

      const valid = ref(false);
      const snackbar = ref(false);
      const snackbarMessage = ref('');
      const loading = ref(false);
      const barberStore = useBarberStore()

      const submitBarber = async () => {
        loading.value = true;
        if (!valid.value) return

        try {
          await barberStore.createBarber(form.value)
          snackbarMessage.value = 'Barbero creado exitosamente'
          snackbar.value = true
          form.value = {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            telefono: '',
            foto: ''
          }
        } catch (error) {
          console.error('Error al crear barbero:', error)
          snackbarMessage.value = 'Error al crear barbero'
          snackbar.value = true
        } finally {
          loading.value = false
        }
      }

      return {
        form,
        valid,
        submitBarber,
        snackbar,
        snackbarMessage,
        loading,
      }
    }
  }
</script>