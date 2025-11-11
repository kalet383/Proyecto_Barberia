<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Google from '@/assets/images/auth/social-google.svg';
import { router } from '@/router';
const checkbox = ref(false);
const show1 = ref(false);
const password = ref('');
const email = ref('');
const Regform = ref();
const nombre = ref('');
const apellido = ref('');
const telefono = ref('');
const passwordRules = ref([
  (v: string) => !!v || 'La contraseña es obligatoria',
  (v: string) => v.length >= 8 || 'Mínimo 8 caracteres',
  (v: string) => v.length <= 20 || 'Máximo 20 caracteres',
  (v: string) =>
    /[A-Z]/.test(v) || 'Debe incluir al menos una mayúscula',
  (v: string) =>
    /[a-z]/.test(v) || 'Debe incluir al menos una minúscula',
  (v: string) =>
    /\d/.test(v) || 'Debe incluir al menos un número',
  (v: string) =>
    /[@$!%*?&]/.test(v) || 'Debe incluir al menos un símbolo (@$!%*?&)',
]);
const emailRules = ref([
  (v: string) => !!v || 'El correo electrónico es obligatorio',
  (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Formato de correo no válido',
]);

async function handleRegister() {
  const form = Regform.value;
  if (!(await form.validate())) return;

  try {
    const authStore = useAuthStore();
    await authStore.register({
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      password: password.value,
      telefono: telefono.value,
    });

    router.push('/login1');
  } catch (error) {
    console.error('Error al registrar:', error);
    alert(error);
  }
}
</script>

<template>
  <v-btn block color="primary" variant="outlined" class="text-lightText googleBtn">
    <img :src="Google" alt="google" />
    <span class="ml-2">Registrate con tu cuenta de Google</span></v-btn
  >
  <v-row>
    <v-col class="d-flex align-center">
      <v-divider class="custom-devider" />
      <p class="orbtn" rounded="md" size="small"> O </p>
      <v-divider class="custom-devider" />
    </v-col>
  </v-row>
  <h5 class="text-h5 text-center my-4 mb-8">Registrate con un correo electronico valido</h5>
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="nombre"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="#ee6f38"
          label="Nombre"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="apellido"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="#ee6f38"
          label="Apellido"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="Correo electronico"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="#ee6f38"
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Contraseña"
      required
      density="comfortable"
      variant="outlined"
      color="#ee6f38"
      hide-details="auto"
      :append-icon="show1 ? '$eye' : '$eyeOff'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>
    <br>

    <v-text-field
      v-model="telefono"
      label="Telefono"
      required
      density="comfortable"
      variant="outlined"
      color="#ee6f38"
      hide-details="auto"
      :type="show1 ? 'text' : 'telefono'"
      @click:append="show1 = !show1"
      class="pwdInput"
    ></v-text-field>

    <div class="d-sm-inline-flex align-center mt-2 mb-7 mb-sm-0 font-weight-bold">
      <v-checkbox
        v-model="checkbox"
        :rules="[(v: any) => !!v || 'You must agree to continue!']"
        label="¿Estas de acuerdo con?"
        required
        color="#ee6f38"
        class="ms-n2"
        hide-details
      ></v-checkbox>
      <a href="#" class="ml-1 text-lightText">Terminos y condiciones</a>
    </div>
    <v-btn color="#ee6f38" block class="mt-2" variant="flat" size="large" @click="handleRegister()"> Registrarse </v-btn>
  </v-form>
  <div class="mt-5 text-right">
    <v-divider />
    <v-btn variant="plain" to="/login1" class="mt-2 text-capitalize mr-n2">¿Ya tienes una cuenta?</v-btn>
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
  padding: 2px 15px;
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
</style>
