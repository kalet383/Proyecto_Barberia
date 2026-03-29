<template>
    <v-container>
        <!-- ═══ HEADER ═══ -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 14px;">
                <div :style="{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #1976d2, #64b5f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', boxShadow: '0 4px 12px rgba(25,118,210,0.25)' }">
                    <i class="fas fa-users"></i>
                </div>
                <div>
                    <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">
                        {{ isBarber ? 'Mis Clientes' : 'Gestión de Clientes' }}
                    </h2>
                    <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">
                        {{ isBarber ? 'Personas que has atendido en tus citas' : 'Lista completa de clientes registrados' }}
                    </p>
                </div>
            </div>
            <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: isDark ? 'rgba(25,118,210,0.15)' : '#e3f2fd', color: isDark ? '#90caf9' : '#1565c0', fontSize: '0.82rem', fontWeight: '700' }">
                <i class="fas fa-user-check" style="font-size: 10px;"></i>
                {{ displayedClients.length }} {{ displayedClients.length === 1 ? 'cliente' : 'clientes' }}
            </span>
        </div>

        <!-- Loading -->
        <v-progress-linear v-if="loading" indeterminate color="#1976d2" rounded class="mb-4" />

        <!-- Error -->
        <v-alert v-if="error" type="error" variant="tonal" rounded="lg" class="mb-4">
            {{ error }}
        </v-alert>

        <!-- No hay clientes -->
        <div
            v-if="!loading && displayedClients.length === 0"
            :style="{ textAlign: 'center', padding: '64px 20px', background: headerBg, border: `1px dashed ${cardBorder}`, borderRadius: '16px' }"
        >
            <div :style="{ width: '80px', height: '80px', borderRadius: '50%', background: isDark ? 'rgba(25,118,210,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#1976d2' }">
                <i class="fas fa-user-slash"></i>
            </div>
            <h3 :style="{ fontWeight: '800', color: txtPrimary, margin: '0 0 8px', fontSize: '1.2rem' }">
                {{ isBarber ? 'No has atendido clientes aún' : 'Sin clientes registrados' }}
            </h3>
            <p :style="{ fontSize: '0.9rem', color: txtSecondary, margin: '0 auto', maxWidth: '400px' }">
                {{ isBarber ? 'Cuando completes citas con clientes, aparecerán en esta lista con su información de contacto.' : 'Actualmente no hay clientes en la base de datos.' }}
            </p>
        </div>

        <!-- Tarjetas -->
        <v-row v-else>
            <v-col v-for="cliente in displayedClients" :key="cliente.id" cols="12" sm="6" md="4" lg="3">
                <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg, height: '100%', display: 'flex', flexDirection: 'column' }" class="client-card">
                    <div style="position: relative;">
                        <v-img :src="cliente.foto || 'https://via.placeholder.com/400x200?text=Sin+Foto'" height="160" cover></v-img>
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 12px 8px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; display: flex; align-items: center; gap: 6px;">
                            <i class="fas fa-id-card" style="font-size: 10px; opacity: 0.8;"></i>
                            <span style="font-size: 0.72rem; font-weight: 700;">ID #{{ cliente.id }}</span>
                        </div>
                    </div>

                    <v-card-text class="pa-4 flex-grow-1">
                        <h3 :style="{ fontSize: '1.05rem', fontWeight: '800', color: txtPrimary, marginBottom: '8px', lineHeight: '1.3' }">
                            {{ cliente.nombre }} {{ cliente.apellido }}
                        </h3>
                        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }">
                            <div :style="{ width: '24px', height: '24px', borderRadius: '6px', background: isDark ? 'rgba(144,202,249,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                                <i class="far fa-envelope" :style="{ color: isDark ? '#90caf9' : '#1976d2', fontSize: '11px' }"></i>
                            </div>
                            <span :style="{ fontSize: '0.78rem', color: txtSecondary, wordBreak: 'break-all' }">{{ cliente.email }}</span>
                        </div>
                        <div :style="{ display: 'flex', alignItems: 'center', gap: '10px' }">
                            <div :style="{ width: '24px', height: '24px', borderRadius: '6px', background: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                                <i class="fas fa-phone-alt" :style="{ color: '#4caf50', fontSize: '11px' }"></i>
                            </div>
                            <span :style="{ fontSize: '0.78rem', color: txtSecondary }">{{ cliente.telefono || 'No registrado' }}</span>
                        </div>
                    </v-card-text>
                    
                    <v-divider :style="{ borderColor: cardBorder, opacity: 0.1 }" />
                    
                    <div class="pa-3" style="display: flex; gap: 8px;">
                        <span :style="{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa', color: txtSecondary, fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }">
                            <i class="fas fa-history" style="font-size: 9px; margin-right: 6px;"></i> Ver Historial
                        </span>
                        <span v-if="!isBarber" :style="{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(144,202,249,0.1)' : '#e3f2fd', color: isDark ? '#90caf9' : '#1976d2', cursor: 'pointer' }">
                            <i class="fas fa-edit" style="font-size: 12px;"></i>
                        </span>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { onMounted, computed, ref } from 'vue';
    import { useClientStore } from '@/stores/client';
    import { useAuthStore } from '@/stores/auth';
    import { useCitaStore } from '@/stores/cita';
    import { useCustomizerStore } from '@/stores/customizer';
    
    const clientStore = useClientStore();
    const authStore = useAuthStore();
    const citaStore = useCitaStore();
    const customizer = useCustomizerStore();
    
    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
    const role = computed(() => authStore.user?.Role?.toLowerCase() || '');
    const isBarber = computed(() => role.value === 'barbero');

    const loading = ref(false);
    const error = ref('');

    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
    const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
    const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

    // Clientes a mostrar
    const displayedClients = computed(() => {
        if (!isBarber.value) return clientStore.clients;
        
        // Si es barbero, filtrar por clientes que tengan citas con él
        if (!Array.isArray(citaStore.citas)) return [];
        
        const myClientIds = new Set();
        citaStore.citas.forEach(cita => {
            if (cita.barbero?.id === authStore.user?.id && cita.cliente?.id) {
                myClientIds.add(cita.cliente.id);
            }
        });

        // Retornar los objetos de cliente completos desde el store o reconstruirlos
        return clientStore.clients.filter(c => myClientIds.has(c.id));
    });

    onMounted(async () => {
        loading.value = true;
        try {
            await clientStore.getClients();
            if (isBarber.value) {
                await citaStore.obtenerCitas();
            }
        } catch (err) {
            error.value = 'Error al cargar los datos';
        } finally {
            loading.value = false;
        }
    });
</script>

<style scoped>
.client-card:hover {
    transform: translateY(-4px);
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

.is-dark .client-card:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.4) !important;
}
</style>