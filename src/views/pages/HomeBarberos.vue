<template>
  <div>
    <section id="barberos-section" class="barberos-section">
      <v-container class="py-16" fluid>

        <!-- Encabezado -->
        <div class="seccion-header text-center mb-12">
          <span class="seccion-eyebrow">
            <span class="eyebrow-line"></span>
            NUESTRO EQUIPO
            <span class="eyebrow-line"></span>
          </span>
          <h2 class="seccion-titulo">Barberos <span class="titulo-accent">Profesionales</span></h2>
          <p class="seccion-desc">
            En StyleHub, nuestros barberos son artistas del estilo. No solo dominan las tijeras y las máquinas,
            también entienden que tu imagen habla por ti.
          </p>
          <div class="titulo-subline"></div>
        </div>

        <!-- Loading -->
        <v-row v-if="barberStore.loading" justify="center" class="my-10">
          <div class="loading-wrap">
            <v-progress-circular indeterminate color="#ee6f38" size="48" width="3"></v-progress-circular>
            <span class="loading-text">Cargando barberos...</span>
          </div>
        </v-row>

        <!-- Grid de barberos -->
        <div v-else :class="{ 'scroll-container': barberStore.barbers?.length > 4 }">
          <v-row
            dense
            justify="center"
            align="stretch"
            class="barberos-grid"
            :class="{ 'scroll-content': barberStore.barbers?.length > 4 }"
          >
            <v-col
              v-for="barbero in barberStore.barbers"
              :key="barbero.id"
              cols="12" sm="6" md="3" lg="3"
              class="d-flex"
            >
              <div class="barbero-card">
                <!-- Imagen -->
                <div class="barbero-img-wrap">
                  <img
                    v-if="barbero.foto || barbero.photo"
                    :src="barbero.foto || barbero.photo"
                    :alt="barbero.nombre"
                    class="barbero-img"
                  />
                  <div v-else class="barbero-img-placeholder">
                    <i class="fas fa-user-circle"></i>
                  </div>
                  <!-- Badge disponible -->
                  <div class="disponible-badge">
                    <span class="disponible-dot"></span>
                    Disponible
                  </div>
                </div>

                <!-- Info -->
                <div class="barbero-info">
                  <div class="barbero-scissors"><i class="fas fa-cut"></i></div>
                  <h3 class="barbero-nombre">{{ barbero.nombre || 'Barbero' }} {{ barbero.apellido || '' }}</h3>
                  <p class="barbero-especialidad">Especialista en cortes · Barba · Masajes</p>
                  <div class="barbero-estrellas">
                    <i class="fas fa-star" v-for="n in 5" :key="n"></i>
                  </div>
                  <button
                    class="btn-agendar-card"
                    :class="{ 'is-loading': cargandoHorarios === barbero.id }"
                    @click="agendarCon(barbero)"
                  >
                    <span v-if="cargandoHorarios === barbero.id">
                      <v-progress-circular indeterminate size="14" width="2" color="white" class="mr-1"></v-progress-circular>
                      Cargando...
                    </span>
                    <span v-else>
                      AGENDAR CON {{ (barbero.nombre || 'BARBERO').split(' ')[0].toUpperCase() }}
                    </span>
                  </button>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Scroll indicator -->
        <div v-if="barberStore.barbers?.length > 4" class="scroll-indicator">
          <i class="fas fa-chevron-left"></i>
          <span>Desliza para ver más barberos</span>
          <i class="fas fa-chevron-right"></i>
        </div>

        <!-- Sin barberos -->
        <v-row v-if="!barberStore.loading && barberStore.barbers?.length === 0" justify="center" class="my-10">
          <div class="sin-barberos">
            <i class="fas fa-user-slash"></i>
            <p>No hay barberos disponibles en este momento.</p>
          </div>
        </v-row>

      </v-container>
    </section>
  </div>

  <!-- Snackbar de error -->
  <v-snackbar v-model="mostrarError" color="#1a1a1a" :timeout="4000" location="top">
    <div class="d-flex align-center gap-2">
      <i class="fas fa-exclamation-circle" style="color:#ee6f38"></i>
      <span>{{ mensajeError }}</span>
    </div>
    <template v-slot:actions>
      <v-btn color="#ee6f38" variant="text" @click="mostrarError = false">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useBarberStore } from '@/stores/barber'
  import { useReservaBarberoStore } from '@/stores/reservaBarbero'

  const barberStore = useBarberStore()
  const reservaBarberoStore = useReservaBarberoStore()
  const cargandoHorarios = ref(null)
  const mostrarError = ref(false)
  const mensajeError = ref('')

  const agendarCon = async (barbero) => {
    if (cargandoHorarios.value) return // Prevenir múltiples clicks sin deshabilitar el botón (evita saltos de scroll)
    try {
      reservaBarberoStore.resetReserva()
      cargandoHorarios.value = barbero.id
      const horarios = await barberStore.getHorariosBarbero(barbero.id)
      if (!horarios || horarios.length === 0) {
        mensajeError.value = `${barbero.nombre} no tiene horarios disponibles`
        mostrarError.value = true
        return
      }
      reservaBarberoStore.inicializarConBarbero(barbero, horarios)
      window.dispatchEvent(new CustomEvent('open-reserva-barbero-dialog'))
    } catch (error) {
      console.error('❌ Error al cargar horarios del barbero:', error)
      mensajeError.value = 'Error al cargar los horarios disponibles. Intenta nuevamente.'
      mostrarError.value = true
    } finally {
      cargandoHorarios.value = null
    }
  }

  onMounted(async () => {
    await barberStore.getBarbers()
  })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.barberos-section {
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
}

