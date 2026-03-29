<template>
  <v-container style="max-width: 720px;">
    <!-- ═══ HEADER ═══ -->
    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25);">
        <i class="fas fa-plus-circle"></i>
      </div>
      <div>
        <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Crear Nuevo Servicio</h2>
        <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Agrega un servicio a tu barbería</p>
      </div>
    </div>

    <!-- Error -->
    <v-alert v-if="errorMsg" type="error" variant="tonal" rounded="lg" closable class="mb-4" @click:close="errorMsg = ''">
      {{ errorMsg }}
    </v-alert>

    <!-- ═══ FORMULARIO ═══ -->
    <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg }">
      <!-- Section: Datos básicos -->
      <div :style="{ padding: '16px 20px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(238,111,56,0.1); display: flex; align-items: center; justify-content: center; color: #ee6f38; font-size: 14px;">
          <i class="fas fa-info-circle"></i>
        </div>
        <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary }">Información del servicio</span>
      </div>

      <v-card-text class="pa-5">
        <v-form @submit.prevent="crearServicio" v-model="valid">
          <v-row dense>
            <!-- Nombre -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Nombre del servicio *"
                v-model="form.nombre"
                :rules="[v => !!v || 'Requerido']"
                variant="outlined"
                density="comfortable"
                rounded="lg"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-scissors" style="color: #ee6f38; font-size: 14px;"></i>
                </template>
              </v-text-field>
            </v-col>

            <!-- Categoría -->
            <v-col cols="12" md="6">
              <v-select
                label="Categoría *"
                v-model="form.categoriaId"
                :items="categorias"
                item-title="nombre"
                item-value="id"
                :rules="[v => !!v || 'Requerida']"
                variant="outlined"
                density="comfortable"
                rounded="lg"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-folder" style="color: #9c27b0; font-size: 14px;"></i>
                </template>
              </v-select>
            </v-col>

            <!-- Descripción -->
            <v-col cols="12">
              <v-textarea
                label="Descripción *"
                v-model="form.descripcion"
                :rules="[v => !!v || 'Requerida']"
                auto-grow
                variant="outlined"
                density="comfortable"
                rounded="lg"
                rows="2"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-align-left" style="color: #1976d2; font-size: 14px;"></i>
                </template>
              </v-textarea>
            </v-col>

            <!-- Precio -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Precio *"
                v-model.number="form.precio"
                type="number"
                prefix="$"
                :rules="[v => (v !== null && v > 0) || 'Mayor que 0']"
                variant="outlined"
                density="comfortable"
                rounded="lg"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-dollar-sign" style="color: #4caf50; font-size: 14px;"></i>
                </template>
              </v-text-field>
            </v-col>

            <!-- Duración -->
            <v-col cols="12" md="6">
              <v-text-field
                label="Duración *"
                v-model="form.duracion"
                placeholder="00:30"
                :rules="[v => /^\d{2}:\d{2}$/.test(v) || 'Formato HH:MM']"
                hint="Ej: 00:30 para 30 min · 01:00 para 1h"
                persistent-hint
                variant="outlined"
                density="comfortable"
                rounded="lg"
              >
                <template v-slot:prepend-inner>
                  <i class="fas fa-clock" style="color: #2196f3; font-size: 14px;"></i>
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <!-- ═══ SECCIÓN MULTIMEDIA ═══ -->
          <div :style="{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${cardBorder}` }">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(156,39,176,0.1); display: flex; align-items: center; justify-content: center; color: #9c27b0; font-size: 14px;">
                  <i class="fas fa-photo-video"></i>
                </div>
                <div>
                  <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary }">Multimedia</span>
                  <p :style="{ fontSize: '0.72rem', color: txtSecondary, margin: 0 }">Opcional — puedes agregar después</p>
                </div>
              </div>

              <!-- Toggle tipo -->
              <div :style="{ display: 'flex', gap: '4px', background: isDark ? '#0d111b' : '#f5f5f5', borderRadius: '8px', padding: '3px' }">
                <span
                  :style="{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: '700',
                    background: mediaType === 'imagen' ? (isDark ? '#111827' : 'white') : 'transparent',
                    color: mediaType === 'imagen' ? '#ee6f38' : (isDark ? '#4b5563' : '#aaa'),
                    boxShadow: mediaType === 'imagen' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }"
                  @click="mediaType = 'imagen'"
                >
                  <i class="fas fa-image" style="font-size: 11px;"></i>
                  Imagen
                </span>
                <span
                  :style="{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '6px 14px', borderRadius: '6px', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: '700',
                    background: mediaType === 'video' ? (isDark ? '#111827' : 'white') : 'transparent',
                    color: mediaType === 'video' ? '#9c27b0' : (isDark ? '#4b5563' : '#aaa'),
                    boxShadow: mediaType === 'video' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.2s ease',
                  }"
                  @click="mediaType = 'video'"
                >
                  <i class="fas fa-video" style="font-size: 11px;"></i>
                  Video
                </span>
              </div>
            </div>

            <!-- ── IMAGEN ── -->
            <div v-if="mediaType === 'imagen'">
              <input ref="imgInputRef" type="file" accept="image/*" style="display:none" @change="onImgSelected" />

              <div
                v-if="!imgPreviewUrl"
                :style="{
                  border: `2px dashed ${cardBorder}`, borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '150px', cursor: 'pointer', background: headerBg,
                  transition: 'all 0.2s ease', padding: '24px', textAlign: 'center',
                }"
                @click="$refs.imgInputRef.click()"
                @dragover.prevent
                @drop.prevent="onDrop($event, 'imagen')"
                class="drop-zone"
              >
                <i class="fas fa-cloud-upload-alt" :style="{ fontSize: '32px', color: isDark ? '#1f2937' : '#ddd', marginBottom: '8px' }"></i>
                <p :style="{ fontSize: '0.85rem', color: txtSecondary, margin: '0 0 4px' }">Clic o arrastra una imagen</p>
                <p :style="{ fontSize: '0.72rem', color: isDark ? '#374151' : '#ccc', margin: 0 }">JPG, PNG, WEBP</p>
              </div>

              <div v-else style="position: relative; border-radius: 12px; overflow: hidden; border: 2px solid #ee6f38; background: #000;">
                <img :src="imgPreviewUrl" style="width: 100%; max-height: 240px; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px;">
                  <span style="width: 30px; height: 30px; border-radius: 8px; background: white; color: #333; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2);" @click="$refs.imgInputRef.click()">
                    <i class="fas fa-pen" style="font-size: 11px;"></i>
                  </span>
                  <span style="width: 30px; height: 30px; border-radius: 8px; background: #ffebee; color: #c62828; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2);" @click="clearImagen">
                    <i class="fas fa-trash" style="font-size: 11px;"></i>
                  </span>
                </div>
                <span style="position: absolute; bottom: 8px; right: 8px; padding: 3px 10px; border-radius: 6px; background: rgba(238,111,56,0.9); color: white; font-size: 0.68rem; font-weight: 700;">
                  <i class="fas fa-image" style="font-size: 8px; margin-right: 3px;"></i> Imagen
                </span>
              </div>
            </div>

            <!-- ── VIDEO ── -->
            <div v-if="mediaType === 'video'">
              <input ref="videoInputRef" type="file" accept="video/mp4,video/*" style="display:none" @change="onVideoSelected" />

              <div
                v-if="!videoPreviewUrl"
                :style="{
                  border: `2px dashed ${cardBorder}`, borderRadius: '12px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  minHeight: '150px', cursor: 'pointer', background: headerBg,
                  transition: 'all 0.2s ease', padding: '24px', textAlign: 'center',
                }"
                @click="$refs.videoInputRef.click()"
                @dragover.prevent
                @drop.prevent="onDrop($event, 'video')"
                class="drop-zone"
              >
                <i class="fas fa-film" :style="{ fontSize: '32px', color: isDark ? '#1f2937' : '#ddd', marginBottom: '8px' }"></i>
                <p :style="{ fontSize: '0.85rem', color: txtSecondary, margin: '0 0 4px' }">Clic o arrastra un video</p>
                <p :style="{ fontSize: '0.72rem', color: isDark ? '#374151' : '#ccc', margin: 0 }">MP4, WEBM</p>
              </div>

              <div v-else style="position: relative; border-radius: 12px; overflow: hidden; border: 2px solid #9c27b0; background: #000;">
                <video :src="videoPreviewUrl" style="width: 100%; max-height: 240px; object-fit: cover; display: block;" muted autoplay loop playsinline></video>
                <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px;">
                  <span style="width: 30px; height: 30px; border-radius: 8px; background: white; color: #333; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2);" @click="$refs.videoInputRef.click()">
                    <i class="fas fa-pen" style="font-size: 11px;"></i>
                  </span>
                  <span style="width: 30px; height: 30px; border-radius: 8px; background: #ffebee; color: #c62828; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2);" @click="clearVideo">
                    <i class="fas fa-trash" style="font-size: 11px;"></i>
                  </span>
                </div>
                <span style="position: absolute; bottom: 8px; right: 8px; padding: 3px 10px; border-radius: 6px; background: rgba(156,39,176,0.9); color: white; font-size: 0.68rem; font-weight: 700;">
                  <i class="fas fa-video" style="font-size: 8px; margin-right: 3px;"></i> Video
                </span>
              </div>
            </div>

            <!-- Upload progress -->
            <div v-if="uploadingMedia" style="margin-top: 14px;">
              <v-progress-linear :model-value="uploadProgress" color="#ee6f38" rounded height="6" />
              <p style="font-size: 0.75rem; text-align: center; color: #ee6f38; margin: 6px 0 0; font-weight: 600;">
                Subiendo... {{ uploadProgress }}%
              </p>
            </div>
          </div>

          <!-- ═══ BOTÓN GUARDAR ═══ -->
          <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', paddingTop: '20px', borderTop: `1px solid ${cardBorder}` }">
            <span
              :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 18px', borderRadius: '8px', border: `1px solid ${cardBorder}`, cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: txtSecondary }"
              @click="resetForm"
            >
              <i class="fas fa-eraser" style="font-size: 11px;"></i>
              Limpiar
            </span>

            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 26px', borderRadius: '10px',
                cursor: valid && !uploadingMedia && !loading ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem', fontWeight: '700',
                background: valid && !uploadingMedia && !loading ? 'linear-gradient(135deg, #ee6f38, #ff9a6c)' : (isDark ? '#1f2937' : '#f5f5f5'),
                color: valid && !uploadingMedia && !loading ? 'white' : (isDark ? '#374151' : '#bdbdbd'),
                boxShadow: valid && !uploadingMedia && !loading ? '0 4px 14px rgba(238,111,56,0.25)' : 'none',
                transition: 'all 0.2s ease',
              }"
              @click="valid && !uploadingMedia && !loading && crearServicio()"
            >
              <i v-if="loading || uploadingMedia" class="fas fa-spinner fa-spin" style="font-size: 13px;"></i>
              <i v-else class="fas fa-save" style="font-size: 13px;"></i>
              {{ loading || uploadingMedia ? 'Guardando...' : 'Guardar Servicio' }}
            </span>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="4000" rounded="lg">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i :class="snackbarColor === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" style="font-size: 14px;"></i>
        {{ snackbarMessage }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useServiceStore } from '@/stores/services'
