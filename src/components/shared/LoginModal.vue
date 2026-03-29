<template>
  <v-dialog v-model="isOpen" max-width="440" transition="dialog-bottom-transition">
    <v-card class="auth-modal" rounded="lg">
      <!-- Cerrar -->
      <v-btn
        icon
        variant="text"
        size="small"
        class="close-btn"
        @click="isOpen = false"
      >
        <i class="fas fa-times"></i>
      </v-btn>

      <v-card-text class="px-7 py-8">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="auth-logo mb-3">
            <img src="/imagenes/logo/logo2.png" alt="Logo" width="72" />
          </div>
          <h2 class="auth-title">Bienvenido</h2>
          <p class="auth-subtitle">Ingresa tus credenciales para continuar</p>
        </div>

        <Form @submit="validate" class="loginForm" v-slot="{ errors, isSubmitting }">
          <!-- Google -->
          <v-btn
            block
            variant="outlined"
            class="google-btn mb-5"
            size="large"
            rounded="lg"
            @click="loginWithGoogle"
          >
            <img src="/src/assets/images/auth/social-google.svg" alt="google" width="18" class="mr-2" />
            <span class="google-text">Continuar con Google</span>
          </v-btn>

          <!-- Divider -->
          <div class="divider-line mb-5">
            <span>o con correo</span>
          </div>

          <!-- Email -->
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Correo electrónico"
            class="mb-3"
            required
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="#ee6f38"
            rounded="lg"
            :prepend-inner-icon="mdiEmailOutline"
          />

          <!-- Password -->
          <v-text-field
            ref="passwordInput"
            v-model="password"
            :rules="passwordRules"
            label="Contraseña"
            required
            density="comfortable"
            variant="outlined"
            color="#ee6f38"
            hide-details="auto"
            rounded="lg"
            :append-inner-icon="show1 ? mdiEye : mdiEyeOff"
            :prepend-inner-icon="mdiLockOutline"
            :type="show1 ? 'text' : 'password'"
            @click:append-inner="togglePasswordVisibility"
            class="mb-2"
          />

          <!-- Remember + Forgot -->
          <div class="d-flex align-center justify-space-between mb-5">
            <v-checkbox
              v-model="checkbox"
              label="Recuérdame"
              color="#ee6f38"
              hide-details
              density="compact"
              class="remember-check"
            />
            <a href="javascript:void(0)" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Submit -->
          <v-btn
            block
            size="large"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="submit-btn text-none font-weight-bold"
            rounded="lg"
            elevation="2"
          >
            Iniciar sesión
          </v-btn>

          <!-- Error -->
          <v-alert
            v-if="errors.apiError"
            type="error"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="mt-4"
          >
            <i class="fas fa-exclamation-circle mr-1" style="font-size: 12px;"></i>
            {{ errors.apiError }}
          </v-alert>
        </Form>

        <!-- Register link -->
        <div class="mt-6 text-center">
          <span class="text-medium-emphasis" style="font-size: 0.88rem;">¿No tienes cuenta?</span>
          <v-btn
            variant="text"
            color="#ee6f38"
            class="text-none font-weight-bold ml-1"
            size="small"
            @click="goToRegister"
          >
            Regístrate
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Form } from 'vee-validate'
import { mdiEye, mdiEyeOff, mdiLockOutline, mdiEmailOutline } from '@mdi/js'
import { auth as firebaseAuth, googleProvider, signInWithPopup } from '@/plugins/firebase'

const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)
const checkbox = ref(false)
const show1 = ref(false)
const password = ref('')
const email = ref('')
const passwordInput = ref(null)

const togglePasswordVisibility = () => {
  const input = passwordInput.value?.$el?.querySelector('input')
  const start = input?.selectionStart
  const end = input?.selectionEnd
  show1.value = !show1.value
  setTimeout(() => {
    if (input) {
      input.setSelectionRange(start, end)
      input.focus()
    }
  }, 0)
}

const passwordRules = ref([(v) => !!v || 'La contraseña es obligatoria'])
const emailRules = ref([
  (v) => !!v || 'El correo es obligatorio',
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato inválido',
])

const clearFields = () => {
  email.value = ''
  password.value = ''
  show1.value = false
  checkbox.value = false
}

const handleOpenDialog = () => {
  clearFields()
  isOpen.value = true
}

watch(isOpen, (val) => {
  if (!val) setTimeout(clearFields, 300)
})

