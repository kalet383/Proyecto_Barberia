<script setup lang="ts">
import { computed } from 'vue';
import { useCustomizerStore, type ThemeMode } from '@/stores/customizer';

const customizer = useCustomizerStore();

const modes = [
  { value: 'light' as ThemeMode, icon: 'fas fa-sun', label: 'Claro' },
  { value: 'dark' as ThemeMode, icon: 'fas fa-moon', label: 'Oscuro' },
  { value: 'system' as ThemeMode, icon: 'fas fa-desktop', label: 'Sistema' }
];

const currentMode = computed(() => customizer.themeMode);
const activeTheme = computed(() => customizer.activeTheme);
const isDark = computed(() => activeTheme.value === 'DarkTheme');

const selectMode = (mode: ThemeMode) => {
  customizer.SET_THEME_MODE(mode);
};
</script>

<template>
  <div class="theme-toggle-container" :class="{ 'is-dark': isDark }">
    <button
      v-for="mode in modes"
      :key="mode.value"
      class="mode-btn"
      :class="{ active: currentMode === mode.value }"
      @click="selectMode(mode.value)"
      :title="mode.label"
    >
      <i :class="mode.icon"></i>
    </button>
  </div>
</template>

<style scoped>
.theme-toggle-container {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 3px;
  gap: 2px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.theme-toggle-container.is-dark {
  background: #0f172a;
  border-color: #1e293b;
}

.mode-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
}

.mode-btn:hover {
  color: #64748b;
  background: rgba(226, 232, 240, 0.5);
}

.is-dark .mode-btn:hover {
  color: #cbd5e1;
  background: rgba(30, 41, 59, 0.5);
}

.mode-btn.active {
  background: white;
  color: #ee6f38;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.is-dark .mode-btn.active {
  background: #1e293b;
  color: #4f8ef7;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Efecto de pulso al presionar */
.mode-btn:active {
  transform: scale(0.92);
}
</style>
