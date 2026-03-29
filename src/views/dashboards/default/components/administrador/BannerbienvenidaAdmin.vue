<template>
  <div style="margin-bottom: 24px;">
    <div
      :style="{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 24px', borderRadius: '12px',
        background: isDark ? 'linear-gradient(135deg, #1e293b, #0f172a)' : 'linear-gradient(135deg, #1a1a2e, #252540)',
        border: `1px solid ${isDark ? '#1e293b' : 'rgba(238,111,56,0.15)'}`,
        flexWrap: 'wrap', gap: '16px',
        position: 'relative', overflow: 'hidden',
        boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 4px 14px rgba(26,26,46,0.2)'
      }"
    >
      <!-- Decoración de fondo adaptativa -->
      <div
        :style="{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '120px', height: '120px', borderRadius: '50%',
          background: isDark ? 'rgba(79,142,247,0.06)' : 'rgba(238,111,56,0.08)',
          pointerEvents: 'none'
        }"
      ></div>
      <div
        :style="{
          position: 'absolute', bottom: '-20px', left: '40%',
          width: '80px', height: '80px', borderRadius: '50%',
          background: isDark ? 'rgba(124,92,252,0.04)' : 'rgba(238,111,56,0.05)',
          pointerEvents: 'none'
        }"
      ></div>

      <!-- Contenido izquierda -->
      <div style="display: flex; align-items: center; gap: 16px; position: relative; z-index: 1;">
        <!-- Icono saludo -->
        <div
          :style="{
            width: '50px', height: '50px', borderRadius: '14px',
            background: isDark ? 'linear-gradient(135deg, #4f8ef7, #7c5cfc)' : 'linear-gradient(135deg, #ee6f38, #ff9a6c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px',
            boxShadow: isDark ? '0 4px 14px rgba(79,142,247,0.3)' : '0 4px 14px rgba(238,111,56,0.3)',
          }"
        >
          {{ iconoSaludo }}
        </div>

        <div>
          <h1 :style="{ fontSize: '1.2rem', fontWeight: '800', color: 'white', margin: '0 0 2px', lineHeight: '1.3' }">
            {{ saludo }}, <span :style="{ color: isDark ? '#4f8ef7' : '#ff9a6c' }">{{ nombreUsuario }}</span>
          </h1>
          <p :style="{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0' }">
            Nos alegra verte de nuevo · {{ fechaHoy }}
          </p>
        </div>
      </div>

      <!-- Hora actual -->
      <div style="display: flex; align-items: center; gap: 8px; position: relative; z-index: 1;">
        <span
          :style="{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '8px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#ffffff',
            fontSize: '0.78rem', fontWeight: '600',
          }"
        >
          <i class="far fa-clock" :style="{ fontSize: '12px', color: isDark ? '#4f8ef7' : '#ee6f38' }"></i>
          {{ horaActual }}
        </span>

        <span
          :style="{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '6px 12.5px', borderRadius: '8px',
            background: isDark ? 'rgba(79,142,247,0.2)' : rolColor.bg, 
            color: isDark ? '#ffffff' : rolColor.text,
            fontSize: '0.72rem', fontWeight: '700',
            textTransform: 'capitalize',
          }"
        >
          <i :class="rolColor.icon" style="font-size: 10px;"></i>
          {{ rolUsuario }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCustomizerStore } from '@/stores/customizer'

const authStore = useAuthStore()
const customizer = useCustomizerStore()
const horaActual = ref('')
let intervalo = null

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

const nombreUsuario = computed(() => {
  const u = authStore.user
  if (!u) return 'Usuario'
  return `${u.nombre} ${u.apellido}`
})

const rolUsuario = computed(() => {
  return authStore.user?.Role || authStore.user?.role || 'usuario'
})

const rolColor = computed(() => {
  const r = rolUsuario.value?.toLowerCase()
  if (r === 'administrador' || r === 'superadmin') return { bg: 'rgba(238,111,56,0.15)', text: '#ff9a6c', icon: 'fas fa-crown' }
  if (r === 'barbero') return { bg: 'rgba(76,175,80,0.15)', text: '#81c784', icon: 'fas fa-scissors' }
  return { bg: 'rgba(33,150,243,0.15)', text: '#90caf9', icon: 'fas fa-user' }
})

const saludo = computed(() => {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
})

const iconoSaludo = computed(() => {
  const hora = new Date().getHours()
  if (hora < 12) return '☀️'
  if (hora < 19) return '🌤️'
  return '🌙'
})

const fechaHoy = computed(() => {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const actualizarHora = () => {
  horaActual.value = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  actualizarHora()
  intervalo = setInterval(actualizarHora, 30000)
})

onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>