<template>
  <div id="servicios-section">
    <!-- Promo Ticker -->
    <div class="promo-ticker">
      <div class="promo-track">
        <span>💈🔥 RECUERDA TODOS NUESTROS MIERCOLES DE CANDELA, CON TODA LA BARBERIA EN UN 20% DE DESCUENTO 💈🔥 | VEN Y DISFRUTA DE NUESTRO ESPACIO DE DISTRACCION CON NUESTRAS CONSOLAS DE VIDEOJUEGOS 🎮 | FINES DE SEMANA SERVICIO ESTANDAR CON GRANIZADO GRATIS 🥤</span>
      </div>
    </div>

    <v-container class="py-10" fluid>
      <!-- Sin servicios publicados -->
      <div v-if="serviceStore.featuredServices.length === 0" class="text-center py-16">
        <v-icon size="80" color="grey-lighten-1">mdi-scissors-cutting</v-icon>
        <p class="text-grey mt-4">Pronto mostraremos nuestros servicios aquí</p>
      </div>

      <!-- Carrusel de Servicios Publicados -->
      <div v-else>
        <h2 class="section-title">NUESTROS SERVICIOS <span style="font-weight: 400; text-transform: none; font-size: 0.7em;">| Lo que ofrecemos</span></h2>

        <div class="carousel-root">
          <!-- Flecha izquierda -->
          <button
            class="carousel-arrow left"
            @click="prev"
            :class="{ disabled: currentIndex === 0 }"
          >
            <span class="arrow-symbol">‹</span>
          </button>

          <!-- Viewport -->
          <div class="carousel-viewport" ref="viewportRef">
            <div
              class="carousel-track"
              :style="trackStyle"
            >
              <div
                v-for="servicio in serviceStore.featuredServices"
                :key="servicio.id"
                class="carousel-item"
                :style="slideStyle"
              >
                <v-card class="service-card" height="100%">
                  <!-- Media -->
                  <div class="card-media">
                    <video
                      v-if="servicio.videoUrl && isValidUrl(servicio.videoUrl)"
                      class="card-media-inner"
                      autoplay muted loop playsinline
                    >
                      <source :src="servicio.videoUrl" type="video/mp4" />
                    </video>
                    <img
                      v-else-if="servicio.imagenUrl && isValidUrl(servicio.imagenUrl)"
                      :src="servicio.imagenUrl"
                      class="card-media-inner"
                    />
                    <div v-else class="card-media-placeholder">
                      <v-icon size="56" color="grey-darken-2">mdi-image-off</v-icon>
                    </div>
                    <div class="card-title-overlay">{{ servicio.nombre }}</div>
                  </div>

                  <!-- Info -->
                  <div class="card-info">
                    <div class="card-meta">
                      <span class="meta-precio">💰 ${{ Number(servicio.precio).toLocaleString() }} COP</span>
                      <span class="meta-sep">|</span>
                      <span class="meta-tiempo">⏱️ {{ formatDuracion(servicio.duracionAprox) }}</span>
                    </div>
                    <p class="card-desc">{{ servicio.descripcion }}</p>
                    <div class="card-btn-wrapper">
                      <button class="btn-agendar" @click="agendarServicio(servicio.id)">
                        <v-icon start size="18">mdi-calendar-plus</v-icon>
                        AGENDAR
                      </button>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </div>

          <!-- Flecha derecha -->
          <button
            class="carousel-arrow right"
            @click="next"
            :class="{ disabled: currentIndex >= maxIndex }"
          >
            <span class="arrow-symbol">›</span>
          </button>
        </div>

        <!-- Dots -->
        <div class="carousel-dots" v-if="maxIndex > 0">
          <span
            v-for="i in maxIndex + 1"
            :key="i"
            class="dot"
            :class="{ active: currentIndex === i - 1 }"
            @click="currentIndex = i - 1"
          ></span>
        </div>
      </div>

      <!-- Botón inferior -->
      <div class="cta-section text-center mt-12 mb-4">
        <p class="cta-text mb-6">¿No encontraste lo que buscas? Tenemos más servicios disponibles.</p>
        <button class="cta-btn" @click="agendarSinServicio">
          <v-icon start>mdi-calendar-check</v-icon>
          VER TODOS LOS SERVICIOS Y AGENDAR
        </button>
      </div>
    </v-container>

    <!-- Modal de Reserva -->
    <vistareserva-cita v-model="showModal"></vistareserva-cita>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import VistareservaCita from '@/views/pages/VistareservaCita.vue'
  import { useServiceStore } from '@/stores/services'
  import { useReservaStore } from '@/stores/reserva'

  const serviceStore = useServiceStore()
  const reservaStore = useReservaStore()
  const showModal = ref(false)

  // Carrusel
  const currentIndex = ref(0)
  const viewportRef = ref(null)
  const visibleCount = ref(3)

  const maxIndex = computed(() => {
    return Math.max(0, serviceStore.featuredServices.length - visibleCount.value)
  })

  // Width de cada slide = 100% / visibleCount (usando %)
  const slideStyle = computed(() => ({
    width: `calc(100% / ${visibleCount.value})`,
    minWidth: `calc(100% / ${visibleCount.value})`,
    maxWidth: `calc(100% / ${visibleCount.value})`,
  }))

  const trackStyle = computed(() => ({
    transform: `translateX(calc(-${currentIndex.value} * 100% / ${visibleCount.value}))`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }))

  function updateVisibleCount() {
    const w = window.innerWidth
    if (w < 600) visibleCount.value = 1
    else if (w < 960) visibleCount.value = 2
    else visibleCount.value = 3
    // reset si el índice supera el máximo
    if (currentIndex.value > maxIndex.value) currentIndex.value = maxIndex.value
  }

  function prev() { if (currentIndex.value > 0) currentIndex.value-- }
  function next() { if (currentIndex.value < maxIndex.value) currentIndex.value++ }

  function isValidUrl(url) {
    if (!url) return false
    if (url.startsWith('data:')) return false
    if (url.startsWith('📁')) return false
    return true
  }

  function formatDuracion(duracion) {
    if (!duracion) return ''
    const parts = duracion.split(':')
    if (parts.length >= 2) {
      const h = parseInt(parts[0])
      const m = parseInt(parts[1])
      if (h > 0) return `${h}h ${m}m`
      return `${m} min`
    }
    return duracion
  }

  function agendarServicio(id) {
    reservaStore.resetReserva()
    reservaStore.setServicios([id])
    showModal.value = true
  }

  function agendarSinServicio() {
    reservaStore.resetReserva()
    showModal.value = true
  }

  onMounted(async () => {
    await serviceStore.getServices()
    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateVisibleCount)
  })
