<template>
    <div class="reservar-cita-view">
        <!-- Header con botón de volver -->
        <v-card class="mb-4" elevation="2">
            <v-card-text class="d-flex align-items-center">
                <v-btn icon variant="text" @click="volver" class="mr-3">
                    <i class="fas fa-arrow-left"></i>
                </v-btn>
                <div>
                    <h2 class="text-h5 mb-0">Reservar Cita</h2>
                    <p class="text-caption text-grey mb-0">{{ tituloSeccion }}</p>
                </div>
            </v-card-text>
        </v-card>

        <!-- Modal de selección (inicio) -->
        <div v-if="paso === 'seleccion'" class="seleccion-container">
            <v-row>
                <v-col cols="12" md="6">
                    <v-card class="opcion-card" elevation="2" hover @click="seleccionarOpcion('servicios')">
                        <v-card-text class="text-center pa-8">
                            <div class="icono-container mb-4">
                                <i class="fas fa-calendar-day" style="font-size: 64px; color: #ee6f38;"></i>
                            </div>
                            <h3 class="text-h5 mb-3">Por Fecha y Hora</h3>
                            <p class="text-body-2 text-grey-darken-1">
                                Elige tu fecha y hora preferida, te mostraremos los barberos disponibles
                            </p>
                            <v-chip color="#ee6f38" variant="flat" class="mt-4">
                                <i class="fas fa-clock mr-2"></i>
                                Más flexible
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card class="opcion-card" elevation="2" hover @click="seleccionarOpcion('barbero')">
                        <v-card-text class="text-center pa-8">
                            <div class="icono-container mb-4">
                                <i class="fas fa-user-tie" style="font-size: 64px; color: #ee6f38;"></i>
                            </div>
                            <h3 class="text-h5 mb-3">Por Barbero</h3>
                            <p class="text-body-2 text-grey-darken-1">
                                Selecciona tu barbero favorito y elige entre sus horarios disponibles
                            </p>
                            <v-chip color="#ee6f38" variant="flat" class="mt-4">
                                <i class="fas fa-star mr-2"></i>
                                Tu favorito
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <!-- Selección de barbero -->
        <div v-else-if="paso === 'barberos'" class="barberos-container">
            <v-card>
                <v-card-text>
                    <h3 class="text-h5 mb-4">Selecciona tu barbero</h3>
                    
                    <v-row v-if="!barberStore.loading">
                        <v-col v-for="barbero in barberStore.barbers" :key="barbero.id" cols="12" sm="6" md="4">
                            <v-card class="barbero-card" elevation="2" hover @click="seleccionarBarbero(barbero)">
                                <v-img 
                                :src="barbero.foto || '/imagenes/barberos/default.png'" 
                                height="250" 
                                cover
                                >
                                <template v-slot:error>
                                    <div class="d-flex align-center justify-center fill-height bg-grey-lighten-2">
                                    <i class="fas fa-user" style="font-size: 80px; color: #999;"></i>
                                    </div>
                                </template>
                                </v-img>
                                <v-card-title class="text-center">
                                    {{ barbero.nombre }} {{ barbero.apellido }}
                                </v-card-title>
                                <v-card-text class="text-center">
                                    <p class="text-caption text-grey">Barbero profesional</p>
                                </v-card-text>
                                <v-card-actions class="justify-center pb-4">
                                    <v-btn color="#ee6f38" variant="flat">
                                        Seleccionar
                                        <i class="fas fa-arrow-right ml-2"></i>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>

                    <div v-else class="text-center py-8">
                        <v-progress-circular indeterminate color="#ee6f38"></v-progress-circular>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <!-- Modales de reserva (estos sí son fullscreen) -->
        <VistareservaCita v-model="modalReservaServicios" />
        <VistareservacitaBarbero v-model="modalReservaBarbero" />
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useBarberStore } from '@/stores/barber'
    import { useReservaBarberoStore } from '@/stores/reservaBarbero'
    import VistareservaCita from '@/views/pages/VistareservaCita.vue'
    import VistareservacitaBarbero from '@/views/pages/VistareservacitaBarbero.vue'

    const router = useRouter()
    const barberStore = useBarberStore()
    const reservaBarberoStore = useReservaBarberoStore()

    const paso = ref('seleccion') // 'seleccion' | 'barberos' | 'servicios'
    const modalReservaServicios = ref(false)
    const modalReservaBarbero = ref(false)

    const tituloSeccion = computed(() => {
        if (paso.value === 'seleccion') return '¿Cómo deseas agendar?'
        if (paso.value === 'barberos') return 'Elige tu barbero favorito'
        return 'Reserva tu cita'
    })

    const seleccionarOpcion = (tipo) => {
        if (tipo === 'servicios') {
            // Abrir modal de servicios directamente
            modalReservaServicios.value = true
        } else if (tipo === 'barbero') {
            // Mostrar lista de barberos
            paso.value = 'barberos'
        }
    }

    const seleccionarBarbero = async (barbero) => {
        try {
            // Obtener horarios del barbero
            const horarios = await barberStore.getHorariosBarbero(barbero.id)
            
            if (!horarios || horarios.length === 0) {
            alert(`${barbero.nombre} no tiene horarios disponibles`)
            return
            }
            
            // Inicializar reserva con el barbero
            reservaBarberoStore.inicializarConBarbero(barbero, horarios)
            
            // Abrir modal de reserva
            modalReservaBarbero.value = true
            
        } catch (error) {
            console.error('Error al cargar barbero:', error)
            alert('Error al cargar los horarios del barbero')
        }
    }

    const volver = () => {
        if (paso.value === 'barberos') {
            paso.value = 'seleccion'
        } else {
            router.push('/dashboard')
        }
    }

    onMounted(async () => {
        await barberStore.getBarbers()
    })
</script>

<style scoped>
    .reservar-cita-view {
        padding: 24px;
    }

    .seleccion-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 40px 0;
    }

    .opcion-card {
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        height: 100%;
    }

    .opcion-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 24px rgba(238, 111, 56, 0.3) !important;
        border-color: #ee6f38;
    }

    .icono-container {
        padding: 20px;
        background: rgba(238, 111, 56, 0.1);
        border-radius: 50%;
        display: inline-block;
    }

    .barberos-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .barbero-card {
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .barbero-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(238, 111, 56, 0.3) !important;
        border-color: #ee6f38;
    }
</style>