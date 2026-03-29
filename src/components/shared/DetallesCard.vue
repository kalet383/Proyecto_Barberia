<template>
    <v-dialog 
        :model-value="mostrarDetalles" 
        @update:model-value="onDialogToggle" 
        max-width="950"
        scrollable
        transition="dialog-bottom-transition"
    >
        <v-theme-provider theme="PurpleTheme">
            <v-card class="detalle-modal rounded-xl">
                <!-- Botón cerrar flotante -->
                <v-btn
                    icon
                    variant="tonal"
                    size="small"
                    class="close-btn"
                    @click="cerrarDetalles"
                >
                    <i class="fas fa-times"></i>
                </v-btn>

                <v-card-text class="pa-0 modal-body">
                    <v-row no-gutters>
                        <!-- ═══════ COLUMNA IMAGEN ═══════ -->
                        <v-col cols="12" md="5">
                            <div class="image-section">
                                <!-- Badge descuento -->
                                <v-chip
                                    v-if="productoSeleccionado?.en_oferta && descuento"
                                    color="red"
                                    size="small"
                                    class="discount-chip"
                                    label
                                >
                                    <i class="fas fa-bolt mr-1" style="font-size: 10px;"></i>
                                    -{{ descuento }}%
                                </v-chip>

                                <v-img 
                                    :src="productoSeleccionado?.imagenUrl || productoSeleccionado?.img || '/imagenes/logo/logo2.png'" 
                                    :aspect-ratio="1"
                                    cover
                                    class="product-image rounded-lg"
                                >
                                    <template v-slot:placeholder>
                                        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                                            <v-progress-circular color="#ee6f38" indeterminate />
                                        </div>
                                    </template>
                                </v-img>
                            </div>
                        </v-col>

                        <!-- ═══════ COLUMNA INFO ═══════ -->
                        <v-col cols="12" md="7">
                            <div class="info-section">
                                <!-- Título -->
                                <h2 class="product-title">{{ productoSeleccionado?.nombre }}</h2>

                                <!-- ═══ Precio ═══ -->
                                <div class="my-4" v-if="productoSeleccionado">
                                    <!-- Con oferta -->
                                    <template v-if="productoSeleccionado.en_oferta">
                                        <v-alert
                                            border="start"
                                            border-color="success"
                                            color="green-lighten-5"
                                            density="compact"
                                            class="mb-3"
                                            rounded="lg"
                                        >
                                            <div class="d-flex align-center">
                                                <v-icon color="success" size="small" class="mr-2">mdi-sale</v-icon>
                                                <div>
                                                    <span class="text-caption font-weight-bold text-success text-uppercase">
                                                        {{ productoSeleccionado.dias_oferta || 'OFERTA ESPECIAL' }}
                                                    </span>
                                                    <p 
                                                        v-if="productoSeleccionado.informacion_oferta" 
                                                        class="text-caption text-grey-darken-1 mb-0"
                                                    >
                                                        {{ productoSeleccionado.informacion_oferta }}
                                                    </p>
                                                </div>
                                            </div>
                                        </v-alert>

                                        <div class="d-flex align-end ga-3 flex-wrap">
                                            <span class="price-offer">
                                                ${{ Number(productoSeleccionado.precio_oferta).toLocaleString() }}
                                            </span>
                                            <span class="price-original">
                                                ${{ Number(productoSeleccionado.precio_venta).toLocaleString() }}
                                            </span>
                                            <v-chip 
                                                color="green" 
                                                size="x-small" 
                                                variant="tonal"
                                                label
                                            >
                                                Ahorras ${{ (productoSeleccionado.precio_venta - productoSeleccionado.precio_oferta).toLocaleString() }}
                                            </v-chip>
                                        </div>
                                    </template>

                                    <!-- Sin oferta -->
                                    <template v-else>
                                        <span class="price-normal">
                                            ${{ Number(productoSeleccionado?.precio_venta).toLocaleString() }}
                                        </span>
                                    </template>
                                </div>

                                <!-- Descripción -->
                                <p class="text-body-2 text-grey-darken-2" style="line-height: 1.65;">
                                    {{ productoSeleccionado?.descripcion || productoSeleccionado?.resumen }}
                                </p>

                                <v-divider class="my-4" />

                                <!-- ═══ Detalles del producto ═══ -->
                                <div class="details-section">
                                    <!-- Ingredientes -->
                                    <div class="detail-block" v-if="productoSeleccionado?.ingredientes">
                                        <div class="detail-label">
                                            <div class="detail-icon-box">
                                                <i class="fas fa-flask"></i>
                                            </div>
                                            <h4>Ingredientes</h4>
                                        </div>
                                        <p class="detail-text">{{ productoSeleccionado?.ingredientes }}</p>
                                    </div>

                                    <!-- Modo de uso -->
                                    <div class="detail-block" v-if="productoSeleccionado?.modo_uso">
                                        <div class="detail-label">
                                            <div class="detail-icon-box">
                                                <i class="fas fa-hand-sparkles"></i>
                                            </div>
                                            <h4>Modo de uso</h4>
                                        </div>
                                        <p class="detail-text">{{ productoSeleccionado?.modo_uso }}</p>
                                    </div>

                                    <!-- Presentación -->
                                    <div class="detail-block" v-if="productoSeleccionado?.cantidades">
                                        <div class="detail-label">
                                            <div class="detail-icon-box">
                                                <i class="fas fa-box-open"></i>
                                            </div>
                                            <h4>Presentación</h4>
                                        </div>
                                        <p class="detail-text">{{ productoSeleccionado?.cantidades }}</p>
                                    </div>

                                    <!-- Beneficios -->
                                    <div class="detail-block" v-if="productoSeleccionado?.beneficios?.length">
                                        <div class="detail-label">
                                            <div class="detail-icon-box">
                                                <i class="fas fa-star"></i>
                                            </div>
                                            <h4>Beneficios</h4>
                                        </div>
                                        <ul class="benefits-list">
                                            <li v-for="(beneficio, i) in productoSeleccionado?.beneficios" :key="i">
                                                <i class="fas fa-check"></i>
                                                {{ beneficio }}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <!-- ═══════ FOOTER ═══════ -->
                <v-card-actions class="modal-footer pa-4">
                    <v-btn 
                        variant="outlined" 
                        color="grey-darken-1" 
                        rounded="lg"
                        class="text-none font-weight-medium"
                        @click="cerrarDetalles"
                    >
                        <i class="fas fa-arrow-left mr-2" style="font-size: 12px;"></i>
                        Volver
                    </v-btn>

                    <v-spacer />

                    <v-btn 
                        color="#ee6f38" 
                        rounded="lg"
                        size="large"
                        class="text-none font-weight-bold add-cart-btn"
                        elevation="3"
                        @click="agregarAlCarrito"
                    >
                        <i class="fas fa-shopping-cart mr-2" style="font-size: 14px;"></i>
                        Agregar al carrito
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-theme-provider>
    </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductosStore } from '@/stores/useProductosStore'

