<template>
    <v-container class="barbero-container">
        <div class="section-header mb-5">
            <div class="title-accent"></div>
            <h3 class="section-title" :style="{ color: txtPrimary }">Selecciona un profesional</h3>
        </div>

        <!-- Alerta si no hay fecha/hora -->
        <div v-if="!reservaStore.tieneFechaYHora" class="info-banner mb-4" :style="{ background: headerBg, borderColor: cardBorder }">
            <i class="fas fa-info-circle banner-icon"></i>
            <span :style="{ color: txtSecondary, fontWeight: '600' }">Selecciona primero una fecha y hora en el paso anterior</span>
        </div>

        <div v-else class="scroll-barberos">
            <!-- Loading -->
            <div v-if="loading" class="estado-vacio">
                <v-progress-circular indeterminate color="#ee6f38" size="40" />
                <p class="mt-4 estado-texto" :style="{ color: txtSecondary }">Buscando profesionales disponibles...</p>
            </div>

            <!-- Sin barberos -->
            <div v-else-if="barberosDisponibles.length === 0" class="estado-vacio">
                <div class="empty-icon-wrap" :style="{ background: headerBg }">
                    <i class="fas fa-user-slash" :style="{ color: isDark ? '#374151' : '#ccc' }"></i>
                </div>
                <p class="mt-4 estado-texto" :style="{ color: txtSecondary }">No hay profesionales disponibles para esta fecha y hora</p>
            </div>

            <!-- Lista de barberos -->
            <div v-else class="lista-barberos">
                <div
                    v-for="barbero in barberosDisponibles"
                    :key="barbero.id"
                    class="barbero-card"
                    :class="{ 'barbero-seleccionado': reservaStore.barberoSeleccionado?.id === barbero.id }"
                    @click="seleccionarBarbero(barbero)"
                    :style="reservaStore.barberoSeleccionado?.id !== barbero.id ? { background: cardBg, borderColor: cardBorder } : {}"
                >
                    <!-- Indicador de selección -->
                    <div class="seleccion-indicator" :class="{ activo: reservaStore.barberoSeleccionado?.id === barbero.id }" :style="reservaStore.barberoSeleccionado?.id !== barbero.id ? { borderColor: cardBorder } : {}">
                        <i class="fas fa-check"></i>
                    </div>

                    <div class="barbero-avatar-wrap">
                        <v-avatar size="64" class="barbero-avatar" :style="{ border: `2px solid ${isDark ? '#1e293b' : '#f0f0f0'}` }">
                            <v-img :src="barbero.foto" />
                        </v-avatar>
                        <div class="avatar-ring" :class="{ activo: reservaStore.barberoSeleccionado?.id === barbero.id }"></div>
                    </div>

                    <div class="barbero-info">
                        <span class="nombre-barbero" :style="{ color: txtPrimary }">{{ barbero.nombre }} {{ barbero.apellido }}</span>
                        <span class="barbero-role" :style="{ color: txtSecondary }">Maestro Barbero</span>
                    </div>

                    <button class="sobre-mi-btn" @click.stop="abrirDialog(barbero)" :style="{ borderColor: cardBorder, color: txtSecondary }">
                        <i class="fas fa-id-badge mr-1"></i> Perfil
                    </button>
                </div>
            </div>
        </div>

        <!-- Dialog info barbero -->
        <v-dialog v-model="dialogVisible" max-width="480px">
            <div class="barbero-dialog" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
                <div class="dialog-header">
                    <v-avatar size="100" class="dialog-avatar" :style="{ border: `4px solid ${isDark ? '#ee6f38' : '#ee6f38'}` }">
                        <v-img :src="barberoSeleccionado?.foto" />
                    </v-avatar>
                    <button class="dialog-close" @click="dialogVisible = false" :style="{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)' }">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="dialog-body">
                    <h2 class="dialog-nombre" :style="{ color: txtPrimary }">{{ barberoSeleccionado?.nombre }} {{ barberoSeleccionado?.apellido }}</h2>
                    <span class="dialog-role">Esquilador de Élite · StyleHub</span>
                    <div class="dialog-divider"></div>
                    <p class="dialog-desc" :style="{ color: txtSecondary }">{{ barberoSeleccionado?.descripcion || 'Un experto artesano dedicado a perfeccionar tu estilo con cada corte.' }}</p>
                    <button class="dialog-action-btn" @click="dialogVisible = false">
                        ENTENDIDO
                    </button>
                </div>
            </div>
        </v-dialog>
    </v-container>
</template>

