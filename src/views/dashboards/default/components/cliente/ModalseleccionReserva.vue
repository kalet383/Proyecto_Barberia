<template>
    <div class="reservar-cita-view">
        <!-- Header con botón de volver -->
        <v-card class="mb-6 overflow-hidden" elevation="0" :style="{ border: `1px solid ${cardBorder}`, background: headerBg, borderRadius: '16px' }">
            <v-card-text class="d-flex align-center py-4 px-6">
                <v-btn icon variant="tonal" @click="volver" class="mr-4" :color="isDark ? 'orange-lighten-2' : '#ee6f38'" size="small">
                    <i class="fas fa-arrow-left"></i>
                </v-btn>
                <div>
                    <h2 :style="{ fontSize: '1.25rem', fontWeight: '900', color: txtPrimary, margin: 0, letterSpacing: '-0.5px' }">Reservar Cita</h2>
                    <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0, fontWeight: '600' }">{{ tituloSeccion }}</p>
                </div>
            </v-card-text>
        </v-card>

        <!-- Modal de selección (inicio) -->
        <div v-if="paso === 'seleccion'" class="seleccion-container">
            <v-row class="mt-2">
                <v-col cols="12" md="6">
                    <v-card 
                        class="opcion-card" 
                        elevation="0" 
                        @click="seleccionarOpcion('servicios')"
                        :style="{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: '24px' }"
                    >
                        <v-card-text class="text-center pa-10">
                            <div class="icono-wrapper mb-6">
                                <div class="icono-glow"></div>
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <h3 :style="{ fontSize: '1.5rem', fontWeight: '800', color: txtPrimary, marginBottom: '12px' }">Por Fecha y Hora</h3>
                            <p :style="{ fontSize: '0.9rem', color: txtSecondary, lineHeight: '1.6', marginBottom: '24px' }">
                                Elige tu fecha y hora preferida, te mostraremos los barberos disponibles para ese momento.
                            </p>
                            <v-chip color="#ee6f38" variant="flat" class="px-6 font-weight-bold" rounded="xl">
                                <i class="fas fa-magic mr-2"></i>
                                Más flexible
                            </v-chip>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card 
                        class="opcion-card" 
                        elevation="0" 
                        @click="seleccionarOpcion('barbero')"
                        :style="{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: '24px' }"
                    >
                        <v-card-text class="text-center pa-10">
                            <div class="icono-wrapper mb-6" style="--icon-color: #6366f1;">
                                <div class="icono-glow" style="background: rgba(99, 102, 241, 0.15);"></div>
                                <i class="fas fa-user-tie" style="color: #6366f1;"></i>
                            </div>
                            <h3 :style="{ fontSize: '1.5rem', fontWeight: '800', color: txtPrimary, marginBottom: '12px' }">Por Barbero</h3>
                            <p :style="{ fontSize: '0.9rem', color: txtSecondary, lineHeight: '1.6', marginBottom: '24px' }">
                                Selecciona tu barbero de confianza y elige entre sus espacios disponibles en su agenda.
                            </p>
                            <v-chip color="#6366f1" variant="flat" class="px-6 font-weight-bold" rounded="xl">
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
            <v-card elevation="0" :style="{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '20px', overflow: 'hidden' }">
                <v-card-text class="pa-8">
                    <div class="d-flex align-center mb-8">
                        <div style="width: 4px; height: 24px; background: #ee6f38; border-radius: 4px; margin-right: 12px;"></div>
                        <h3 :style="{ fontSize: '1.4rem', fontWeight: '900', color: txtPrimary, margin: 0 }">Selecciona tu barbero</h3>
                    </div>
                    
                    <v-row v-if="!barberStore.loading">
                        <v-col v-for="barbero in barberStore.barbers" :key="barbero.id" cols="12" sm="6" md="4">
                            <v-card 
                                class="barbero-card-premium" 
                                elevation="0" 
                                @click="seleccionarBarbero(barbero)"
                                :style="{ background: headerBg, border: `1px solid ${cardBorder}`, borderRadius: '20px', overflow: 'hidden' }"
                            >
                                <div class="img-container">
                                    <v-img 
                                        :src="barbero.foto || '/imagenes/barberos/default.png'" 
                                        height="280" 
                                        cover
                                        class="barbero-img"
                                    >
                                        <template v-slot:placeholder>
                                            <div class="d-flex align-center justify-center fill-height" :style="{ background: isDark ? '#1f2937' : '#f3f4f6' }">
                                                <v-progress-circular indeterminate color="#ee6f38"></v-progress-circular>
                                            </div>
                                        </template>
                                        <template v-slot:error>
                                            <div class="d-flex align-center justify-center fill-height" :style="{ background: isDark ? '#1f2937' : '#f3f4f6' }">
                                                <i class="fas fa-user" style="font-size: 60px; color: #9ca3af; opacity: 0.5;"></i>
                                            </div>
                                        </template>
                                    </v-img>
                                    <div class="img-overlay"></div>
                                </div>
                                <div class="pa-5 text-center">
                                    <h4 :style="{ fontSize: '1.1rem', fontWeight: '800', color: txtPrimary, marginBottom: '4px' }">
                                        {{ barbero.nombre }} {{ barbero.apellido }}
                                    </h4>
                                    <p :style="{ fontSize: '0.8rem', color: txtSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }">Esquilador Senior</p>
                                    
                                    <v-btn 
                                        block 
                                        :color="isDark ? '#ee6f38' : '#ee6f38'" 
                                        variant="flat" 
                                        class="mt-4 text-none font-weight-bold"
                                        rounded="lg"
                                        height="44"
                                    >
                                        Elegir Barbero
                                        <i class="fas fa-chevron-right ml-2" style="font-size: 10px;"></i>
                                    </v-btn>
                                </div>
                            </v-card>
                        </v-col>
                    </v-row>

                    <div v-else class="text-center py-16">
                        <v-progress-circular indeterminate color="#ee6f38" size="64" width="4"></v-progress-circular>
                        <p class="mt-4" :style="{ color: txtSecondary, fontWeight: '600' }">Cargando profesionales...</p>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <!-- Modales de reserva -->
        <VistareservaCita v-model="modalReservaServicios" />
        <VistareservacitaBarbero v-model="modalReservaBarbero" />
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { useBarberStore } from '@/stores/barber'
    import { useReservaBarberoStore } from '@/stores/reservaBarbero'
    import { useCustomizerStore } from '@/stores/customizer'
    import VistareservaCita from '@/views/pages/VistareservaCita.vue'
    import VistareservacitaBarbero from '@/views/pages/VistareservacitaBarbero.vue'

    const router = useRouter()
    const barberStore = useBarberStore()
    const reservaBarberoStore = useReservaBarberoStore()
    const customizer = useCustomizerStore()

    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
    
    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
    const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#64748b');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#e2e8f0');
    const headerBg = computed(() => isDark.value ? '#161d2f' : '#ffffff');

    const paso = ref('seleccion') // 'seleccion' | 'barberos' | 'servicios'
    const modalReservaServicios = ref(false)
    const modalReservaBarbero = ref(false)

    const tituloSeccion = computed(() => {
        if (paso.value === 'seleccion') return '¿Cómo deseas agendar?'
        if (paso.value === 'barberos') return 'Elige tu profesional favorito'
        return 'Reserva tu cita'
    })

    const seleccionarOpcion = (tipo) => {
        if (tipo === 'servicios') {
            modalReservaServicios.value = true
        } else if (tipo === 'barbero') {
            paso.value = 'barberos'
        }
    }

    const seleccionarBarbero = async (barbero) => {
        try {
            const horarios = await barberStore.getHorariosBarbero(barbero.id)
            if (!horarios || horarios.length === 0) {
                // Podrías usar un snackbar aquí
                return
            }
            reservaBarberoStore.inicializarConBarbero(barbero, horarios)
            modalReservaBarbero.value = true
        } catch (error) {
            console.error('Error al cargar barbero:', error)
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
        padding: 32px;
        min-height: 100%;
    }

    .seleccion-container {
        max-width: 1000px;
        margin: 0 auto;
    }

    .opcion-card {
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        position: relative;
        overflow: hidden;
    }

    .opcion-card:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
        border-color: #ee6f38 !important;
    }

    .icono-wrapper {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #ee6f38;
        z-index: 1;
    }

    .icono-glow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(238, 111, 56, 0.15);
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        animation: blob-anim 10s infinite linear;
        z-index: -1;
    }

    @keyframes blob-anim {
        0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        33% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
        66% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
        100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
    }

    .barberos-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .barbero-card-premium {
        transition: all 0.4s ease;
        cursor: pointer;
    }

    .barbero-card-premium:hover {
        transform: translateY(-8px);
        box-shadow: 0 15px 30px rgba(0,0,0,0.3) !important;
        border-color: #ee6f38 !important;
    }

    .img-container {
        position: relative;
        overflow: hidden;
    }

    .barbero-img {
        transition: transform 0.6s ease;
    }

    .barbero-card-premium:hover .barbero-img {
        transform: scale(1.08);
    }

    .img-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50%;
        background: linear-gradient(transparent, rgba(0,0,0,0.4));
        pointer-events: none;
    }

    @media (max-width: 600px) {
        .reservar-cita-view { padding: 16px; }
        .opcion-card { margin-bottom: 20px; }
    }
</style>