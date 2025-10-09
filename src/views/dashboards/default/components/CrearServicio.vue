<template>
    <v-card class="pa-4">
        <v-card-title>Crear Servicio</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="crearServicio" v-model="valid">
                <v-text-field label="Nombre del servicio" v-model="form.nombre" :rules="[v => !!v || 'El nombre es requerido']" required />
                <v-textarea label="Descripción" v-model="form.descripcion" :rules="[v => !!v || 'La descripción es requerida']" auto-grow required />
                <v-text-field label="Precio" v-model="form.precio" type="number" prefix="$" step="0.01" :rules="[v => v > 0 || 'El precio debe ser mayor que 0']" required/>
                <v-text-field label="Duración (HH:MM)" v-model="form.duracion" placeholder="00:30" :rules="[v => /^\d{2}:\d{2}$/.test(v) || 'Formato HH:MM']" hint="Ej: 00:30 para 30 minutos o 01:00 para 1 hora" persistent-hint required/>
                <v-btn color="primary" class="mt-4" type="submit" :disabled="!valid">Guardar Servicio</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" color="green" timeout="3000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script>
    import { ref } from 'vue'
    import { useServiceStore } from '@/stores/services';

    export default {
        name: 'CrearServicio',
        setup() {
            // estado del formulario
            const form = ref({
            nombre: '',
            descripcion: '',
            precio: null,
            duracion: '' // formato "HH:MM"
            })

            const valid = ref(false);
            const snackbar = ref(false);
            const snackbarMessage = ref('');
            const loading = ref(false);
            const serviceStore = useServiceStore();

            const crearServicio = async () => {
                loading.value = true;
                if (!valid.value) return

                // Aseguramos segundos "00"
                let duracionFinal = form.value.duracion
                if (/^\d{2}:\d{2}$/.test(duracionFinal)) {
                    duracionFinal = duracionFinal + ':00'
                }

                // Llamas a tu store para guardar
                await serviceStore.createService({
                    nombre: form.value.nombre,
                    descripcion: form.value.descripcion,
                    precio: parseFloat(form.value.precio),
                    duracionAprox: duracionFinal
                })

                // Limpia formulario
                form.value = { nombre: '', descripcion: '', precio: null, duracion: '' }

                // Mostrar snackbar
                snackbarMessage.value = 'Servicio creado y guardado con éxito'
                snackbar.value = true
            }

            return { form, valid, crearServicio, snackbar, snackbarMessage, loading }
        }
    }
</script>