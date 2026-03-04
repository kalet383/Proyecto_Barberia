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
                        <v-btn color="error" size="small" v-if="producto.cantidad_publicada > 0" @click="retirarPublicacion(producto)">Retirar</v-btn>
                        <v-btn color="warning" size="small" @click="openOfertaDialog(producto)">
                            {{ producto.en_oferta ? 'Config. Oferta' : 'Ofertar' }}
                        </v-btn>
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
                    <!-- Max is (stock - published) -->
                    <v-text-field 
                        type="number" 
                        v-model.number="publishCantidad" 
                        label="Cantidad a publicar" 
                        min="1" 
                        :max="Math.max(0, (selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0))"
                        :rules="[
                            v => v > 0 || 'Debe ser mayor a 0',
                            v => v <= Math.max(0, (selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0)) || 'Excede el stock disponible'
                        ]"
                    ></v-text-field>
                    <div class="text-caption">Stock total: {{ selectedProduct?.stock || 0 }}</div>
                    <div class="text-caption">Ya publicados: {{ selectedProduct?.cantidad_publicada || 0 }}</div>
                    <div class="text-caption font-weight-bold" :class="{'text-error': ((selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0)) < 0}">
                        Stock disponible para publicar: {{ Math.max(0, (selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0)) }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showPublishDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="confirmPublish" :disabled="publishCantidad <= 0 || publishCantidad > Math.max(0, (selectedProduct?.stock || 0) - (selectedProduct?.cantidad_publicada || 0))">Publicar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog para configurar oferta y precio -->
        <v-dialog v-model="showOfertaDialog" max-width="500">
            <v-card>
                <v-card-title>Configurar Precio y Oferta</v-card-title>
                <v-card-text>
                    <v-form ref="ofertaFormRef">
                        <div>Producto: <strong>{{ selectedOfertaProduct?.nombre }}</strong></div>
                        <v-divider class="my-3"></v-divider>

                        <v-text-field 
                            type="number" 
                            v-model.number="ofertaForm.precio_venta" 
                            label="Precio Normal (Venta)" 
                            min="0" 
                            prefix="$"
                            :rules="[v => !!v || 'Campo requerido', v => v > 0 || 'Debe ser mayor a 0']"
                            variant="outlined"
                            density="comfortable"
                            class="mb-4"
                        ></v-text-field>
                        
                        <v-switch 
                            v-model="ofertaForm.en_oferta" 
                            color="success"
                            label="Activar Oferta"
                            class="mb-2"
                        ></v-switch>

                        <template v-if="ofertaForm.en_oferta">
                            <v-text-field 
                                type="number" 
                                v-model.number="ofertaForm.precio_oferta" 
                                label="Precio de Oferta" 
                                min="0" 
                                prefix="$"
                                :rules="[
                                    v => !!v || 'Debe ingresar un precio de oferta',
                                    v => v > 0 || 'Debe ser mayor a 0',
                                    v => v < ofertaForm.precio_venta || 'La oferta debe ser menor al precio normal'
                                ]"
                                variant="outlined"
                                density="comfortable"
                                class="mb-2"
                            ></v-text-field>
                            
                            <v-text-field 
                                v-model="ofertaForm.dias_oferta" 
                                label="Días o duración de la oferta (Opcional)" 
                                hint="Ej: 3 Días, Solo hoy, Fines de semana"
                                variant="outlined"
                                density="comfortable"
                                class="mb-2"
                            ></v-text-field>

                            <v-textarea 
                                v-model="ofertaForm.informacion_oferta" 
                                label="Información adicional (Opcional)" 
                                hint="Detalles que se mostrarán junto al precio"
                                variant="outlined"
                                density="comfortable"
                                rows="2"
                            ></v-textarea>
                        </template>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showOfertaDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" @click="confirmOferta" :loading="savingOferta">Guardar Configuración</v-btn>
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

    // Ofertas State
    const showOfertaDialog = ref(false);
    const savingOferta = ref(false);
    const selectedOfertaProduct = ref(null);
    const ofertaFormRef = ref(null);
    const ofertaForm = ref({
        precio_venta: 0,
        en_oferta: false,
        precio_oferta: null,
        dias_oferta: '',
        informacion_oferta: ''
    });

    const openPublishDialog = (producto) => {
        selectedProduct.value = producto;
        
        const available = Math.max(0, producto.stock - (producto.cantidad_publicada || 0));
        
        publishCantidad.value = available > 0 ? 1 : 0;
        showPublishDialog.value = true;
    };

    const openOfertaDialog = (producto) => {
        selectedOfertaProduct.value = producto;
        ofertaForm.value = {
            precio_venta: Number(producto.precio_venta) || 0,
            en_oferta: !!producto.en_oferta,
            precio_oferta: producto.precio_oferta ? Number(producto.precio_oferta) : null,
            dias_oferta: producto.dias_oferta || '',
            informacion_oferta: producto.informacion_oferta || ''
        };
        showOfertaDialog.value = true;
    };

    const confirmOferta = async () => {
        if (!selectedOfertaProduct.value) return;
        
        const { valid } = await ofertaFormRef.value.validate();
        if (!valid) return;

        savingOferta.value = true;
        try {
            const payload = { ...ofertaForm.value };
            if (!payload.en_oferta) {
                payload.precio_oferta = null;
                payload.dias_oferta = null;
                payload.informacion_oferta = null;
            }
            await productoStore.updateProducto(selectedOfertaProduct.value.id, payload);
            showOfertaDialog.value = false;
            notify('Configuración actualizada');
            await productoStore.getProductos();
        } catch (e) {
            console.error('Error al configurar', e);
            notify('Error al guardar configuración');
        } finally {
            savingOferta.value = false;
        }
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