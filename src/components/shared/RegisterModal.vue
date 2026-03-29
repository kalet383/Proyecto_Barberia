<template>
  <v-dialog v-model="isOpen" max-width="480" transition="dialog-bottom-transition">
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

      <v-card-text class="px-7 py-7">
        <!-- Header -->
        <div class="text-center mb-5">
          <h2 class="auth-title">Crea tu cuenta</h2>
          <p class="auth-subtitle">Únete a StyleHub Barbería</p>
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
            <span class="google-text">Registrarse con Google</span>
          </v-btn>

          <!-- Divider -->
          <div class="divider-line mb-5">
            <span>o con correo</span>
          </div>

          <!-- Nombre + Apellido -->
          <v-row dense class="mb-1">
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="nombre"
                :rules="[(v) => !!v || 'Requerido']"
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
                :rules="[(v) => !!v || 'Requerido']"
                label="Apellido"
                density="comfortable"
                hide-details="auto"
                variant="outlined"
                color="#ee6f38"
                rounded="lg"
              />
            </v-col>
          </v-row>

          <!-- Email -->
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Correo electrónico"
            required
            density="comfortable"
            hide-details="auto"
            variant="outlined"
            color="#ee6f38"
            rounded="lg"
            :prepend-inner-icon="mdiEmailOutline"
            class="mb-3"
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
            class="mb-3"
          />

          <!-- Teléfono -->
          <v-text-field
            v-model="telefono"
            :rules="telefonoRules"
            label="Teléfono"
            required
            density="comfortable"
            variant="outlined"
            color="#ee6f38"
            hide-details="auto"
            rounded="lg"
            :prepend-inner-icon="mdiPhone"
            @keypress="soloNumeros"
            class="mb-3"
          />

          <!-- Términos -->
          <v-checkbox
            v-model="checkbox"
            :rules="[(v) => !!v || 'Requerido']"
            color="#ee6f38"
            hide-details
            density="compact"
            class="mb-4 terms-check"
          >
            <template v-slot:label>
              <span class="text-caption" style="color: #666;">
                Acepto los <a href="#" class="terms-link" @click.prevent>Términos y condiciones</a>
              </span>
            </template>
          </v-checkbox>

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
            Crear cuenta
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
            {{ errors.apiError }}
          </v-alert>
        </Form>

        <!-- Login link -->
        <div class="mt-5 text-center">
          <span class="text-medium-emphasis" style="font-size: 0.88rem;">¿Ya tienes cuenta?</span>
          <v-btn
            variant="text"
            color="#ee6f38"
            class="text-none font-weight-bold ml-1"
            size="small"
            @click="goToLogin"
          >
            Inicia sesión
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Form } from 'vee-validate'
import { mdiEye, mdiEyeOff, mdiLockOutline, mdiEmailOutline, mdiPhone } from '@mdi/js'

const authStore = useAuthStore()

const isOpen = ref(false)
const checkbox = ref(false)
const show1 = ref(false)
const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
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

const passwordRules = ref([
  (v) => !!v || 'Contraseña obligatoria',
  (v) => (v && v.length >= 8) || 'Mínimo 8 caracteres',
  (v) => (v && /[A-Z]/.test(v)) || 'Al menos una mayúscula',
  (v) => (v && /\d/.test(v)) || 'Al menos un número',
])

const emailRules = ref([
  (v) => !!v || 'Correo obligatorio',
  (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato inválido',
])

const telefonoRules = ref([
  (v) => !!v || 'Teléfono obligatorio',
  (v) => /^\d+$/.test(v) || 'Solo números',
  (v) => (v && v.length >= 7) || 'Mínimo 7 dígitos',
  (v) => (v && v.length <= 12) || 'Máximo 12 dígitos',
])

const soloNumeros = (event) => {
  const charCode = event.which || event.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57)) event.preventDefault()
}

const clearFields = () => {
  nombre.value = ''
  apellido.value = ''
  telefono.value = ''
  email.value = ''
  password.value = ''
  checkbox.value = false
  show1.value = false
}

const handleOpenDialog = () => {
  clearFields()
  isOpen.value = true
}

watch(isOpen, (val) => {
  if (!val) setTimeout(clearFields, 300)
})

onMounted(() => window.addEventListener('open-register-dialog', handleOpenDialog))
onUnmounted(() => window.removeEventListener('open-register-dialog', handleOpenDialog))

const goToLogin = () => {
  isOpen.value = false
  setTimeout(() => window.dispatchEvent(new CustomEvent('open-login-dialog')), 300)
}

const loginWithGoogle = () => alert('Login con Google próximamente')

async function validate(values, { setErrors }) {
  if (!checkbox.value) {
    setErrors({ apiError: 'Debes aceptar los términos' })
    return
  }
  try {
    await authStore.register({
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      password: password.value,
      telefono: telefono.value,
    })
    isOpen.value = false
    clearFields()
    setTimeout(() => window.dispatchEvent(new CustomEvent('open-login-dialog')), 400)
  } catch (error) {
    let msg = 'Error al registrar'
    if (error.response?.data?.message) msg = error.response.data.message
    else if (typeof error === 'string') msg = error
    setErrors({ apiError: msg })
  }
}
</script>

<style scoped>
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

:deep(.v-field__prepend-inner) {
  color: #ee6f38 !important;
  padding-right: 4px !important;
}

:deep(.v-field__append-inner .v-icon) {
  color: #ee6f38 !important;
  opacity: 1 !important;
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
  letter-spacing: 0.3px;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 14px rgba(238, 111, 56, 0.25) !important;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(238, 111, 56, 0.35) !important;
}

@media (max-width: 500px) {
  .auth-modal {
    border-radius: 16px 16px 0 0 !important;
  }

  .auth-title {
    font-size: 1.3rem;
  }
}
</style>