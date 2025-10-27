<template>
    <v-container class="barbero-container">
        <h3 class="text-h3 mb-4">Selecciona un profesional</h3>

        <!-- 🔹 Alerta si no hay fecha/hora seleccionada -->
        <v-alert v-if="!reservaStore.tieneFechaYHora" type="info" variant="tonal" class="mb-4">
            Por favor, selecciona primero una fecha y hora en el paso anterior
        </v-alert>

        <!-- 🔹 Lista de barberos disponibles -->
        <div v-else class="scroll-barberos">
            <div v-if="loading" class="text-center py-8">
                <v-progress-circular indeterminate color="primary" />
                <p class="mt-4 text-grey">Buscando barberos disponibles...</p>
            </div>

            <div v-else-if="barberosDisponibles.length === 0" class="text-center py-8">
                <v-icon size="64" color="grey-lighten-1">mdi-account-off-outline</v-icon>
                <p class="mt-4 text-grey">No hay barberos disponibles para esta fecha y hora</p>
            </div>

            <div v-else class="lista-barberos">
                <v-card v-for="barbero in barberosDisponibles" :key="barbero.id" class="barbero-card" outlined :class="{ 'barbero-seleccionado': reservaStore.barberoSeleccionado === barbero.id }">
                    <v-btn size="x-small" variant="outlined" class="btn-seleccionar" :class="{ 'btn-activo': reservaStore.barberoSeleccionado === barbero.id }"@click.stop="seleccionarBarbero(barbero.id)">
                        {{ reservaStore.barberoSeleccionado === barbero.id ? 'Seleccionado' : 'Seleccionar' }}
                    </v-btn>
                    <v-avatar size="64" class="ma-4">
                        <v-img :src="barbero.foto" />
                    </v-avatar>
                    <div class="barbero-info">
                        <span class="nombre-barbero">{{ barbero.nombre }} {{ barbero.apellido }}</span>
                        <v-btn variant="text" size="small" class="sobre-mi-btn" @click.stop="abrirDialog(barbero)">
                            Sobre mí
                        </v-btn>
                    </div>
                </v-card>
            </div>
        </div>

        <!-- 🔹 Dialog con la información del barbero -->
        <v-dialog v-model="dialogVisible" max-width="500px">
            <v-card>
                <v-card-title class="text-h2">{{ barberoSeleccionado?.nombre }}</v-card-title>
                <v-card-text>
                    <v-avatar size="80" class="mb-4">
                        <v-img :src="barberoSeleccionado?.foto" />
                    </v-avatar>
                    <p>{{ barberoSeleccionado?.descripcion || 'Este barbero aún no tiene una descripción.' }}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="dialogVisible = false">Cerrar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, watch } from 'vue';
    import { useBarberStore } from '@/stores/barber';
    import { useReservaStore } from '@/stores/reserva';

    const barberoStore = useBarberStore();
    const reservaStore = useReservaStore();
    const emit = defineEmits(['emitBarbero'])
    const dialogVisible = ref(false);
    const barberoSeleccionado = ref(null);
    const barberosDisponibles = ref([]);
    const loading = ref(false);

    const abrirDialog = (barbero) => {
        barberoSeleccionado.value = barbero;
        dialogVisible.value = true;
    };

    const seleccionarBarbero = (id) => {
        if (reservaStore.barberoSeleccionado === id) {
            reservaStore.setBarbero(null);
            console.log('❌ Deseleccionando barbero');
            emit('emitBarbero', null);
        } else {
            reservaStore.setBarbero(id);
            const barbero = barberosDisponibles.value.find(b => {
                return b.id === id;
            });
            console.log('✅ Barbero encontrado:', barbero);
            emit('emitBarbero', barbero);
        }
    };

    // 🔹 Cargar barberos cuando haya fecha y hora
    const cargarBarberosDisponibles = async () => {
        if (!reservaStore.tieneFechaYHora) {
            barberosDisponibles.value = [];
            return;
        }

        loading.value = true;
        try {
            const barberos = await barberoStore.getBarberosDisponibles(
                reservaStore.diaSemana,
                reservaStore.horaSeleccionada
            );
            barberosDisponibles.value = barberos;
        } catch (error) {
            console.error('Error cargando barberos:', error);
            barberosDisponibles.value = [];
        } finally {
            loading.value = false;
        }
    };

    // 🔹 Watch para recargar cuando cambie fecha/hora
    watch(
        () => [reservaStore.fechaSeleccionada, reservaStore.horaSeleccionada],
        () => {
            cargarBarberosDisponibles();
        },
        { immediate: true }
    );
</script>

<style scoped>
    .barbero-container {
        max-width: 500px;
        margin-left: 40px;
        text-align: left;
    }

    .scroll-barberos {
        max-height: 450px;
        overflow-y: auto;
        padding-right: 8px;
    }

    .scroll-barberos::-webkit-scrollbar {
        width: 8px;
    }

    .scroll-barberos::-webkit-scrollbar-thumb {
        background-color: #b0b0b0;
        border-radius: 10px;
    }

    .scroll-barberos::-webkit-scrollbar-thumb:hover {
        background-color: #8c8c8c;
    }

    .lista-barberos {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .barbero-card {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        transition: 0.2s ease;
        cursor: pointer;
    }

    .barbero-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(4px);
    }

    .barbero-seleccionado {
        border: 2px solid #1976d2 !important;
        background-color: #f5f9ff;
    }

    .btn-seleccionar {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 2;
        text-transform: none;
        font-size: 0.7rem;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .btn-activo {
        background-color: #1976d2 !important;
        color: white !important;
        border-color: #1976d2 !important;
    }

    .barbero-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .nombre-barbero {
        font-size: 1rem;
        color: #333;
        font-weight: 500;
        margin-bottom: 4px;
    }

    .sobre-mi-btn {
        text-transform: none;
        font-size: 0.8rem;
        color: #757575;
        padding: 0;
        min-width: 0;
        align-self: flex-start;
    }
</style>