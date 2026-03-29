<template>
  <div class="auth-page-container">
    <v-card class="auth-page-card" rounded="lg" elevation="0">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="page-icon mb-3">
          <i class="fas fa-user-lock"></i>
        </div>
        <h2 class="auth-title">Iniciar sesión</h2>
        <p class="auth-subtitle">Accede a tu cuenta de StyleHub</p>
      </div>

      <!-- Google -->
      <v-btn
        block
        variant="outlined"
        class="google-btn mb-5"
        size="large"
        rounded="lg"
        @click="loginWithGoogle"
      >
        <img :src="Google" alt="google" width="18" class="mr-2" />
        <span class="google-text">Continuar con Google</span>
      </v-btn>

      <!-- Divider -->
      <div class="divider-line mb-5">
        <span>o con correo electrónico</span>
      </div>

      <!-- Form -->
      <Form @submit="validate" class="loginForm" v-slot="{ errors, isSubmitting }">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Correo electrónico"
          class="mb-4"
          required
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="#ee6f38"
          rounded="lg"
        />

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Contraseña"
          required
          density="comfortable"
          variant="outlined"
          color="#ee6f38"
          hide-details="auto"
          rounded="lg"
          :append-inner-icon="show1 ? '$eye' : '$eyeOff'"
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
        />

        <div class="d-flex align-center justify-space-between mt-3 mb-5">
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

        <v-alert
          v-if="errors.apiError"
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="mt-4"
        >
          {{ errors.apiError }}
        </v-alert>
      </Form>

      <!-- Register link -->
      <v-divider class="my-5" />
      <div class="text-center">
        <span class="text-medium-emphasis" style="font-size: 0.88rem;">¿No tienes cuenta?</span>
        <v-btn
          variant="text"
          color="#ee6f38"
          class="text-none font-weight-bold ml-1"
          size="small"
          to="/register"
        >
          Regístrate aquí
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Google from '@/assets/images/auth/social-google.svg'
import { useAuthStore } from '@/stores/auth'
import { Form } from 'vee-validate'
import { auth as firebaseAuth, googleProvider, signInWithPopup } from '@/plugins/firebase'

const router = useRouter()
const route = useRoute()
const checkbox = ref(false)
const show1 = ref(false)
const password = ref('')
const email = ref('')

const passwordRules = ref([(v: string) => !!v || 'Contraseña obligatoria'])
const emailRules = ref([
  (v: string) => !!v || 'Correo obligatorio',
  (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato inválido',
])

const handlePostLoginRoles = () => {
  const authStore = useAuthStore()
  
  // Reserva desde servicios
  const returnToReserva = sessionStorage.getItem('returnToReserva')
  if (returnToReserva === 'true') {
    sessionStorage.removeItem('returnToReserva')
    router.push('/')
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-reserva-dialog')), 100)
    return
  }

  // Reserva desde barberos
  const returnToReservaBarbero = sessionStorage.getItem('returnToReservaBarbero')
  if (returnToReservaBarbero === 'true') {
    sessionStorage.removeItem('returnToReservaBarbero')
    router.push('/')
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-reserva-barbero-dialog')), 100)
    return
  }

  // Redirect URL
  const redirectPath = route.query.redirect as string
  if (redirectPath) {
    router.push(redirectPath)
    return
  }

  // Redirigir según rol
  const userRole = (authStore.user?.role || authStore.user?.Role || '').toLowerCase()
  if (userRole === 'cliente') {
    router.push('/')
  } else if (userRole === 'superadmin') {
    router.push('/superadmin/dashboard')
  } else {
    router.push('/dashboard')
  }
}

const loginWithGoogle = async () => {
  const authStore = useAuthStore()
  try {
    const result = await signInWithPopup(firebaseAuth, googleProvider)
    const idToken = await result.user.getIdToken()
    await authStore.loginWithGoogle(idToken)
    handlePostLoginRoles()
  } catch (error) {
    console.error('Error con Google Login:', error)
    alert('Fallo al iniciar sesión con Google')
  }
}

async function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore()
  try {
    await authStore.login({ email: email.value, password: password.value })
    await authStore.loadUser()
    handlePostLoginRoles()

  } catch (error: unknown) {
    setErrors({ apiError: error })
  }
}
</script>

<style scoped>
.auth-page-container {
  max-width: 440px;
  margin: 0 auto;
  padding: 20px 16px;
}

.auth-page-card {
  border: 1px solid #f0f0f0;
  padding: 32px;
}

.page-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 14px rgba(238, 111, 56, 0.25);
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

.google-btn {
  border-color: #e0e0e0 !important;
  text-transform: none;
  background: white !important;
}

.google-btn:hover {
  background: #fafafa !important;
}

.google-text {
  font-size: 0.88rem;
  font-weight: 600;
  color: #555;
}

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
}

.forgot-link:hover {
  text-decoration: underline;
}

.submit-btn {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
  color: white !important;
  box-shadow: 0 4px 14px rgba(238, 111, 56, 0.25) !important;
  transition: all 0.3s ease !important;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(238, 111, 56, 0.35) !important;
}
</style>