const productosStore = useProductosStore()
const { mostrarDetalles, productoSeleccionado: productFromStore } = storeToRefs(productosStore)
const { cerrarDetalles, AgregaralCarrito } = productosStore

// Estado local para evitar que la imagen parpadee (se cambie al logo) durante la transición de cierre
const productoSeleccionado = ref(null)

watch(productFromStore, (newVal) => {
    if (newVal) {
        productoSeleccionado.value = newVal
    }
}, { immediate: true })

const descuento = computed(() => {
    if (!productoSeleccionado.value?.en_oferta) return null
    const original = productoSeleccionado.value.precio_venta
    const oferta = productoSeleccionado.value.precio_oferta
    if (original && oferta) return Math.round(((original - oferta) / original) * 100)
    return null
})

const onDialogToggle = (val) => {
    if (!val) cerrarDetalles()
}

const agregarAlCarrito = () => {
    if (productoSeleccionado.value) {
        AgregaralCarrito(productoSeleccionado.value)
        cerrarDetalles()
    }
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   MODAL BASE
═══════════════════════════════════════ */
.detalle-modal {
    overflow: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar { width: 5px; }
.modal-body::-webkit-scrollbar-track { background: transparent; }
.modal-body::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #ee6f38, #ff9a6c);
    border-radius: 10px;
}

/* Botón cerrar */
.close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9) !important;
    color: #666 !important;
    backdrop-filter: blur(8px);
    transition: all 0.25s ease !important;
}

