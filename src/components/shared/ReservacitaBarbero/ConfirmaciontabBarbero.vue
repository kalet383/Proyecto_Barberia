<template>
    <v-container class="d-flex align-center justify-center" style="min-height: 70vh;">
        <div class="confirmacion-card" :style="{ background: cardBg, border: `1.5px solid ${cardBorder}` }">
            <!-- Header -->
            <div class="confirmacion-header" :style="{ background: headerBg }">
                <div class="header-icon" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.1)', border: `2px solid ${isDark ? 'rgba(238, 111, 56, 0.5)' : 'rgba(238, 111, 56, 0.3)'}` }">
                    <i class="fas fa-user-check"></i>
                </div>
                <h2 class="header-titulo" :style="{ color: isDark ? '#fff' : '#1a1a2e' }">Confirmación de Usuario</h2>
                <p class="header-subtitulo" :style="{ color: txtSecondary }">Verifica tu información para continuar</p>
            </div>

            <div class="confirmacion-divider"></div>

            <!-- Usuario Logueado -->
            <div v-if="isAuthenticated" class="confirmacion-body">
                <div class="status-banner success mb-6" :style="{ background: isDark ? 'rgba(46, 125, 50, 0.08)' : 'rgba(46, 125, 50, 0.05)', borderColor: isDark ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.15)' }">
                    <div class="banner-icon-wrap success" :style="{ background: isDark ? 'rgba(46, 125, 50, 0.15)' : 'rgba(46, 125, 50, 0.12)' }">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                        <p class="banner-titulo" :style="{ color: isDark ? '#81c784' : '#2e7d32' }">¡Sesión activa!</p>
                        <p class="banner-subtitulo" :style="{ color: txtSecondary }">Tu cita será agendada con esta cuenta</p>
                    </div>
                </div>

                <div class="usuario-card mb-6" :style="{ background: innerBg, borderColor: cardBorder }">
                    <div class="usuario-avatar-wrap">
                        <v-avatar size="64" class="usuario-avatar" :style="{ border: `2px solid ${isDark ? '#ee6f38' : '#ee6f38'}` }">
                            <v-img v-if="userData.foto" :src="userData.foto"></v-img>
                            <i v-else class="fa-solid fa-user" style="font-size: 30px; color: white;"></i>
                        </v-avatar>
                    </div>
                    <div class="usuario-info ml-2">
                        <p class="usuario-nombre" :style="{ color: txtPrimary }">{{ userData.nombre }} {{ userData.apellido }}</p>
                        <p class="usuario-detalle" :style="{ color: txtSecondary }">
                            <i class="fa-solid fa-envelope" style="color: #ee6f38;"></i>
                            {{ userData.email }}
                        </p>
                        <p class="usuario-detalle" :style="{ color: txtSecondary }">
                            <i class="fa-solid fa-phone" style="color: #ee6f38;"></i>
                            {{ userData.telefono || 'Sin teléfono' }}
                        </p>
                    </div>
                </div>

                <button class="btn-cambiar-cuenta mb-6" @click="cerrarSesion" :style="{ borderColor: cardBorder, color: txtSecondary }">
                    <i class="fa-solid fa-arrow-right-arrow-left mr-2"></i>
                    Usar otra cuenta
                </button>

                <div class="terminos-container mb-6">
                    <label class="terminos-label" @click="aceptaTerminos = !aceptaTerminos" :style="{ color: txtPrimary }">
                        <div class="checkbox-custom" :class="{ checked: aceptaTerminos }" :style="!aceptaTerminos ? { borderColor: cardBorder } : {}">
                            <i class="fas fa-check" v-if="aceptaTerminos"></i>
                        </div>
                        <span>
                            Acepto los
                            <a href="#" class="terminos-link" @click.stop>términos y condiciones</a>
                        </span>
                    </label>
                </div>

                <div class="info-banner" :style="{ background: innerBg, borderColor: cardBorder }">
                    <i class="fa-solid fa-shield-halved info-icon"></i>
                    <span :style="{ color: txtSecondary }">Recibirás confirmación por correo y SMS</span>
                </div>
            </div>

            <!-- Usuario NO Logueado -->
            <div v-else class="confirmacion-body">
                <div class="status-banner warning mb-6" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.08)' : 'rgba(238, 111, 56, 0.05)', borderColor: isDark ? 'rgba(238, 111, 56, 0.25)' : 'rgba(238, 111, 56, 0.2)' }">
                    <div class="banner-icon-wrap warning" :style="{ background: isDark ? 'rgba(238, 111, 56, 0.15)' : 'rgba(238, 111, 56, 0.12)' }">
                        <i class="fa-solid fa-unlock-keyhole"></i>
                    </div>
                    <div>
                        <p class="banner-titulo" :style="{ color: '#ee6f38' }">Cuenta requerida</p>
                        <p class="banner-subtitulo" :style="{ color: txtSecondary }">Inicia sesión o regístrate para continuar</p>
                    </div>
                </div>

                <p class="seccion-titulo mb-4" :style="{ color: txtPrimary, fontWeight: '800' }">
                    <i class="fa-solid fa-user-lock mr-2" style="color: #ee6f38;"></i>
                    ¿Cómo deseas continuar?
                </p>

                <button class="btn-primary mb-4" @click="irALogin">
                    <i class="fa-solid fa-sign-in-alt mr-2"></i>
                    INICIAR SESIÓN
                </button>

                <div class="divisor-o mb-4">
                    <span class="linea" :style="{ background: cardBorder }"></span>
                    <span class="texto-o" :style="{ color: txtSecondary }">o</span>
                    <span class="linea" :style="{ background: cardBorder }"></span>
                </div>

                <button class="btn-outlined mb-6" @click="irARegistro" :style="{ borderColor: '#ee6f38', color: '#ee6f38' }">
                    <i class="fa-solid fa-user-plus mr-2"></i>
                    CREAR CUENTA NUEVA
                </button>

                <div class="beneficios-card" :style="{ background: innerBg, borderColor: cardBorder }">
                    <p class="beneficios-titulo" :style="{ color: txtPrimary }">
                        <i class="fa-solid fa-gift mr-2" style="color: #ee6f38;"></i>
                        Ventajas de ser miembro
                    </p>
                    <div class="beneficios-lista">
                        <div class="beneficio-item" v-for="b in beneficios" :key="b" :style="{ color: txtSecondary }">
                            <div class="beneficio-check" :style="{ background: isDark ? 'rgba(46, 125, 50, 0.15)' : 'rgba(46, 125, 50, 0.1)', color: isDark ? '#81c784' : '#2e7d32' }">
                                <i class="fas fa-check"></i>
                            </div>
                            <span>{{ b }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="confirmacion-footer" :style="{ background: headerBg, borderTop: `1px solid ${cardBorder}` }">
                <i class="fa-solid fa-fingerprint footer-icon" :style="{ opacity: 0.5 }"></i>
                <span :style="{ color: txtSecondary, fontSize: '0.75rem', fontWeight: '700' }">CONEXIÓN SEGURA Y CIFRADA</span>
            </div>
        </div>
    </v-container>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';
    import { useCustomizerStore } from '@/stores/customizer'

    const router = useRouter();
    const authStore = useAuthStore();
    const customizer = useCustomizerStore()
    const emit = defineEmits(['estado-confirmacion-agendar']);

    const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
    
    // Adaptive Colors
    const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
    const txtSecondary = computed(() => isDark.value ? '#a1a1aa' : '#64748b');
    const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
    const cardBorder = computed(() => isDark.value ? '#1f2937' : '#f0f0f0');
    const headerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');
    const innerBg = computed(() => isDark.value ? '#1e293b' : '#fafafa');

    const aceptaTerminos = ref(false);
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const userData = computed(() => ({
        nombre: authStore.user?.nombre || '',
        apellido: authStore.user?.apellido || '',
        email: authStore.user?.email || '',
        telefono: authStore.user?.telefono || '',
        foto: authStore.user?.foto || null
    }));

    const beneficios = ['Historial de citas y servicios', 'Reservas ágiles en un clic', 'Ofertas y descuentos VIP', 'Recordatorios personalizados'];

    watch(
        [isAuthenticated, aceptaTerminos],
        ([autenticado, terminos]) => {
            emit('estado-confirmacion-agendar', autenticado && terminos);
        },
        { immediate: true }
    );

    const irALogin = () => { window.dispatchEvent(new CustomEvent('open-login-dialog')); };
    const irARegistro = () => { window.dispatchEvent(new CustomEvent('open-register-dialog')); };

    const cerrarSesion = async () => {
        aceptaTerminos.value = false;
        await authStore.logout();
    };

    const validarConfirmacion = () => {
        if (!isAuthenticated.value) return { valido: false, mensaje: 'Debes iniciar sesión para continuar' };
        if (!aceptaTerminos.value) return { valido: false, mensaje: 'Debes aceptar los términos y condiciones' };
        return { valido: true, datos: userData.value };
    };

    defineExpose({ validarConfirmacion });
</script>

<style scoped>
    .confirmacion-card {
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        max-width: 500px;
        width: 100%;
        transition: all 0.3s ease;
    }

    .confirmacion-header { padding: 40px 32px; text-align: center; }

    .header-icon {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
        color: #ee6f38;
        transform: rotate(-5deg);
    }

    .header-titulo { font-size: 1.35rem; font-weight: 900; letter-spacing: -0.5px; }
    .header-subtitulo { font-size: 0.9rem; font-weight: 600; margin-top: 4px; }

    .confirmacion-divider { height: 4px; background: linear-gradient(90deg, #ee6f38, #ff9a6c, transparent); }

    .confirmacion-body { padding: 32px; }

    .status-banner { display: flex; align-items: center; gap: 16px; padding: 18px; border-radius: 16px; border: 1.5px solid; }
    .banner-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
    .banner-titulo { font-weight: 800; font-size: 1rem; margin-bottom: 2px; }
    .banner-subtitulo { font-size: 0.82rem; font-weight: 600; }

    .usuario-card { display: flex; align-items: center; padding: 20px; border-radius: 20px; border: 1.5px solid; }
    .usuario-avatar { background: linear-gradient(135deg, #ee6f38, #ff9a6c); box-shadow: 0 4px 12px rgba(238, 111, 56, 0.35); }
    .usuario-nombre { font-size: 1.15rem; font-weight: 900; letter-spacing: -0.3px; }
    .usuario-detalle { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 600; margin-top: 4px; }
    .usuario-detalle i { font-size: 14px; width: 18px; text-align: center; }

    .btn-cambiar-cuenta {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        border: 1.5px solid;
        background: transparent;
        font-weight: 800;
        font-size: 0.82rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .btn-cambiar-cuenta:hover { transform: translateY(-2px); border-color: #ee6f38 !important; color: #ee6f38 !important; }

    .btn-primary {
        width: 100%;
        padding: 16px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #ee6f38, #ff9a6c);
        color: white;
        font-weight: 900;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        letter-spacing: 1px;
        box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4);
    }

    .btn-primary:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(238, 111, 56, 0.5); }

    .btn-outlined {
        width: 100%;
        padding: 14px;
        border-radius: 14px;
        border: 2px solid;
        background: transparent;
        font-weight: 800;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.5px;
    }

    .btn-outlined:hover { background: rgba(238, 111, 56, 0.08); transform: translateY(-2px); }

    .divisor-o { display: flex; align-items: center; gap: 14px; }
    .linea { flex: 1; height: 1px; opacity: 0.5; }
    .texto-o { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; }

    .terminos-label { display: flex; align-items: center; gap: 14px; cursor: pointer; font-size: 0.9rem; font-weight: 700; }

    .checkbox-custom {
        width: 24px;
        height: 24px;
        border-radius: 8px;
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: transparent;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .checkbox-custom.checked { background: #ee6f38; border-color: #ee6f38; color: white; transform: rotate(360deg) scale(1.1); box-shadow: 0 4px 10px rgba(238, 111, 56, 0.4); }

    .terminos-link { color: #ee6f38; font-weight: 800; text-decoration: none; border-bottom: 2px solid rgba(238, 111, 56, 0.2); transition: all 0.2s; }
    .terminos-link:hover { border-bottom-color: #ee6f38; }

    .info-banner { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 12px; border: 1px solid; font-size: 0.85rem; font-weight: 600; }
    .info-icon { color: #ee6f38; font-size: 16px; }

    .seccion-titulo { font-size: 0.95rem; display: flex; align-items: center; }

    .beneficios-card { border-radius: 18px; padding: 20px; border: 1px solid; }
    .beneficios-titulo { font-size: 0.95rem; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; }
    .beneficios-lista { display: flex; flex-direction: column; gap: 12px; }
    .beneficio-item { display: flex; align-items: center; gap: 12px; font-size: 0.88rem; font-weight: 600; }
    .beneficio-check { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }

    .confirmacion-footer { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 18px; letter-spacing: 2px; }
    .footer-icon { font-size: 16px; color: #ee6f38; }
</style>