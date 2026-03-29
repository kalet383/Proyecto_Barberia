<script setup>
import { computed } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

const props = defineProps({
  closesearch: {
    type: Function,
    required: false
  }
});

const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
</script>

<template>
  <div style="position: relative;">
    <v-text-field
      persistent-placeholder
      placeholder="Buscar..."
      variant="outlined"
      density="compact"
      hide-details
      rounded="lg"
      color="#ee6f38"
      style="min-width: 200px;"
    >
      <template v-slot:prepend-inner>
        <i class="fas fa-search" style="color: #ee6f38; font-size: 13px;"></i>
      </template>
      <template v-slot:append-inner>
        <!-- Botón cerrar (mobile) -->
        <span
          v-if="props.closesearch"
          :style="{
            width: '26px', height: '26px', borderRadius: '6px',
            background: isDark ? 'rgba(239,68,68,0.15)' : '#ffebee', 
            color: isDark ? '#ff5252' : '#c62828',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '11px', marginLeft: '4px'
          }"
          class="d-block d-lg-none"
          @click="props.closesearch"
        >
          <i class="fas fa-times"></i>
        </span>
      </template>
    </v-text-field>
  </div>
</template>