<template>
    <v-dialog :model-value="mostrarDetalles" @update:model-value="onDialogToggle" max-width="1000">
        <v-card class="detalle-card">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="productoSeleccionado?.imagenUrl || productoSeleccionado?.img || '/imagenes/logo/logo2.png'" aspect-ratio="1" class="imagen-modal" />
                </v-col>
                <v-col cols="12" md="6">
                    <h3 class="titulodialog">{{ productoSeleccionado?.nombre }}</h3>
                    
                    <div class="precio-section my-3" v-if="productoSeleccionado">
                        <template v-if="productoSeleccionado.en_oferta">
                            <v-alert
                                border="start"
                                border-color="success"
                                elevation="2"
                                color="green-lighten-5"
                                class="mb-3 pr-2 py-2"
                            >
                                <div class="d-flex align-center justify-space-between w-100">
                                    <div>
                                        <div class="d-flex align-center">
                                            <v-icon color="success" class="mr-2">mdi-sale</v-icon>
                                            <span class="text-subtitle-2 font-weight-bold text-success text-uppercase">
                                                {{ productoSeleccionado.dias_oferta || 'OFERTA ESPECIAL' }}
                                            </span>
                                        </div>
                                        <div class="text-caption text-grey-darken-1 mt-1" v-if="productoSeleccionado.informacion_oferta">
                                            {{ productoSeleccionado.informacion_oferta }}
                                        </div>
                                    </div>
                                </div>
                            </v-alert>
                            <div class="d-flex align-end gap-3 mb-2">
                                <span class="text-h4 font-weight-black text-green-darken-3">
                                    ${{ Number(productoSeleccionado.precio_oferta).toLocaleString() }}
                                </span>
                                <span class="text-h6 text-decoration-line-through text-grey-darken-1 mb-1">
                                    ${{ Number(productoSeleccionado.precio_venta).toLocaleString() }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <div class="text-h4 font-weight-bold text-primary mb-3">
                                ${{ Number(productoSeleccionado?.precio_venta).toLocaleString() }}
                            </div>
                        </template>
                    </div>

                    <p class="resumenproduc text-body-1 text-grey-darken-2"> {{ productoSeleccionado?.descripcion || productoSeleccionado?.resumen }} </p>
                    <v-divider class="my-3"></v-divider>
                    <div class="detallesdelproduc">
                        <h4>Ingredientes</h4>
                            <p> {{ productoSeleccionado?.ingredientes }} </p> 
                        <h4>Modo de uso</h4>
                            <p> {{ productoSeleccionado?.modo_uso }} </p>
                        <h4>Cantidades de presentacion</h4>
                            <p> {{ productoSeleccionado?.cantidades }} </p>
                        <h4>Beneficios</h4>
                            <ul>
                                <li v-for="(beneficio, i) in productoSeleccionado?.beneficios" :key="i"> {{ beneficio }} </li>
                            </ul>
                    </div>
                </v-col>
                <v-btn color="#ee6f38" @click="cerrarDetalles" class="btndialog">Cerrar</v-btn>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script setup>
    import { storeToRefs } from 'pinia'
    import { useProductosStore } from '@/stores/useProductosStore'

    const productosStore = useProductosStore()

    // Extraer el estado reactivo del store
    const { mostrarDetalles, productoSeleccionado } = storeToRefs(productosStore)

    // Extraer las acciones (no necesitan storeToRefs)
    const { cerrarDetalles } = productosStore

    const onDialogToggle = (val) => {
        if (!val) cerrarDetalles()
    }
</script>

<style scoped>
    .detalle-card {
        padding: 20px;
    }

    .imagen-modal {
        width: 90%;
        height: auto;
        border-radius: 8px;
    }

    .titulodialog {
        text-align: center;
        margin-bottom: 1%;
    }

    .resumenproduc {
        font-size: 15px;
    }

    .detallesdelproduc {
        margin-top: 1%;
    }

    .btndialog {
        margin-bottom: 1%;
        margin-left: 90%;
    }
</style>