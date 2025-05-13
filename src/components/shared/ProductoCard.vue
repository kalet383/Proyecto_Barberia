<template>
    <div class="producto-card">
        <img :src="producto.img || defaultImage" :alt="producto.nombre" class="producto-img">
        <div class="info-producto">
            <h3 class="nombre-producto"> {{ producto.nombre }} </h3>
            <p class="precio-producto">$ {{ producto.precio.toLocaleString() }} </p>
            <div class="botonescarta">
                <button class="btn-detalles">Ver Detalles</button>
                <button class="btn-carrito">Agregar al carrito</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name : 'ProductoCard',
    props : {
        producto : {
            type : Object,
            required : true
        }
    }
}
</script>

<style scoped>
    .producto-card {
        background: #fff;
        color: #000;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
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