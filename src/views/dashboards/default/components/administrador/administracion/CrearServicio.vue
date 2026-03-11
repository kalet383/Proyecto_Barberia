<template>
    <v-card class="pa-4 elevation-2 rounded-xl">
        <v-card-title class="text-h5 font-weight-bold mb-4">
            <v-icon start color="primary">mdi-content-save-edit</v-icon>
            Crear Nuevo Servicio
        </v-card-title>

        <v-card-text>
            <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4" closable @click:close="errorMsg = ''">
                {{ errorMsg }}
            </v-alert>

            <v-form @submit.prevent="crearServicio" v-model="valid">
                <v-row>
                    <!-- Nombre -->
                    <v-col cols="12" md="6">
                        <v-text-field
                            label="Nombre del servicio *"
                            v-model="form.nombre"
                            :rules="[v => !!v || 'Requerido']"
                            variant="outlined"
                            density="comfortable"
                        />
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
                        />
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
                            rows="2"
                        />
                    </v-col>

                    <!-- Precio -->
                    <v-col cols="12" md="6">
                        <v-text-field
                            label="Precio *"
                            v-model.number="form.precio"
                            type="number"
                            prefix="$"
                            :rules="[v => (v !== null && v > 0) || 'Debe ser mayor que 0']"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>

                    <!-- Duración -->
                    <v-col cols="12" md="6">
                        <v-text-field
                            label="Duración *"
                            v-model="form.duracion"
                            placeholder="00:30"
                            :rules="[v => /^\d{2}:\d{2}$/.test(v) || 'Formato HH:MM (ej: 00:30)']"
                            hint="Ej: 00:30 para 30 min · 01:00 para 1h"
                            persistent-hint
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-divider class="mb-4" />
                        <p class="text-subtitle-1 font-weight-bold mb-1">📎 Media del servicio <span class="text-grey text-body-2">(opcional — puedes agregarlo después)</span></p>
                        <p class="text-caption text-grey mb-4">Elige imagen <strong>O</strong> video para el servicio. Solo se puede tener uno.</p>

                        <!-- Toggle Imagen / Video -->
                        <v-btn-toggle v-model="mediaType" mandatory color="primary" variant="outlined" density="compact" class="mb-4">
                            <v-btn value="imagen" prepend-icon="mdi-image">Imagen</v-btn>
                            <v-btn value="video" prepend-icon="mdi-video">Video</v-btn>
                        </v-btn-toggle>

                        <!-- ── IMAGEN ── -->
                        <div v-if="mediaType === 'imagen'">
                            <input ref="imgInputRef" type="file" accept="image/*" style="display:none" @change="onImgSelected" />

                            <div v-if="!imgPreviewUrl" class="drop-zone" @click="$refs.imgInputRef.click()" @dragover.prevent @drop.prevent="onDrop($event, 'imagen')">
                                <v-icon size="48" color="grey">mdi-image-plus</v-icon>
                                <p class="text-body-2 text-grey mt-2">Haz clic o arrastra una imagen aquí</p>
                                <p class="text-caption text-grey-lighten-1">JPG, PNG, WEBP</p>
                            </div>

                            <div v-else class="preview-container">
                                <img :src="imgPreviewUrl" class="preview-media" />
                                <div class="preview-overlay">
                                    <v-btn color="white" variant="text" size="small" prepend-icon="mdi-pencil" @click="$refs.imgInputRef.click()">Cambiar</v-btn>
                                    <v-btn color="error" variant="text" size="small" prepend-icon="mdi-delete" @click="clearImagen">Quitar</v-btn>
                                </div>
                                <v-chip class="preview-type-badge" color="teal" size="small">Imagen seleccionada</v-chip>
                            </div>
                        </div>

                        <!-- ── VIDEO ── -->
                        <div v-if="mediaType === 'video'">
                            <input ref="videoInputRef" type="file" accept="video/mp4,video/*" style="display:none" @change="onVideoSelected" />

                            <div v-if="!videoPreviewUrl" class="drop-zone" @click="$refs.videoInputRef.click()" @dragover.prevent @drop.prevent="onDrop($event, 'video')">
                                <v-icon size="48" color="grey">mdi-video-plus</v-icon>
                                <p class="text-body-2 text-grey mt-2">Haz clic o arrastra un video aquí</p>
                                <p class="text-caption text-grey-lighten-1">MP4, WEBM</p>
                            </div>

                            <div v-else class="preview-container">
                                <video :src="videoPreviewUrl" class="preview-media" muted autoplay loop playsinline></video>
                                <div class="preview-overlay">
                                    <v-btn color="white" variant="text" size="small" prepend-icon="mdi-pencil" @click="$refs.videoInputRef.click()">Cambiar</v-btn>
                                    <v-btn color="error" variant="text" size="small" prepend-icon="mdi-delete" @click="clearVideo">Quitar</v-btn>
                                </div>
                                <v-chip class="preview-type-badge" color="purple" size="small">Video seleccionado</v-chip>
                            </div>
                        </div>

                        <!-- Barra de progreso -->
                        <div v-if="uploadingMedia" class="mt-3">
                            <v-progress-linear
                                :model-value="uploadProgress"
                                color="primary"
                                rounded
                                height="8"
                            />
                            <p class="text-caption text-center text-primary mt-1">Subiendo archivo... {{ uploadProgress }}%</p>
                        </div>
                    </v-col>
                </v-row>

                <div class="d-flex justify-end mt-6">
                    <v-btn
                        color="primary"
                        size="large"
                        type="submit"
                        :disabled="!valid || uploadingMedia || loading"
                        :loading="loading || uploadingMedia"
                        prepend-icon="mdi-content-save"
                        elevation="2"
                    >
                        Guardar Servicio
                    </v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
        {{ snackbarMessage }}
    </v-snackbar>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useServiceStore } from '@/stores/services'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'
    import api from '@/plugins/axios'

    const serviceStore = useServiceStore()
    const categoriaServicioStore = useCategoriaServicioStore()

    // ── Form ──────────────────────────────────────────────────
    const form = ref({
        nombre: '',
        descripcion: '',
        precio: null,
        duracion: '',
        categoriaId: null,
        publicado: false,
    })

    // ── Media ─────────────────────────────────────────────────
    const mediaType    = ref('imagen')  // 'imagen' | 'video'
    const imgFile      = ref(null)
    const videoFile    = ref(null)
    const imgPreviewUrl   = ref(null)
    const videoPreviewUrl = ref(null)

    // ── UI State ──────────────────────────────────────────────
    const valid          = ref(false)
    const loading        = ref(false)
    const uploadingMedia = ref(false)
    const uploadProgress = ref(0)
    const snackbar       = ref(false)
    const snackbarMessage = ref('')
    const snackbarColor   = ref('success')
    const errorMsg        = ref('')
    const categorias      = ref([])

    // ── Refs for file inputs ──────────────────────────────────
    const imgInputRef   = ref(null)
    const videoInputRef = ref(null)

    onMounted(async () => {
        try {
            const data = await categoriaServicioStore.getCategoriasServicio()
            categorias.value = data
        } catch (e) {
            console.error('Error cargando categorías:', e)
        }
    })

    // ── Drag & drop helper ────────────────────────────────────
    function onDrop(event, type) {
        const file = event.dataTransfer.files[0]
        if (!file) return
        if (type === 'imagen' && file.type.startsWith('image/')) applyImage(file)
        else if (type === 'video' && file.type.startsWith('video/')) applyVideo(file)
    }

    // ── Imagen ────────────────────────────────────────────────
    function onImgSelected(e) {
        const file = e.target.files[0]
        if (!file) return
        applyImage(file)
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

    // ── Video ─────────────────────────────────────────────────
    function onVideoSelected(e) {
        const file = e.target.files[0]
        if (!file) return
        applyVideo(file)
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

    // ── Upload helper ─────────────────────────────────────────
    async function uploadMedia(fileRaw) {
        uploadProgress.value = 0
        uploadingMedia.value = true
        try {
            const fd = new FormData()
            fd.append('file', fileRaw)
            const res = await api.post('/servicio/upload-media', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    if (e.total) uploadProgress.value = Math.round((e.loaded / e.total) * 100)
                }
            })
            return res.data.url  // e.g. /imagenes/servicios/abc.jpg
        } finally {
            uploadingMedia.value = false
            uploadProgress.value = 0
        }
    }

    // ── Crear Servicio ────────────────────────────────────────
    async function crearServicio() {
        errorMsg.value = ''
        loading.value = true
        try {
            // Build clean payload matching the DTO
            let duracionFinal = form.value.duracion.trim()
            if (/^\d{2}:\d{2}$/.test(duracionFinal)) duracionFinal += ':00'

            const payload = {
                nombre:       form.value.nombre,
                descripcion:  form.value.descripcion,
                precio:       Number(form.value.precio),
                duracionAprox: duracionFinal,
                categoriaId:  Number(form.value.categoriaId),
                publicado:    false,
                imagenUrl:    '',
                videoUrl:     '',
            }

            // Upload media if any
            if (mediaType.value === 'imagen' && imgFile.value) {
                uploadingMedia.value = true
                payload.imagenUrl = await uploadMedia(imgFile.value)
            } else if (mediaType.value === 'video' && videoFile.value) {
                uploadingMedia.value = true
                payload.videoUrl = await uploadMedia(videoFile.value)
            }

            await serviceStore.createService(payload)

            snackbarMessage.value = '¡Servicio creado con éxito!'
            snackbarColor.value = 'success'
            snackbar.value = true

            // Reset
            form.value = { nombre: '', descripcion: '', precio: null, duracion: '', categoriaId: null, publicado: false }
            clearImagen()
            clearVideo()
            mediaType.value = 'imagen'
        } catch (err) {
            const serverMsg = err?.response?.data?.message
            const txt = Array.isArray(serverMsg) ? serverMsg.join(' · ') : (serverMsg || err?.message || 'Error al crear el servicio')
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
/* ── Drop zone ── */
.drop-zone {
    border: 2px dashed rgba(0,0,0,0.2);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    cursor: pointer;
    background: rgba(0,0,0,0.02);
    transition: all 0.3s ease;
    padding: 24px;
}

.drop-zone:hover {
    border-color: #1976d2;
    background: rgba(25,118,210,0.04);
}

/* ── Preview ── */
.preview-container {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    border: 2px solid #1976d2;
    background: #000;
    min-height: 200px;
}

.preview-media {
    width: 100%;
    max-height: 280px;
    object-fit: cover;
    display: block;
}

.preview-overlay {
    position: absolute;
    top: 0; left: 0; right: 0;
    padding: 8px 10px;
    display: flex;
    gap: 4px;
    background: linear-gradient(rgba(0,0,0,0.55), transparent);
}

.preview-type-badge {
    position: absolute;
    bottom: 10px;
    right: 10px;
}
</style>