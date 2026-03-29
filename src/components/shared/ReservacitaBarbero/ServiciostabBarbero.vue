<template>
    <v-container class="servicios-container">
        <div class="section-header mb-6">
            <div class="title-accent"></div>
            <h3 class="section-title" :style="{ color: txtPrimary }">Selecciona un servicio</h3>

            <div class="categoria-chips-container mt-2">
                <button
                    v-for="categoria in categoriasOrdenadas"
                    :key="categoria.id"
                    class="chip-categoria"
                    :class="{ activo: categoriaActiva === categoria.id }"
                    @click="scrollToCategoria(categoria.id); categoriaActiva = categoria.id"
                    :style="categoriaActiva !== categoria.id ? { background: headerBg, borderColor: cardBorder, color: txtSecondary } : {}"
                >
                    {{ categoria.nombre }}
                </button>
            </div>
        </div>

        <div class="scroll-servicios" ref="scrollContainer" @scroll="onScroll">
            <div
                v-for="categoria in categoriasOrdenadas"
                :key="categoria.id"
                :ref="el => setCategoriaRef(categoria.id, el)"
                class="categoria-seccion"
                :data-categoria-id="categoria.id"
            >
                <div class="categoria-header" :style="{ borderBottom: `1px solid ${cardBorder}` }">
                    <div class="categoria-dot"></div>
                    <h4 class="categoria-titulo" :style="{ color: txtPrimary }">{{ categoria.nombre }}</h4>
                </div>

                <div class="lista-servicios">
                    <div
                        v-for="servicio in serviciosPorCategoria[categoria.id]"
                        :key="servicio.id"
                        class="servicio-card"
                        :class="{ 'servicio-seleccionado': serviciosSeleccionados.includes(servicio.id) }"
                        @click="toggleSeleccion(servicio.id)"
                        :style="!serviciosSeleccionados.includes(servicio.id) ? { background: cardBg, borderColor: cardBorder } : {}"
                    >
                        <button
                            class="toggle-btn"
                            :class="{ seleccionado: serviciosSeleccionados.includes(servicio.id) }"
                            :style="!serviciosSeleccionados.includes(servicio.id) ? { borderColor: cardBorder, color: txtSecondary } : {}"
                        >
                            <i :class="['fa-solid', serviciosSeleccionados.includes(servicio.id) ? 'fa-check' : 'fa-plus']"></i>
                        </button>

                        <div class="servicio-contenido">
                            <h5 class="servicio-nombre" :style="{ color: txtPrimary }">{{ servicio.nombre }}</h5>
                            <p class="servicio-desc" :style="{ color: txtSecondary }">{{ servicio.descripcion }}</p>
                            <div class="servicio-meta">
                                <span class="servicio-precio">
                                    <i class="fa-solid fa-tag mr-1"></i>
                                    {{ formatPrecio(servicio.precio) }}
                                </span>
                                <span class="servicio-duracion" :style="{ color: txtSecondary }">
                                    <i class="fa-regular fa-clock mr-1"></i>
                                    {{ servicio.duracionAprox }}
                                </span>
                            </div>
                        </div>

                        <div class="servicio-arrow" @click.stop="abrirDialog(servicio)" :style="{ color: isDark ? '#374151' : '#ccc' }">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dialog -->
        <v-dialog v-model="dialog" max-width="520">
            <div v-if="servicioSeleccionado" class="servicio-dialog" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
                <div class="servicio-dialog-header">
                    <div class="servicio-dialog-icon">
                        <i class="fa-solid fa-scissors"></i>
                    </div>
                    <button class="dialog-close-btn" @click="dialog = false" :style="{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)' }">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="servicio-dialog-body pa-8">
                    <h2 class="servicio-dialog-nombre" :style="{ color: txtPrimary }">{{ servicioSeleccionado.nombre }}</h2>
                    <p class="servicio-dialog-desc" :style="{ color: txtSecondary }">{{ servicioSeleccionado.descripcion }}</p>

                    <div class="servicio-dialog-meta mb-8">
                        <div class="meta-item" :style="{ background: headerBg }">
                            <i class="fa-solid fa-tag"></i>
                            <div>
                                <span class="meta-label">Precio</span>
                                <span class="meta-valor" :style="{ color: txtPrimary }">{{ formatPrecio(servicioSeleccionado.precio) }}</span>
                            </div>
                        </div>
                        <div class="meta-item" :style="{ background: headerBg }">
                            <i class="fa-regular fa-clock"></i>
                            <div>
                                <span class="meta-label">Duración</span>
                                <span class="meta-valor" :style="{ color: txtPrimary }">{{ servicioSeleccionado.duracionAprox }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="servicio-dialog-actions">
                        <button class="btn-secondary" @click="dialog = false" :style="{ borderColor: cardBorder, color: txtSecondary }">Cerrar</button>
                        <button
                            class="btn-primary"
                            :class="{ activo: serviciosSeleccionados.includes(servicioSeleccionado.id) }"
                            @click="toggleSeleccion(servicioSeleccionado.id); dialog = false"
                        >
                            <i :class="['fa-solid mr-2', serviciosSeleccionados.includes(servicioSeleccionado.id) ? 'fa-check' : 'fa-plus']"></i>
                            {{ serviciosSeleccionados.includes(servicioSeleccionado.id) ? 'Quitar servicio' : 'Añadir servicio' }}
                        </button>
                    </div>
                </div>
            </div>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, onMounted, watch, computed } from 'vue'
    import { useServiceStore } from '@/stores/services'
    import { useReservaBarberoStore } from '@/stores/reservaBarbero'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'
    import { useCustomizerStore } from '@/stores/customizer'

    const ServicioStore = useServiceStore()
    const reservaBarberoStore = useReservaBarberoStore()
    const categoriaServicioStore = useCategoriaServicioStore()
    const customizer = useCustomizerStore()

    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
    
    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a1a');
    const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#666');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eeeeee');
    const headerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');

    const emit = defineEmits(['seleccionados', 'estado-servicio-siguiente'])

    const dialog = ref(false)
    const servicioSeleccionado = ref(null)
    const serviciosSeleccionados = ref([])
    const categorias = ref([])
    const categoriaActiva = ref(null)
    const scrollContainer = ref(null)
    const categoriaRefs = ref({})
    const isScrolling = ref(false)

    const formatPrecio = (precio) => {
        if (precio === null || precio === undefined || precio === '') return 'No registrado'
        const num = typeof precio === 'string' ? parseFloat(precio.replace(/[^0-9.-]+/g, '')) : precio
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(num || 0)
    }

    const categoriasOrdenadas = computed(() => {
        const cats = [...categorias.value]
        return cats.sort((a, b) => {
            if (a.nombre.toLowerCase() === 'combos') return -1
            if (b.nombre.toLowerCase() === 'combos') return 1
            return a.nombre.localeCompare(b.nombre)
        })
    })

    const serviciosPorCategoria = computed(() => {
        const agrupados = {}
        categoriasOrdenadas.value.forEach(cat => {
            agrupados[cat.id] = ServicioStore.services.filter(s => s.categoria?.id === cat.id)
        })
        return agrupados
    })

    const setCategoriaRef = (categoriaId, el) => {
        if (el) categoriaRefs.value[categoriaId] = el
    }

    const scrollToCategoria = (categoriaId) => {
        const elemento = categoriaRefs.value[categoriaId]
        if (elemento && scrollContainer.value) {
            isScrolling.value = true
            scrollContainer.value.scrollTo({ top: elemento.offsetTop - 20, behavior: 'smooth' })
            setTimeout(() => { isScrolling.value = false }, 800)
        }
    }

    const onScroll = () => {
        if (isScrolling.value) return
        let categoriaVisible = null
        for (const [categoriaId, elemento] of Object.entries(categoriaRefs.value)) {
            if (elemento) {
                const rect = elemento.getBoundingClientRect()
                const containerRect = scrollContainer.value.getBoundingClientRect()
                if (rect.top <= containerRect.top + 100 && rect.bottom > containerRect.top) {
                    categoriaVisible = parseInt(categoriaId)
                }
            }
        }
        if (categoriaVisible && categoriaActiva.value !== categoriaVisible) {
            categoriaActiva.value = categoriaVisible
        }
    }

    const toggleSeleccion = (id) => {
        const index = serviciosSeleccionados.value.indexOf(id)
        if (index > -1) {
            serviciosSeleccionados.value.splice(index, 1)
        } else {
            serviciosSeleccionados.value.push(id)
        }
        emit('seleccionados', serviciosSeleccionados.value)
    }

    const abrirDialog = (servicio) => {
        servicioSeleccionado.value = servicio
        dialog.value = true
    }

    watch(serviciosSeleccionados, (nuevoValor) => {
        emit('estado-servicio-siguiente', nuevoValor.length > 0)
    }, { deep: true })

    onMounted(async () => {
        await categoriaServicioStore.getCategoriasServicio()
        categorias.value = categoriaServicioStore.categoriasServicio
        await ServicioStore.getServices()
        if (categoriasOrdenadas.value.length > 0) {
            categoriaActiva.value = categoriasOrdenadas.value[0].id
        }
        if (reservaBarberoStore.serviciosSeleccionados.length > 0) {
            serviciosSeleccionados.value = [...reservaBarberoStore.serviciosSeleccionados]
        }
    })