.barberos-section::before {
  content: '';
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(238,111,56,0.06) 0%, transparent 70%);
  pointer-events: none;
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

.eyebrow-line:last-child {
  background: linear-gradient(90deg, #ee6f38, transparent);
}

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

.seccion-desc {
  max-width: 580px;
  margin: 0 auto 20px;
  color: rgba(255,255,255,0.5);
  font-size: 0.95rem;
  line-height: 1.7;
  font-family: 'DM Sans', sans-serif;
}

.titulo-subline {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  border-radius: 2px;
  margin: 0 auto;
}

/* Loading */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.loading-text {
  color: rgba(255,255,255,0.4);
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
}

/* Scroll */
.scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 20px;
}

.scroll-container::-webkit-scrollbar { height: 4px; }
.scroll-container::-webkit-scrollbar-track { background: #1a1a1a; }
.scroll-container::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

.scroll-content { flex-wrap: nowrap !important; width: max-content; }
.scroll-content .v-col { flex: 0 0 auto; max-width: none; }

.scroll-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(238,111,56,0.7);
  font-size: 0.82rem;
  font-weight: 600;
  margin-top: 14px;
  letter-spacing: 0.5px;
  animation: pulseOpa 2s ease-in-out infinite;
  font-family: 'DM Sans', sans-serif;
}

@keyframes pulseOpa {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.barberos-grid {
  margin-left: 4%;
  margin-right: 4%;
}

/* Card */
.barbero-card {
  width: 100%;
  background: #141414;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
}

.barbero-card:hover {
  border-color: rgba(238,111,56,0.4);
  transform: translateY(-8px);
  box-shadow: 0 20px 50px rgba(238,111,56,0.2);
}

/* Imagen */
.barbero-img-wrap {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: #1a1a1a;
  flex-shrink: 0;
}

.barbero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.barbero-card:hover .barbero-img { transform: scale(1.07); }

.barbero-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #222, #1a1a1a);
  font-size: 80px;
  color: #333;
}

/* Badge */
.disponible-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif;
}

.disponible-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 6px rgba(76,175,80,0.8);
  animation: pulseDot 2s ease-in-out infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Info */
.barbero-info {
  padding: 20px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.barbero-scissors {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(238,111,56,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #ee6f38;
}

.barbero-nombre {
  font-family: 'DM Sans', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 0.3px;
}

.barbero-especialidad {
  font-size: 0.76rem;
  color: rgba(255,255,255,0.4);
  margin: 0;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0.3px;
}

.barbero-estrellas {
  display: flex;
  gap: 3px;
  color: #ee6f38;
  font-size: 11px;
}

.btn-agendar-card {
  width: 100%;
  margin-top: 4px;
  padding: 11px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-agendar-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(238,111,56,0.4);
}

.btn-agendar-card.is-loading { opacity: 0.7; cursor: wait; }

/* Sin barberos */
.sin-barberos {
  text-align: center;
  color: rgba(255,255,255,0.3);
  padding: 40px;
}

.sin-barberos i { font-size: 48px; display: block; margin-bottom: 14px; }
.sin-barberos p { font-size: 0.9rem; margin: 0; font-family: 'DM Sans', sans-serif; }
</style>