</script>

<style scoped>
  #servicios-section {
    background-color: #0c0c0c;
    min-height: 100vh;
  }

  /* ─── Título ─── */
  .section-title {
    color: white;
    text-align: center;
    font-size: 2.4rem;
    margin-bottom: 40px;
    font-weight: 800;
    margin-top: 2%;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .section-title::after {
    content: '';
    display: block;
    width: 200px;
    height: 4px;
    margin: 12px auto 0;
    background: linear-gradient(to right, transparent, #ee6f38, transparent);
    border-radius: 2px;
  }

  /* ─── Carrusel raíz ─── */
  .carousel-root {
    display: flex;
    align-items: stretch;
    gap: 8px;
  }

  /* ─── Flechas ─── */
  .carousel-arrow {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    align-self: center;
    border-radius: 50%;
    border: 2.5px solid #ee6f38;
    background: linear-gradient(135deg, #ff9a5c, #ee6f38);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 20px rgba(238,111,56,0.8), inset 0 1px 0 rgba(255,255,255,0.2);
    position: relative;
    overflow: hidden;
  }

  .carousel-arrow::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent);
    animation: pulse-arrow 2.5s ease-in-out infinite;
  }

  .icon-arrow {
    color: white !important;
    z-index: 2;
    position: relative;
  }

  .arrow-symbol {
    color: white;
    font-size: 54px;
    font-weight: bold;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    position: relative;
    text-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
    filter: drop-shadow(0 2px 4px rgba(238,111,56,0.6));
  }

  .carousel-arrow:hover:not(.disabled) {
    background: linear-gradient(135deg, #ff9a5c, #ff8c3d);
    transform: scale(1.2) translateY(-2px);
    box-shadow: 0 0 30px rgba(238,111,56,1), inset 0 1px 0 rgba(255,255,255,0.3);
    filter: brightness(1.15);
  }

  .carousel-arrow.disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
    background: linear-gradient(135deg, #888, #666);
    border-color: #666;
    box-shadow: 0 0 10px rgba(100,100,100,0.3);
  }

  /* ─── Viewport: oculta lo que sobre ─── */
  .carousel-viewport {
    flex: 1;
    overflow: hidden;
    border-radius: 16px;
  }

  /* ─── Track: fila de slides ─── */
  .carousel-track {
    display: flex;
    align-items: stretch;
    /* transform se aplica inline */
  }

  /* ─── Cada slide ─── */
  .carousel-item {
    flex-shrink: 0;
    padding: 0 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  /* ─── Card ─── */
  .service-card {
    background: #1a1a1a !important;
    border: 1px solid rgba(238,111,56,0.18);
    border-radius: 18px !important;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    display: flex;
    flex-direction: column;
    animation: fadeInUp 0.7s ease backwards;
  }

  .service-card:hover {
    transform: translateY(-8px);
    border-color: #ee6f38;
    box-shadow: 0 14px 28px rgba(238,111,56,0.28);
  }

  /* Media */
  .card-media {
    position: relative;
    width: 100%;
    height: 340px;
    overflow: hidden;
    background: #111;
    flex-shrink: 0;
  }

  .card-media-inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-media-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #222;
  }

  .card-title-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 14px 12px;
    background: linear-gradient(transparent, rgba(0,0,0,0.88));
    color: white;
    font-weight: 800;
    font-size: 1rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Info */
  .card-info {
    padding: 14px 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    font-size: 0.85rem;
  }

  .meta-precio {
    color: #4caf50;
    font-weight: 800;
  }

  .meta-sep {
    color: #555;
  }

  .meta-tiempo {
    color: #ccc;
  }

  .card-desc {
    color: #bbb;
    font-size: 0.85rem;
    line-height: 1.5;
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin: 0;
  }

  .card-btn-wrapper {
    display: flex;
    justify-content: center;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  .btn-agendar {
    background: transparent;
    border: 2px solid #ee6f38;
    color: #ee6f38;
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: 50px;
    padding: 8px 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    letter-spacing: 0.5px;
  }

  .btn-agendar:hover {
    background: #ee6f38;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 14px rgba(238,111,56,0.4);
  }

  /* ─── Dots ─── */
  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .dot.active {
    background: #ee6f38;
    transform: scale(1.4);
  }

  /* ─── Promo ticker ─── */
  .promo-ticker {
    height: 40px;
    overflow: hidden;
    background: #ee6f38;
    color: white;
    font-weight: 800;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-size: 14px;
    text-transform: uppercase;
  }

  .promo-track {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 30s linear infinite;
  }

  @keyframes scroll-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  @keyframes pulse-arrow {
    0%, 100% {
      box-shadow: 0 0 15px rgba(238,111,56,0.6), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    50% {
      box-shadow: 0 0 30px rgba(238,111,56,0.9), inset 0 1px 0 rgba(255,255,255,0.3);
    }
  }

  /* ─── CTA ─── */
  .cta-section {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 40px;
  }

  .cta-text {
    color: rgba(255,255,255,0.55);
    font-size: 1rem;
    letter-spacing: 0.4px;
  }

  .cta-btn {
    background: linear-gradient(135deg, #ee6f38, #ff9a5c);
    color: white;
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 1px;
    border: none;
    border-radius: 50px;
    padding: 14px 40px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .cta-btn:hover {
    transform: scale(1.07) translateY(-3px);
    box-shadow: 0 14px 28px rgba(238,111,56,0.55);
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
</style>
