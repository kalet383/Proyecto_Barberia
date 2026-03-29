<script setup lang="ts">
import { useProductosStore } from '@/stores/useProductosStore';
import { ShoppingCartIcon, XIcon, PlusIcon, MinusIcon, TrashIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';
import { nextTick, computed } from 'vue';

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

const subtotalAnimado = computed(() => productosStore.subtotalCarrito);

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
        max-width="820" 
        scrollable
        transition="dialog-bottom-transition"
        :z-index="10000"
    >
        <v-theme-provider theme="PurpleTheme">
            <v-card class="cart-modal rounded-xl">
                <!-- ═══════════════════════════════════════
                     HEADER
                ═══════════════════════════════════════ -->
                <div class="cart-header">
                    <div class="header-pattern"></div>
                    <div class="d-flex align-center justify-space-between position-relative" style="z-index: 1;">
                        <div class="d-flex align-center ga-3">
                            <div class="header-icon-box">
                                <ShoppingCartIcon size="24" stroke-width="2" />
                            </div>
                            <div>
                                <h2 class="text-white font-weight-bold" style="font-size: 1.25rem; line-height: 1.2;">
                                    Mi Carrito
                                </h2>
                                <p class="mb-0" style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">
                                    <span style="color: #ff9a6c; font-weight: 700;">
                                        {{ productosStore.ComprasCarrito.length }}
                                    </span>
                                    {{ productosStore.ComprasCarrito.length === 1 ? 'producto' : 'productos' }}
                                </p>
                            </div>
                        </div>
                        <v-btn 
                            icon 
                            variant="tonal" 
                            size="small"
                            class="close-btn"
                            @click="productosStore.cerrarCarrito()"
                        >
                            <XIcon size="20" stroke-width="2.5" />
                        </v-btn>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════
                     CONTENIDO
                ═══════════════════════════════════════ -->
                <v-card-text class="cart-content pa-0">
                    <!-- ════════ CON PRODUCTOS ════════ -->
                    <div v-if="productosStore.ComprasCarrito.length > 0" class="pa-4 pa-md-5">
                        <div class="products-list">
                            <transition-group name="product-anim" tag="div" class="d-flex flex-column" style="gap: 14px;">
                                <v-card
                                    v-for="item in (productosStore.ComprasCarrito as Product[])" 
                                    :key="item.id"
                                    variant="outlined"
                                    rounded="xl"
                                    class="product-card"
                                >
                                    <v-row no-gutters align="center">
                                        <!-- Imagen -->
                                        <v-col cols="3" sm="2" class="pa-3">
                                            <v-img 
                                                :src="item.img" 
                                                :aspect-ratio="1"
                                                cover 
                                                class="product-img rounded-lg"
                                            >
                                                <template v-slot:placeholder>
                                                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                                                        <v-progress-circular color="#ee6f38" indeterminate size="20" width="2" />
                                                    </div>
                                                </template>
                                            </v-img>
                                        </v-col>

                                        <!-- Info del producto -->
                                        <v-col cols="9" sm="4" class="pa-3 pl-1">
                                            <h3 class="product-name">{{ item.nombre }}</h3>
                                            <p class="text-caption text-medium-emphasis mb-0 mt-1">
                                                {{ formatCurrency(item.precio) }} c/u
                                            </p>
                                            <!-- Subtotal visible en mobile -->
                                            <p class="d-sm-none mb-0 mt-1 font-weight-bold" style="color: #ee6f38; font-size: 1rem;">
                                                {{ formatCurrency(item.precio * item.cantidad) }}
                                            </p>
                                        </v-col>

                                        <!-- Cantidad -->
                                        <v-col cols="6" sm="3" class="pa-3 d-flex justify-center">
                                            <div class="quantity-control">
                                                <v-btn 
                                                    icon 
                                                    size="x-small" 
                                                    variant="tonal"
                                                    color="grey-darken-1"
                                                    :disabled="item.cantidad <= 1"
                                                    @click="productosStore.QuitarUno(item.id)"
                                                    class="qty-btn"
                                                >
                                                    <MinusIcon size="14" stroke-width="2.5" />
                                                </v-btn>
                                                <span class="qty-value">{{ item.cantidad }}</span>
                                                <v-btn 
                                                    icon 
                                                    size="x-small" 
                                                    variant="tonal"
                                                    color="orange-darken-1"
                                                    @click="productosStore.AgregaralCarrito(item)"
                                                    class="qty-btn"
                                                >
                                                    <PlusIcon size="14" stroke-width="2.5" />
                                                </v-btn>
                                            </div>
                                        </v-col>

                                        <!-- Subtotal desktop -->
                                        <v-col cols="3" sm="2" class="pa-3 text-center d-none d-sm-flex align-center justify-center">
                                            <span class="product-subtotal">
                                                {{ formatCurrency(item.precio * item.cantidad) }}
                                            </span>
                                        </v-col>

                                        <!-- Eliminar -->
                                        <v-col cols="6" sm="1" class="pa-3 d-flex justify-center align-center">
                                            <v-btn 
                                                icon 
                                                size="small" 
                                                variant="text"
                                                class="remove-btn"
                                                @click="productosStore.EliminarDelCarrito(item.id)"
                                            >
                                                <TrashIcon size="18" stroke-width="2" />
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </transition-group>
                        </div>
                    </div>

                    <!-- ════════ CARRITO VACÍO ════════ -->
                    <div v-else class="empty-cart">
                        <div class="empty-visual">
                            <div class="empty-circle">
                                <ShoppingCartIcon size="48" stroke-width="1.5" />
                            </div>
                        </div>
                        <h2 class="text-h6 font-weight-bold mb-2">Tu carrito está vacío</h2>
                        <p class="text-body-2 text-medium-emphasis mb-6" style="max-width: 280px;">
                            Explora nuestra tienda y descubre productos increíbles
                        </p>
                        <v-btn 
                            color="#ee6f38" 
                            rounded="lg" 
                            size="large"
                            class="text-none font-weight-bold explore-btn"
                            elevation="3"
                            @click="goToStore"
                        >
                            <i class="fas fa-store mr-2"></i>
                            Explorar Productos
                        </v-btn>
                    </div>
                </v-card-text>

                <!-- ═══════════════════════════════════════
                     FOOTER
                ═══════════════════════════════════════ -->
                <div v-if="productosStore.ComprasCarrito.length > 0" class="cart-footer">
                    <!-- Acciones secundarias -->
                    <div class="d-flex align-center justify-space-between mb-4 pb-3" style="border-bottom: 1px dashed #e0e0e0;">
                        <v-btn 
                            variant="text" 
                            color="grey-darken-1" 
                            size="small" 
                            class="text-none font-weight-medium"
                            @click="goToStore"
                        >
                            <i class="fas fa-arrow-left mr-2"></i>
                            Seguir comprando
                        </v-btn>
                        <v-btn 
                            variant="text" 
                            color="red-darken-1" 
                            size="small" 
                            class="text-none font-weight-medium"
                            @click="productosStore.VaciarCarrito()"
                        >
                            <TrashIcon size="14" class="mr-1" />
                            Vaciar
                        </v-btn>
                    </div>

                    <!-- Resumen -->
                    <v-card variant="flat" class="checkout-card rounded-xl" color="grey-lighten-5">
                        <v-card-text class="pa-4">
                            <!-- Subtotal -->
                            <div class="d-flex justify-space-between align-center mb-2">
                                <span class="text-body-2 text-medium-emphasis">Subtotal</span>
                                <span class="text-body-2 font-weight-bold">{{ formatCurrency(subtotalAnimado) }}</span>
                            </div>
                            <!-- Envío -->
                            <div class="d-flex justify-space-between align-center mb-3">
                                <span class="text-body-2 text-medium-emphasis">Envío</span>
                                <span class="text-caption text-medium-emphasis font-italic">Calcular al pagar</span>
                            </div>

                            <v-divider class="mb-3" />

                            <!-- Total -->
                            <div class="d-flex justify-space-between align-center mb-4">
                                <span class="text-subtitle-1 font-weight-bold text-uppercase" style="letter-spacing: 0.5px;">
                                    Total
                                </span>
                                <span class="total-price">{{ formatCurrency(subtotalAnimado) }}</span>
                            </div>

                            <!-- Botón pagar -->
                            <v-btn 
                                block 
                                size="x-large" 
                                class="checkout-btn text-none font-weight-bold"
                                elevation="3"
                                @click="goToCheckout"
                            >
                                <i class="fas fa-lock mr-2" style="font-size: 14px;"></i>
                                Proceder al pago
                                <i class="fas fa-arrow-right ml-2" style="font-size: 14px;"></i>
                            </v-btn>

                            <!-- Nota seguridad -->
                            <p class="text-center text-caption text-medium-emphasis mt-3 mb-0">
                                <i class="fas fa-shield-alt mr-1" style="color: #ee6f38;"></i>
                                Pago 100% seguro · Envío a toda Colombia
                            </p>
                        </v-card-text>
                    </v-card>
                </div>
            </v-card>
        </v-theme-provider>
    </v-dialog>
</template>

<style scoped>
/* ═══════════════════════════════════════
   MODAL BASE
═══════════════════════════════════════ */
.cart-modal {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.28) !important;
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.cart-header {
    position: relative;
    background: linear-gradient(135deg, #1a1a2e, #252540);
    padding: 18px 22px;
    overflow: hidden;
    flex-shrink: 0;
}

.header-pattern {
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(circle at 15% 50%, rgba(238, 111, 56, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 85% 80%, rgba(238, 111, 56, 0.08) 0%, transparent 40%);
    pointer-events: none;
}

.header-icon-box {
    width: 46px;
    height: 46px;
    border-radius: 13px;
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 14px rgba(238, 111, 56, 0.3);
    flex-shrink: 0;
}

.close-btn {
    background: rgba(255, 255, 255, 0.12) !important;
    color: rgba(255, 255, 255, 0.7) !important;
    transition: all 0.25s ease !important;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    color: white !important;
    transform: rotate(90deg);
}

/* ═══════════════════════════════════════
   CONTENIDO
═══════════════════════════════════════ */
.cart-content {
    flex: 1;
    overflow-y: auto;
    background: #f7f7f8;
}

/* Scrollbar */
.cart-content::-webkit-scrollbar { width: 5px; }
.cart-content::-webkit-scrollbar-track { background: transparent; }
.cart-content::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ee6f38, #ff9a6c);
    border-radius: 10px;
}

/* ═══════════════════════════════════════
   PRODUCT CARDS — HORIZONTAL
═══════════════════════════════════════ */
.product-card {
    border-color: #eee !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
}

.product-card:hover {
    border-color: #ee6f38 !important;
    box-shadow: 0 6px 24px rgba(238, 111, 56, 0.15) !important;
    transform: translateY(-2px);
}

.product-img {
    border: 2px solid #f0f0f0;
    transition: border-color 0.3s ease;
}

.product-card:hover .product-img {
    border-color: #ee6f38;
}

.product-name {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ═══════════════════════════════════════
   CANTIDAD
═══════════════════════════════════════ */
.quantity-control {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #f5f5f5;
    border-radius: 12px;
    padding: 4px 6px;
    border: 1px solid #e8e8e8;
}

.qty-btn {
    transition: transform 0.2s ease !important;
}

.qty-btn:hover {
    transform: scale(1.1);
}

.qty-value {
    min-width: 32px;
    text-align: center;
    font-weight: 800;
    font-size: 1rem;
    color: #1a1a2e;
    user-select: none;
}

/* ═══════════════════════════════════════
   SUBTOTAL Y ELIMINAR
═══════════════════════════════════════ */
.product-subtotal {
    font-size: 1.05rem;
    font-weight: 800;
    color: #ee6f38;
    white-space: nowrap;
}

.remove-btn {
    color: #bbb !important;
    transition: all 0.25s ease !important;
}

.remove-btn:hover {
    color: #ef4444 !important;
    background: rgba(239, 68, 68, 0.08) !important;
    transform: scale(1.15);
}

/* ═══════════════════════════════════════
   CARRITO VACÍO
═══════════════════════════════════════ */
.empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 52px 28px;
    min-height: 360px;
    background: linear-gradient(180deg, #f7f7f8 0%, #fff5f0 100%);
}

.empty-visual {
    margin-bottom: 20px;
}

.empty-circle {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff5f0, #ffe8dc);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ee6f38;
    opacity: 0.8;
    animation: floatCart 3.5s ease-in-out infinite;
}

@keyframes floatCart {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.explore-btn {
    box-shadow: 0 6px 20px rgba(238, 111, 56, 0.3) !important;
    transition: all 0.3s ease !important;
    letter-spacing: 0.5px;
}

.explore-btn:hover {
    transform: translateY(-3px) !important;
    box-shadow: 0 10px 30px rgba(238, 111, 56, 0.4) !important;
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
.cart-footer {
    background: white;
    border-top: 1px solid #eee;
    padding: 16px 20px 20px;
    flex-shrink: 0;
}

.checkout-card {
    border: 1px solid #e8e8e8 !important;
}

.total-price {
    font-size: 1.55rem;
    font-weight: 800;
    color: #ee6f38;
    letter-spacing: -0.5px;
}

.checkout-btn {
    background: linear-gradient(135deg, #1a1a2e, #2d2d4a) !important;
    color: white !important;
    border-radius: 14px !important;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.checkout-btn:hover {
    background: linear-gradient(135deg, #ee6f38, #d4561f) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(238, 111, 56, 0.35) !important;
}

/* ═══════════════════════════════════════
   ANIMACIONES DE ITEMS
═══════════════════════════════════════ */
.product-anim-enter-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.product-anim-leave-active {
    transition: all 0.25s ease;
}
.product-anim-enter-from {
    opacity: 0;
    transform: translateX(-16px);
}
.product-anim-leave-to {
    opacity: 0;
    transform: translateX(16px) scale(0.96);
}
.product-anim-move {
    transition: transform 0.35s ease;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 600px) {
    .cart-modal {
        border-radius: 20px 20px 0 0 !important;
        max-height: 88vh;
    }

    .cart-header {
        padding: 14px 16px;
    }

    .header-icon-box {
        width: 40px;
        height: 40px;
        border-radius: 11px;
    }

    .product-name {
        font-size: 0.85rem;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .product-subtotal {
        font-size: 0.95rem;
    }

    .quantity-control {
        padding: 3px 5px;
    }

    .qty-value {
        min-width: 28px;
        font-size: 0.9rem;
    }

    .total-price {
        font-size: 1.3rem;
    }

    .cart-footer {
        padding: 14px 16px 16px;
    }

    .empty-cart {
        padding: 36px 20px;
        min-height: 300px;
    }

    .empty-circle {
        width: 90px;
        height: 90px;
    }

    .empty-circle svg {
        width: 38px;
        height: 38px;
    }
}

@media (min-width: 601px) and (max-width: 959px) {
    .product-name {
        font-size: 0.9rem;
    }
}

@media (min-width: 1200px) {
    .cart-modal {
        max-height: 82vh;
    }

    .cart-header {
        padding: 22px 26px;
    }

    .product-name {
        font-size: 1rem;
    }

    .product-subtotal {
        font-size: 1.1rem;
    }

    .total-price {
        font-size: 1.7rem;
    }
}
</style>