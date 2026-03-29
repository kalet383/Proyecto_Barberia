<template>
  <v-container>
    <!-- ═══════════════════════════════════════
         HEADER
    ═══════════════════════════════════════ -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25);">
          <i class="fas fa-scissors"></i>
        </div>
        <div>
          <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Gestión de Servicios</h2>
          <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Administra los servicios de tu barbería</p>
        </div>
      </div>
      <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 14px', borderRadius: '8px', background: isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0', color: isDark ? '#ffb74d' : '#e65100', fontSize: '0.82rem', fontWeight: '700' }">
        <i class="fas fa-layer-group" style="font-size: 10px;"></i>
        {{ serviceStore.services.length }} servicios
      </span>
    </div>

    <!-- Loading -->
    <v-progress-linear v-if="serviceStore.loading" indeterminate color="#ee6f38" class="mb-4" rounded />

    <!-- Error -->
    <v-alert
      v-if="serviceStore.error"
      type="error"
      variant="tonal"
      closable
      rounded="lg"
      class="mb-4"
      @click:close="serviceStore.error = null"
    >
      {{ serviceStore.error }}
    </v-alert>

    <!-- Sin servicios -->
    <div
      v-if="!serviceStore.loading && serviceStore.services.length === 0"
      :style="{ textAlign: 'center', padding: '48px 20px', background: headerBg, border: `1px dashed ${cardBorder}`, borderRadius: '12px', marginBottom: '16px' }"
    >
      <div :style="{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', color: '#ee6f38' }">
        <i class="fas fa-scissors"></i>
      </div>
      <p :style="{ fontWeight: '700', color: txtPrimary, margin: '0 0 4px' }">Sin servicios registrados</p>
      <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Comienza creando tu primer servicio</p>
    </div>

    <!-- ═══════════════════════════════════════
         GRID DE SERVICIOS
    ═══════════════════════════════════════ -->
    <v-row>
      <v-col v-for="servicio in sortedServices" :key="servicio.id" cols="10" sm="6" lg="4">
        <v-card class="service-card" rounded="lg" elevation="0" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
          <!-- Media preview -->
          <div class="card-media">
            <video
              v-if="servicio.videoUrl && isValidUrl(servicio.videoUrl)"
              class="media-content"
              muted autoplay loop playsinline
            >
              <source :src="servicio.videoUrl" type="video/mp4" />
            </video>
            <v-img
              v-else-if="servicio.imagenUrl && isValidUrl(servicio.imagenUrl)"
              :src="servicio.imagenUrl"
              height="180"
              cover
            />
            <div v-else class="media-empty" :style="{ background: isDark ? '#0d111b' : '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }">
              <i class="fas fa-image" style="font-size: 32px; color: #ccc;"></i>
              <span style="font-size: 0.75rem; color: #aaa; margin-top: 8px;">Sin multimedia</span>
            </div>

            <!-- Overlay nombre -->
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 14px 10px; background: linear-gradient(transparent, rgba(0,0,0,0.7));">
              <span style="color: white; font-weight: 700; font-size: 0.92rem; line-height: 1.3;">{{ servicio.nombre }}</span>
            </div>

            <!-- Badge destacado -->
            <div
              v-if="servicio.destacado"
              style="position: absolute; top: 10px; right: 10px; width: 32px; height: 32px; border-radius: 8px; background: #fff8e1; display: flex; align-items: center; justify-content: center; color: #f57f17; font-size: 14px; box-shadow: 0 2px 8px rgba(245,158,11,0.3); z-index: 2;"
            >
              <i class="fas fa-star"></i>
            </div>

            <!-- Estado publicado -->
            <span
              :style="{
                position: 'absolute', top: '10px', left: '10px', zIndex: 2,
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '6px',
                fontSize: '0.65rem', fontWeight: '700',
                background: servicio.publicado ? (isDark ? 'rgba(76,175,80,0.2)' : '#e8f5e9') : (isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5'),
                color: servicio.publicado ? (isDark ? '#4caf50' : '#2e7d32') : (isDark ? '#9ca3af' : '#888'),
              }"
            >
              <i :class="servicio.publicado ? 'fas fa-check-circle' : 'fas fa-circle'" style="font-size: 8px;"></i>
              {{ servicio.publicado ? 'Publicado' : 'Borrador' }}
            </span>
          </div>

          <!-- Info -->
          <div style="padding: 14px 14px 8px; flex: 1; display: flex; flex-direction: column;">
            <!-- Tags -->
            <div style="display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap;">
              <!-- Categoría -->
              <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 8px', borderRadius: '4px', background: isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0', color: isDark ? '#ffb74d' : '#e65100', fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }">
                <i class="fas fa-tag" style="font-size: 7px;"></i>
                {{ servicio.categoria?.nombre || 'Sin categoría' }}
              </span>
            </div>

            <!-- Descripción -->
            <p class="desc-truncate" :style="{ fontSize: '0.82rem', color: txtSecondary, lineHeight: '1.5', margin: '0 0 10px' }">
              {{ servicio.descripcion }}
            </p>

            <!-- Precio y duración -->
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: `1px solid ${cardBorder}`, marginTop: 'auto' }">
              <span style="font-size: 1.1rem; font-weight: 800; color: #ee6f38;">
                ${{ (Number(servicio.precio) || 0).toLocaleString() }}
              </span>
              <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '5px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: txtSecondary, fontSize: '0.72rem', fontWeight: '600' }">
                <i class="far fa-clock" style="font-size: 10px; color: #ee6f38;"></i>
                {{ servicio.duracionAprox }}
              </span>
            </div>
          </div>

          <v-divider />

          <!-- ACCIONES -->
          <div style="padding: 10px 14px 14px; display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '7px', cursor: 'pointer',
                fontSize: '0.72rem', fontWeight: '700',
                background: servicio.publicado ? (isDark ? 'rgba(244,67,54,0.1)' : '#ffebee') : (isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e9'),
                color: servicio.publicado ? (isDark ? '#ef5350' : '#c62828') : (isDark ? '#4caf50' : '#2e7d32'),
                opacity: togglingId === servicio.id ? '0.5' : '1',
              }"
              @click="togglePublicado(servicio)"
            >
              <i :class="servicio.publicado ? 'fas fa-eye-slash' : 'fas fa-eye'" style="font-size: 10px;"></i>
              {{ servicio.publicado ? 'Ocultar' : 'Publicar' }}
            </span>

            <!-- Botón Destacar (Estrella) -->
            <span
              :style="{
                width: '32px', height: '32px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: servicio.publicado ? 'pointer' : 'not-allowed',
                background: servicio.destacado ? (isDark ? 'rgba(245,158,11,0.15)' : '#fff8e1') : (isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'),
                color: servicio.destacado ? (isDark ? '#ffb74d' : '#f57f17') : (isDark ? '#6b7280' : '#9e9e9e'),
                transition: 'all 0.2s ease',
                border: servicio.destacado ? `1px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#ffe082'}` : '1px solid transparent',
                opacity: servicio.publicado ? '1' : '0.4'
              }"
              @click="toggleDestacado(servicio)"
              :title="servicio.publicado ? 'Destacar servicio' : 'Debes publicar el servicio primero'"
            >
              <i :class="servicio.destacado ? 'fas fa-star' : 'far fa-star'" style="font-size: 12px;"></i>
            </span>

            <div style="flex: 1;"></div>

            <span
              :style="{ width: '30px', height: '30px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: isDark ? 'rgba(30,136,229,0.1)' : '#e3f2fd', color: isDark ? '#42a5f5' : '#1565c0' }"
              @click="editService(servicio)"
              title="Editar"
            >
              <i class="fas fa-pen" style="font-size: 12px;"></i>
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- Snackbar para notificaciones local -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" rounded="lg">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>

  <!-- DIALOGS -->
  <v-dialog v-model="editDialog" max-width="600" persistent>
    <v-card rounded="lg" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
      <div :style="{ padding: '18px 20px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(238,111,56,0.1); color: #ee6f38; display: flex; align-items: center; justify-content: center; font-size: 14px;">
            <i class="fas fa-edit"></i>
          </div>
          <span :style="{ fontSize: '1rem', fontWeight: '700', color: txtPrimary }">Editar Servicio</span>
        </div>
        <v-btn icon variant="text" size="small" @click="editDialog = false" :color="txtSecondary"><i class="fas fa-times"></i></v-btn>
      </div>

      <v-card-text class="pa-5">
        <v-form v-model="editValid" @submit.prevent="saveService">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Nombre *" v-model="currentService.nombre"
                :rules="[v => !!v || 'Campo requerido']"
                variant="outlined" density="comfortable" rounded="lg"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                label="Descripción *" v-model="currentService.descripcion"
                :rules="[v => !!v || 'Campo requerido']"
                variant="outlined" density="comfortable" rounded="lg" rows="2" auto-grow
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Precio *" v-model.number="currentService.precio"
                type="number" prefix="$"
                variant="outlined" density="comfortable" rounded="lg"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Duración *" v-model="currentService.duracionAprox"
                placeholder="00:30"
                variant="outlined" density="comfortable" rounded="lg"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                label="Categoría" v-model="currentService.categoriaId"
                :items="categoriaStore.categoriasServicio"
                item-title="nombre" item-value="id"
                variant="outlined" density="comfortable" rounded="lg"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn variant="text" :color="txtSecondary" @click="editDialog = false">Cancelar</v-btn>
        <span
          :style="{
            padding: '8px 24px', borderRadius: '8px', cursor: editValid && !loadingAction ? 'pointer' : 'not-allowed',
            fontSize: '0.88rem', fontWeight: '700',
            background: editValid && !loadingAction ? 'linear-gradient(135deg, #ee6f38, #ff9a6c)' : '#f5f5f5',
            color: editValid && !loadingAction ? 'white' : '#bdbdbd',
            transition: 'all 0.2s ease',
          }"
          @click="editValid && !loadingAction && saveService()"
        >
          {{ loadingAction ? 'Guardando...' : 'Guardar Cambios' }}
        </span>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Dialog -->
  <v-dialog v-model="deleteDialog" max-width="400">
    <v-card rounded="lg" :style="{ background: cardBg }">
      <v-card-text class="pa-6 text-center">
        <div style="width: 50px; height: 50px; border-radius: 50%; background: #ffebee; color: #c62828; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 20px;">
          <i class="fas fa-trash"></i>
        </div>
        <h3 :style="{ color: txtPrimary, marginBottom: '8px' }">¿Eliminar servicio?</h3>
        <p :style="{ color: txtSecondary, fontSize: '0.88rem', marginBottom: '24px' }">
          Esta acción no se puede deshacer. Se eliminará el servicio "<strong>{{ currentService.nombre }}</strong>".
        </p>
        <div style="display: flex; gap: 10px;">
          <v-btn block variant="text" :color="txtSecondary" @click="deleteDialog = false" style="flex: 1;">Cancelar</v-btn>
          <v-btn block color="error" rounded="lg" @click="confirmDelete" :loading="loadingAction" style="flex: 1;" class="text-none">Eliminar</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useServiceStore } from '@/stores/services'
