<script setup lang="ts">
import { useProductosStore } from '@/stores/useProductosStore';
import { ShoppingCartIcon, XIcon, PlusIcon, MinusIcon, TrashIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';

const productosStore = useProductosStore();
const router = useRouter();

interface Product {
    id: number;
    nombre: string;
    precio: number;
    img: string;
    cantidad: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value);
};

const goToCheckout = () => {
    productosStore.cerrarCarrito();
    router.push('/checkout');
};
</script>

<template>
    <v-dialog v-model="productosStore.carritoAbierto" max-width="900" persistent scrollable>
        <v-card class="cart-modal">
            <v-card-title class="pa-4 d-flex align-center bg-grey-lighten-4">
                <ShoppingCartIcon size="24" class="mr-2" />
                <span class="text-h5 font-weight-bold">MI CARRITO</span>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="productosStore.cerrarCarrito()">
                    <XIcon size="24" />
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-0">
                <v-container fluid v-if="productosStore.ComprasCarrito.length > 0">
                    <v-row class="bg-grey-lighten-3 py-2 px-4 d-none d-md-flex font-weight-bold text-caption">
                        <v-col cols="5">PRODUCTO</v-col>
                        <v-col cols="2" class="text-center">CANTIDAD</v-col>
                        <v-col cols="2" class="text-center">PRECIO</v-col>
                        <v-col cols="2" class="text-center">SUBTOTAL</v-col>
                        <v-col cols="1"></v-col>
                    </v-row>

                    <v-divider></v-divider>

                    <v-list class="pa-0">
                        <v-list-item v-for="item in (productosStore.ComprasCarrito as Product[])" :key="item.id" class="px-4 py-4 border-bottom">
                            <v-row align="center">
                                <v-col cols="12" md="5" class="d-flex align-center">
                                    <v-img :src="item.img" width="80" height="80" cover class="rounded mr-4"></v-img>
                                    <div>
                                        <div class="text-subtitle-1 font-weight-bold">{{ item.nombre }}</div>
                                        <v-btn variant="text" color="error" size="x-small" density="compact" class="px-0 text-lowercase mt-1 d-md-none" @click="productosStore.EliminarDelCarrito(item.id)">
                                            <TrashIcon size="14" class="mr-1" /> Quitar
                                        </v-btn>
                                    </div>
                                </v-col>
                                
                                <v-col cols="4" md="2" class="d-flex justify-center align-center">
                                    <div class="quantity-control d-flex align-center border rounded">
                                        <v-btn icon size="x-small" variant="text" @click="productosStore.QuitarUno(item.id)">
                                            <MinusIcon size="14" />
                                        </v-btn>
                                        <span class="mx-2 font-weight-bold">{{ item.cantidad }}</span>
                                        <v-btn icon size="x-small" variant="text" @click="productosStore.AgregaralCarrito(item)">
                                            <PlusIcon size="14" />
                                        </v-btn>
                                    </div>
                                </v-col>

                                <v-col cols="4" md="2" class="text-center">
                                    <span class="text-body-2">{{ formatCurrency(item.precio) }}</span>
                                </v-col>

                                <v-col cols="4" md="2" class="text-center font-weight-bold">
                                    <span class="text-primary">{{ formatCurrency(item.precio * item.cantidad) }}</span>
                                </v-col>

                                <v-col cols="12" md="1" class="text-right d-none d-md-block">
                                    <v-btn icon variant="text" color="grey" @click="productosStore.EliminarDelCarrito(item.id)">
                                        <XIcon size="20" />
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </v-container>

                <v-container v-else class="text-center py-12">
                    <v-icon size="80" color="grey-lighten-1">mdi-cart-outline</v-icon>
                    <div class="text-h6 mt-4 text-grey">Tu carrito está vacío</div>
                    <v-btn color="primary" class="mt-6" @click="productosStore.cerrarCarrito()">
                        Ir a comprar
                    </v-btn>
                </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-6 bg-grey-lighten-4 flex-column flex-md-row">
                <div class="text-left mb-4 mb-md-0 w-100 w-md-auto">
                    <v-btn variant="text" color="error" prepend-icon="mdi-trash-can-outline" @click="productosStore.VaciarCarrito()" v-if="productosStore.ComprasCarrito.length > 0">
                        Vaciar Carrito
                    </v-btn>
                    <v-btn variant="text" color="primary" prepend-icon="mdi-arrow-left" @click="productosStore.cerrarCarrito()" class="ml-md-2">
                        Volver a la Tienda
                    </v-btn>
                </div>
                
                <v-spacer class="d-none d-md-block"></v-spacer>

                <div class="cart-totals text-right w-100" v-if="productosStore.ComprasCarrito.length > 0">
                    <div class="d-flex justify-space-between justify-md-end mb-2">
                        <span class="text-subtitle-1 mr-4">SUBTOTAL:</span>
                        <span class="text-h6 font-weight-bold text-primary">{{ formatCurrency(productosStore.subtotalCarrito) }}</span>
                    </div>
                    <div class="text-caption text-grey mb-4">Impuestos incluidos. Los gastos de envío se calculan en el pago.</div>
                    
                    <div style="width: 100%;">
                        <v-btn 
                            color="#000000" 
                            theme="dark"
                            height="50"
                            block 
                            tile
                            @click="goToCheckout"
                            class="text-white font-weight-bold"
                            style="background-color: black !important; color: white !important;"
                        >
                            INICIAR PROCESO DE PAGO
                        </v-btn>
                    </div>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.cart-modal {
    border-radius: 8px;
    overflow: hidden;
}

.border-bottom {
    border-bottom: 1px solid #eeeeee;
}

.quantity-control {
    background-color: white;
}

.text-primary {
    color: #ee6f38 !important;
}

/* Transitions */
.v-dialog {
    transition: transform 0.3s ease-out;
}
</style>
