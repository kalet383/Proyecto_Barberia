<template>
  <v-container>
    <!-- ═══ HEADER ═══ -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div :style="{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #ee6f38, #ff9a6c)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', boxShadow: '0 4px 12px rgba(238,111,56,0.25)' }">
          <i class="fas fa-list-ul"></i>
        </div>
        <div>
          <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Categorías de Servicios</h2>
          <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Listado maestro de categorías disponibles</p>
        </div>
      </div>
      <v-btn
        to="/crear-categoria-servicio"
        variant="flat"
        rounded="lg"
        color="primary"
        style="font-weight: 800; text-transform: none; letter-spacing: 0.5px;"
      >
        <i class="fas fa-plus mr-2" style="font-size: 11px;"></i>
        Nueva Categoría
      </v-btn>
    </div>

    <v-progress-linear v-if="categoriaServicioStore.loading" color="#ee6f38" indeterminate rounded class="mb-4" />

    <v-alert v-if="categoriaServicioStore.error" type="error" variant="tonal" rounded="lg" class="mb-4">
      {{ categoriaServicioStore.error }}
    </v-alert>

    <div
      v-if="!categoriaServicioStore.loading && categoriaServicioStore.categoriasServicio.length === 0"
      :style="{ textAlign: 'center', padding: '48px 20px', background: headerBg, border: `1px dashed ${cardBorder}`, borderRadius: '12px' }"
    >
      <div :style="{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', color: '#ee6f38' }">
        <i class="fas fa-folder-open"></i>
      </div>
      <p :style="{ fontWeight: '700', color: txtPrimary, margin: '0 0 4px' }">No hay categorías</p>
      <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Comienza creando una nueva categoría de servicio</p>
    </div>

    <!-- ═══ GRID / TABLA MODERNA ═══ -->
    <v-card v-if="categoriaServicioStore.categoriasServicio.length > 0" rounded="xl" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: cardBg, overflow: 'hidden' }">
      <v-table hover style="background: transparent;">
        <thead>
          <tr :style="{ background: headerBg }">
            <th :style="{ borderBottom: `1px solid ${cardBorder}`, color: txtSecondary, fontWeight: '800', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px' }">Información</th>
            <th :style="{ borderBottom: `1px solid ${cardBorder}`, color: txtSecondary, fontWeight: '800', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.5px' }" class="text-right">ID</th>
          </tr>
        </thead>
        <tbody :style="{ color: txtPrimary }">
          <tr v-for="categoria in categoriaServicioStore.categoriasServicio" :key="categoria.id" class="table-row">
            <td :style="{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.02)' : '#f5f5f5'}`, padding: '16px 24px' }">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(238,111,56,0.15)' : '#fff3e0', color: '#ee6f38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.85rem' }">
                  {{ categoria.nombre?.charAt(0).toUpperCase() }}
                </div>
                <span style="font-weight: 700; font-size: 0.95rem;">{{ categoria.nombre }}</span>
              </div>
            </td>
            <td :style="{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.02)' : '#f5f5f5'}`, padding: '16px 24px' }" class="text-right">
              <span :style="{ fontSize: '0.75rem', fontWeight: '600', color: txtSecondary, background: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9', padding: '4px 10px', borderRadius: '6px' }">
                #{{ categoria.id }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'
import { useCustomizerStore } from '@/stores/customizer'

const customizer = useCustomizerStore()
const isDark = computed(() => customizer.activeTheme === 'DarkTheme')

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e')
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888')
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff')
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee')
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa')

const categoriaServicioStore = useCategoriaServicioStore()

onMounted(async () => {
  await categoriaServicioStore.getCategoriasServicio()
})
</script>

<style scoped>
.table-row { transition: background 0.2s ease; }
.table-row:hover { background: rgba(238,111,56,0.03) !important; }
</style>