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
                        <div><strong>Precio:</strong> ${{ Number(producto.precio_venta).toFixed(2) }}</div>
                        <div><strong>Stock:</strong> {{ producto.stock }} unidades</div>
                        <div><strong>Categoría:</strong> {{ producto.categoria?.nombre || 'Sin categoría' }}</div>
                        <div><strong>Publicados:</strong> {{ producto.cantidad_publicada || 0 }}</div>
                    </v-card-text>

                    <v-card-actions>
                        <v-btn color="primary" size="small" @click="openPublishDialog(producto)">Publicar</v-btn>
                        <v-btn color="error" size="small" v-if="producto.cantidad_publicada > 0" @click="retirarPublicacion(producto)">Retirar publicación</v-btn>
                    </v-card-actions>
                </v-card>

            </v-col>
        </v-row>

        <!-- Dialog para publicar producto -->
        <v-dialog v-model="showPublishDialog" max-width="400">
            <v-card>
                <v-card-title>Publicar producto</v-card-title>
                <v-card-text>
                    <div>Producto: <strong>{{ selectedProduct?.nombre }}</strong></div>
                    <v-text-field type="number" v-model.number="publishCantidad" label="Cantidad a publicar" min="1" :max="selectedProduct?.stock || 1"></v-text-field>
                    <div class="text-caption">Stock disponible: {{ selectedProduct?.stock || 0 }}</div>
                    <div class="text-caption">Stock disponible para publicar: {{ (selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0) }}</div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showPublishDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="confirmPublish">Publicar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Tabla de control de publicaciones -->
        <v-card class="mt-6">
            <v-card-title>Control de publicaciones</v-card-title>
            <v-card-text>
                <v-data-table :items="productoStore.productos" :headers="headers" class="elevation-1">
                    <template #top>
                        <div class="table-headers d-flex align-center px-4 py-2 font-weight-bold">
                            <div style="flex: 3">Nombre</div>
                            <div style="flex: 1">Stock</div>
                            <div style="flex: 1">Publicados</div>
                            <div style="flex: 1">Estado</div>
                            <div style="flex: 1">Acción</div>
                        </div>
                    </template>
                    <template #item.publicados="{ item }">
                        {{ item.cantidad_publicada || 0 }}
                    </template>
                    <template #item.estado="{ item }">
                        <v-chip :color="item.cantidad_publicada > 0 ? 'green' : 'grey'" small>
                            {{ item.cantidad_publicada > 0 ? (item.cantidad_publicada == item.stock ? 'Publicado: Todo stock' : 'Publicado: Parcial') : 'No publicado' }}
                        </v-chip>
                    </template>
                    <template #item.accion="{ item }">
                        <v-btn small color="error" v-if="item.cantidad_publicada > 0" @click="retirarPublicacion(item)">Retirar</v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar" :timeout="3000">{{ snackbarText }}</v-snackbar>
    </v-container>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { useProductoStore } from '@/stores/producto';
        
    const productoStore = useProductoStore();

    const showPublishDialog = ref(false);
    const selectedProduct = ref(null);
    const publishCantidad = ref(1);

    const openPublishDialog = (producto) => {
        selectedProduct.value = producto;
        // Por defecto publicar 1 si hay stock
        publishCantidad.value = producto.stock > 0 ? 1 : 0;
        showPublishDialog.value = true;
    };

    const snackbar = ref(false);
    const snackbarText = ref('');

    const notify = (text) => {
        snackbarText.value = text; snackbar.value = true;
    };
    const confirmPublish = async () => {
        if (!selectedProduct.value) return;
        try {
            await productoStore.publishProducto(selectedProduct.value.id, publishCantidad.value);
            showPublishDialog.value = false;
            selectedProduct.value = null;
            await productoStore.getProductos();
            notify('Producto publicado correctamente');
        } catch (e) {
            console.error('Error al publicar', e);
            showPublishDialog.value = false;
            const backendMsg = productoStore.error || (e?.response?.data?.message) || 'Error al publicar el producto';
            notify(backendMsg);
        }
    };

    const retirarPublicacion = async (producto) => {
        try {
            await productoStore.unpublishProducto(producto.id);
            await productoStore.getProductos();
        } catch (e) {
            console.error('Error al retirar publicación', e);
        }
    };

    const headers = [
        { text: 'Nombre', value: 'nombre' },
        { text: 'Stock', value: 'stock' },
        { text: 'Publicados', value: 'publicados' },
        { text: 'Estado', value: 'estado' },
        { text: 'Acción', value: 'accion' }
    ];

    onMounted(async () => {
        await productoStore.getProductos();
    });
</script>

<style scoped>
.table-headers {
  background: #fff;
  border-bottom: 1px solid #eee;
  gap: 12px;
}
.table-headers > div {
  padding-left: 8px;
}
</style>