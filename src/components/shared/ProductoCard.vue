<template>
    <v-theme-provider theme="PurpleTheme">
        <v-card 
            class="producto-card" 
            :class="{ 'oferta-card': producto.en_oferta }"
            rounded="lg"
            :elevation="hover ? 6 : 1"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
        >
            <!-- Badge Recién Llegado -->
            <v-chip
                v-if="esNuevo(producto.createdAt) && !producto.en_oferta"
                color="#ee6f38"
                size="small"
                label
                class="badge-nuevo"
            >
                <i class="fas fa-star mr-1" style="font-size: 9px;"></i>
                Nuevo
            </v-chip>

            <!-- Badge Oferta -->
            <div v-if="producto.en_oferta" class="badge-oferta">
                <i class="fas fa-bolt mr-1" style="font-size: 10px;"></i>
                {{ producto.dias_oferta || '¡OFERTA!' }}
            </div>

            <!-- ═══ Imagen ═══ -->
            <div class="image-wrapper">
                <v-img 
                    :src="getImageUrl(producto)" 
                    :alt="producto.nombre"
                    :aspect-ratio="1"
                    cover
                    class="product-image"
                >
                    <template v-slot:placeholder>
                        <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
                            <v-progress-circular color="#ee6f38" indeterminate size="28" width="2" />
                        </div>
                    </template>
                </v-img>

                <!-- Descuento sobre imagen -->
                <v-chip
                    v-if="producto.en_oferta && descuento"
                    color="red"
                    size="small"
                    class="discount-badge"
                    label
                >
                    -{{ descuento }}%
                </v-chip>

                <!-- Agotado overlay -->
                <div v-if="estaAgotado" class="agotado-overlay">
                    <span>AGOTADO</span>
                </div>
            </div>

            <!-- ═══ Info ═══ -->
            <v-card-text class="info-section pa-3 pb-1">
                <h3 class="product-name">{{ producto.nombre }}</h3>

                <div class="mt-2">
                    <template v-if="producto.en_oferta">
                        <div class="d-flex align-center ga-2 flex-wrap">
                            <span class="price-offer">${{ Number(producto.precio_oferta).toLocaleString() }}</span>
                            <span class="price-original">${{ Number(producto.precio_venta).toLocaleString() }}</span>
                        </div>
                        <p 
                            v-if="producto.informacion_oferta" 
                            class="text-caption font-weight-medium mt-1 mb-0 offer-info-text"
                            style="color: #e65100;"
                        >
                            {{ producto.informacion_oferta }}
                        </p>
                    </template>
                    <template v-else>
                        <span class="price-normal">${{ Number(producto.precio_venta).toLocaleString() }}</span>
                    </template>
                </div>
            </v-card-text>

            <!-- ═══ Botones ═══ -->
            <v-card-actions class="actions-section px-3 pb-3 pt-1">
                <v-btn
                    variant="text"
                    color="grey-darken-2"
                    size="small"
                    class="text-none font-weight-bold btn-details"
                    rounded="lg"
                    @click.stop="emitirverDetalles"
                >
                    <i class="fas fa-eye mr-1" style="font-size: 11px;"></i>
                    Detalles
                </v-btn>

                <v-spacer />

                <v-btn
                    :color="estaAgotado ? 'grey' : '#ee6f38'"
                    :variant="estaAgotado ? 'tonal' : 'flat'"
                    :disabled="estaAgotado"
                    size="small"
                    class="text-none font-weight-bold btn-cart"
                    rounded="lg"
                    @click.stop="emitirAgregarCarrito"
                >
                    <i :class="estaAgotado ? 'fas fa-ban' : 'fas fa-cart-plus'" class="mr-1" style="font-size: 11px;"></i>
                    {{ estaAgotado ? 'Agotado' : 'Agregar' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-theme-provider>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    producto: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['ver-detalles', 'agregar-carrito'])

const hover = ref(false)
const defaultImage = '/imagenes/logo/logo2.png'

const estaAgotado = computed(() => {
    return !props.producto.cantidad_publicada || props.producto.cantidad_publicada <= 0
})

const descuento = computed(() => {
    if (!props.producto?.en_oferta) return null
    const original = props.producto.precio_venta
    const oferta = props.producto.precio_oferta
    if (original && oferta) return Math.round(((original - oferta) / original) * 100)
    return null
})

const emitirverDetalles = () => {
    emit('ver-detalles', props.producto)
}

const emitirAgregarCarrito = () => {
    if (!estaAgotado.value) {
        emit('agregar-carrito', props.producto)
    }
}

const getImageUrl = (producto) => {
    if (producto.imagenUrl && producto.imagenUrl.trim() !== '' && producto.imagenUrl !== 'imagenur1prueba') {
        return producto.imagenUrl
    }
    if (producto.img && producto.img.trim() !== '') {
        return producto.img
    }
    return defaultImage
}

const esNuevo = (createdAt) => {
    if (!createdAt) return false
    const fechaProducto = new Date(createdAt)
    const hoy = new Date()
    const diferencia = hoy.getTime() - fechaProducto.getTime()
    const dias = diferencia / (1000 * 3600 * 24)
    return dias <= 5
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   CARD
═══════════════════════════════════════ */
.producto-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    overflow: visible;
    border: 1px solid #eee;
    transition: all 0.3s ease;
}

.producto-card:hover {
    transform: translateY(-4px);
    border-color: rgba(238, 111, 56, 0.2);
}

.oferta-card {
    border: 1.5px solid #e8f5e9;
}

.oferta-card:hover {
    border-color: #81c784;
}

/* ═══════════════════════════════════════
   BADGES
═══════════════════════════════════════ */
.badge-nuevo {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 5;
    font-weight: 700 !important;
    font-size: 0.68rem !important;
    letter-spacing: 0.3px;
}

.badge-oferta {
    position: absolute;
    top: 10px;
    left: 0;
    background: linear-gradient(135deg, #2e7d32, #43a047);
    color: white;
    padding: 4px 12px 4px 10px;
    font-size: 0.65rem;
    font-weight: 800;
    border-radius: 0 6px 6px 0;
    z-index: 5;
    box-shadow: 0 2px 6px rgba(46, 125, 50, 0.25);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
}

/* ═══════════════════════════════════════
   IMAGEN
═══════════════════════════════════════ */
.image-wrapper {
    position: relative;
    margin: 10px 10px 0;
    border-radius: 10px;
    overflow: hidden;
    background: #f5f5f5;
}

.product-image {
    transition: transform 0.4s ease;
}

.producto-card:hover .product-image {
    transform: scale(1.05);
}

.discount-badge {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-weight: 800 !important;
    font-size: 0.72rem !important;
    z-index: 3;
}

.agotado-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
}

.agotado-overlay span {
    background: rgba(0, 0, 0, 0.65);
    color: white;
    padding: 5px 16px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1.5px;
}

/* ═══════════════════════════════════════
   INFO
═══════════════════════════════════════ */
.info-section {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: #1a1a2e;
    line-height: 1.3;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ═══════════════════════════════════════
   PRECIOS
═══════════════════════════════════════ */
.price-offer {
    font-size: 1.2rem;
    font-weight: 800;
    color: #2e7d32;
}

.price-original {
    font-size: 0.82rem;
    color: #aaa;
    text-decoration: line-through;
}

.price-normal {
    font-size: 1.2rem;
    font-weight: 800;
    color: #ee6f38;
}

.offer-info-text {
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* ═══════════════════════════════════════
   BOTONES
═══════════════════════════════════════ */
.actions-section {
    margin-top: auto;
}

.btn-details {
    transition: color 0.2s ease !important;
    padding: 0 8px !important;
    min-width: auto !important;
}

.btn-details:hover {
    color: #ee6f38 !important;
}

.btn-cart {
    transition: all 0.2s ease !important;
}

.btn-cart:not(:disabled):hover {
    box-shadow: 0 3px 10px rgba(238, 111, 56, 0.3) !important;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 600px) {
    .image-wrapper {
        margin: 8px 8px 0;
        border-radius: 8px;
    }

    .product-name {
        font-size: 0.85rem;
    }

    .price-offer,
    .price-normal {
        font-size: 1.05rem;
    }

    .badge-oferta {
        font-size: 0.6rem;
        padding: 3px 8px 3px 6px;
    }
}
</style>