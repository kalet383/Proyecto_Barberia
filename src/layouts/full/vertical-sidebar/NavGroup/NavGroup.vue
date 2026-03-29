<script setup>
import { computed } from 'vue';
import { useCustomizerStore } from '@/stores/customizer';

const props = defineProps({ item: Object });
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
</script>

<template>
  <v-list-subheader 
    :color="isDark ? '#ffffff' : 'darkText'" 
    class="smallCap"
    :style="{ opacity: '1', fontWeight: '900', letterSpacing: '1px', marginTop: '16px', textTransform: 'uppercase', fontSize: '0.75rem', filter: isDark ? 'drop-shadow(0 0 1px rgba(255,255,255,0.2))' : 'none' }"
  >
    {{ props.item.header }}
  </v-list-subheader>
</template>
