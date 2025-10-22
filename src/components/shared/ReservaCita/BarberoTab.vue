<template>
    <v-container class="barbero-container">
        <h3 class="text-h3 mb-4">Selecciona un profesional</h3>

        <!-- 🔹 Contenedor con scroll -->
        <div class="scroll-barberos">
            <div class="lista-barberos">
                <v-card v-for="barbero in barberoStore.barbers" :key="barbero.id" class="barbero-card" outlined :class="{ 'barbero-seleccionado': barberoSeleccionadoId === barbero.id }">
                    <v-btn size="x-small" variant="outlined" class="btn-seleccionar" @click.stop="seleccionarBarbero(barbero.id)">
                        {{ barberoSeleccionadoId === barbero.id ? 'Seleccionado' : 'Seleccionar' }}
                    </v-btn>
                    <v-avatar size="64" class="ma-4">
                        <v-img :src="barbero.foto" />
                    </v-avatar>
                    <div class="barbero-info">
                        <span class="nombre-barbero">{{ barbero.nombre }}</span>
                        <v-btn variant="text" size="small" class="sobre-mi-btn" @click.stop="abrirDialog(barbero)">
                            Sobre mí
                        </v-btn>
                    </div>
                </v-card>
            </div>
        </div>

        <!-- 🔹 Dialog con la información del barbero -->
        <v-dialog v-model="dialogVisible" max-width="400px">
            <v-card>
                <v-card-title class="text-h4">{{ barberoSeleccionado?.nombre }}</v-card-title>
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

<script>
    import { ref, onMounted } from 'vue';
    import { useBarberStore } from '@/stores/barber';

    export default {
        name: 'BarberoTab',
        setup() {
            const barberoStore = useBarberStore();
            const dialogVisible = ref(false);
            const barberoSeleccionado = ref(null);
            const barberoSeleccionadoId = ref(null);

            const abrirDialog = (barbero) => {
                barberoSeleccionado.value = barbero;
                dialogVisible.value = true;
            };

            const seleccionarBarbero = (id) => {
                barberoSeleccionadoId.value = barberoSeleccionadoId.value === id ? null : id;
            };

            onMounted(() => {
                barberoStore.getBarbers();
            });

            return {
                barberoStore,
                dialogVisible,
                barberoSeleccionado,
                abrirDialog,
                barberoSeleccionadoId,
                seleccionarBarbero
            }
        }
    }
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
    }

    .btn-seleccionar {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 2;
        text-transform: none;
        font-size: 0.7rem;
        border-radius: 8px;
        color: #1976d2;
        transition: all 0.2s ease;
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