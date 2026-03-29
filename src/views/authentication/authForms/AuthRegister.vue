<template>
  <div class="auth-page-container">
    <v-card class="auth-page-card" rounded="lg" elevation="0">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="page-icon mb-3">
          <i class="fas fa-user-plus"></i>
        </div>
        <h2 class="auth-title">Crear cuenta</h2>
        <p class="auth-subtitle">Regístrate en StyleHub Barbería</p>
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
        <span class="google-text">Registrarse con Google</span>
      </v-btn>

      <!-- Divider -->
      <div class="divider-line mb-5">
        <span>o con correo electrónico</span>
      </div>

      <!-- Form -->
      <v-form ref="Regform" lazy-validation class="loginForm">
        <v-row dense class="mb-1">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="nombre"
              label="Nombre"
              density="comfortable"
              hide-details="auto"
              variant="outlined"
              color="#ee6f38"
              rounded="lg"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="apellido"
              label="Apellido"
              density="comfortable"
              hide-details="auto"
              variant="outlined"
              color="#ee6f38"
              rounded="lg"
            />
          </v-col>
        </v-row>

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
          class="mb-3"
        />

        <v-text-field
          v-model="telefono"
          label="Teléfono"
          required
          density="comfortable"
          variant="outlined"
          color="#ee6f38"
          hide-details="auto"
          rounded="lg"
          class="mb-3"
        />

        <v-checkbox
          v-model="checkbox"
          color="#ee6f38"
          hide-details
          density="compact"
          class="mb-4 terms-check"
        >
          <template v-slot:label>
            <span class="text-caption" style="color: #666;">
              Acepto los <a href="#" class="terms-link">Términos y condiciones</a>
            </span>
          </template>
        </v-checkbox>

        <v-btn
          block
          size="large"
          class="submit-btn text-none font-weight-bold"
          rounded="lg"
          elevation="2"
          @click="handleRegister"
        >
          Crear cuenta
        </v-btn>
      </v-form>

      <!-- Login link -->
      <v-divider class="my-5" />
      <div class="text-center">
        <span class="text-medium-emphasis" style="font-size: 0.88rem;">¿Ya tienes cuenta?</span>
        <v-btn
          variant="text"
          color="#ee6f38"
          class="text-none font-weight-bold ml-1"
          size="small"
          to="/login1"
        >
          Inicia sesión
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Google from '@/assets/images/auth/social-google.svg'
import { useAuthStore } from '@/stores/auth'
import { router } from '@/router'
import { auth as firebaseAuth, googleProvider, signInWithPopup } from '@/plugins/firebase'

const show1 = ref(false)
const checkbox = ref(false)
const password = ref('')
const email = ref('')
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const Regform = ref()

const passwordRules = ref([
  (v: string) => !!v || 'Contraseña obligatoria',
  (v: string) => v.length >= 8 || 'Mínimo 8 caracteres',
  (v: string) => /[A-Z]/.test(v) || 'Al menos una mayúscula',
  (v: string) => /[a-z]/.test(v) || 'Al menos una minúscula',
  (v: string) => /\d/.test(v) || 'Al menos un número',
  (v: string) => /[@$!%*?&]/.test(v) || 'Al menos un símbolo (@$!%*?&)',
])

const emailRules = ref([
  (v: string) => !!v || 'Correo obligatorio',
  (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato inválido',
])

const handlePostLoginRoles = () => {
  const authStore = useAuthStore()
  
  const returnToReserva = sessionStorage.getItem('returnToReserva')
  if (returnToReserva === 'true') {
    sessionStorage.removeItem('returnToReserva')
    router.push('/')
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-reserva-dialog')), 100)
    return
  }

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
    console.error('Error con Google Registration:', error)
    alert('Fallo al registrarse con Google')
  }
}

async function handleRegister() {
  const form = Regform.value
  if (!(await form.validate())) return
  try {
    const authStore = useAuthStore()
    await authStore.register({
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      password: password.value,
      telefono: telefono.value,
    })
    router.push('/login1')
  } catch (error) {
    console.error('Error al registrar:', error)
    alert(error)
  }
}
</script>

<style scoped>
.auth-page-container {
  max-width: 480px;
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

.terms-check {
  margin-left: -8px;
}

.terms-link {
  color: #ee6f38;
  font-weight: 700;
  text-decoration: none;
}

.terms-link:hover {
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