.close-btn:hover {
    background: #ee6f38 !important;
    color: white !important;
    transform: rotate(90deg);
}

/* ═══════════════════════════════════════
   IMAGEN
═══════════════════════════════════════ */
.image-section {
    position: relative;
    padding: 20px;
    background: #f8f8f8;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-image {
    border: 1px solid #eee;
    transition: transform 0.4s ease;
}

.product-image:hover {
    transform: scale(1.03);
}

.discount-chip {
    position: absolute;
    top: 28px;
    left: 28px;
    z-index: 5;
    font-weight: 800;
    letter-spacing: 0.5px;
}

/* ═══════════════════════════════════════
   INFO
═══════════════════════════════════════ */
.info-section {
    padding: 28px 28px 16px;
}

.product-title {
    font-size: 1.55rem;
    font-weight: 800;
    color: #1a1a2e;
    line-height: 1.25;
    letter-spacing: -0.3px;
    margin: 0;
}

/* ═══════════════════════════════════════
   PRECIOS
═══════════════════════════════════════ */
.price-offer {
    font-size: 1.85rem;
    font-weight: 800;
    color: #15803d;
    letter-spacing: -0.5px;
}

.price-original {
    font-size: 1.05rem;
    font-weight: 500;
    color: #999;
    text-decoration: line-through;
    margin-bottom: 4px;
}

.price-normal {
    font-size: 1.85rem;
    font-weight: 800;
    color: #ee6f38;
    letter-spacing: -0.5px;
}

/* ═══════════════════════════════════════
   DETALLES DEL PRODUCTO
═══════════════════════════════════════ */
.details-section {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.detail-block {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.detail-label {
    display: flex;
    align-items: center;
    gap: 10px;
}

.detail-icon-box {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(238, 111, 56, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ee6f38;
    font-size: 13px;
    flex-shrink: 0;
}

.detail-label h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
}

.detail-text {
    font-size: 0.88rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
    padding-left: 40px;
}

/* Beneficios */
.benefits-list {
    list-style: none;
    padding: 0 0 0 40px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.benefits-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 0.88rem;
    color: #555;
    line-height: 1.5;
}

.benefits-list li i {
    color: #22c55e;
    font-size: 11px;
    margin-top: 5px;
    flex-shrink: 0;
}

/* ═══════════════════════════════════════
   FOOTER
═══════════════════════════════════════ */
.modal-footer {
    border-top: 1px solid #eee;
    background: #fafafa;
    flex-shrink: 0;
}

.add-cart-btn {
    box-shadow: 0 4px 16px rgba(238, 111, 56, 0.3) !important;
    transition: all 0.3s ease !important;
    letter-spacing: 0.3px;
}

.add-cart-btn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 8px 24px rgba(238, 111, 56, 0.4) !important;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 960px) {
    .image-section {
        padding: 16px;
        max-height: 350px;
    }

    .info-section {
        padding: 20px;
    }

    .product-title {
        font-size: 1.3rem;
    }

    .price-offer,
    .price-normal {
        font-size: 1.5rem;
    }

    .detail-text,
    .benefits-list {
        padding-left: 40px;
    }
}

@media (max-width: 600px) {
    .detalle-modal {
        border-radius: 20px 20px 0 0 !important;
        max-height: 92vh;
    }

    .image-section {
        padding: 12px;
        max-height: 280px;
    }

    .info-section {
        padding: 16px;
    }

    .product-title {
        font-size: 1.2rem;
        padding-right: 30px;
    }

    .price-offer,
    .price-normal {
        font-size: 1.35rem;
    }

    .price-original {
        font-size: 0.95rem;
    }

    .detail-icon-box {
        width: 26px;
        height: 26px;
        font-size: 11px;
    }

    .detail-label h4 {
        font-size: 0.85rem;
    }

    .detail-text {
        padding-left: 36px;
        font-size: 0.82rem;
    }

    .benefits-list {
        padding-left: 36px;
    }

    .benefits-list li {
        font-size: 0.82rem;
    }

    .modal-footer {
        flex-wrap: wrap;
        gap: 8px;
    }

    .add-cart-btn {
        flex: 1;
    }
}
</style>