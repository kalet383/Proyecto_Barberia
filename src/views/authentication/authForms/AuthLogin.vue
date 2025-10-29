<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Google from '@/assets/images/auth/social-google.svg';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';

const router = useRouter();
const checkbox = ref(false);
const valid = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const passwordRules = ref([
  (v: string) => !!v || 'La contraseña es obligatoria',
]);
const emailRules = ref([
  (v: string) => !!v || 'El correo electrónico es obligatorio', 
  (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato de correo inválido',
]);

async function validate(values: any, { setErrors }: any) {
  const authStore = useAuthStore();
  
  try {
    console.log('🔄 Iniciando login...');
    const result = await authStore.login({ email: email.value, password: password.value });
    console.log('✅ Login exitoso:', result);
    
    // 🎯 FORZAR LA CARGA DEL USUARIO
    await authStore.loadUser();
    
    console.log('👤 Usuario después de loadUser:', authStore.user);
    console.log('🔐 Rol del usuario:', (authStore.user as any)?.Role);
    
    // 🚀 REDIRIGIR SEGÚN EL ROL
    const userRole = (authStore.user as any)?.Role;
    
    if (userRole === 'cliente') {
      console.log('📍 Cliente - Redirigiendo a página principal');
      router.push('/');
    } else if (userRole === 'administrador' || userRole === 'barbero') {
      console.log('📍 Admin/Barbero - Redirigiendo a dashboard');
      router.push('/dashboard');
    } else {
      // Por defecto, dashboard
      console.log('📍 Rol desconocido - Redirigiendo a dashboard');
      router.push('/dashboard');
    }
    
  } catch (error: unknown) {
    console.log('❌ Error en login:', error);
    setErrors({ apiError: error });
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Inicia sesion con Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <v-btn variant="outlined" class="orbtn" rounded="md" size="small">O</v-btn>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Iniciar sesión con dirección de correo electrónico</h5>
  <Form @submit="validate" class="mt-7 loginForm" v-slot="{ errors, isSubmitting }">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Ingrese su correo electronico"
      class="mt-4 mb-8"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Ingrese su contraseña"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-flex align-center mt-2 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="¿Acuerdate de mi?"
        required
        color="primary"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <div class="ml-auto">
        <a href="javascript:void(0)" class="text-primary text-decoration-none">¿Has olvidado tu contraseña?</a>
      </div>
    </div>
    <v-btn color="secondary" :loading="isSubmitting" block class="mt-2" variant="flat" size="large" :disabled="valid" type="submit">
      Iniciar sesion</v-btn
    >
    <div v-if="errors.apiError" class="mt-2">
      <v-alert color="error">{{ errors.apiError }}</v-alert>
    </div>
  </Form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/register" class="mt-2 text-capitalize mr-n2">¿No tienes una cuenta?</v-btn>
  </div>
</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.loginForm {
  .v-text-field .v-field--active input {
    font-weight: 500;
  }
}
</style>