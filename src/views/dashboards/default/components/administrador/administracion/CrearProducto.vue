<template>
    <v-card class="pa-4">
        <v-card-title>Crear producto</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="crearProducto" v-model="valid">
                <v-text-field label="Nombre del producto" v-model="form.nombre" :rules="[v => !!v || 'El nombre es requerido']" required />
                <v-textarea label="Descripción del producto" v-model="form.descripcion" :rules="[v => !!v || 'La descripción es requerida']" auto-grow required />
                <v-text-field label="Precio de venta" v-model.number="form.precio_venta" type="number" prefix="$" step="0.01" :rules="[v => !!v || 'El precio es requerido', v => (v && !isNaN(Number(v))) || 'El precio debe ser un número']" required />
                <v-text-field label="Imagen del producto" v-model="form.imagenUrl" :rules="[v => !!v || 'La imagen es requerida']" required />
                <v-select label="Categoría del producto" v-model="form.categoriaId" :items="categorias" item-title="nombre" item-value="id" :rules="[v => !!v || 'La categoría es requerida']" :loading="loading" required/>
                <v-btn color="primary" class="mt-4" type="submit" :disabled="!valid || saving" :loading="saving" @click="crearProducto">Guardar producto</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useProductoStore } from '@/stores/producto'
    import { useCategoriaProductoStore } from '@/stores/CategoriaProducto'

    // Mantener nombre del componente
    defineOptions({ name: 'CrearProducto' })

    const productoStore = useProductoStore()
    const categoriaProductoStore = useCategoriaProductoStore()
    const form = ref({
    nombre: '',
    descripcion: '',
    precio_venta: 0,
    imagenUrl: '',
    categoriaId: null
    })

    const valid = ref(false)
    const snackbar = ref(false)
    const snackbarMessage = ref('')
    const snackbarColor = ref('green')
    const loading = ref(false)
    const saving = ref(false)
    const categorias = ref([])

    const getCategorias = async () => {
    loading.value = true
    try {
        const data = await categoriaProductoStore.getCategoriasProducto()
        categorias.value = data
        console.log('Categorías cargadas:', data)
    } catch (error) {
        console.error('Error al cargar categorías:', error)
    } finally {
        loading.value = false
    }
    }

    onMounted(() => {
    getCategorias()
    })

    const crearProducto = async () => {
    if (!valid.value) return

    saving.value = true

    // Asegurar que precio y datos sean correctos
    const payload = {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion,
        precio_venta: Number(form.value.precio_venta),
        imagenUrl: form.value.imagenUrl,
        categoriaId: Number(form.value.categoriaId),
        publicado: form.value.publicado ?? false
    }

    console.log('Enviando payload:', payload)

    try {
        const response = await productoStore.createProducto(payload)
        if (response) {
        snackbarMessage.value = 'Producto creado exitosamente'
        snackbarColor.value = 'green'
        snackbar.value = true
        // Resetear formulario
        form.value = {
            nombre: '',
            descripcion: '',
            precio_venta: 0,
            imagenUrl: '',
            categoriaId: null
        }
        }
    } catch (error: any) {
        console.error('Error al crear producto:', error)
        const msg = error?.response?.data?.message ?? error?.response?.data ?? error?.message ?? 'Error al crear el producto'
        snackbarMessage.value = typeof msg === 'string' ? msg : JSON.stringify(msg)
        snackbarColor.value = 'error'
        snackbar.value = true
    } finally {
        saving.value = false
    }
    }
</script>