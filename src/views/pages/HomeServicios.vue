<template>
  <div id="servicios-section" class="servicios-section">

    <!-- Promo Ticker -->
    <div class="promo-ticker">
      <div class="promo-track">
        <span>
          💈🔥 MIÉRCOLES DE CANDELA — 20% DE DESCUENTO EN TODA LA BARBERÍA &nbsp;|&nbsp;
          🎮 ZONA DE VIDEOJUEGOS PARA TU ESPERA &nbsp;|&nbsp;
          🥤 FINES DE SEMANA: SERVICIO ESTÁNDAR + GRANIZADO GRATIS &nbsp;|&nbsp;
          💈🔥 MIÉRCOLES DE CANDELA — 20% DE DESCUENTO EN TODA LA BARBERÍA &nbsp;|&nbsp;
          🎮 ZONA DE VIDEOJUEGOS PARA TU ESPERA &nbsp;|&nbsp;
          🥤 FINES DE SEMANA: SERVICIO ESTÁNDAR + GRANIZADO GRATIS
        </span>
      </div>
    </div>

    <v-container class="py-16" fluid>

      <!-- Sin servicios -->
      <div v-if="serviceStore.featuredServices.length === 0" class="sin-servicios text-center py-16">
        <i class="fas fa-cut sin-icon"></i>
        <p>Pronto mostraremos nuestros servicios aquí</p>
      </div>

      <div v-else>
        <!-- Encabezado -->
        <div class="seccion-header text-center mb-14">
          <span class="seccion-eyebrow">
            <span class="eyebrow-line"></span>
            LO QUE OFRECEMOS
            <span class="eyebrow-line"></span>
          </span>
          <h2 class="seccion-titulo">Nuestros <span class="titulo-accent">Servicios</span></h2>
          <div class="titulo-subline"></div>
        </div>

        <!-- Carrusel -->
        <div class="carousel-root">
          <button class="carousel-arrow left" @click="prev" :class="{ disabled: currentIndex === 0 }">
            <span class="arrow-sym">‹</span>
          </button>

          <div class="carousel-viewport" ref="viewportRef">
            <div class="carousel-track" :style="trackStyle">
              <div
                v-for="servicio in serviceStore.featuredServices"
                :key="servicio.id"
                class="carousel-item"
                :style="slideStyle"
              >
                <div class="service-card">
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
                      <i class="fas fa-cut"></i>
                    </div>
                    <div class="card-nombre-overlay">{{ servicio.nombre }}</div>
                    <!-- Tag de precio sobre imagen -->
                    <div class="card-precio-tag">${{ Number(servicio.precio).toLocaleString() }}</div>
                  </div>

                  <!-- Info -->
                  <div class="card-info">
                    <div class="card-meta">
                      <span class="meta-tiempo">
                        <i class="fas fa-clock mr-1"></i>
                        {{ formatDuracion(servicio.duracionAprox) }}
                      </span>
                    </div>
                    <p class="card-desc">{{ servicio.descripcion }}</p>
                    <button class="btn-agendar" @click="agendarServicio(servicio.id)">
                      <i class="fas fa-calendar-plus mr-2"></i>
                      AGENDAR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="carousel-arrow right" @click="next" :class="{ disabled: currentIndex >= maxIndex }">
            <span class="arrow-sym">›</span>
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

      <!-- CTA -->
      <div class="cta-section text-center mt-14">
        <p class="cta-text">¿No encontraste lo que buscas? Tenemos más servicios disponibles.</p>
        <button class="cta-btn" @click="agendarSinServicio">
          <i class="fas fa-calendar-check mr-2"></i>
          VER TODOS LOS SERVICIOS Y AGENDAR
        </button>
      </div>

    </v-container>
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

  const currentIndex = ref(0)
  const viewportRef = ref(null)
  const visibleCount = ref(3)

  const maxIndex = computed(() => Math.max(0, serviceStore.featuredServices.length - visibleCount.value))

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
    window.dispatchEvent(new CustomEvent('open-reserva-dialog'))
  }

  function agendarSinServicio() {
    reservaStore.resetReserva()
    window.dispatchEvent(new CustomEvent('open-reserva-dialog'))
  }

  onMounted(async () => {
    await serviceStore.getServices()
    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
  })

  onUnmounted(() => window.removeEventListener('resize', updateVisibleCount))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.servicios-section {
  background: #0c0c0c;
  min-height: 100vh;
}

