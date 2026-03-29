<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="440" persistent>
    <div class="notif-card">
      <!-- Header -->
      <div class="notif-header">
        <div class="confetti-wrap">
          <span v-for="i in 8" :key="i" class="confetti" :style="getConfettiStyle(i)"></span>
        </div>
        <div class="notif-icon-wrap">
          <div class="notif-pulse"></div>
          <div class="notif-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>
        </div>
      </div>

      <div class="notif-body">
        <h2 class="notif-titulo">¡Cita Agendada!</h2>
        <p class="notif-sub">{{ mensaje }}</p>

        <div class="notif-info">
          <i class="fa-solid fa-envelope info-icon"></i>
          <p>Recibirás una confirmación por correo electrónico y SMS con todos los detalles de tu cita.</p>
        </div>

        <button class="notif-btn" @click="handleClose">
          <i class="fas fa-check mr-2"></i>
          ¡Perfecto!
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
  defineProps({
    modelValue: Boolean,
    mensaje: String
  })

  const emit = defineEmits(['update:modelValue', 'cerrar-todo'])

  function handleClose() {
    emit('update:modelValue', false)
    emit('cerrar-todo')
  }

  function getConfettiStyle(i) {
    const colors = ['#ee6f38', '#ff9a6c', '#ffd54f', '#81c784', '#64b5f6', '#ba68c8', '#fff', '#ffb74d']
    const left = (i * 13) % 100
    const delay = (i * 0.15) % 1.5
    return {
      left: `${left}%`,
      background: colors[i % colors.length],
      animationDelay: `${delay}s`,
      animationDuration: `${1.2 + (i * 0.1)}s`
    }
  }
</script>

<style scoped>
  .notif-card {
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.15);
  }

  /* Header */
  .notif-header {
    background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
    padding: 36px 24px 28px;
    display: flex;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  /* Confetti */
  .confetti-wrap {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .confetti {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    top: -8px;
    animation: confettiDrop linear forwards;
    opacity: 0;
  }

  @keyframes confettiDrop {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100px) rotate(540deg); opacity: 0; }
  }

  /* Icono */
  .notif-icon-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .notif-pulse {
    position: absolute;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: rgba(238, 111, 56, 0.12);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.2; }
  }

  .notif-icon {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    background: rgba(238, 111, 56, 0.15);
    border: 2px solid rgba(238, 111, 56, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    color: #ee6f38;
    position: relative;
    z-index: 1;
    box-shadow: 0 0 30px rgba(238, 111, 56, 0.25);
  }

  /* Body */
  .notif-body {
    padding: 24px 28px 28px;
    text-align: center;
  }

  .notif-titulo {
    font-size: 1.4rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 8px;
  }

  .notif-sub {
    font-size: 0.875rem;
    color: #888;
    margin: 0 0 18px;
    line-height: 1.5;
  }

  /* Info box */
  .notif-info {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px 16px;
    background: rgba(238, 111, 56, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(238, 111, 56, 0.15);
    text-align: left;
    margin-bottom: 20px;
  }

  .info-icon {
    color: #ee6f38;
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .notif-info p {
    font-size: 0.82rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
  }

  /* Botón */
  .notif-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #ee6f38, #ff9a6c);
    color: white;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.22s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 15px rgba(238, 111, 56, 0.3);
  }

  .notif-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4);
  }
</style>