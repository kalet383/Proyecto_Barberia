<template>
    <v-container>
        <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h4 font-weight-bold">Gestión de Servicios</h2>
            <v-chip color="primary" variant="tonal">
                {{ serviceStore.services.length }} Servicios Totales
            </v-chip>
        </div>

        <!-- Loading & Error -->
        <v-progress-linear v-if="serviceStore.loading" indeterminate color="primary" class="mb-4" />
        <v-alert v-if="serviceStore.error" type="error" closable class="mb-4" @click:close="serviceStore.error = null">
            {{ serviceStore.error }}
        </v-alert>

        <!-- No hay servicios -->
        <v-alert v-if="!serviceStore.loading && serviceStore.services.length === 0" type="info" variant="tonal" class="mb-4">
            No hay servicios registrados. Comienza creando uno nuevo.
        </v-alert>

        <!-- Grid de Servicios -->
        <v-row>
            <v-col v-for="servicio in sortedServices" :key="servicio.id" cols="12" md="6" lg="4">
                <v-card class="service-admin-card">
                    <!-- Miniatura: video o imagen -->
                    <div class="card-media-preview">
                        <video v-if="servicio.videoUrl && isValidUrl(servicio.videoUrl)" class="card-preview-video" muted autoplay loop playsinline>
                            <source :src="servicio.videoUrl" type="video/mp4" />
                        </video>
                        <v-img v-else-if="servicio.imagenUrl && isValidUrl(servicio.imagenUrl)"
                            :src="servicio.imagenUrl"
                            height="180"
                            cover
                            class="w-100"
                        />
                        <div v-else class="card-media-empty d-flex flex-column align-center justify-center">
                            <v-icon size="48" color="grey-darken-1">mdi-image-off-outline</v-icon>
                            <span class="text-caption text-grey mt-2">Sin imagen/video</span>
                        </div>
                        <div class="card-name-overlay">{{ servicio.nombre }}</div>
                    </div>

                    <v-card-text class="pt-3">
                        <div class="d-flex gap-2 mb-2 flex-wrap">
                            <v-chip size="small" color="blue-grey" variant="tonal">
                                {{ servicio.categoria?.nombre || 'Sin Categoria' }}
                            </v-chip>
                            <v-chip v-if="servicio.videoUrl && isValidUrl(servicio.videoUrl)" size="small" color="purple" variant="tonal">
                                <v-icon start size="12">mdi-video</v-icon> Video
                            </v-chip>
                            <v-chip v-else-if="servicio.imagenUrl && isValidUrl(servicio.imagenUrl)" size="small" color="teal" variant="tonal">
                                <v-icon start size="12">mdi-image</v-icon> Imagen
                            </v-chip>
                        </div>

                        <p class="text-body-2 text-truncate-2 mb-3">{{ servicio.descripcion }}</p>
                        
                        <div class="d-flex justify-space-between align-center border-t pt-2">
                            <div class="text-subtitle-1 font-weight-bold color-primary">
                                ${{ Number(servicio.precio).toLocaleString() }}
                            </div>
                            <div class="text-caption text-grey">
                                <v-icon size="14">mdi-clock-outline</v-icon> {{ servicio.duracionAprox }}
                            </div>
                        </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="pa-3">
                        <v-btn 
                            :color="servicio.publicado ? 'error' : 'success'" 
                            variant="flat"
                            size="small"
                            :prepend-icon="servicio.publicado ? 'mdi-eye-off' : 'mdi-eye'"
                            :loading="togglingId === servicio.id"
                            @click="togglePublicado(servicio)"
                        >
                            {{ servicio.publicado ? 'Despublicar' : 'Publicar' }}
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-btn
                            color="blue-darken-1"
                            variant="flat"
                            size="small"
                            prepend-icon="mdi-pencil"
                            class="mr-1"
                            @click="editService(servicio)"
                        >
                            Editar
                        </v-btn>
                        <v-btn
                            color="red-darken-1"
                            variant="flat"
                            size="small"
                            prepend-icon="mdi-delete"
                            @click="confirmDelete(servicio)"
                        >
                            Eliminar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- ============================================================
             Dialog de Edición
        ============================================================ -->
        <v-dialog v-model="editDialog" max-width="680px" persistent>
            <v-card rounded="xl">
                <v-card-title class="pa-5 text-h5 font-weight-bold d-flex align-center">
                    <v-icon start color="blue">mdi-pencil</v-icon>
                    Editar Servicio
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="editDialog = false" :disabled="loadingAction"></v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-5">
                    <v-form ref="editForm" v-model="editValid">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field label="Nombre" v-model="currentService.nombre" required variant="outlined" density="compact" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select label="Categoría" v-model="currentService.categoriaId" :items="categorias" item-title="nombre" item-value="id" variant="outlined" density="compact" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea label="Descripción" v-model="currentService.descripcion" rows="2" variant="outlined" density="compact" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Precio" v-model.number="currentService.precio" type="number" prefix="$" variant="outlined" density="compact" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field label="Duración (HH:MM:SS)" v-model="currentService.duracionAprox" variant="outlined" density="compact" />
                            </v-col>


                            <!-- Media selector -->
                            <v-col cols="12">
                                <p class="text-subtitle-2 font-weight-bold mb-1">📎 Media del servicio <span class="text-grey text-caption">(opcional)</span></p>
                                <p class="text-caption text-grey mb-3">Elige imagen <strong>O</strong> video. Solo uno por servicio.</p>

                                <v-btn-toggle v-model="mediaType" mandatory color="primary" variant="outlined" density="compact" class="mb-3">
                                    <v-btn value="imagen" prepend-icon="mdi-image">Imagen</v-btn>
                                    <v-btn value="video" prepend-icon="mdi-video">Video</v-btn>
                                </v-btn-toggle>

                                <!-- IMAGEN -->
                                <div v-if="mediaType === 'imagen'">
                                    <input ref="imgFileEdit" type="file" accept="image/*" style="display:none" @change="onImgFileEdit" />
                                    <div v-if="!imgPreviewUrl" class="edit-drop-zone" @click="$refs.imgFileEdit.click()">
                                        <v-icon size="40" color="grey">mdi-image-plus</v-icon>
                                        <p class="text-body-2 text-grey mt-1">Haz clic para seleccionar una imagen</p>
                                    </div>
                                    <div v-else class="edit-preview-container">
                                        <img :src="imgPreviewUrl" class="edit-preview-media" />
                                        <div class="edit-preview-overlay">
                                            <v-btn color="white" variant="text" size="small" prepend-icon="mdi-pencil" @click="$refs.imgFileEdit.click()">Cambiar</v-btn>
                                            <v-btn color="error" variant="text" size="small" prepend-icon="mdi-delete" @click="clearEditImagen">Quitar</v-btn>
                                        </div>
                                        <v-chip class="edit-preview-badge" color="teal" size="small">Imagen</v-chip>
                                    </div>
                                </div>

                                <!-- VIDEO -->
                                <div v-if="mediaType === 'video'">
                                    <input ref="videoFileEdit" type="file" accept="video/mp4,video/*" style="display:none" @change="onVideoFileEdit" />
                                    <div v-if="!videoPreviewUrl" class="edit-drop-zone" @click="$refs.videoFileEdit.click()">
                                        <v-icon size="40" color="grey">mdi-video-plus</v-icon>
                                        <p class="text-body-2 text-grey mt-1">Haz clic para seleccionar un video</p>
                                    </div>
                                    <div v-else class="edit-preview-container">
                                        <video :src="videoPreviewUrl" class="edit-preview-media" muted autoplay loop playsinline></video>
                                        <div class="edit-preview-overlay">
                                            <v-btn color="white" variant="text" size="small" prepend-icon="mdi-pencil" @click="$refs.videoFileEdit.click()">Cambiar</v-btn>
                                            <v-btn color="error" variant="text" size="small" prepend-icon="mdi-delete" @click="clearEditVideo">Quitar</v-btn>
                                        </div>
                                        <v-chip class="edit-preview-badge" color="purple" size="small">Video</v-chip>
                                    </div>
                                </div>

                                <!-- Progreso -->
                                <div v-if="uploadingMedia" class="mt-3">
                                    <v-progress-linear :model-value="uploadProgress" color="primary" rounded height="8" />
                                    <p class="text-caption text-center text-primary mt-1">Subiendo archivo... {{ uploadProgress }}%</p>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-alert v-if="saveError" type="error" variant="tonal" class="mx-5 mb-2" density="compact">
                    {{ saveError }}
                </v-alert>
                <v-divider></v-divider>
                <v-card-actions class="pa-5">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="editDialog = false" :disabled="loadingAction">Cancelar</v-btn>
                    <v-btn
                        color="primary"
                        variant="elevated"
                        @click="saveEdit"
                        :loading="loadingAction"
                        :disabled="!editValid"
                    >
                        Guardar Cambios
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Dialog Confirmar Borrar -->
        <v-dialog v-model="deleteDialog" max-width="400px">
            <v-card class="pa-4 text-center">
                <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
                <h3 class="text-h6 mb-2">¿Eliminar este servicio?</h3>
                <p class="text-body-2 mb-6">Esta acción no se puede deshacer y podría afectar citas agendadas.</p>
                <div class="d-flex gap-4 justify-center">
                    <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
                    <v-btn color="error" @click="handleDelete" :loading="loadingAction">Eliminar</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useServiceStore } from '@/stores/services';
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio';
    import api from '@/plugins/axios';

    const serviceStore = useServiceStore();
    const categoriaStore = useCategoriaServicioStore();

    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const editValid = ref(false);
    const loadingAction = ref(false);
    const uploadingMedia = ref(false);
    const uploadProgress = ref(0);
    const currentService = ref({});
    const serviceToDelete = ref(null);
    const togglingId = ref(null);
    const saveError = ref('');

    // Media state
    const mediaType = ref('imagen'); // 'imagen' | 'video'
    const videoFile = ref(null);
    const imgFile = ref(null);
    const imgPreviewUrl = ref(null);
    const videoPreviewUrl = ref(null);

    const categorias = computed(() => categoriaStore.categoriasServicio);

    const sortedServices = computed(() => {
        return [...serviceStore.services].sort((a, b) => b.id - a.id);
    });

    onMounted(async () => {
        await serviceStore.getServices();
        await categoriaStore.getCategoriasServicio();
    });

    // Helper: comprueba si la URL es una ruta real y no una base64 o nombre de archivo
    function isValidUrl(url) {
        if (!url) return false;
        if (url.startsWith('data:')) return false;
        if (url.startsWith('📁')) return false;
        return true;
    }

    const togglePublicado = async (servicio) => {
        togglingId.value = servicio.id;
        try {
            await serviceStore.updateService(servicio.id, { publicado: !servicio.publicado });
        } catch (error) {
            console.error(error);
        } finally {
            togglingId.value = null;
        }
    };

    const editService = (servicio) => {
        currentService.value = { ...servicio };
        // Ensure categoriaId
        if (servicio.categoria && !servicio.categoriaId) {
            currentService.value.categoriaId = servicio.categoria.id;
        }
        // Determine media type based on existing data
        if (isValidUrl(servicio.videoUrl)) {
            mediaType.value = 'video';
            videoPreviewUrl.value = servicio.videoUrl;
        } else {
            mediaType.value = 'imagen';
            imgPreviewUrl.value = isValidUrl(servicio.imagenUrl) ? servicio.imagenUrl : null;
        }
        // Clear pending files
        videoFile.value = null;
        imgFile.value = null;
        saveError.value = '';
        editDialog.value = true;
    };

    const onImgFileEdit = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        imgFile.value = file;
        // Local blob preview
        imgPreviewUrl.value = URL.createObjectURL(file);
        currentService.value.imagenUrl = '';
    };

    const clearEditImagen = () => {
        if (imgPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imgPreviewUrl.value);
        imgPreviewUrl.value = null;
        imgFile.value = null;
    };

    const onVideoFileEdit = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        videoFile.value = file;
        videoPreviewUrl.value = URL.createObjectURL(file);
        currentService.value.videoUrl = '';
    };

    const clearEditVideo = () => {
        if (videoPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(videoPreviewUrl.value);
        videoPreviewUrl.value = null;
        videoFile.value = null;
    };

    const uploadMedia = async (fileRaw) => {
        uploadProgress.value = 0;
        uploadingMedia.value = true;

        try {
            const formData = new FormData();
            formData.append('file', fileRaw);

            const response = await api.post('/servicio/upload-media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    if (e.total) {
                        uploadProgress.value = Math.round((e.loaded / e.total) * 100);
                    }
                },
            });

            return response.data.url; // e.g. /imagenes/servicios/abc123.jpg
        } finally {
            uploadingMedia.value = false;
            uploadProgress.value = 0;
        }
    };

    const saveEdit = async () => {
        loadingAction.value = true;
        try {
            // Build a clean payload with only DTO-accepted fields
            const svc = currentService.value;
            const payload = {
                nombre: svc.nombre,
                descripcion: svc.descripcion,
                precio: Number(svc.precio),
                duracionAprox: svc.duracionAprox,
                categoriaId: svc.categoriaId,
                publicado: svc.publicado,
                imagenUrl: svc.imagenUrl || '',
                videoUrl: svc.videoUrl || '',
            };

            if (mediaType.value === 'imagen') {
                if (imgFile.value) {
                    const url = await uploadMedia(imgFile.value);
                    payload.imagenUrl = url;
                }
                payload.videoUrl = ''; // clear video
            } else if (mediaType.value === 'video') {
                if (videoFile.value) {
                    const url = await uploadMedia(videoFile.value);
                    payload.videoUrl = url;
                }
                payload.imagenUrl = ''; // clear image
            }

            await serviceStore.updateService(currentService.value.id, payload);

            // Clean up blob URLs
            if (imgPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(imgPreviewUrl.value);
            if (videoPreviewUrl.value?.startsWith('blob:')) URL.revokeObjectURL(videoPreviewUrl.value);

            editDialog.value = false;
        } catch (error) {
            const msg = error?.response?.data?.message;
            saveError.value = Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al guardar los cambios.');
            console.error('Error al guardar:', error);
        } finally {
            loadingAction.value = false;
        }
    };

    const confirmDelete = (servicio) => {
        serviceToDelete.value = servicio;
        deleteDialog.value = true;
    };

    const handleDelete = async () => {
        loadingAction.value = true;
        try {
            await serviceStore.deleteService(serviceToDelete.value.id);
            deleteDialog.value = false;
        } catch (error) {
            console.error(error);
        } finally {
            loadingAction.value = false;
        }
    };
</script>

<style scoped>
    .service-admin-card {
        border-radius: 16px;
        transition: all 0.3s ease;
        border: 1px solid rgba(0,0,0,0.06);
        overflow: hidden;
    }

    .service-admin-card:hover {
        box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        transform: translateY(-2px);
    }

    /* Card media preview area */
    .card-media-preview {
        position: relative;
        width: 100%;
        height: 180px;
        overflow: hidden;
        background: #1a1a2e;
    }

    .card-preview-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-media-empty {
        width: 100%;
        height: 100%;
    }

    .card-name-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 8px 12px;
        background: linear-gradient(transparent, rgba(0,0,0,0.75));
        color: white;
        font-weight: 700;
        font-size: 0.9rem;
    }

    .bg-black-transparent {
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
    }

    .text-truncate-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .color-primary { color: #ee6f38; }
    .gap-2 { gap: 8px; }
    .gap-4 { gap: 16px; }
    .w-100 { width: 100%; }
    .flex-1-1 { flex: 1 1 0; }

    /* Preview boxes */
    .media-preview-box {
        position: relative;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        border: 2px solid #1976d2;
        background: #000;
    }

    .preview-img {
        width: 100%;
        max-height: 200px;
        object-fit: cover;
        display: block;
    }

    .preview-video {
        width: 100%;
        max-height: 200px;
        display: block;
        object-fit: contain;
    }

    .preview-badge {
        position: absolute;
        top: 8px;
        right: 8px;
    }

    /* Edit dialog - drop zones */
    .edit-drop-zone {
        border: 2px dashed rgba(0,0,0,0.18);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 120px;
        cursor: pointer;
        background: rgba(0,0,0,0.02);
        transition: all 0.25s ease;
        padding: 20px;
        text-align: center;
    }

    .edit-drop-zone:hover {
        border-color: #1976d2;
        background: rgba(25,118,210,0.04);
    }

    .edit-preview-container {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid #1976d2;
        background: #000;
        min-height: 150px;
    }

    .edit-preview-media {
        width: 100%;
        max-height: 240px;
        object-fit: cover;
        display: block;
    }

    .edit-preview-overlay {
        position: absolute;
        top: 0; left: 0; right: 0;
        padding: 6px 8px;
        display: flex;
        gap: 4px;
        background: linear-gradient(rgba(0,0,0,0.5), transparent);
    }

    .edit-preview-badge {
        position: absolute;
        bottom: 8px;
        right: 8px;
    }
</style>