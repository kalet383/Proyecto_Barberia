<template>
    <v-container>
        <h2 class="text-h5 mb-4">Productos</h2>
        
        <v-progress-linear v-if="productoStore.loading" color="primary" indeterminate />

        <v-alert v-if="productoStore.error" type="error" class="mb-4">
            {{ productoStore.error }}
        </v-alert>

        <v-alert v-if="!productoStore.loading && productoStore.productos.length === 0" type="info" class="mb-4">
            No hay productos disponibles
        </v-alert>

        <v-row>
            <v-col v-for="producto in productoStore.productos" :key="producto.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img 
                        :src="producto.imagenUrl && producto.imagenUrl !== 'imagenur1prueba' ? producto.imagenUrl : 'https://via.placeholder.com/400x200?text=Sin+Imagen'" 
                        height="200px"
                        cover
                    ></v-img>

                    <v-card-title>
                        {{ producto.nombre }}
                    </v-card-title>

                    <v-card-subtitle>
                        <div class="mb-1">{{ producto.descripcion }}</div>
                    </v-card-subtitle>

                    <v-card-text>
                        <div><strong>Precio:</strong> ${{ Number(producto.precio).toFixed(2) }}</div>
                        <div><strong>Stock:</strong> {{ producto.stock }} unidades</div>
                        <div><strong>Categoría:</strong> {{ producto.categoria?.nombre || 'Sin categoría' }}</div>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { useProductoStore } from '@/stores/producto';
    import { onMounted } from 'vue';

    export default {
        name: 'ListaProductos',
        setup() {
            const productoStore = useProductoStore();

            onMounted(async () => {
                await productoStore.getProductos();
            });

            return {
                productoStore
            }
        }
    }
</script>