import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'
import api from '@/plugins/axios'
import { useCustomizerStore } from '@/stores/customizer';

const serviceStore = useServiceStore()
const categoriaServicioStore = useCategoriaServicioStore()
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

// Form
const form = ref({
  nombre: '',
  descripcion: '',
  precio: null,
  duracion: '',
  categoriaId: null,
  publicado: false,
})

// Media
const mediaType = ref('imagen')
const imgFile = ref(null)
const videoFile = ref(null)
const imgPreviewUrl = ref(null)
const videoPreviewUrl = ref(null)

// UI
const valid = ref(false)
const loading = ref(false)
const uploadingMedia = ref(false)
const uploadProgress = ref(0)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')
const errorMsg = ref('')
const categorias = ref([])
const imgInputRef = ref(null)
const videoInputRef = ref(null)

onMounted(async () => {
  try {
    const data = await categoriaServicioStore.getCategoriasServicio()
    categorias.value = data
  } catch (e) {
    console.error('Error cargando categorías:', e)
  }
})

// Reset
function resetForm() {
  form.value = { nombre: '', descripcion: '', precio: null, duracion: '', categoriaId: null, publicado: false }
  clearImagen()
  clearVideo()
  mediaType.value = 'imagen'
  errorMsg.value = ''
}

// Drag & drop
function onDrop(event, type) {
  const file = event.dataTransfer.files[0]
  if (!file) return
  if (type === 'imagen' && file.type.startsWith('image/')) applyImage(file)
  else if (type === 'video' && file.type.startsWith('video/')) applyVideo(file)
}

