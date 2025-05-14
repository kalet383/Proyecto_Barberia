<template>
    <section id="productos-section" class="v-container">
        <h2 class="tituloprincipal">PRODUCTOS QUE NECESITAS | Los mas top</h2>

        <!-- Tabs para las categorías -->
        <v-tabs v-model="Tabactivado" align-tabs="center" color="black">
            <v-tab v-for="(categoria, index) in categorias" :key="index" class="tab-categoria">
                {{ categoria.nombre }}
            </v-tab>
        </v-tabs>

        <!-- Contenido de las pestañas -->
        <v-window v-model="Tabactivado">
            <v-window-item v-for="(categoria, index) in categorias" :key="index">
                <div class="productos-grid">
                    <ProductoCard v-for="producto in categoria.productos" :key="producto.id" :producto="producto" @ver-detalles="emitirverDetalles"></ProductoCard>
                </div>
            </v-window-item>
        </v-window>

        <DetallesCard></DetallesCard>
    </section>
</template>

<script>
    import { mapState } from 'pinia'
    import { useProductosStore } from '@/stores/useProductosStore';
    import ProductoCard from '@/components/shared/ProductoCard.vue';
    import DetallesCard from '@/components/shared/DetallesCard.vue';
    
    export default {
        name : 'HomeProductos',
        components : {
            ProductoCard,
            DetallesCard
        },
        data() {
            return {
                Tabactivado : 0, // Pestaña activa por defecto
            };
        },
        computed: {
            ...mapState(useProductosStore, ['categorias'])
        },
        methods: {
            emitirverDetalles(producto) {
                const store = useProductosStore();
                store.abrirDetalles(producto);
            }
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