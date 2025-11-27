<template>
    <div>
        <section id="barberos-section">
            <v-container class="py-10" fluid>
                <h2 class="tituloseccion">NUESTRO EQUIPO | Barberos profesionales</h2>
                <p>"En StyleHub, nuestros barberos son artistas del estilo. No solo dominan las tijeras y las máquinas, 
                    también entienden que tu imagen habla por ti. Déjalo en manos de quienes viven para transformar tu look 
                    en una declaración de actitud."
                </p>
                
                <!-- Mostrar loading mientras cargan los barberos -->
                <v-row v-if="barberStore.loading" justify="center" class="my-5">
                    <v-progress-circular indeterminate color="orange"></v-progress-circular>
                </v-row>

                <!-- Contenedor con scroll horizontal cuando hay más de 4 barberos -->
                <div v-else :class="{ 'scroll-container': barberStore.barbers?.length > 4 }">
                    <v-row dense justify="center" align="stretch" class="espaciocards" :class="{ 'scroll-content': barberStore.barbers?.length > 4 }">
                        <v-col v-for="barbero in barberStore.barbers" :key="barbero.id" cols="12" sm="6" md="3" lg="3" class="d-flex">
                            <v-card class="mx-auto card-barbero" max-width="330">
                                <v-img 
                                    height="340px" 
                                    :src="barbero.foto || barbero.photo || '/imagenes/barberos/default.png'" 
                                    cover
                                    class="imagen-barbero"
                                >
                                    <!-- Fallback si no hay imagen -->
                                    <template v-slot:error>
                                        <div class="imagen-placeholder">
                                            <i class="fas fa-user-circle" style="font-size: 100px; color: #666;"></i>
                                        </div>
                                    </template>
                                </v-img>
                                <v-card-title> 
                                    {{ barbero.nombre || 'Barbero' }}
                                    {{ barbero.apellido || '' }} 
                                </v-card-title>
                                <v-card-text> 
                                    {{ 'Barbero profesional - Especialista en cualquier tipo de corte, en barba y masajes - 5 años de experiencia' }} 
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn @click="agendarCon(barbero)"> 
                                        AGENDAR CON {{ (barbero.nombre || 'BARBERO').split(' ')[0].toUpperCase() }} 
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </div>

                <!-- Indicador de scroll solo cuando hay más de 4 barberos -->
                <div v-if="barberStore.barbers?.length > 4" class="scroll-indicator">
                    <i class="fas fa-chevron-left"></i>
                    <span>Desliza para ver más barberos</span>
                    <i class="fas fa-chevron-right"></i>
                </div>

                <!-- Mostrar mensaje si no hay barberos -->
                <v-row v-if="!barberStore.loading && barberStore.barbers?.length === 0" justify="center" class="my-5">
                    <p style="color: #ee6f38;">No hay barberos disponibles en este momento.</p>
                </v-row>
            </v-container>
        </section>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useBarberStore } from '@/stores/barber';

    const barberStore = useBarberStore();

    // Función para agendar cita con un barbero específico
    const agendarCon = (barbero) => {
        console.log('Agendar con:', barbero);
        // Aquí puedes implementar la lógica de agendamiento
    }

    onMounted(async () => {
        await barberStore.getBarbers()
    })
</script>

<style scoped>
    #barberos-section {
        background-color: #000;
    }

    .tituloseccion {
        color: white;
        text-align: center;
        font-size: 2rem;
        margin-bottom: 30px;
        font-weight: bold;
        margin-top: 3%;
    }

    .tituloseccion::after {
        content: '';
        display: block;
        width: 300px;
        height: 4px;
        margin: 8px auto 0 auto;
        background: linear-gradient(to right, #000, #fff, #000);
        border-radius: 2px;
        background-size: 200%;
        animation: animateGradient 3s linear infinite;
    }

    @keyframes animateGradient {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: 0 0;
        }
    }

    p {
        color: white;
        text-align: center;
        font-weight: bold;
        margin-bottom: 2%;
    }

    /* SCROLL HORIZONTAL - Solo cuando hay más de 4 barberos */
    .scroll-container {
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 20px;
        margin-bottom: 20px;
    }

    .scroll-container::-webkit-scrollbar {
        height: 10px;
    }

    .scroll-container::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 5px;
    }

    .scroll-container::-webkit-scrollbar-thumb {
        background: #ee6f38;
        border-radius: 5px;
        transition: background 0.3s ease;
    }

    .scroll-container::-webkit-scrollbar-thumb:hover {
        background: #ff7043;
    }

    .scroll-content {
        flex-wrap: nowrap !important;
        width: max-content;
    }

    .scroll-content .v-col {
        flex: 0 0 auto;
        max-width: none;
    }

    /* Indicador de scroll */
    .scroll-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: #ee6f38;
        font-weight: bold;
        margin-top: 10px;
        margin-bottom: 30px;
        animation: pulse 2s infinite;
    }

    .scroll-indicator i {
        font-size: 20px;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    /* ESTILOS PARA LAS TARJETAS - MANTENER DISEÑO ORIGINAL */
    .card-barbero {
        height: 100% !important;
        min-height: 580px;
        display: flex;
        flex-direction: column;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 2px solid transparent;
    }

    .card-barbero:hover {
        transform: scale(1.03);
        box-shadow: 0 0 20px #ee6f38;
        border-color: #ee6f38;
    }

    /* Asegurar que la imagen siempre tenga el mismo tamaño */
    .imagen-barbero {
        min-height: 340px !important;
        max-height: 340px !important;
        background-color: #1a1a1a;
    }

    /* Placeholder para cuando no hay imagen */
    .imagen-placeholder {
        width: 100%;
        height: 340px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    }

    .espaciocards {
        margin-left: 8%;
        margin-right: 8%;
        margin-bottom: 5%;
    }

    .v-card-title {
        text-align: center;
        font-weight: bold;
        font-size: 1.4rem !important;
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 16px !important;
    }

    .v-card-text {
        font-weight: bold;
        white-space: normal;
        text-align: start;
        flex-grow: 1;
        min-height: 80px;
    }

    .v-card-actions {
        color: #ee6f38;
        transition: all 0.3s ease;
        justify-content: center;
        margin-top: auto;
        padding: 16px;
    }

    .v-card-actions .v-btn {
        transition: all 0.3s ease;
    }

    .v-card-actions:hover {
        background-color: #ff7043;
    }

    .v-card-actions:hover .v-btn {
        color: white;
        transform: scale(1.05);
        box-shadow: 0 5px 13px rgba(255, 87, 34, 0.4);
    }

    /* Asegurar que todas las columnas tengan la misma altura */
    .d-flex {
        display: flex !important;
    }

    .v-col {
        display: flex;
        flex-direction: column;
    }
</style>