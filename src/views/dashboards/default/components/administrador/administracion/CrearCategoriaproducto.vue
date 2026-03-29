<template>
  <v-container style="max-width: 600px;">
    <!-- ═══ HEADER ═══ -->
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #1e88e5, #42a5f5); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(30,136,229,0.25);">
        <i class="fas fa-box"></i>
      </div>
      <div>
        <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Categoría de Producto</h2>
        <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Nueva categoría para inventario</p>
      </div>
    </div>

    <!-- ═══ CARD FORMULARIO ═══ -->
    <v-card rounded="xl" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg, boxShadow: shadowColor }">
      <!-- Card header -->
      <div :style="{ padding: '18px 24px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', gap: '12px' }">
        <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(30,136,229,0.15)' : 'rgba(30,136,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e88e5', fontSize: '15px' }">
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
            placeholder="Ej: Shampoos, Ceras, Máquinas..."
            :bg-color="inputBg"
          >
            <template v-slot:prepend-inner>
              <i class="fas fa-pencil-alt" style="color: #1e88e5; font-size: 14px;"></i>
            </template>
          </v-text-field>

          <!-- Botones -->
          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px;">
            <v-btn
              variant="flat"
              rounded="lg"
              :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
              :block="$vuetify.display.xs"
              @click="form.nombre = ''"
              style="font-weight: 700; text-transform: none; letter-spacing: 0;"
            >
              Limpiar
            </v-btn>

            <v-btn
              variant="flat"
              rounded="lg"
              color="primary"
              :disabled="!valid || loading"
              :loading="loading"
              :block="$vuetify.display.xs"
              type="submit"
              style="font-weight: 800; text-transform: none; letter-spacing: 0.5px;"
            >
              <i class="fas fa-save mr-2"></i>
              Guardar categoría
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000" rounded="xl" color="success">
      <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
        <i class="fas fa-check-circle" style="font-size: 16px;"></i>
        {{ snackbarMessage }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCategoriaProductoStore } from '@/stores/CategoriaProducto'
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

// Opcional: mantener el nombre del componente
defineOptions({ name: 'CrearCategoriaproducto' })

const form = ref({ nombre: '' })
const valid = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const loading = ref(false)
const categoriaProductoStore = useCategoriaProductoStore()

const crearCategoria = async () => {
  if (!valid.value) return
  loading.value = true

  try {
    const response = await categoriaProductoStore.createCategoriaProducto(form.value)
    if (response) {
      snackbarMessage.value = 'Categoría creada exitosamente'
      snackbar.value = true
      form.value.nombre = ''
    }
  } catch (error) {
     snackbarMessage.value = 'Error al crear la categoría'
     snackbar.value = true
  } finally {
     loading.value = false
  }
}
</script>