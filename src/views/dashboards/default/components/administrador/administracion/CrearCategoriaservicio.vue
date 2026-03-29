<template>
  <v-container style="max-width: 600px;">
    <!-- ═══ HEADER ═══ -->
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25);">
        <i class="fas fa-folder-plus"></i>
      </div>
      <div>
        <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Crear Categoría</h2>
        <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Nueva categoría para servicios</p>
      </div>
    </div>

    <!-- ═══ CARD FORMULARIO ═══ -->
    <v-card rounded="xl" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg, boxShadow: shadowColor }">
      <!-- Card header -->
      <div :style="{ padding: '18px 24px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', gap: '12px' }">
        <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(238,111,56,0.15)' : 'rgba(238,111,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ee6f38', fontSize: '15px' }">
          <i class="fas fa-tag"></i>
        </div>
        <span :style="{ fontSize: '1rem', fontWeight: '800', color: txtPrimary, letterSpacing: '0.3px' }">Datos de la categoría</span>
      </div>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="crearCategoria" v-model="valid">
          <!-- Input nombre -->
          <v-text-field
            label="Nombre de la categoría"
            v-model="form.nombre"
            :rules="[v => !!v || 'El nombre es requerido']"
            required
            variant="outlined"
            density="comfortable"
            rounded="lg"
            placeholder="Ej: Cortes, Barba, Combos..."
            :bg-color="inputBg"
          >
            <template v-slot:prepend-inner>
              <i class="fas fa-font" style="color: #ee6f38; font-size: 14px;"></i>
            </template>
          </v-text-field>

          <!-- Info -->
          <div :style="{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '14px', padding: '12px 16px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f8f8', borderRadius: '12px', border: `1px solid ${cardBorder}` }">
            <i class="fas fa-info-circle" style="color: #ee6f38; font-size: 14px; margin-top: 3px;"></i>
            <p :style="{ fontSize: '0.8rem', color: txtSecondary, margin: 0, lineHeight: '1.6' }">
              Las categorías agrupan los servicios en la vista pública. Ejemplo: <strong :style="{ color: txtPrimary }">Cortes</strong>, <strong :style="{ color: txtPrimary }">Barba</strong>, <strong :style="{ color: txtPrimary }">Combos</strong>.
            </p>
          </div>

          <!-- Botones -->
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <span
              class="footer-btn secondary-btn"
              :style="{ 
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', 
                border: `1px solid ${isDark ? '#374151' : '#e0e0e0'}`, cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700', 
                color: txtSecondary, background: isDark ? 'transparent' : 'white'
              }"
              @click="resetForm"
            >
              <i class="fas fa-eraser" style="font-size: 12px;"></i>
              Limpiar
            </span>

            <span
              class="footer-btn primary-btn"
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', borderRadius: '10px',
                cursor: valid && !loading ? 'pointer' : 'not-allowed',
                fontSize: '0.88rem', fontWeight: '800',
                background: valid && !loading ? (isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9') : (isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'),
                color: valid && !loading ? (isDark ? '#4caf50' : '#2e7d32') : (isDark ? '#6b7280' : '#bdbdbd'),
                border: valid && !loading ? (isDark ? '1px solid rgba(76,175,80,0.3)' : 'none') : 'none',
                transition: 'all 0.2s ease',
              }"
              @click="valid && !loading && crearCategoria()"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin" style="font-size: 13px;"></i>
              <i v-else class="fas fa-save" style="font-size: 13px;"></i>
              {{ loading ? 'Enviando...' : 'Guardar' }}
            </span>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- ═══ CATEGORÍAS EXISTENTES ═══ -->
    <v-card
      v-if="categoriaServicioStore.categoriasServicio.length > 0"
      rounded="xl"
      elevation="0"
      :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', marginTop: '28px', background: cardBg, boxShadow: shadowColor }"
    >
      <div :style="{ padding: '18px 24px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2', fontSize: '15px' }">
            <i class="fas fa-list-ul"></i>
          </div>
          <span :style="{ fontSize: '1rem', fontWeight: '800', color: txtPrimary, letterSpacing: '0.3px' }">Categorías existentes</span>
        </div>
        <span :style="{ padding: '4px 12px', borderRadius: '8px', background: isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)', color: isDark ? '#60a5fa' : '#1565c0', fontSize: '0.75rem', fontWeight: '800' }">
          {{ categoriaServicioStore.categoriasServicio.length }} total
        </span>
      </div>

      <div style="padding: 12px 24px;">
        <div
          v-for="cat in categoriaServicioStore.categoriasServicio"
          :key="cat.id"
          :style="{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'}` }"
          class="category-item"
        >
          <span :style="{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(238,111,56,0.15)' : '#fff3e0', color: '#ee6f38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800' }">
            {{ cat.nombre?.charAt(0)?.toUpperCase() }}
          </span>
          <span :style="{ fontSize: '0.9rem', fontWeight: '700', color: txtPrimary, flex: 1 }">
            {{ cat.nombre }}
          </span>
          <span :style="{ fontSize: '0.72rem', color: isDark ? '#4b5563' : '#bbb', fontWeight: '600', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9', padding: '3px 8px', borderRadius: '6px' }">
            ID: {{ cat.id }}
          </span>
        </div>
      </div>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" rounded="xl" :color="isDark ? 'grey-darken-4' : 'grey-darken-3'">
      <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
        <i class="fas fa-check-circle" style="font-size: 16px; color: #4caf50;"></i>
        {{ snackbarMessage }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
const inputBg = computed(() => isDark.value ? '#0d111b' : '#ffffff')
const shadowColor = computed(() => isDark.value ? '0 10px 25px -5px rgba(0,0,0,0.4)' : '0 4px 6px -1px rgba(0,0,0,0.1)')

const form = ref({ nombre: '' })
const valid = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const loading = ref(false)
const categoriaServicioStore = useCategoriaServicioStore()

const resetForm = () => {
  form.value.nombre = ''
}

const crearCategoria = async () => {
  if (!valid.value || loading.value) return
  loading.value = true

  try {
    const response = await categoriaServicioStore.createCategoriaServicio(form.value)
    if (response) {
      snackbarMessage.value = 'Categoría creada exitosamente'
      snackbar.value = true
      form.value.nombre = ''
      // Recargar lista
      await categoriaServicioStore.getCategoriasServicio()
    }
  } catch (e) {
    snackbarMessage.value = 'Error al crear categoría'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await categoriaServicioStore.getCategoriasServicio()
})
</script>

<style scoped>
.category-item:last-child { border-bottom: none !important; }
.footer-btn { transition: all 0.3s ease; }
.footer-btn:hover:not(:disabled) { transform: translateY(-2px); }
.primary-btn:hover:not(:disabled) { background: rgba(76,175,80,0.2) !important; filter: brightness(1.1); }
.secondary-btn:hover { background: rgba(0,0,0,0.02) !important; border-color: #999 !important; }
</style>