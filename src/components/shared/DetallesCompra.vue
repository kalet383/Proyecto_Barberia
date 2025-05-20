<template>
    <div>
        <v-dialog v-model="dialogInterno" max-width="800" @update:modelValue="emitirCambio">
            <v-data-table v-model="selected" :items="items" :headers="headers" show-select></v-data-table>
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
                    {title: 'NOMBRE', value: 'nombre'},
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
            TiendaProductos() {
                return useProductosStore
            }
        },
        methods: {
            emitirCambio(nuevoValor) {
                this.$emit('update:dialog', nuevoValor);
            },
            cerrarModal() {
                this.dialogInterno = false;
                this.$emit('update:dialog', false);
            }
        }
    }
</script>