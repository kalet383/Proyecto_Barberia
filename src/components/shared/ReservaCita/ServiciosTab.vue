<template>
    <v-container class="servicios-container">
        <h3 class="text-h3 mb-4">Selecciona un servicio</h3>

        <div class="scroll-servicios">
            <div class="lista-servicios">
                <v-card v-for="servicio in ServicioStore.services" :key="servicio.id" class="servicio-card mb-2" :class="{ 'servicio-seleccionado': serviciosSeleccionados.includes(servicio.id) }" outlined @click="abrirDialog(servicio)">

                    <!-- 🔹 Botón de selección -->
                    <v-btn icon size="small" class="btn-seleccionar" variant="outlined" @click.stop="toggleSeleccion(servicio.id)">
                    <i :class="[ 'fa-solid', serviciosSeleccionados.includes(servicio.id) ? 'fa-check' : 'fa-plus', serviciosSeleccionados.includes(servicio.id) ? 'icono-seleccionado' : 'icono-normal'
                    ]"></i>
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
    import { ref, onMounted } from 'vue'
    import { useServiceStore } from '@/stores/services'

    const ServicioStore = useServiceStore()
    const emit = defineEmits(['seleccionados'])
    const dialog = ref(false)
    const servicioSeleccionado = ref(null)
    const serviciosSeleccionados = ref([]) // 🔹 permite seleccionar varios servicios

    const toggleSeleccion = (id) => {
        const index = serviciosSeleccionados.value.indexOf(id)
        if (index > -1) {
            serviciosSeleccionados.value.splice(index, 1)
        } else {
            serviciosSeleccionados.value.push(id)
        }
        // Emitir los IDs seleccionados al padre
        emit('seleccionados', serviciosSeleccionados.value)
    }

    const abrirDialog = (servicio) => {
        servicioSeleccionado.value = servicio
        dialog.value = true
    }

    onMounted(() => {
        ServicioStore.getServices()
    })
</script>

<style scoped>
    .servicios-container {
        max-width: 500px;
        margin-left: 40px;
        text-align: left;
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

    .lista-servicios {
        display: flex;
        flex-direction: column;
        gap: 12px;
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

    /* 🔹 Solo borde resaltado cuando está seleccionado */
    .servicio-seleccionado {
        border: 2px solid #ee6f38 !important;
    }

    /* 🔹 Botón en la esquina superior derecha */
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