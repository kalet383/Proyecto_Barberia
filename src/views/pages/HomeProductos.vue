<template>
  <v-theme-provider theme="PurpleTheme">
    <div>
      <!-- Promo ticker -->
      <div class="promo-ticker">
        <div class="promo-track">
          <span>
            🛒 POR LA COMPRA DE MÁS DE 3 PRODUCTOS OBTÉN UN 10% EN EL TOTAL &nbsp;|&nbsp;
            🚨 OFERTAS EXCLUSIVAS PARA MIEMBROS &nbsp;|&nbsp;
            🛒 POR LA COMPRA DE MÁS DE 3 PRODUCTOS OBTÉN UN 10% EN EL TOTAL &nbsp;|&nbsp;
            🚨 OFERTAS EXCLUSIVAS PARA MIEMBROS
          </span>
        </div>
      </div>
    </div>

    <section id="productos-section" class="productos-section">
      <!-- Encabezado -->
      <div class="seccion-header text-center mb-10">
        <span class="seccion-eyebrow">
          <span class="eyebrow-line"></span>
          TIENDA OFICIAL
          <span class="eyebrow-line"></span>
        </span>
        <h2 class="seccion-titulo">Productos que <span class="titulo-accent">necesitas</span></h2>
        <div class="titulo-subline"></div>
      </div>

      <!-- Tabs categorías -->
      <div class="tabs-wrapper mb-8">
        <div class="tabs-track">
          <button
            v-for="(categoria, index) in categorias"
            :key="index"
            class="tab-btn"
            :class="{ activo: Tabactivado === index }"
            @click="Tabactivado = index"
          >
            {{ categoria.nombre }}
          </button>
        </div>
      </div>

      <!-- Grid de productos -->
      <div class="productos-container">
        <div class="productos-grid" v-if="categorias[Tabactivado]">
          <ProductoCard
            v-for="producto in categorias[Tabactivado].productos"
            :key="producto.id"
            :producto="producto"
            @ver-detalles="emitirverDetalles"
            @agregar-carrito="AgregaralCarrito"
          />
        </div>
      </div>

      <DetallesCard />
    </section>
  </v-theme-provider>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/plugins/axios'
  import ProductoCard from '@/components/shared/ProductoCard.vue'
  import DetallesCard from '@/components/shared/DetallesCard.vue'

  const Tabactivado = ref(0)
  const categorias = ref([])

  const emitirverDetalles = async (producto) => {
    const { useProductosStore } = await import('@/stores/useProductosStore')
    const productoStore = useProductosStore()
    productoStore.abrirDetalles(producto)
  }

  const AgregaralCarrito = async (producto) => {
    const { useProductosStore } = await import('@/stores/useProductosStore')
    const productoStore = useProductosStore()
    productoStore.AgregaralCarrito(producto)
  }

  const loadProductosTienda = async () => {
    try {
      const res = await api.get('/producto/tienda')
      const items = res.data || []
      const map = new Map()
      for (const p of items) {
        const cat = p.categoria || { id: p.categoriaId || 0, nombre: 'Sin categoría' }
        if (!map.has(cat.id)) map.set(cat.id, { id: cat.id, nombre: cat.nombre || 'Sin categoría', productos: [] })
        map.get(cat.id).productos.push(p)
      }
      categorias.value = Array.from(map.values())
    } catch (error) {
      console.error('Error cargando productos de tienda', error)
    }
  }

  onMounted(() => { loadProductosTienda() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* Ticker */
.promo-ticker {
  height: 38px;
  overflow: hidden;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c, #ee6f38);
  background-size: 200%;
  animation: gradientShift 4s linear infinite;
  color: white;
  font-weight: 800;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 0.78rem;
  letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.promo-track {
  display: inline-block;
  padding-left: 100%;
  animation: scroll-left 25s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Sección */
.productos-section {
  background: #f8f7f5;
  padding: 60px 0 80px;
  min-height: 100vh;
}

/* Encabezado */
.seccion-header { position: relative; }

.seccion-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ee6f38;
  text-transform: uppercase;
  margin-bottom: 14px;
  font-family: 'DM Sans', sans-serif;
}

.eyebrow-line {
  display: inline-block;
  width: 28px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ee6f38);
}

.eyebrow-line:last-child {
  background: linear-gradient(90deg, #ee6f38, transparent);
}

.seccion-titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 400;
  color: #1a1a1a;
  letter-spacing: 2px;
  margin: 0 0 16px;
  line-height: 1;
}

.titulo-accent { color: #ee6f38; }

.titulo-subline {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  border-radius: 2px;
  margin: 0 auto;
}

/* Tabs */
.tabs-wrapper {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.tabs-track {
  display: flex;
  gap: 6px;
  background: white;
  padding: 6px;
  border-radius: 14px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
  flex-wrap: wrap;
  justify-content: center;
}

.tab-btn {
  padding: 9px 22px;
  border-radius: 10px;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 0.82rem;
  letter-spacing: 0.5px;
  color: #888;
  cursor: pointer;
  transition: all 0.22s ease;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}

.tab-btn:hover { color: #ee6f38; background: rgba(238,111,56,0.05); }

.tab-btn.activo {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  box-shadow: 0 4px 12px rgba(238,111,56,0.3);
}

/* Grid */
.productos-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .productos-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
  .seccion-titulo { font-size: 2rem; }
}

@media (max-width: 480px) {
  .productos-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
}
</style>