/* Ticker */
.promo-ticker {
  height: 40px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border-bottom: 1px solid rgba(238,111,56,0.3);
  color: rgba(255,255,255,0.85);
  font-weight: 700;
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-size: 0.75rem;
  letter-spacing: 0.8px;
  font-family: 'DM Sans', sans-serif;
}

.promo-track {
  display: inline-block;
  padding-left: 100%;
  animation: scroll-left 35s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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
  margin-bottom: 16px;
  font-family: 'DM Sans', sans-serif;
}

.eyebrow-line {
  display: inline-block;
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ee6f38);
}
.eyebrow-line:last-child { background: linear-gradient(90deg, #ee6f38, transparent); }

.seccion-titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 400;
  color: white;
  letter-spacing: 2px;
  margin: 0 0 16px;
  line-height: 1;
}

.titulo-accent { color: #ee6f38; }

.titulo-subline {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  border-radius: 2px;
  margin: 0 auto;
}

/* Sin servicios */
.sin-servicios { color: rgba(255,255,255,0.3); }
.sin-icon { font-size: 56px; display: block; margin-bottom: 16px; }

/* Carrusel */
.carousel-root {
  display: flex;
  align-items: stretch;
  gap: 12px;
}

.carousel-arrow {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  align-self: center;
  border-radius: 50%;
  border: 2px solid #ee6f38;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.carousel-arrow:not(.disabled):hover {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(238,111,56,0.5);
}

.carousel-arrow.disabled {
  opacity: 0.2;
  cursor: default;
  pointer-events: none;
  border-color: #444;
}

.arrow-sym {
  color: #ee6f38;
  font-size: 40px;
  font-weight: 300;
  line-height: 1;
  transition: color 0.3s;
}

.carousel-arrow:not(.disabled):hover .arrow-sym { color: white; }

.carousel-viewport {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
}

.carousel-track {
  display: flex;
  align-items: stretch;
}

.carousel-item {
  flex-shrink: 0;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Service card */
.service-card {
  background: #141414;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: fadeInUp 0.6s ease both;
}

.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(238,111,56,0.4);
  box-shadow: 0 20px 50px rgba(238,111,56,0.2);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Media */
.card-media {
  position: relative;
  width: 100%;
  height: 320px;
  overflow: hidden;
  background: #111;
  flex-shrink: 0;
}

.card-media-inner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.service-card:hover .card-media-inner { transform: scale(1.06); }

.card-media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  font-size: 48px;
  color: #333;
}

.card-nombre-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 28px 16px 14px;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: 'DM Sans', sans-serif;
}

.card-precio-tag {
  position: absolute;
  top: 14px;
  right: 14px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  font-weight: 800;
  font-size: 0.82rem;
  padding: 5px 12px;
  border-radius: 20px;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(238,111,56,0.4);
}

/* Card info */
.card-info {
  padding: 16px 18px 18px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-meta { display: flex; align-items: center; }

.meta-tiempo {
  display: flex;
  align-items: center;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.4);
  font-family: 'DM Sans', sans-serif;
}

.meta-tiempo i { color: #ee6f38; }

.card-desc {
  color: rgba(255,255,255,0.55);
  font-size: 0.83rem;
  line-height: 1.6;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}

.btn-agendar {
  background: transparent;
  border: 1.5px solid rgba(238,111,56,0.5);
  color: #ee6f38;
  font-weight: 700;
  font-size: 0.78rem;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.25s ease;
  letter-spacing: 0.8px;
  font-family: 'DM Sans', sans-serif;
}

.btn-agendar:hover {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  border-color: transparent;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(238,111,56,0.35);
}

/* Dots */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ee6f38;
  transform: scale(1.5);
  box-shadow: 0 0 8px rgba(238,111,56,0.6);
}

/* CTA */
.cta-section {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding-top: 48px;
}

.cta-text {
  color: rgba(255,255,255,0.4);
  font-size: 0.95rem;
  margin-bottom: 24px;
  font-family: 'DM Sans', sans-serif;
}

.cta-btn {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  font-weight: 800;
  font-size: 0.875rem;
  letter-spacing: 1.2px;
  border: none;
  border-radius: 8px;
  padding: 16px 44px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 6px 25px rgba(238,111,56,0.4);
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 35px rgba(238,111,56,0.5);
}
</style>