<script setup>
    import { ref, watch, computed } from 'vue';
    import { useBarberStore } from '@/stores/barber';
    import { useReservaStore } from '@/stores/reserva';
    import { useCustomizerStore } from '@/stores/customizer'

    const barberoStore = useBarberStore();
    const reservaStore = useReservaStore();
    const customizer = useCustomizerStore()
    
    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
    
    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
    const txtSecondary = computed(() => isDark.value ? '#a1a1aa' : '#64748b');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eeeeee');
    const headerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');

    const emit = defineEmits(['emit-barbero', 'estado-barbero-siguiente'])
    const dialogVisible = ref(false);
    const barberoSeleccionado = ref(null);
    const barberosDisponibles = ref([]);
    const loading = ref(false);

    const abrirDialog = (barbero) => {
        barberoSeleccionado.value = barbero;
        dialogVisible.value = true;
    };

    const seleccionarBarbero = (barbero) => {
        if (reservaStore.barberoSeleccionado?.id === barbero.id) {
            reservaStore.setBarbero(null);
            emit('emit-barbero', null);
        } else {
            reservaStore.setBarbero(barbero);
            emit('emit-barbero', barbero);
        }
    };

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
            barberosDisponibles.value = [];
        } finally {
            loading.value = false;
        }
    };

    watch(
        () => reservaStore.barberoSeleccionado,
        (barbero) => {
            emit('estado-barbero-siguiente', barbero !== null && barbero !== undefined)
        },
        { immediate: true }
    )

    watch(
        () => [reservaStore.fechaSeleccionada, reservaStore.horaSeleccionada],
        () => { cargarBarberosDisponibles(); },
        { immediate: true }
    );
</script>

<style scoped>
    .barbero-container {
        max-width: 520px;
        margin-left: 32px;
        text-align: left;
        padding: 8px 0;
    }

    .section-header { display: flex; align-items: center; gap: 12px; }

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
    }

    .info-banner {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-radius: 14px;
        border: 1px solid;
        font-size: 0.88rem;
    }

    .banner-icon { color: #ee6f38; font-size: 18px; flex-shrink: 0; }

    .scroll-barberos {
        max-height: 480px;
        overflow-y: auto;
        padding-right: 8px;
    }

    .scroll-barberos::-webkit-scrollbar { width: 4px; }
    .scroll-barberos::-webkit-scrollbar-thumb { background: #ee6f38; border-radius: 4px; }

    .estado-vacio { display: flex; flex-direction: column; align-items: center; padding: 60px 24px; text-align: center; }

    .empty-icon-wrap {
        width: 80px;
        height: 80px;
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    }

    .estado-texto { font-size: 0.95rem; font-weight: 600; margin: 0; max-width: 280px; line-height: 1.5; }

    .lista-barberos { display: flex; flex-direction: column; gap: 12px; }

    .barbero-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 18px 20px;
        border-radius: 18px;
        border: 1.5px solid;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }

    .barbero-card:hover {
        border-color: #ee6f38 !important;
        transform: translateX(6px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
    }

    .barbero-seleccionado {
        border-color: #ee6f38 !important;
        background: linear-gradient(135deg, rgba(238, 111, 56, 0.12), transparent) !important;
        box-shadow: 0 8px 25px rgba(238, 111, 56, 0.15) !important;
    }

    .seleccion-indicator {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.25s ease;
        font-size: 11px;
        color: transparent;
    }

    .seleccion-indicator.activo { background: #ee6f38; border-color: #ee6f38; color: white; transform: rotate(360deg); }

    .barbero-avatar-wrap { position: relative; flex-shrink: 0; }
    .barbero-avatar { box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

    .avatar-ring {
        position: absolute;
        inset: -5px;
        border-radius: 50%;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .avatar-ring.activo { border-color: #ee6f38; transform: scale(1.05); }

    .barbero-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .nombre-barbero { font-size: 1.05rem; font-weight: 800; }
    .barbero-role { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

    .sobre-mi-btn {
        padding: 8px 16px;
        border-radius: 12px;
        border: 1.5px solid;
        background: transparent;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.25s ease;
        white-space: nowrap;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .sobre-mi-btn:hover { border-color: #ee6f38; color: #ee6f38 !important; background: rgba(238, 111, 56, 0.08); }

    .barbero-dialog { border-radius: 24px; overflow: hidden; }

    .dialog-header {
        background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
        padding: 48px 24px 60px;
        display: flex;
        justify-content: center;
        position: relative;
    }

    .dialog-avatar { box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: translateY(10px); }

    .dialog-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .dialog-close:hover { background: rgba(255,255,255,0.2) !important; transform: rotate(90deg); }

    .dialog-body { padding: 40px 32px 32px; text-align: center; position: relative; z-index: 1; }
    .dialog-nombre { font-size: 1.6rem; font-weight: 900; margin: 0 0 8px; }
    .dialog-role { font-size: 0.85rem; color: #ee6f38; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }

    .dialog-divider { width: 50px; height: 4px; background: #ee6f38; border-radius: 2px; margin: 20px auto; }
    .dialog-desc { font-size: 1rem; line-height: 1.7; margin-bottom: 32px; }

    .dialog-action-btn {
        width: 100%;
        padding: 16px;
        border-radius: 14px;
        background: linear-gradient(135deg, #ee6f38, #ff9a6c);
        border: none;
        color: white;
        font-weight: 900;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        letter-spacing: 1px;
    }

    .dialog-action-btn:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(238, 111, 56, 0.4); }

    @media (max-width: 600px) {
        .barbero-container { margin-left: 0; padding: 16px; }
    }
</style>