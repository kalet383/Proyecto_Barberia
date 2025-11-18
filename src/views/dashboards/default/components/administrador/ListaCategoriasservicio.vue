<template>
    <v-container>
        <h2 class="text-h5 mb-4">Categorias de servicios</h2>

        <v-progress-linear v-if="categoriaServicioStore.loading" color="primary" indeterminate />

        <v-alert v-if="categoriaServicioStore.error" type="error" class="mb-4">
            {{ categoriaServicioStore.error }}
        </v-alert>

        <v-alert v-if="!categoriaServicioStore.loading && categoriaServicioStore.categoriasServicio.length === 0" type="info" class="mb-4">
            No hay categorias disponibles
        </v-alert>

        <v-table>
            <thead>
                <tr>
                    <th class="text-left">
                    Nombre categoria
                    </th>
                    <th class="text-left">
                    Acciones
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="categoria in categoriaServicioStore.categoriasServicio" :key="categoria.id">
                    <td>{{ categoria.nombre }}</td>
                    <!-- <td>{{ item.calories }}</td> -->
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio.ts'

    const categoriaServicioStore = useCategoriaServicioStore()

    onMounted(async () => {
        await categoriaServicioStore.getCategoriasServicio()
    })
</script>