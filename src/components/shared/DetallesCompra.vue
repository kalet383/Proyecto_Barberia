<template>
    <div>
        <v-dialog v-model="dialogInterno" max-width="1300" class="rounded-xl" persistent @update:modelValue="emitirCambio">
            <v-card>
                <v-toolbar flat>
                    <v-toolbar-title>SHOPPING CART</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="vaciarCarrito">Vaciar carrito</v-btn>
                </v-toolbar>

                <v-row no-gutters>
                    <!-- Columna izquierda (contenido adicional) -->
                    <v-col cols="12" md="7" class="pa-4" style="max-height: 600px; overflow-y: auto;">
                        <v-data-table v-model="selected" :items="carrito" :headers="headers" item-value="id" show-select class="elevation-1">
                            <template #item.nombre="{ item }">
                                <div class="d-flex align-center gap-2">
                                    <v-avatar size="80">
                                        <v-img :src="item.img" alt="PRODUCTO"></v-img>
                                    </v-avatar>
                                    <span><strong>{{ item.nombre }}</strong></span>
                                </div>
                            </template>
                            <template #item.subtotal="{ item }">
                                ${{ (item.precio * item.cantidad).toLocaleString() }}
                            </template>
                        </v-data-table>
                    </v-col>

                    <v-col cols="12" md="5" class="pa-4">
                        <!-- Aquí puedes poner lo que quieras, por ejemplo: -->
                        <h3>TOTAL DEL CARRITO</h3>
                    </v-col>
                </v-row> 
            </v-card>
            <v-btn color="#ee6f38" @click="cerrarModal">Cerrar</v-btn>
        </v-dialog>
    </div>
</template>

<script>
    import { useProductosStore } from '@/stores/useProductosStore';
    export default {
        name: 'DetallesCompra',
        props: {
            dialog : {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogInterno: this.dialog,
                selected : [],
                headers : [
                    {title: 'PRODUCTO', value: 'nombre'},
                    {title: 'CANTIDAD', value: 'cantidad'},
                    {title: 'PRECIO', value: 'precio'},
                    {title: 'SUBTOTAL', value: 'subtotal'}
                ]
            }
        },
        watch: {
            dialog(nuevoValor) {
                this.dialogInterno = nuevoValor;
            },
        },
        computed: {
            carrito() {
                return useProductosStore().ComprasCarrito
            }
        },
        methods: {
            emitirCambio(nuevoValor) {
                this.$emit('update:dialog', nuevoValor);
            },
            cerrarModal() {
                this.dialogInterno = false;
                this.$emit('update:dialog', false);
            },
            vaciarCarrito() {
                useProductosStore().ComprasCarrito = []
            }
        }
    }
</script>