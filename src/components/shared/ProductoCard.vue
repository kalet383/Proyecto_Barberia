<template>
    <div class="producto-card">
        <img :src="producto.img" :alt="producto.nombre" class="producto-img">
        <div class="info-producto">
            <h3 class="nombre-producto"> {{ producto.nombre }} </h3>
            <p class="precio-producto">$ {{ producto.precio.toLocaleString() }} </p>
            <div class="botondetalles">
                <button>Ver Detalles</button>
            </div>
            <div class="botonagregarcarrito">
                <button>Agregar al carrito</button>
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
        transform: scale(1.05);
    }

    .info-producto {
        flex: 1;
        display: flex;
        flex-direction: column;           
    }

    .producto-img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 5px;
        margin-right: 15px;
    }

    .nombre-producto {
        font-size: 1.2rem;
        margin: 10px 0;
    }

    .precio-producto {
        font-size: 1rem;
        color: #555;
        margin-bottom: 10px;
    }

    .botondetalles {
        color: #ee6f38;
        padding: 5px 15px;
        border-radius: 5px;
        align-self: flex-start;
        transition: background-color 0.3s ease;
    }

    .botondetalles:hover {
        background-color: #ff7043;
        color: white;
        box-shadow: 0 2px 10px rgba(255, 87, 34, 0.4);
    }

    .botonagregarcarrito {
        color: #ee6f38;
        padding: 5px 15px;
        border-radius: 5px;
        align-self: flex-start;
        transition: background-color 0.3s ease;
    }

    .botonagregarcarrito:hover {
        background-color: #ff7043;
        color: white;
        box-shadow: 0 2px 10px rgba(255, 87, 34, 0.4);
    }

    @media (max-width: 768px) {
        .product-card {
            padding: 8px;
        }

        .product-image {
            width: 50px;
            height: 50px;
        }

        .product-name {
            font-size: 0.9rem;
        }

        .product-price {
            font-size: 0.8rem;
        }

        .product-button {
            padding: 4px 12px;
        }
    }
</style>