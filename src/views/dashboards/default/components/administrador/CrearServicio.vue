<template>
    <v-card class="pa-4">
        <v-card-title>Crear Servicio</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="crearServicio" v-model="valid">
                <v-text-field label="Nombre del servicio" v-model="form.nombre" :rules="[v => !!v || 'El nombre es requerido']" required />
                <v-textarea label="Descripción" v-model="form.descripcion" :rules="[v => !!v || 'La descripción es requerida']" auto-grow required />
                <v-text-field label="Precio" v-model="form.precio" type="number" prefix="$" step="0.01" :rules="[v => v > 0 || 'El precio debe ser mayor que 0']" required/>
                <v-text-field label="Duración (HH:MM)" v-model="form.duracion" placeholder="00:30" :rules="[v => /^\d{2}:\d{2}$/.test(v) || 'Formato HH:MM']" hint="Ej: 00:30 para 30 minutos o 01:00 para 1 hora" persistent-hint required/>
                <v-select label="Categoría del servicio" v-model="form.categoriaId" :items="categorias" item-title="nombre" item-value="id" :rules="[v => !!v || 'La categoría es requerida']" :loading="loading"required/>
                <v-btn color="primary" class="mt-4" type="submit" :disabled="!valid">Guardar Servicio</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" color="green" timeout="3000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useServiceStore } from '@/stores/services'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'

    // Estado del formulario
        const form = ref({
        nombre: '',
        descripcion: '',
        precio: null,
        duracion: '', // formato "HH:MM"
        categoriaId: null
    })

    const valid = ref(false)
    const snackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarColor = ref('green')
    const loading = ref(false)
    const categorias = ref([])

    const serviceStore = useServiceStore()
    const categoriaServicioStore = useCategoriaServicioStore()

    const getCategorias = async () => {
    loading.value = true
    try {
        const data = await categoriaServicioStore.getCategoriasServicio()
        categorias.value = data
    } catch (error) {
        console.error('Error al cargar categorías:', error)
    } finally {
        loading.value = false
    }
    }

    onMounted(() => {
        getCategorias()
    })

    const crearServicio = async () => {
    loading.value = true
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
        duracionAprox: duracionFinal,
        categoriaId: form.value.categoriaId
    })

    // Limpia formulario
    form.value = { nombre: '', descripcion: '', precio: null, duracion: '', categoriaId: null }

    // Mostrar snackbar
    snackbarMessage.value = 'Servicio creado y guardado con éxito'
    snackbar.value = true
    loading.value = false
    }
</script>