onMounted(() => window.addEventListener('open-login-dialog', handleOpenDialog))
onUnmounted(() => window.removeEventListener('open-login-dialog', handleOpenDialog))

const goToRegister = () => {
  isOpen.value = false
  setTimeout(() => window.dispatchEvent(new CustomEvent('open-register-dialog')), 300)
}

const handlePostLoginRoles = async () => {
  isOpen.value = false

  const userRole = (authStore.user?.Role || authStore.user?.role || '').toLowerCase()
  if (userRole === 'superadmin') {
    router.push('/superadmin/dashboard')
  } else if (['administrador', 'barbero'].includes(userRole)) {
    router.push('/dashboard')
  }

  const returnToReserva = sessionStorage.getItem('returnToReserva')
  if (returnToReserva === 'true') {
    sessionStorage.removeItem('returnToReserva')
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-reserva-dialog')), 400)
  }

  const returnToReservaBarbero = sessionStorage.getItem('returnToReservaBarbero')
  if (returnToReservaBarbero === 'true') {
    sessionStorage.removeItem('returnToReservaBarbero')
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-reserva-barbero-dialog')), 400)
  }

  clearFields()
}

const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider)
    const idToken = await result.user.getIdToken()
    
    // Llamar al backend a través del authStore
    await authStore.loginWithGoogle(idToken)
    await handlePostLoginRoles()
  } catch (error) {
    console.error('Error con Google Login:', error)
    alert('Fallo al iniciar sesión con Google')
  }
}

async function validate(values, { setErrors }) {
  try {
    await authStore.login({ email: email.value, password: password.value })
    await authStore.loadUser()
    await handlePostLoginRoles()
  } catch (error) {
    let msg = 'Error al iniciar sesión'
    if (error.response?.data?.message) msg = error.response.data.message
    else if (typeof error === 'string') msg = error
    setErrors({ apiError: msg })
  }
}

</script>

<style scoped>
/* ═══════════════════════════════════════
   MODAL BASE
═══════════════════════════════════════ */
.auth-modal {
  position: relative;
  overflow: visible;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  color: #999 !important;
  background: #f5f5f5 !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 10px !important;
  transition: all 0.25s ease !important;
}

.close-btn:hover {
  background: #ee6f38 !important;
  color: white !important;
  transform: rotate(90deg);
}

/* ═══════════════════════════════════════
   HEADER
═══════════════════════════════════════ */
.auth-logo {
  display: flex;
  justify-content: center;
}

.auth-logo img {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0;
}

.auth-subtitle {
  font-size: 0.88rem;
  color: #888;
  margin: 4px 0 0;
}

/* ═══════════════════════════════════════
   GOOGLE BUTTON
═══════════════════════════════════════ */
.google-btn {
  border-color: #e0e0e0 !important;
  text-transform: none;
  background: white !important;
  transition: all 0.2s ease;
}

.google-btn:hover {
  background: #fafafa !important;
  border-color: #ccc !important;
}

.google-text {
  font-size: 0.88rem;
  font-weight: 600;
  color: #555;
}

/* ═══════════════════════════════════════
   DIVIDER
═══════════════════════════════════════ */
.divider-line {
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 0.8rem;
}

.divider-line::before,
.divider-line::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #eee;
}

.divider-line span {
  padding: 0 12px;
}

/* ═══════════════════════════════════════
   FIELDS
═══════════════════════════════════════ */
:deep(.v-field__prepend-inner) {
  color: #ee6f38 !important;
  padding-right: 4px !important;
}

:deep(.v-field__append-inner .v-icon) {
  color: #ee6f38 !important;
  opacity: 1 !important;
}

/* ═══════════════════════════════════════
   REMEMBER + FORGOT
═══════════════════════════════════════ */
.remember-check {
  margin-left: -8px;
}

.remember-check :deep(.v-label) {
  font-size: 0.82rem;
  color: #666;
}

.forgot-link {
  color: #ee6f38;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #d4561f;
  text-decoration: underline;
}

/* ═══════════════════════════════════════
   SUBMIT BUTTON
═══════════════════════════════════════ */
.submit-btn {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
  color: white !important;
  letter-spacing: 0.3px;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 14px rgba(238, 111, 56, 0.25) !important;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(238, 111, 56, 0.35) !important;
}

/* ═══════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════ */
@media (max-width: 500px) {
  .auth-modal {
    border-radius: 16px 16px 0 0 !important;
  }

  .auth-title {
    font-size: 1.3rem;
  }
}
</style>