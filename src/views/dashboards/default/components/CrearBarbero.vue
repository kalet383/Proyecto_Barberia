<template>
  <v-card>
    <v-card-title>Crear Barbero</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitBarber" v-model="valid">
        <!-- SECCIÓN 1: DATOS DEL BARBERO -->
        <v-card-subtitle>Información Personal</v-card-subtitle>
        <v-text-field 
          v-model="form.nombre" 
          label="Nombre" 
          :rules="[v => !!v || 'El nombre es requerido']" 
          required 
        />
        <v-text-field 
          v-model="form.apellido" 
          label="Apellido" 
          :rules="[v => !!v || 'El apellido es requerido']" 
          required 
        />
        <v-text-field 
          v-model="form.email" 
          label="Email" 
          :rules="[v => !!v || 'El email es requerido']" 
          required 
        />
        <v-text-field 
          v-model="form.password" 
          label="Contraseña" 
          type="password" 
          :rules="[v => !!v || 'La contraseña es requerida']" 
          required 
        />
        <v-text-field 
          v-model="form.telefono" 
          label="Teléfono" 
          :rules="[v => !!v || 'El teléfono es requerido']" 
          required 
        />
        <v-text-field 
          v-model="form.foto" 
          label="URL/Foto base64" 
          :rules="[v => !!v || 'La URL/Foto es requerida']" 
          required 
        />

        <!-- SECCIÓN 2: HORARIOS DEL BARBERO -->
        <v-divider class="my-6"></v-divider>
        <v-card-subtitle>Horarios de Trabajo</v-card-subtitle>
        
        <v-row v-for="(horario, index) in form.horarios" :key="index" class="mb-4">
          <v-col cols="12" sm="4">
            <v-select
              v-model="horario.diasemana"
              :items="diasSemana"
              label="Día de la semana"
              :rules="[v => !!v || 'Selecciona un día']"
              required
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="horario.idFranja"
              :items="franjas"
              item-title="label"
              item-value="id_franja"
              label="Franja horaria"
              :rules="[v => !!v || 'Selecciona una franja']"
              required
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-btn 
              icon="mdi-delete" 
              color="error" 
              size="small"
              @click="removeHorario(index)"
            />
          </v-col>
        </v-row>

        <v-btn 
          color="secondary" 
          @click="addHorario"
          class="mb-4"
        >
          + Agregar Horario
        </v-btn>

        <!-- BOTÓN SUBMIT -->
        <v-divider class="my-6"></v-divider>
        <v-btn 
          type="submit" 
          color="primary" 
          :disabled="!valid || form.horarios.length === 0"
          :loading="loading"
        >
          Crear barbero
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
  
  <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useBarberStore } from '@/stores/barber'
import api from '@/plugins/axios'

export default {
  name: 'CrearBarbero',
  setup() {
    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      telefono: '',
      foto: '',
      horarios: []
    });

    const diasSemana = [
      { title: 'Lunes', value: 'lunes' },
      { title: 'Martes', value: 'martes' },
      { title: 'Miércoles', value: 'miercoles' },
      { title: 'Jueves', value: 'jueves' },
      { title: 'Viernes', value: 'viernes' },
      { title: 'Sábado', value: 'sabado' },
      { title: 'Domingo', value: 'domingo' },
    ];

    const valid = ref(false);
    const snackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('success');
    const loading = ref(false);
    const franjas = ref([]);
    const barberStore = useBarberStore();

    // Cargar franjas horarias disponibles
    const loadFranjas = async () => {
      try {
        const { data } = await api.get('/franja-horaria', { withCredentials: true })
        franjas.value = data.map(franja => ({
          id_franja: franja.id_franja,
          label: `${franja.hora_inicio} - ${franja.hora_fin}`
        }));
      } catch (error) {
        console.error('Error completo al cargar franjas:', error);
        snackbarMessage.value = 'Error al cargar franjas horarias';
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    };

    const addHorario = () => {
      form.value.horarios.push({
        diasemana: '',
        idFranja: ''
      });
    };

    const removeHorario = (index) => {
      form.value.horarios.splice(index, 1);
    };

    const submitBarber = async () => {
      loading.value = true;
      if (!valid.value) {
        loading.value = false;
        return;
      }

      try {
        // Llamar al servicio que crea barbero + horarios
        await barberStore.createBarberWithSchedule(form.value);
        snackbarMessage.value = 'Barbero y horarios creados exitosamente';
        snackbarColor.value = 'success';
        snackbar.value = true;
        
        // Limpiar formulario
        form.value = {
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          telefono: '',
          foto: '',
          horarios: []
        };
      } catch (error) {
        console.error('Error al crear barbero:', error);
        snackbarMessage.value = error.message || 'Error al crear barbero';
        snackbarColor.value = 'error';
        snackbar.value = true;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadFranjas();
    });

    return {
      form,
      valid,
      submitBarber,
      snackbar,
      snackbarMessage,
      snackbarColor,
      loading,
      diasSemana,
      franjas,
      addHorario,
      removeHorario,
    };
  }
};
</script>