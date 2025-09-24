<template>
    <div>
        <v-icon class="fa-solid fa-cart-shopping carrito" @click="activarCarrito"></v-icon>
        <DetallesCompra :dialog="estadoCarrito" @update:dialog="estadoCarrito = $event"></DetallesCompra>
    </div>
</template>

<script>
    import { useProductosStore } from '@/stores/useProductosStore';
    import DetallesCompra from '@/components/shared/DetallesCompra.vue';
    
    export default {
        name: 'CarritoCompra',
        components: {
            DetallesCompra
        },
        data() {
                return {
                    estadoCarrito : false
                }
            },
            computed: {
                TiendaProductos() {
                    return useProductosStore
                }
            },
            methods: {
                activarCarrito() {
                    this.estadoCarrito = true
                }
        },
    }
</script>

<style scoped>
    .carrito {
        color: white;
        font-size: 24px;
        cursor: pointer;
        transition: color 0.3s ease;
        
    }

    .carrito:hover {
        color: #ee6f38;
    } 
</style>