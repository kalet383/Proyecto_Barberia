<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="460" persistent>
    <div class="notif-card error">
      <!-- Header -->
      <div class="notif-header error">
        <div class="notif-icon-ring">
          <div class="notif-icon">
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
        </div>
        <div class="notif-particles">
          <span v-for="i in 6" :key="i" class="particle"></span>
        </div>
      </div>

      <div class="notif-body">
        <h2 class="notif-titulo error">No Disponible</h2>
        <p class="notif-mensaje">{{ mensaje }}</p>

        <!-- Horarios alternativos -->
        <div v-if="horariosAlternativos && horariosAlternativos.length > 0" class="alternativas-seccion">
          <p class="alternativas-titulo">
            <i class="fa-regular fa-clock mr-1"></i>
            Horarios disponibles
          </p>
          <div class="alternativas-lista">
            <div
              v-for="(horario, index) in horariosAlternativos.slice(0, 3)"
              :key="index"
              class="alternativa-item"
            >
              <i class="fas fa-chevron-right"></i>
              <span>{{ horario }}</span>
            </div>
          </div>
        </div>

        <!-- Barberos alternativos -->
        <div v-if="barberosAlternativos && barberosAlternativos.length > 0" class="alternativas-seccion">
          <p class="alternativas-titulo">
            <i class="fa-solid fa-user mr-1"></i>
            Barberos disponibles
          </p>
          <div class="alternativas-lista">
            <div
              v-for="(barbero, index) in barberosAlternativos.slice(0, 3)"
              :key="index"
              class="alternativa-item"
            >
              <i class="fas fa-chevron-right"></i>
              <span>{{ barbero }}</span>
            </div>
          </div>
        </div>

        <button class="notif-btn error" @click="$emit('update:modelValue', false)">
          Entendido
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
  defineProps({
    modelValue: Boolean,
    mensaje: String,
    horariosAlternativos: Array,
    barberosAlternativos: Array
  })
  defineEmits(['update:modelValue'])
</script>

<style scoped>
  .notif-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18);
  }

  /* Header */
  .notif-header {
    padding: 36px 24px 28px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .notif-header.error {
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  }

  .notif-icon-ring {
    position: relative;
    z-index: 2;
  }

  .notif-icon {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
  }

  .notif-header.error .notif-icon {
    background: rgba(244, 67, 54, 0.15);
    border: 2px solid rgba(244, 67, 54, 0.4);
    color: #f44336;
    box-shadow: 0 0 30px rgba(244, 67, 54, 0.2);
  }

  /* Particles decoration */
  .notif-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(244, 67, 54, 0.3);
    animation: float 3s ease-in-out infinite;
  }

  .particle:nth-child(1) { top: 20%; left: 15%; animation-delay: 0s; }
  .particle:nth-child(2) { top: 60%; left: 80%; animation-delay: 0.5s; width: 6px; height: 6px; }
  .particle:nth-child(3) { top: 80%; left: 25%; animation-delay: 1s; }
  .particle:nth-child(4) { top: 30%; left: 70%; animation-delay: 1.5s; width: 5px; height: 5px; }
  .particle:nth-child(5) { top: 70%; left: 50%; animation-delay: 2s; }
  .particle:nth-child(6) { top: 15%; left: 55%; animation-delay: 0.8s; width: 3px; height: 3px; }

  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-8px) scale(1.2); opacity: 0.7; }
  }

  /* Body */
  .notif-body {
    padding: 24px 28px 28px;
  }

  .notif-titulo {
    font-size: 1.3rem;
    font-weight: 800;
    text-align: center;
    margin: 0 0 10px;
  }

  .notif-titulo.error { color: #d32f2f; }

  .notif-mensaje {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 20px;
  }

  /* Alternativas */
  .alternativas-seccion {
    margin-bottom: 16px;
  }

  .alternativas-titulo {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #888;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .alternativas-lista {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .alternativa-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fafafa;
    border-radius: 8px;
    font-size: 0.83rem;
    color: #444;
    border: 1px solid #f0f0f0;
  }

  .alternativa-item i { font-size: 10px; color: #f44336; }

  /* Botón */
  .notif-btn {
    width: 100%;
    padding: 13px;
    border-radius: 12px;
    border: none;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.22s ease;
    margin-top: 4px;
    letter-spacing: 0.3px;
  }

  .notif-btn.error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    color: white;
    box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
  }

  .notif-btn.error:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(244, 67, 54, 0.4);
  }
</style>