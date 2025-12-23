<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Gestión de Usuarios</h1>
      </v-col>
    </v-row>

    <!-- Filtros y Acciones -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar usuario"
          variant="outlined"
          density="comfortable"
          clearable
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filterRole"
          :items="roles"
          label="Filtrar por rol"
          variant="outlined"
          density="comfortable"
          clearable
          @click:clear="filterRole = null"
        ></v-select>
      </v-col>

      <v-col cols="12" md="3">
        <v-select
          v-model="filterStatus"
          :items="statusOptions"
          label="Filtrar por estado"
          variant="outlined"
          density="comfortable"
          clearable
          @click:clear="filterStatus = null"
        ></v-select>
      </v-col>

      <v-col cols="12" md="2">
        <v-btn
          block
          color="primary"
          size="large"
          prepend-icon="mdi-account-plus"
          @click="openCreateDialog"
        >
          Nuevo Usuario
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Usuarios -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            :search="search"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.activo="{ item }">
              <v-chip :color="item.activo ? 'success' : 'error'" size="small">
                {{ item.activo ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>

            <template v-slot:item.role="{ item }">
              <v-chip :color="getRoleColor(item.role)" size="small">
                {{ item.role }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex gap-2">
                <v-btn
                  size="small"
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-pencil"
                  @click="openEditDialog(item)"
                >
                  Editar
                </v-btn>

                <v-btn
                  size="small"
                  :color="item.activo ? 'warning' : 'success'"
                  variant="tonal"
                  :prepend-icon="item.activo ? 'mdi-cancel' : 'mdi-check-circle'"
                  @click="toggleStatus(item)"
                >
                  {{ item.activo ? 'Desactivar' : 'Activar' }}
                </v-btn>

                <v-btn
                  size="small"
                  color="error"
                  variant="tonal"
                  prepend-icon="mdi-delete"
                  @click="confirmDelete(item)"
                >
                  Eliminar
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog Crear/Editar Usuario -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'Editar Usuario' : 'Nuevo Usuario' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.nombre"
                  label="Nombre"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.apellido"
                  label="Apellido"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.telefono"
                  label="Teléfono"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.role"
                  :items="rolesForCreate"
                  label="Rol"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>

              <v-col cols="12" v-if="!editMode">
                <v-text-field
                  v-model="formData.password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  :rules="[rules.required, rules.minLength]"
                  :append-icon="showPassword ? '$eye' : '$eyeOff'"
                  @click:append="showPassword = !showPassword"
                  class="pwdInput"
                ></v-text-field>
              </v-col>

              <v-col cols="12" v-if="editMode">
                <v-text-field
                  v-model="formData.password"
                  label="Nueva Contraseña (opcional)"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  hint="Dejar en blanco para no cambiar"
                  persistent-hint
                  :append-icon="showPassword ? '$eye' : '$eyeOff'"
                  @click:append="showPassword = !showPassword"
                  class="pwdInput"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveUser" :loading="saving">
            {{ editMode ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro que desea eliminar al usuario <strong>{{ userToDelete?.nombre }} {{ userToDelete?.apellido }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteUser" :loading="deleting">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSuperAdminStore } from '@/stores/superadmin';
import api from '@/plugins/axios';

const superAdminStore = useSuperAdminStore();

const search = ref('');
const filterRole = ref<string | null>(null);
const filterStatus = ref<boolean | null>(null);
const dialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const userToDelete = ref<any>(null);
const showPassword = ref(false);

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Apellido', key: 'apellido', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: true },
  { title: 'Rol', key: 'role', sortable: true },
  { title: 'Estado', key: 'activo', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const roles = [
  { title: 'Administrador', value: 'administrador' },
  { title: 'Barbero', value: 'barbero' },
  { title: 'Cliente', value: 'cliente' },
];

const rolesForCreate = [
  { title: 'Administrador', value: 'administrador' },
  { title: 'Barbero', value: 'barbero' },
  { title: 'Cliente', value: 'cliente' },
];

const statusOptions = [
  { title: 'Activo', value: true },
  { title: 'Inactivo', value: false },
];

const formData = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  role: '',
  foto: '',
});

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
};

const filteredUsers = computed(() => {
  let users = superAdminStore.users;

  if (filterRole.value !== null && filterRole.value !== '') {
    users = users.filter(u => u.role === filterRole.value);
  }

  if (filterStatus.value !== null) {
    users = users.filter(u => u.activo === filterStatus.value);
  }

  return users;
});

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    superadmin: 'purple',
    administrador: 'primary',
    barbero: 'success',
    cliente: 'info',
  };
  return colors[role] || 'grey';
};

const openCreateDialog = () => {
  editMode.value = false;
  showPassword.value = false;
  formData.value = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    role: '',
    foto: '',
  };
  dialog.value = true;
};

const openEditDialog = (user: any) => {
  editMode.value = true;
  showPassword.value = false;
  formData.value = {
    nombre: user.nombre,
    apellido: user.apellido,
    email: user.email,
    telefono: user.telefono,
    password: '',
    role: user.role,
    foto: user.foto || '',
  };
  userToDelete.value = user; // Reutilizamos para guardar el ID
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  showPassword.value = false;
  formData.value = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    role: '',
    foto: '',
  };
};

