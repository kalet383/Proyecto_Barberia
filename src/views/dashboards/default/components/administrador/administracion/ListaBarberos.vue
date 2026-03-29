<template>
    <v-container>
        <!-- ═══ HEADER ═══ -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #1565c0, #1e88e5); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(21,101,192,0.25);">
                    <i class="fas fa-hand-holding-heart"></i>
                </div>
                <div>
                    <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Equipo de Barberos</h2>
                    <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Gestiona el personal y sus turnos</p>
                </div>
            </div>
            <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: isDark ? 'rgba(21,101,192,0.15)' : '#e3f2fd', color: isDark ? '#90caf9' : '#1565c0', fontSize: '0.82rem', fontWeight: '700' }">
                <i class="fas fa-id-badge" style="font-size: 10px;"></i>
                {{ barberStore.barbers.length }} barberos
            </span>
        </div>

        <!-- Loading -->
        <v-progress-linear v-if="barberStore.loading" indeterminate color="#1565c0" rounded class="mb-4" />

        <!-- Error -->
        <v-alert v-if="barberStore.error" type="error" variant="tonal" rounded="lg" class="mb-4">
            {{ barberStore.error }}
        </v-alert>

        <!-- No hay barberos -->
        <div
            v-if="!barberStore.loading && barberStore.barbers.length === 0"
            :style="{ textAlign: 'center', padding: '48px 20px', background: headerBg, border: `1px dashed ${cardBorder}`, borderRadius: '12px' }"
        >
            <div :style="{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? 'rgba(21,101,192,0.1)' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', color: '#1565c0' }">
                <i class="fas fa-user-slash"></i>
            </div>
            <p :style="{ fontWeight: '700', color: txtPrimary, margin: '0 0 4px' }">Sin personal</p>
            <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">No hay barberos registrados actualmente</p>
        </div>

        <!-- Tarjetas -->
        <v-row>
            <v-col v-for="barbero in barberStore.barbers" :key="barbero.id" cols="12" sm="6" md="4" lg="3">
                <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg, height: '100%', display: 'flex', flexDirection: 'column' }">
                    <div style="position: relative;">
                        <v-img :src="barbero.foto || 'https://via.placeholder.com/400x200?text=Sin+Foto'" height="160" cover></v-img>
                        <div style="position: absolute; top: 12px; right: 12px;">
                            <v-btn icon size="x-small" color="white" elevation="2">
                                <i class="fas fa-ellipsis-v" style="font-size: 11px; color: #1a1a2e;"></i>
                            </v-btn>
                        </div>
                    </div>

                    <v-card-text class="pa-4 flex-grow-1">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                            <span :style="{ display: 'inline-block', padding: '2px 8px', borderRadius: '4px', background: isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9', color: isDark ? '#81c784' : '#2e7d32', fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase' }">Activo</span>
                        </div>
                        <h3 :style="{ fontSize: '1rem', fontWeight: '800', color: txtPrimary, marginBottom: '6px', lineHeight: '1.2' }">
                            {{ barbero.nombre }} {{ barbero.apellido }}
                        </h3>
                        <p :style="{ fontSize: '0.78rem', color: txtSecondary, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }">
                            <i class="far fa-envelope" style="font-size: 11px;"></i> {{ barbero.email }}
                        </p>
                        <p :style="{ fontSize: '0.78rem', color: txtSecondary, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }">
                            <i class="fas fa-phone-alt" style="font-size: 11px; color: #4caf50;"></i> {{ barbero.telefono || 'No registrado' }}
                        </p>
                    </v-card-text>
                    
                    <v-divider :style="{ borderColor: cardBorder }" />
                    
                    <div class="pa-3" style="display: flex; gap: 8px;">
                        <span :style="{ flex: 1, textAlign: 'center', padding: '6px', borderRadius: '6px', background: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', color: isDark ? '#90caf9' : '#1565c0', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }">
                            Ver Perfil
                        </span>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { onMounted, computed } from 'vue'
    import { useBarberStore } from '@/stores/barber'
    import { useCustomizerStore } from '@/stores/customizer';

    const barberStore = useBarberStore()
    const customizer = useCustomizerStore();
    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
    const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
    const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

    onMounted(() => {
        barberStore.getBarbers()
    })
</script>