// Imagen
function onImgSelected(e) {
  const file = e.target.files[0]
  if (file) applyImage(file)
}

function applyImage(file) {
  imgFile.value = file
  if (imgPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imgPreviewUrl.value)
  imgPreviewUrl.value = URL.createObjectURL(file)
}

function clearImagen() {
  if (imgPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imgPreviewUrl.value)
  imgPreviewUrl.value = null
  imgFile.value = null
  if (imgInputRef.value) imgInputRef.value.value = ''
}

// Video
function onVideoSelected(e) {
  const file = e.target.files[0]
  if (file) applyVideo(file)
}

function applyVideo(file) {
  videoFile.value = file
  if (videoPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(videoPreviewUrl.value)
  videoPreviewUrl.value = URL.createObjectURL(file)
}

function clearVideo() {
  if (videoPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(videoPreviewUrl.value)
  videoPreviewUrl.value = null
  videoFile.value = null
  if (videoInputRef.value) videoInputRef.value.value = ''
}

// Upload
async function uploadMedia(fileRaw) {
  uploadProgress.value = 0
  uploadingMedia.value = true
  try {
    const fd = new FormData()
    fd.append('file', fileRaw)
    const res = await api.post('/servicio/upload-media', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => { if (e.total) uploadProgress.value = Math.round((e.loaded / e.total) * 100) }
    })
    return res.data.url
  } finally {
    uploadingMedia.value = false
    uploadProgress.value = 0
  }
}

// Crear
async function crearServicio() {
  errorMsg.value = ''
  loading.value = true
  try {
    let duracionFinal = form.value.duracion.trim()
    if (/^\d{2}:\d{2}$/.test(duracionFinal)) duracionFinal += ':00'

    const payload = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion,
      precio: Number(form.value.precio),
      duracionAprox: duracionFinal,
      categoriaId: Number(form.value.categoriaId),
      publicado: false,
      imagenUrl: '',
      videoUrl: '',
    }

    if (mediaType.value === 'imagen' && imgFile.value) {
      payload.imagenUrl = await uploadMedia(imgFile.value)
    } else if (mediaType.value === 'video' && videoFile.value) {
      payload.videoUrl = await uploadMedia(videoFile.value)
    }

    await serviceStore.createService(payload)

    snackbarMessage.value = '¡Servicio creado con éxito!'
    snackbarColor.value = 'success'
    snackbar.value = true
    resetForm()
  } catch (err) {
    const serverMsg = err?.response?.data?.message
    const txt = Array.isArray(serverMsg) ? serverMsg.join(' · ') : (serverMsg || err?.message || 'Error al crear')
    errorMsg.value = txt
    snackbarMessage.value = txt
    snackbarColor.value = 'error'
    snackbar.value = true
    uploadingMedia.value = false
  } finally {
    loading.value = false
    uploadProgress.value = 0
  }
}
</script>

<style scoped>
.drop-zone:hover {
  border-color: #ee6f38 !important;
  background: rgba(238, 111, 56, 0.03) !important;
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px !important;
  }
}
</style>