const saveUser = async () => {
  saving.value = true;
  try {
    if (editMode.value) {
      const updateData: any = { ...formData.value };
      if (!updateData.password) {
        delete updateData.password;
      }
      // Usar API directamente para evitar problemas de autenticación
      await api.put(`/auth/superadmin/update-user/${userToDelete.value.id}`, updateData, { 
        withCredentials: true 
      });
      await superAdminStore.fetchAllUsers();
      showSnackbar('Usuario actualizado exitosamente', 'success');
    } else {
      // Usar API directamente según el rol
      let endpoint = '';
      if (formData.value.role === 'administrador') {
        endpoint = '/auth/superadmin/create-admin';
      } else if (formData.value.role === 'barbero') {
        endpoint = '/auth/superadmin/create-barber';
      } else {
        endpoint = '/auth/superadmin/create-client';
      }
      
      await api.post(endpoint, formData.value, { withCredentials: true });
      await superAdminStore.fetchAllUsers();
      showSnackbar('Usuario creado exitosamente', 'success');
    }
    closeDialog();
  } catch (error: any) {
    console.error('Error al guardar usuario:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Error al guardar usuario';
    showSnackbar(errorMsg, 'error');
  } finally {
    saving.value = false;
  }
};

const toggleStatus = async (user: any) => {
  try {
    await superAdminStore.toggleUserStatus(user.id);
    showSnackbar(`Usuario ${user.activo ? 'desactivado' : 'activado'} exitosamente`, 'success');
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al cambiar estado', 'error');
  }
};

const confirmDelete = (user: any) => {
  userToDelete.value = user;
  deleteDialog.value = true;
};

const deleteUser = async () => {
  deleting.value = true;
  try {
    await superAdminStore.deleteUser(userToDelete.value.id);
    showSnackbar('Usuario eliminado exitosamente', 'success');
    deleteDialog.value = false;
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar usuario', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(async () => {
  loading.value = true;
  try {
    await superAdminStore.fetchAllUsers();
  } catch (error) {
    showSnackbar('Error al cargar usuarios', 'error');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.text-h3 {
  color: rgb(var(--v-theme-primary));
}

/* Asegurar que los botones de acción sean visibles */
:deep(.v-data-table tbody tr td) {
  white-space: nowrap;
}

:deep(.v-btn) {
  opacity: 1 !important;
}

/* Estilo para el campo de contraseña */
.pwdInput {
  position: relative;
}

.pwdInput :deep(.v-input__append) {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
