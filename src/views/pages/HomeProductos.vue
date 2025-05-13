<template>
    <section id="productos-section" class="v-container">
        <h2 class="tituloprincipal">PRODUCTOS QUE NECESITAS | Los mas top</h2>

        <!-- Tabs para las categorías -->
        <v-tabs v-model="Tabactivado" centered background-color="transparent" color="black">
            <v-tab v-for="(categoria, index) in categorias" :key="index" class="tab-categoria">
                {{ categoria.nombre }}
            </v-tab>
        </v-tabs>

        <!-- Contenido de las pestañas -->
        <v-window v-model="Tabactivado">
            <v-window-item v-for="(categoria, index) in categorias" :key="index">
                <div class="productos-grid">
                    <ProductoCard v-for="producto in categoria.productos" :key="producto.id" :producto="producto"></ProductoCard>
                </div>
            </v-window-item>
        </v-window>
    </section>
</template>

<script>
    import ProductoCard from '@/components/shared/ProductoCard.vue';
    export default {
        name : 'HomeProductos',
        components : {
            ProductoCard
        },
        data() {
            return {
                Tabactivado : 0, // Pestaña activa por defecto
                categorias : [
                    {
                        id : 1,
                        nombre : 'CABELLO',
                        productos : [
                            {id : 1, nombre : 'Gel cabello', precio : 12000, img : ''},
                            {id : 2, nombre : 'Cera para peinar', precio : 15000, img : ''},
                            {id : 3, nombre : 'Polvo fijador de cabello', precio : 28000, img : ''}
                        ]
                    },
                    {
                        id : 2,
                        nombre : 'BARBA',
                        productos : [
                            {id : 4, nombre : 'Aceite para barba', precio : 20000, img : ''},
                            {id : 5, nombre : 'Tinte negro para barba', precio : 25000, img : ''}
                        ]
                    },
                    {
                        id : 3,
                        nombre : 'ROSTRO',
                        productos : [
                            {id : 6, nombre : 'Mascarilla Exfoliante', precio : 7000, img : ''},
                            {id : 7, nombre : 'Crema Hidratante Facial', precio : 22000, img : ''}
                        ]
                    },
                    {
                        id : 4,
                        nombre : 'ARTICULOS',
                        productos : [
                            {id : 8, nombre : 'Peine Profesional', precio : 20000, img : ''},
                            {id : 9, nombre : 'Set de Cuchillas', precio : 30000, img : ''}
                        ]
                    }
                ]
            };
        },
    }
</script>

<style scoped>
    .tituloprincipal {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 30px;
        font-weight: bold;
        margin-top: 2%;
    }

    .tituloprincipal::after {
        content: '';
        display: block;
        width: 300px;
        height: 4px;
        margin: 8px auto 0 auto;
        background: linear-gradient(to right, #000, #fff, #000);
        border-radius: 2px;
        background-size: 200%;
        animation: animateGradient 3s linear infinite;
    }

    @keyframes animateGradient {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: 0 0;
        }
    }

    .v-container {
        width: 100%;
        padding: 20px;
    }

    .tab-categoria {
        font-weight: bold;
        margin: 0 10px;
        font-size: 1rem;
        letter-spacing: 1px;
    }

    .tab-categoria:hover {
        color: #ee6f38;
    }

    .productos-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 24px;
        padding: 24px 12px;
        margin-top: 22px;
    }

    @media (max-width: 768px) {
        .tituloprincipal {
            font-size: 1.5rem;
            margin-top: 5%;
        }

        .productos-grid {
            grid-template-columns: 1fr;
            padding: 10px;
        }

        .tab-categoria {
            font-size: 0.9rem;
        }
    }
</style>