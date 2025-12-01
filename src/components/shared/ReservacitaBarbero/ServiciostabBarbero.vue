<template>
    <v-container class="servicios-container">
        <div class="header-container">
            <h3 class="text-h4 titulo-servicios">Selecciona un servicio</h3>
            
            <!-- 🔹 Chips de categorías más pequeños -->
            <div class="categoria-chips-container">
                <v-chip-group v-model="categoriaActiva" mandatory>
                    <v-chip
                        v-for="categoria in categoriasOrdenadas"
                        :key="categoria.id"
                        :value="categoria.id"
                        :color="categoriaActiva === categoria.id ? '#ee6f38' : 'default'"
                        :variant="categoriaActiva === categoria.id ? 'elevated' : 'outlined'"
                        @click="scrollToCategoria(categoria.id)"
                        class="chip-categoria"
                        size="small"
                        density="comfortable"
                    >
                        {{ categoria.nombre }}
                    </v-chip>
                </v-chip-group>
            </div>
        </div>

        <div class="scroll-servicios" ref="scrollContainer" @scroll="onScroll">
            <!-- 🔹 Servicios agrupados por categoría -->
            <div
                v-for="categoria in categoriasOrdenadas"
                :key="categoria.id"
                :ref="el => setCategoriaRef(categoria.id, el)"
                class="categoria-seccion"
                :data-categoria-id="categoria.id"
            >
                <h4 class="text-h4 mb-3 categoria-titulo">
                    {{ categoria.nombre }}
                </h4>

                <div class="lista-servicios">
                    <v-card
                        v-for="servicio in serviciosPorCategoria[categoria.id]"
                        :key="servicio.id"
                        class="servicio-card mb-2"
                        :class="{ 'servicio-seleccionado': serviciosSeleccionados.includes(servicio.id) }"
                        outlined
                        @click="abrirDialog(servicio)"
                    >
                        <!-- 🔹 Botón de selección -->
                        <v-btn
                            icon
                            size="small"
                            class="btn-seleccionar"
                            variant="outlined"
                            @click.stop="toggleSeleccion(servicio.id)"
                        >
                            <i
                                :class="[
                                    'fa-solid',
                                    serviciosSeleccionados.includes(servicio.id) ? 'fa-check' : 'fa-plus',
                                    serviciosSeleccionados.includes(servicio.id) ? 'icono-seleccionado' : 'icono-normal'
                                ]"
                            ></i>
                        </v-btn>

                        <v-card-title class="text-h4">
                            {{ servicio.nombre }}
                        </v-card-title>

                        <v-card-subtitle>
                            <div>{{ servicio.descripcion }}</div>
                            <div>
                                <strong>Precio:</strong> {{ servicio.precio || 'No registrado' }}
                                <strong> - Duración Aproximada:</strong> {{ servicio.duracionAprox }}
                            </div>
                        </v-card-subtitle>
                    </v-card>
                </div>
            </div>
        </div>

        <!-- 🔹 Dialog con detalles -->
        <v-dialog v-model="dialog" max-width="600">
            <v-card v-if="servicioSeleccionado">
                <v-card-title class="text-h2">
                    {{ servicioSeleccionado.nombre }}
                </v-card-title>
                <v-card-text>
                    <p>{{ servicioSeleccionado.descripcion }}</p>
                    <br />
                    <p><strong>Precio:</strong> {{ servicioSeleccionado.precio || 'No registrado' }}</p>
                    <p><strong>Duración Aproximada:</strong> {{ servicioSeleccionado.duracionAprox }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="dialog = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, onMounted, watch, computed } from 'vue'
    import { useServiceStore } from '@/stores/services'
    import { useReservaBarberoStore } from '@/stores/reservaBarbero'
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio'

    const ServicioStore = useServiceStore()
    const reservaBarberoStore = useReservaBarberoStore()
    const categoriaServicioStore = useCategoriaServicioStore()
    
    const emit = defineEmits(['seleccionados', 'estado-servicio-siguiente'])
    
    const dialog = ref(false)
    const servicioSeleccionado = ref(null)
    const serviciosSeleccionados = ref([])
    const categorias = ref([])
    const categoriaActiva = ref(null)
    const scrollContainer = ref(null)
    const categoriaRefs = ref({})
    const isScrolling = ref(false)

    // 🔹 Ordenar categorías - "Combos" de primero
    const categoriasOrdenadas = computed(() => {
        const cats = [...categorias.value]
        return cats.sort((a, b) => {
            if (a.nombre.toLowerCase() === 'combos') return -1
            if (b.nombre.toLowerCase() === 'combos') return 1
            return a.nombre.localeCompare(b.nombre)
        })
    })

    // 🔹 Agrupar servicios por categoría
    const serviciosPorCategoria = computed(() => {
        const agrupados = {}
        categoriasOrdenadas.value.forEach(cat => {
            agrupados[cat.id] = ServicioStore.services.filter(
                servicio => servicio.categoria?.id === cat.id
            )
        })
        return agrupados
    })

    const setCategoriaRef = (categoriaId, el) => {
        if (el) {
            categoriaRefs.value[categoriaId] = el
        }
    }

    const scrollToCategoria = (categoriaId) => {
        const elemento = categoriaRefs.value[categoriaId]
        if (elemento && scrollContainer.value) {
            isScrolling.value = true
            const offsetTop = elemento.offsetTop - 20
            scrollContainer.value.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            })
            
            setTimeout(() => {
                isScrolling.value = false
            }, 800)
        }
    }

    const onScroll = () => {
        if (isScrolling.value) return

        const scrollTop = scrollContainer.value?.scrollTop || 0
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
        const habilitarBtnenServicio = nuevoValor.length > 0
        emit('estado-servicio-siguiente', habilitarBtnenServicio)
    }, { deep: true })

    onMounted(async () => {
        await categoriaServicioStore.getCategoriasServicio()
        categorias.value = categoriaServicioStore.categoriasServicio
        
        await ServicioStore.getServices()

        if (categoriasOrdenadas.value.length > 0) {
            categoriaActiva.value = categoriasOrdenadas.value[0].id
        }

        // ⭐ Cargar servicios previamente seleccionados de la store de barbero
        if (reservaBarberoStore.serviciosSeleccionados.length > 0) {
            serviciosSeleccionados.value = [...reservaBarberoStore.serviciosSeleccionados]
        }
    })
