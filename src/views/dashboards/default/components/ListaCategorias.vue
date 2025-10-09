<template>
    <v-container>
        <h2 class="text-h5 mb-4">Categorias de productos</h2>

        <v-progress-linear v-if="categoriaProductoStore.loading" color="primary" indeterminate />

        <v-alert v-if="categoriaProductoStore.error" type="error" class="mb-4">
            {{ categoriaProductoStore.error }}
        </v-alert>

        <v-alert v-if="!categoriaProductoStore.loading && categoriaProductoStore.categoriasProducto.length === 0" type="info" class="mb-4">
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
                <tr v-for="categoria in categoriaProductoStore.categoriasProducto" :key="categoria.id">
                    <td>{{ categoria.nombre }}</td>
                    <!-- <td>{{ item.calories }}</td> -->
                </tr>
            </tbody>
        </v-table>
    </v-container>
</template>

<script>
    import { onMounted } from 'vue';
    import { useCategoriaProductoStore } from '@/stores/CategoriaProducto';

    export default {
        name: 'ListaCategorias',
        setup() {
            const categoriaProductoStore = useCategoriaProductoStore();
            
            onMounted(async () => {
                await categoriaProductoStore.getCategoriasProducto();
            });

            return {
                categoriaProductoStore
            }
        }
    }
</script>