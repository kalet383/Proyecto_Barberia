<template>
    <v-container class="d-flex align-center justify-center" style="min-height: 70vh;">
        <v-card class="rounded-xl elevation-4" max-width="550" width="100%">
            <v-card-text class="text-center pa-8">
                <div class="mb-4 d-flex justify-center">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #e65100, #ff6f00); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                        <i class="fas fa-user-check" style="font-size: 40px; color: white;"></i>
                    </div>
                </div>
                <h2 class="text-h5 font-weight-bold mb-2">Confirmación de Usuario</h2>
                <p class="text-body-2 text-grey-darken-1">
                    Verifica tu información para continuar
                </p>
            </v-card-text>

            <v-divider></v-divider>

            <!-- Usuario Logueado -->
            <v-card-text v-if="isAuthenticated" class="pa-6">
                <!-- Alerta de usuario autenticado -->
                <v-alert color="green-lighten-5" border="start" border-color="green-darken-2" class="mb-6">
                    <div class="d-flex align-center">
                        <i class="fa-solid fa-circle-check" style="font-size: 24px; color: #2e7d32; margin-right: 12px;"></i>
                        <div>
                            <p class="font-weight-bold mb-0">¡Sesión activa!</p>
                            <p class="text-caption mb-0">Tu cita será agendada con esta cuenta</p>
                        </div>
                    </div>
                </v-alert>

                <!-- Card de usuario -->
                <v-card variant="outlined" class="mb-6" color="grey-lighten-4">
                    <v-card-text class="pa-5">
                        <div class="d-flex align-center">
                            <v-avatar size="60" color="orange-darken-1" class="mr-4">
                                <v-img v-if="userData.foto" :src="userData.foto"></v-img>
                                <i v-else class="fa-solid fa-user" style="font-size: 30px; color: white;"></i>
                            </v-avatar>
                            <div class="flex-grow-1">
                                <p class="text-h6 font-weight-bold mb-1">
                                    {{ userData.nombre }} {{ userData.apellido }}
                                </p>
                                <p class="text-body-2 text-grey-darken-1 mb-1">
                                    <i class="fa-solid fa-envelope" style="font-size: 14px; margin-right: 4px;"></i>
                                    {{ userData.email }}
                                </p>
                                <p class="text-body-2 text-grey-darken-1 mb-0">
                                    <i class="fa-solid fa-phone" style="font-size: 14px; margin-right: 4px;"></i>
                                    {{ userData.telefono }}
                                </p>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <!-- Botón de cambiar cuenta -->
                <v-btn block variant="outlined" color="grey-darken-2" size="large" class="text-none mb-4" @click="cerrarSesion">
                    <i class="fa-solid fa-arrow-right-arrow-left" style="margin-right: 8px;"></i>
                    Usar Otra Cuenta
                </v-btn>

                <!-- Términos -->
                <v-checkbox v-model="aceptaTerminos" color="orange-darken-1" hide-details="auto" class="mb-4">
                    <template v-slot:label>
                        <span class="text-body-2">
                            Acepto los
                            <a href="#" class="text-orange-darken-2 font-weight-bold">términos</a>
                            y
                            <a href="#" class="text-orange-darken-2 font-weight-bold">condiciones</a>
                        </span>
                    </template>
                </v-checkbox>

                <!-- Info adicional -->
                <v-alert color="blue-lighten-5" border="start" border-color="blue" density="compact" class="text-caption">
                    <i class="fa-solid fa-info-circle" style="font-size: 16px; margin-right: 8px;"></i>
                    Recibirás una confirmación por correo y SMS
                </v-alert>
            </v-card-text>

            <!-- Usuario NO Logueado -->
            <v-card-text v-else class="pa-6">
                <!-- Alerta para iniciar sesión -->
                <v-alert color="orange-lighten-5" border="start" border-color="orange-darken-2" class="mb-6">
                    <div class="d-flex align-center">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px; color: #e65100; margin-right: 12px;"></i>
                        <div>
                            <p class="font-weight-bold mb-1">Cuenta requerida</p>
                            <p class="text-caption mb-0">Inicia sesión o regístrate para continuar</p>
                        </div>
                    </div>
                </v-alert>

                <!-- Opciones para continuar con la reserva -->
                <div class="mb-4">
                    <p class="text-subtitle-2 font-weight-bold mb-3">
                        <i class="fa-solid fa-user-shield" style="color: #e65100; margin-right: 8px;"></i>
                        ¿Cómo deseas continuar?
                    </p>

                    <!-- Botón para iniciar sesion -->
                    <v-btn block size="x-large" color="orange-darken-1" class="text-none mb-3" @click="irALogin">
                        <i class="fa-solid fa-right-to-bracket" style="margin-right: 8px;"></i>
                        Iniciar Sesión
                    </v-btn>

                    <!-- Divider -->
                    <div class="d-flex align-center my-4">
                        <v-divider></v-divider>
                        <span class="px-3 text-grey-darken-1 text-caption">o</span>
                        <v-divider></v-divider>
                    </div>

                    <!-- Botón para crear una cuenta -->
                    <v-btn block size="x-large" variant="outlined" color="orange-darken-1" class="text-none" @click="irARegistro">
                        <i class="fa-solid fa-user-plus" style="margin-right: 8px;"></i>
                        Crear Cuenta Nueva
                    </v-btn>
                </div>

                <!-- Beneficios de tener cuenta -->
                <v-card variant="tonal" color="grey-lighten-4" class="pa-4">
                    <p class="text-subtitle-2 font-weight-bold mb-3">
                        <i class="fa-solid fa-star" style="font-size: 18px; margin-right: 4px;"></i>
                        Beneficios de tener cuenta
                    </p>
                    <div class="d-flex flex-column" style="gap: 8px;">
                        <div class="d-flex align-center">
                            <i class="fa-solid fa-check" style="font-size: 16px; color: #2e7d32; margin-right: 8px;"></i>
                            <span class="text-caption">Historial de citas</span>
                        </div>
                        <div class="d-flex align-center">
                            <i class="fa-solid fa-check" style="font-size: 16px; color: #2e7d32; margin-right: 8px;"></i>
                            <span class="text-caption">Reservas más rápidas</span>
                        </div>
                        <div class="d-flex align-center">
                            <i class="fa-solid fa-check" style="font-size: 16px; color: #2e7d32; margin-right: 8px;"></i>
                            <span class="text-caption">Ofertas exclusivas</span>
                        </div>
                        <div class="d-flex align-center">
                            <i class="fa-solid fa-check" style="font-size: 16px; color: #2e7d32; margin-right: 8px;"></i>
                            <span class="text-caption">Recordatorios automáticos</span>
                        </div>
                    </div>
                </v-card>
            </v-card-text>

            <!-- Footer con texto de seguridad -->
            <v-divider></v-divider>
            <v-card-text class="text-center pa-4">
                <p class="text-caption text-grey-darken-1 mb-0">
                    <i class="fa-solid fa-lock" style="font-size: 14px; margin-right: 4px;"></i>
                    Tus datos están seguros y protegidos
                </p>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup>
    import { ref, computed, watch } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/auth';

    const router = useRouter();
    const authStore = useAuthStore();
    const emit = defineEmits(['estado-confirmacion-agendar']);

    // Estado
    const aceptaTerminos = ref(false);

    // Computed
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const userData = computed(() => ({
        nombre: authStore.user?.nombre || '',
        apellido: authStore.user?.apellido || '',
        email: authStore.user?.email || '',
        telefono: authStore.user?.telefono || '',
        foto: authStore.user?.foto || null
    }));

    // ✅ Watch para habilitar/deshabilitar el botón
    watch(
        [isAuthenticated, aceptaTerminos],
        ([autenticado, terminos]) => {
            const habilitar = autenticado && terminos;
            emit('estado-confirmacion-agendar', habilitar);
        },
        { immediate: true }
    );

    // Métodos
    const irALogin = () => {
        sessionStorage.setItem('returnToReservaBarbero', 'true');
        router.push('/login1');
    };

    const irARegistro = () => {
        sessionStorage.setItem('returnToReservaBarbero', 'true');
        router.push('/register');
    };

    const cerrarSesion = async () => {
        aceptaTerminos.value = false;
        await authStore.logout();
        router.replace('/');
    };

    const validarConfirmacion = () => {
        if (!isAuthenticated.value) {
            return {
                valido: false,
                mensaje: 'Debes iniciar sesión para continuar'
            };
        }
        
        if (!aceptaTerminos.value) {
            return {
                valido: false,
                mensaje: 'Debes aceptar los términos y condiciones'
            };
        }
        
        return {
            valido: true,
            datos: userData.value
        };
    };

    defineExpose({
        validarConfirmacion
    });
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>