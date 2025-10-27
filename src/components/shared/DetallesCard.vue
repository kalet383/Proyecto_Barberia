<template>
    <v-dialog :model-value="mostrarDetalles" @update:model-value="onDialogToggle" max-width="1000">
        <v-card class="detalle-card">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="productoSeleccionado?.img" aspect-ratio="1" class="imagen-modal" />
                </v-col>
                <v-col cols="12" md="6">
                    <h3 class="titulodialog">{{ productoSeleccionado?.nombre }}</h3>
                    <p class="resumenproduc"> {{ productoSeleccionado?.resumen }} </p>
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