<script setup lang="ts">
import { useProductosStore } from '@/stores/useProductosStore';
import { ShoppingCartIcon, XIcon, PlusIcon, MinusIcon, TrashIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';
import { nextTick } from 'vue';

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

const goToStore = async () => {
    productosStore.cerrarCarrito();

    const scrollToProducts = () => {
        const el = document.getElementById('productos-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (router.currentRoute.value.path === '/') {
        await nextTick();
        scrollToProducts();
        return;
    }

    await router.push('/');
    setTimeout(scrollToProducts, 120);
};
</script>

<template>
    <v-dialog 
        v-model="productosStore.carritoAbierto" 
        max-width="1000" 
        scrollable
        transition="dialog-bottom-transition"
    >
        <v-card class="cart-modal elevation-24">
            <!-- Header del Modal -->
            <v-card-title class="cart-header pa-6">
                <div class="d-flex align-center w-100">
                    <div class="header-icon-wrapper mr-3">
                        <ShoppingCartIcon size="32" class="header-icon" />
                    </div>
                    <div class="flex-grow-1">
                        <h2 class="cart-title mb-1">Mi Carrito de Compras</h2>
                        <p class="cart-subtitle mb-0">
                            {{ productosStore.ComprasCarrito.length }} 
                            {{ productosStore.ComprasCarrito.length === 1 ? 'producto' : 'productos' }}
                        </p>
                    </div>
                    <v-btn 
                        icon 
                        variant="text" 
                        class="close-btn"
                        @click="productosStore.cerrarCarrito()"
                    >
                        <XIcon size="28" />
                    </v-btn>
                </div>
            </v-card-title>

            <v-divider class="divider-orange"></v-divider>

            <!-- Contenido del Modal -->
            <v-card-text class="pa-0 cart-content">
                <!-- Carrito con Productos -->
                <div v-if="productosStore.ComprasCarrito.length > 0">
                    <!-- Header de la tabla (Desktop) -->
                    <v-row class="table-header py-3 px-6 ma-0 d-none d-md-flex">
                        <v-col cols="5" class="text-uppercase font-weight-bold">Producto</v-col>
                        <v-col cols="2" class="text-center text-uppercase font-weight-bold">Cantidad</v-col>
                        <v-col cols="2" class="text-center text-uppercase font-weight-bold">Precio</v-col>
                        <v-col cols="2" class="text-center text-uppercase font-weight-bold">Subtotal</v-col>
                        <v-col cols="1" class="text-center"></v-col>
                    </v-row>

                    <!-- Lista de Productos -->
                    <v-list class="pa-0 products-list">
                        <v-list-item 
                            v-for="item in (productosStore.ComprasCarrito as Product[])" 
                            :key="item.id" 
                            class="product-item px-6 py-5"
                        >
                            <v-row align="center" class="ma-0">
                                <!-- Producto Info -->
                                <v-col cols="12" md="5" class="d-flex align-center pa-2">
                                    <div class="product-image-wrapper mr-4">
                                        <v-img 
                                            :src="item.img" 
                                            width="100" 
                                            height="100" 
                                            cover 
                                            class="product-image rounded-lg"
                                        >
                                            <template v-slot:placeholder>
                                                <div class="d-flex align-center justify-center fill-height">
                                                    <v-progress-circular
                                                        color="orange-darken-1"
                                                        indeterminate
                                                    ></v-progress-circular>
                                                </div>
                                            </template>
                                        </v-img>
                                    </div>
                                    <div class="product-info">
                                        <h3 class="product-name mb-2">{{ item.nombre }}</h3>
                                        <!-- Botón Eliminar Mobile -->
                                        <v-btn 
                                            variant="text" 
                                            color="error" 
                                            size="small" 
                                            class="pa-0 d-md-none remove-btn-mobile"
                                            @click="productosStore.EliminarDelCarrito(item.id)"
                                        >
                                            <TrashIcon size="16" class="mr-1" /> 
                                            <span>Eliminar</span>
                                        </v-btn>
                                    </div>
                                </v-col>
                                
                                <!-- Cantidad -->
                                <v-col cols="6" md="2" class="d-flex justify-center align-center pa-2">
                                    <div class="quantity-selector">
                                        <v-btn 
                                            icon 
                                            size="small" 
                                            variant="flat"
                                            class="quantity-btn minus"
                                            @click="productosStore.QuitarUno(item.id)"
                                        >
                                            <MinusIcon size="16" />
                                        </v-btn>
                                        <div class="quantity-value">
                                            {{ item.cantidad }}
                                        </div>
                                        <v-btn 
                                            icon 
                                            size="small" 
                                            variant="flat"
                                            class="quantity-btn plus"
                                            @click="productosStore.AgregaralCarrito(item)"
                                        >
                                            <PlusIcon size="16" />
                                        </v-btn>
                                    </div>
                                </v-col>

                                <!-- Precio Unitario -->
                                <v-col cols="6" md="2" class="text-center pa-2">
                                    <div class="price-unit">
                                        {{ formatCurrency(item.precio) }}
                                    </div>
                                </v-col>

                                <!-- Subtotal -->
                                <v-col cols="6" md="2" class="text-center pa-2">
                                    <div class="price-subtotal">
                                        {{ formatCurrency(item.precio * item.cantidad) }}
                                    </div>
                                </v-col>

                                <!-- Botón Eliminar Desktop -->
                                <v-col cols="6" md="1" class="text-center pa-2 d-none d-md-flex justify-center">
                                    <v-btn 
                                        icon 
                                        variant="text" 
                                        class="remove-btn"
                                        @click="productosStore.EliminarDelCarrito(item.id)"
                                    >
                                        <TrashIcon size="22" />
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </div>

                <!-- Carrito Vacío -->
                <div v-else class="empty-cart-container pa-12 text-center">
                    <div class="empty-cart-icon mb-6">
                        <v-icon size="120" color="#ee6f38">mdi-cart-off</v-icon>
                    </div>
                    <h2 class="empty-cart-title mb-3">Tu carrito está vacío</h2>
                    <p class="empty-cart-text mb-6">
                        ¡Descubre nuestros increíbles productos y añade lo que más te guste!
                    </p>
                    <v-btn 
                        color="#ee6f38" 
                        size="x-large"
                        class="shop-now-btn elevation-4"
                        @click="goToStore"
                    >
                        <ShoppingCartIcon size="20" class="mr-2" />
                        <span class="font-weight-bold">Explorar Productos</span>
                    </v-btn>
                </div>
            </v-card-text>

            <v-divider class="divider-orange"></v-divider>

            <!-- Footer del Modal -->
            <v-card-actions class="cart-footer pa-6" v-if="productosStore.ComprasCarrito.length > 0">
                <v-container fluid class="pa-0">
                    <v-row align="center" class="ma-0">
                        <!-- Botones de Acción Izquierda -->
                        <v-col cols="12" md="6" class="pa-2 d-flex flex-column flex-md-row gap-2">
                            <v-btn 
                                variant="outlined" 
                                color="error"
                                class="action-btn"
                                @click="productosStore.VaciarCarrito()"
                            >
                                <TrashIcon size="18" class="mr-2" />
                                <span>Vaciar Carrito</span>
                            </v-btn>
                            <v-btn 
                                variant="text" 
                                color="#ee6f38"
                                class="action-btn"
                                @click="goToStore"
                            >
                                <v-icon class="mr-2">mdi-arrow-left</v-icon>
                                <span>Seguir Comprando</span>
                            </v-btn>
                        </v-col>

                        <!-- Total y Checkout -->
                        <v-col cols="12" md="6" class="pa-2">
                            <div class="checkout-section">
                                <!-- Total -->
                                <div class="total-row mb-3">
                                    <span class="total-label">TOTAL:</span>
                                    <span class="total-amount">
                                        {{ formatCurrency(productosStore.subtotalCarrito) }}
                                    </span>
                                </div>
                                
                                <!-- Nota de Envío -->
                                <p class="shipping-note mb-4">
                                    *Impuestos incluidos. Los gastos de envío se calculan en el checkout.
                                </p>
                                
                                <!-- Botón Checkout -->
                                <v-btn 
                                    block
                                    size="x-large"
                                    class="checkout-btn elevation-4"
                                    @click="goToCheckout"
                                >
                                    <v-icon class="mr-2">mdi-lock-outline</v-icon>
                                    <span class="font-weight-bold">PROCEDER AL PAGO</span>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
/* =========================
   MODAL PRINCIPAL
   ========================= */
.cart-modal {
    border-radius: 16px !important;
    overflow: hidden;
}

/* =========================
   HEADER
   ========================= */
.cart-header {
    background: linear-gradient(135deg, #ee6f38 0%, #ff8c61 100%);
    color: white;
}

.header-icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 10px;
    backdrop-filter: blur(10px);
}

.header-icon {
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.cart-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin: 0;
}

.cart-subtitle {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
}

.close-btn {
    color: white !important;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: rotate(90deg);
}

.divider-orange {
    border-color: #ee6f38;
    border-width: 2px;
    opacity: 0.3;
}

/* =========================
   CONTENIDO
   ========================= */
.cart-content {
    min-height: 300px;
    max-height: 500px;
    background-color: #fafafa;
}

.table-header {
    background-color: #f5f5f5;
    border-bottom: 2px solid #ee6f38;
    font-size: 0.875rem;
    color: #424242;
    letter-spacing: 0.5px;
}

.products-list {
    background-color: white;
}

.product-item {
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.3s ease;
}

.product-item:hover {
    background-color: #fff8f5;
    transform: translateX(4px);
}

.product-item:last-child {
    border-bottom: none;
}

/* =========================
   PRODUCTO
   ========================= */
.product-image-wrapper {
    flex-shrink: 0;
}

.product-image {
    border: 2px solid #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.product-item:hover .product-image {
    border-color: #ee6f38;
    box-shadow: 0 4px 12px rgba(238, 111, 56, 0.3);
}

.product-info {
    flex-grow: 1;
}

.product-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #212121;
    line-height: 1.4;
    margin: 0;
}

.remove-btn-mobile {
    text-transform: none;
    font-size: 0.85rem;
}

/* =========================
   CANTIDAD
   ========================= */
.quantity-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f5f5f5;
    border-radius: 50px;
    padding: 4px;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.quantity-btn {
    background: white !important;
    color: #ee6f38 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease;
}

.quantity-btn:hover {
    background: #ee6f38 !important;
    color: white !important;
    transform: scale(1.1);
}

.quantity-value {
    font-weight: 700;
    font-size: 1.1rem;
    color: #212121;
    min-width: 35px;
    text-align: center;
}

/* =========================
   PRECIOS
   ========================= */
.price-unit {
    font-size: 1rem;
    font-weight: 500;
    color: #616161;
}

.price-subtotal {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ee6f38;
    text-shadow: 0 1px 2px rgba(238, 111, 56, 0.2);
}

.remove-btn {
    color: #9e9e9e !important;
    transition: all 0.3s ease;
}

.remove-btn:hover {
    color: #f44336 !important;
    background: rgba(244, 67, 54, 0.1) !important;
    transform: rotate(90deg) scale(1.1);
}

/* =========================
   CARRITO VACÍO
   ========================= */
.empty-cart-container {
    background: linear-gradient(135deg, #fff 0%, #fff8f5 100%);
}

.empty-cart-icon {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.empty-cart-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #424242;
}

.empty-cart-text {
    font-size: 1.05rem;
    color: #757575;
    max-width: 400px;
    margin: 0 auto;
}

.shop-now-btn {
    background: linear-gradient(135deg, #ee6f38 0%, #ff8c61 100%) !important;
    color: white !important;
    border-radius: 50px;
    text-transform: none;
    font-size: 1.1rem;
    padding: 24px 48px !important;
    transition: all 0.3s ease;
}

.shop-now-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(238, 111, 56, 0.4) !important;
}

/* =========================
   FOOTER
   ========================= */
.cart-footer {
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    border-top: 2px solid #f5f5f5;
}

.action-btn {
    text-transform: none;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.action-btn:hover {
    transform: translateY(-2px);
}

.checkout-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    border: 2px solid #ee6f38;
    box-shadow: 0 4px 12px rgba(238, 111, 56, 0.15);
}

.total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 2px dashed #ee6f38;
}

.total-label {
    font-size: 1.25rem;
    font-weight: 700;
    color: #424242;
    letter-spacing: 1px;
}

.total-amount {
    font-size: 2rem;
    font-weight: 800;
    color: #ee6f38;
    text-shadow: 0 2px 4px rgba(238, 111, 56, 0.2);
}

.shipping-note {
    font-size: 0.85rem;
    color: #757575;
    text-align: center;
    font-style: italic;
    margin: 0;
}

.checkout-btn {
    background: #000000 !important;
    color: white !important;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
}

.checkout-btn:hover {
    background: #ee6f38 !important;
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

/* =========================
   RESPONSIVE
   ========================= */
@media (max-width: 960px) {
    .cart-title {
        font-size: 1.4rem;
    }

    .cart-subtitle {
        font-size: 0.85rem;
    }

    .product-name {
        font-size: 1rem;
    }

    .total-amount {
        font-size: 1.5rem;
    }

    .checkout-section {
        padding: 16px;
    }
}

@media (max-width: 600px) {
    .product-image {
        width: 80px;
        height: 80px;
    }

    .empty-cart-icon {
        font-size: 80px !important;
    }

    .shop-now-btn {
        padding: 20px 32px !important;
        font-size: 1rem;
    }
}
</style>