</script>

<style scoped>
    .servicios-container {
        max-width: 500px;
        margin-left: 40px;
        text-align: left;
    }

    /* 🔹 Header con título y chips */
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        gap: 12px;
    }

    /* 🔹 Título más pequeño */
    .titulo-servicios {
        font-size: 1.3rem !important;
        font-weight: 600;
        white-space: nowrap;
        margin: 0 !important;
    }

    /* 🔹 Chips de categorías compactos */
    .categoria-chips-container {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
    }

    .chip-categoria {
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
        font-size: 0.75rem !important;
        padding: 4px 8px !important;
        height: 24px !important;
    }

    .chip-categoria:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(238, 111, 56, 0.3);
    }

    .scroll-servicios {
        max-height: 450px;
        overflow-y: auto;
        padding-right: 8px;
    }

    .scroll-servicios::-webkit-scrollbar {
        width: 8px;
    }

    .scroll-servicios::-webkit-scrollbar-thumb {
        background-color: #b0b0b0;
        border-radius: 10px;
    }

    .scroll-servicios::-webkit-scrollbar-thumb:hover {
        background-color: #8c8c8c;
    }

    .categoria-seccion {
        margin-bottom: 24px;
        scroll-margin-top: 20px;
    }

    .categoria-titulo {
        color: #000000;
        font-weight: 600;
        padding-bottom: 8px;
        border-bottom: 2px solid #000000;
    }

    .lista-servicios {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;
    }

    .servicio-card {
        position: relative;
        transition: 0.2s ease;
        cursor: pointer;
    }

    .servicio-card:hover {
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .servicio-seleccionado {
        border: 2px solid #ee6f38 !important;
    }

    .btn-seleccionar {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 2;
        background-color: white;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .btn-seleccionar:hover {
        background-color: #dddada;
    }

    .icono-seleccionado {
        color: #ee6f38;
    }

    .icono-normal {
        color: #666;
    }
</style>