import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'
import api from '@/plugins/axios'
import { useCustomizerStore } from '@/stores/customizer';

const serviceStore = useServiceStore()
const categoriaStore = useCategoriaServicioStore()
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

const editDialog = ref(false)
const deleteDialog = ref(false)
const editValid = ref(false)
const loadingAction = ref(false)
const currentService = ref({})
const togglingId = ref(null)

const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const showHint = (msg, color = 'warning') => {
  snackbarText.value = msg
  snackbarColor.value = color
  snackbar.value = true
}

const sortedServices = computed(() => [...serviceStore.services].sort((a, b) => b.id - a.id))

onMounted(async () => {
  await serviceStore.getServices()
  await categoriaStore.getCategoriasServicio()
})

const isValidUrl = (url) => url && !url.startsWith('data:') && !url.startsWith('📁')

const togglePublicado = async (servicio) => {
  togglingId.value = servicio.id
  try {
    await serviceStore.updateService(servicio.id, { publicado: !servicio.publicado })
  } finally {
    togglingId.value = null
  }
}

const toggleDestacado = async (servicio) => {
  if (!servicio.publicado) {
    showHint('Debes publicar el servicio antes de poder destacarlo', 'error')
    return
  }
  try {
    await serviceStore.updateService(servicio.id, { destacado: !servicio.destacado })
    showHint(servicio.destacado ? 'Servicio ya no destacado' : '¡Servicio destacado con éxito!', 'success')
  } catch (err) {
    console.error('Error al destacar:', err)
    showHint('Error al actualizar estado destacado', 'error')
  }
}

const editService = (servicio) => {
  currentService.value = { ...servicio }
  editDialog.value = true
}

const saveService = async () => {
  loadingAction.value = true
  try {
    await serviceStore.updateService(currentService.value.id, {
      nombre: currentService.value.nombre,
      descripcion: currentService.value.descripcion,
      precio: currentService.value.precio,
      duracionAprox: currentService.value.duracionAprox,
      categoriaId: currentService.value.categoriaId
    })
    editDialog.value = false
  } finally {
    loadingAction.value = false
  }
}

const confirmDelete = async () => {
  loadingAction.value = true
  try {
    await serviceStore.deleteService(currentService.value.id)
    deleteDialog.value = false
  } finally {
    loadingAction.value = false
  }
}
</script>

<style scoped>
.service-card { transition: all 0.25s ease; height: 100%; display: flex; flex-direction: column; }
.card-media { position: relative; width: 100%; height: 180px; overflow: hidden; background: #000; }
.media-content { width: 100%; height: 100%; object-fit: cover; }
.desc-truncate { display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>