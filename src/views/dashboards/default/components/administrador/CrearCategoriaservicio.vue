<template>
    <v-card class="pa-4">
        <v-card-title>Crear categoria de un servicio</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="crearCategoria" v-model="valid">
                <v-text-field label="Nombre de la categoría" v-model="form.nombre" :rules="[v => !!v || 'El nombre es requerido']" required />
                <v-btn color="primary" class="mt-4" type="submit" :disabled="!valid">Guardar categoría</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" color="green" timeout="3000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script setup>
    import { ref } from 'vue'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio';

    const form = ref({ nombre: '' })
    const valid = ref(false)
    const snackbar = ref(false)
    const snackbarMessage = ref('')
    const loading = ref(false)
    const categoriaServicioStore = useCategoriaServicioStore()

    const crearCategoria = async () => {
        loading.value = true
        if (!valid.value) return

        const response = await categoriaServicioStore.createCategoriaServicio(form.value)
        if (response) {
            snackbarMessage.value = 'Categoría creada exitosamente'
            snackbar.value = true
            form.value.nombre = ''
        }

        loading.value = false
    }
</script>