<template>
    <v-dialog :model-value="mostrarDetalles" @update:model-value="onDialogToggle" max-width="900">
        <v-card class="detalle-card">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img :src="productoSeleccionado?.img" aspect-ratio="1" class="imagen-modal" />
                </v-col>
                <v-col cols="12" md="6">
                    <h3>{{ productoSeleccionado?.nombre }}</h3>
                    <p>Precio: ${{ productoSeleccionado?.precio.toLocaleString() }}</p>
                    <p>Aquí puedes agregar más texto descriptivo del producto...</p>
                    <v-btn color="#ee6f38" @click="cerrarDetalles">Cerrar</v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script>
    import { useProductosStore } from '@/stores/useProductosStore';
    import { mapState, mapActions } from 'pinia';

    export default {
        name: 'DetallesCard',
        computed: {
            ...mapState(useProductosStore, ['mostrarDetalles', 'productoSeleccionado']),
        },
        methods: {
            ...mapActions(useProductosStore, ['cerrarDetalles']),
            
            onDialogToggle(val) {
            if (!val) this.cerrarDetalles();
            }
        },
    };
</script>

<style scoped>
    .detalle-card {
        padding: 20px;
    }

    .imagen-modal {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
</style>