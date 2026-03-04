<template>
    <div class="producto-card" :class="{'en-oferta-card': producto.en_oferta}">
        <!-- Badge for New Item -->
        <div class="badge-nuevo" v-if="esNuevo(producto.createdAt) && !producto.en_oferta">Recién Llegado</div>
        
        <!-- Badge for Offer (takes precedence or can coexist but let's position it nicely) -->
        <div class="badge-oferta" v-if="producto.en_oferta">
            <v-icon size="small" class="mr-1">mdi-star</v-icon>
            {{ producto.dias_oferta || '¡OFERTA!' }}
        </div>

        <img :src="producto.imagenUrl || producto.img || defaultImage" :alt="producto.nombre" class="producto-img">
        
        <div class="info-producto">
            <h3 class="nombre-producto"> {{ producto.nombre }} </h3>
            
            <div class="precio-container">
                <template v-if="producto.en_oferta">
                    <p class="precio-original text-decoration-line-through text-grey-darken-1 mb-0">${{ Number(producto.precio_venta).toLocaleString() }}</p>
                    <p class="precio-oferta text-green-darken-2 font-weight-black text-h6 mb-2">
                        ${{ Number(producto.precio_oferta).toLocaleString() }}
                    </p>
                    <p v-if="producto.informacion_oferta" class="info-oferta-txt text-caption text-orange-darken-3 mb-2 font-weight-medium">
                        {{ producto.informacion_oferta }}
                    </p>
                </template>
                <template v-else>
                    <p class="precio-producto">$ {{ Number(producto.precio_venta).toLocaleString() }} </p>
                </template>
            </div>

            <div class="botonescarta mt-auto">
                <button class="btn-detalles" @click="emitirverDetalles">Ver Detalles</button>
                <button class="btn-carrito" :disabled="!producto.cantidad_publicada || producto.cantidad_publicada <= 0" @click="emitirAgregarCarrito">
                    {{ !producto.cantidad_publicada || producto.cantidad_publicada <= 0 ? 'Agotado' : 'Agregar al carrito' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        producto: {
            type: Object,
            required: true
        }
    })

    const emit = defineEmits(['ver-detalles', 'agregar-carrito'])

    // Imagen por defecto (ruta desde la carpeta public)
    const defaultImage = '/imagenes/logo/logo2.png' 

    const emitirverDetalles = () => {
        emit('ver-detalles', props.producto)
    }

    const emitirAgregarCarrito = () => {
        emit('agregar-carrito', props.producto)
    }

    const esNuevo = (createdAt) => {
        if (!createdAt) return false;
        const fechaProducto = new Date(createdAt);
        const hoy = new Date();
        const diferencia = hoy.getTime() - fechaProducto.getTime();
        const dias = diferencia / (1000 * 3600 * 24);
        return dias <= 5;
    }
</script>

<style scoped>
    .producto-card {
        background: #fff;
        color: #000;
        border-radius: 12px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .en-oferta-card {
        border: 2px solid #ebf4ec; /* Subtle green border */
        box-shadow: 0 4px 15px rgba(46, 125, 50, 0.15); /* Greenish shadow */
    }

    .badge-nuevo {
        position: absolute;
        top: 10px;
        right: -30px;
        background: #ee6f38;
        color: white;
        padding: 5px 35px;
        font-size: 0.7rem;
        font-weight: bold;
        transform: rotate(45deg);
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .badge-oferta {
        position: absolute;
        top: 15px;
        left: -5px;
        background: linear-gradient(45deg, #2e7d32, #4caf50);
        color: white;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: bold;
        border-radius: 0 20px 20px 0;
        z-index: 10;
        box-shadow: 2px 2px 6px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .info-oferta-txt {
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .producto-card:hover {
        transform: scale(1.03);
    }

    .info-producto {
        flex: 1;
        display: flex;
        flex-direction: column;           
    }

    .producto-img {
        width: 160px;
        height: 160px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .nombre-producto {
        font-size: 1.1rem;
        margin: 5px 0;
        font-weight: bold;
    }

    .precio-producto {
        font-size: 1rem;
        color: #1976d2;
        margin-bottom: 10px;
    }

    .botonescarta {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }

    .btn-detalles,
    .btn-carrito {
        padding: 8px;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
    }

    .btn-detalles {
        color: #ee6f38;
        padding: 5px 15px;
        border-radius: 5px;
        align-self: flex-start;
        transition: background-color 0.3s ease;
    }

    .btn-detalles:hover {
        background-color: #ff7043;
        color: white;
        box-shadow: 0 2px 10px rgba(255, 87, 34, 0.4);
    }

    .btn-carrito {
        color: #ee6f38;
        padding: 5px 15px;
        border-radius: 5px;
        align-self: flex-start;
        transition: background-color 0.3s ease;
    }

    .btn-carrito:hover {
        background-color: #ff7043;
        color: white;
        box-shadow: 0 2px 10px rgba(255, 87, 34, 0.4);
    }

    @media (max-width: 768px) {
        .producto-card {
            padding: 10px;
        }

        .producto-img {
            width: 100px;
            height: 100px;
        }

        .nombre-producto {
            font-size: 1rem;
        }

        .precio-producto {
            font-size: 0.9rem;
        }
    }
</style>