</script>

<style scoped>
    .servicios-container {
        max-width: 520px;
        margin-left: 32px;
        text-align: left;
        padding: 8px 0;
    }

    .section-header { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

    .title-accent {
        width: 4px;
        height: 28px;
        background: linear-gradient(180deg, #ee6f38, #ff9a6c);
        border-radius: 4px;
        flex-shrink: 0;
    }

    .section-title {
        font-size: 1.25rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.3px;
        white-space: nowrap;
    }

    .categoria-chips-container { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }

    .chip-categoria {
        padding: 6px 16px;
        border-radius: 20px;
        border: 1.5px solid;
        background: transparent;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        white-space: nowrap;
    }

    .chip-categoria:hover:not(.activo) { border-color: #ee6f38 !important; color: #ee6f38 !important; transform: translateY(-2px); }

    .chip-categoria.activo {
        background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
        border-color: transparent !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(238, 111, 56, 0.3);
        transform: translateY(-2px);
    }

    .scroll-servicios {
        max-height: 480px;
        overflow-y: auto;
        padding-right: 8px;
        margin-top: 10px;
    }

    .scroll-servicios::-webkit-scrollbar { width: 4px; }
    .scroll-servicios::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

    .categoria-seccion { margin-bottom: 28px; scroll-margin-top: 20px; }

    .categoria-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
        padding-bottom: 12px;
    }

    .categoria-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ee6f38;
        box-shadow: 0 0 10px rgba(238, 111, 56, 0.5);
    }

    .categoria-titulo {
        font-size: 0.95rem;
        font-weight: 800;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .lista-servicios { display: flex; flex-direction: column; gap: 10px; }

    .servicio-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 18px 20px;
        border-radius: 16px;
        border: 1.5px solid;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
    }

    .servicio-card:hover {
        border-color: #ee6f38 !important;
        transform: translateX(6px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .servicio-seleccionado {
        border-color: #ee6f38 !important;
        background: linear-gradient(135deg, rgba(238, 111, 56, 0.12), transparent) !important;
        box-shadow: 0 6px 20px rgba(238, 111, 56, 0.15);
    }

    .toggle-btn {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        border: 1.5px solid;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s ease;
        font-size: 14px;
        flex-shrink: 0;
    }

    .toggle-btn.seleccionado { background: #ee6f38; border-color: transparent !important; color: white !important; transform: rotate(360deg); }

    .servicio-nombre { font-size: 1.05rem; font-weight: 800; margin: 0 0 4px; }
    .servicio-desc { font-size: 0.8rem; margin: 0 0 8px; line-height: 1.4; }
    .servicio-meta { display: flex; gap: 16px; }
    .servicio-precio { color: #ee6f38; font-weight: 800; font-size: 0.85rem; }
    .servicio-duracion { font-size: 0.82rem; font-weight: 600; display: flex; align-items: center; gap: 4px; }

    .servicio-arrow { font-size: 14px; margin-left: auto; transition: transform 0.3s ease; }
    .servicio-card:hover .servicio-arrow { transform: translateX(4px); color: #ee6f38 !important; }

    .servicio-dialog { border-radius: 24px; overflow: hidden; }

    .servicio-dialog-header {
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        padding: 40px 24px;
        display: flex;
        justify-content: center;
        position: relative;
    }

    .servicio-dialog-icon {
        width: 72px;
        height: 72px;
        border-radius: 20px;
        background: rgba(238, 111, 56, 0.15);
        border: 2px solid rgba(238, 111, 56, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: #ee6f38;
        transform: rotate(-10deg);
    }

    .dialog-close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .dialog-close-btn:hover { background: rgba(255,255,255,0.2) !important; transform: scale(1.1); }

    .servicio-dialog-nombre { font-size: 1.5rem; fontWeight: 900; marginBottom: 12px; }
    .servicio-dialog-desc { font-size: 1rem; lineHeight: 1.6; margin-bottom: 28px; }

    .servicio-dialog-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    .meta-item { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 16px; }
    .meta-item i { font-size: 20px; color: #ee6f38; }
    .meta-label { display: block; font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; }
    .meta-valor { display: block; font-size: 1rem; font-weight: 800; }

    .btn-secondary { flex: 1; padding: 14px; border-radius: 12px; border: 1.5px solid; background: transparent; font-weight: 700; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: rgba(0,0,0,0.05); }

    .btn-primary {
        flex: 2;
        padding: 14px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(135deg, #ee6f38, #ff9a6c);
        color: white;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4); }
    .btn-primary.activo { background: #1a1a1a; }

    @media (max-width: 600px) {
        .servicios-container { margin-left: 0; padding: 16px; }
        .servicio-dialog-meta { grid-template-columns: 1fr; }
    }
</style>