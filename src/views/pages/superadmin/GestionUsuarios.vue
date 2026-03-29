<template>
  <v-container fluid>

    <!-- ═══ HEADER ═══ -->
    <div class="page-header mb-6">
      <div class="d-flex align-center ga-3">
        <div class="header-icon"><i class="fas fa-users"></i></div>
        <div>
          <h2 :style="{ fontSize: '1.5rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Gestión de Usuarios</h2>
          <p :style="{ fontSize: '0.88rem', color: txtSecondary, marginBottom: 0 }">Administra los usuarios del sistema</p>
        </div>
      </div>
      <v-btn color="#ee6f38" variant="flat" class="text-none font-weight-bold" rounded="lg" @click="openCreateDialog">
        <i class="fas fa-user-plus mr-2" style="font-size: 12px;"></i> Nuevo Usuario
      </v-btn>
    </div>

    <!-- ═══ STATS ═══ -->
    <v-row class="mb-6">
      <v-col v-for="(stat, i) in statsCards" :key="i" cols="6" md="3">
        <v-card class="stat-card" rounded="xl" elevation="0" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
          <v-card-text class="pa-5">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="stat-label" :style="{ color: isDark ? txtSecondary : stat.color }">{{ stat.label }}</p>
                <p class="stat-value" :style="{ color: isDark ? txtPrimary : stat.color, fontSize: '1.6rem' }">{{ stat.value }}</p>
              </div>
              <div class="stat-icon-box" :style="{ background: isDark ? 'rgba(255,255,255,0.05)' : stat.bg, color: isDark ? '#ee6f38' : stat.color }">
                <i :class="stat.icon"></i>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- ═══ TABLA ═══ -->
    <v-card rounded="xl" elevation="0" class="table-card" :style="{ background: cardBg, border: `1px solid ${cardBorder}` }">
      <div class="table-toolbar" :style="{ borderBottom: `1px solid ${cardBorder}`, background: isDark ? 'rgba(255,255,255,0.01)' : '#fafafa' }">
        <v-text-field
          v-model="search"
          placeholder="Buscar usuarios..."
          variant="outlined"
          density="compact"
          hide-details
          rounded="lg"
          class="search-field"
          :bg-color="inputBg"
        >
          <template v-slot:prepend-inner>
            <i class="fas fa-search" :style="{ color: txtSecondary, fontSize: '13px' }"></i>
          </template>
        </v-text-field>

        <div class="filter-group">
          <!-- Filtro rol -->
          <v-select
            v-model="filterRole"
            :items="roles"
            placeholder="Rol"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
            class="filter-select"
            :bg-color="inputBg"
            style="width: 150px;"
          >
            <template v-slot:selection="{ item }">
              <span class="text-caption font-weight-bold" :style="{ color: getRoleHexColor(item.value) }">{{ item.title }}</span>
            </template>
          </v-select>

          <!-- Filtro estado -->
          <v-select
            v-model="filterStatus"
            :items="statusOptions"
            placeholder="Estado"
            variant="outlined"
            density="compact"
            hide-details
            rounded="lg"
            clearable
            class="filter-select"
            :bg-color="inputBg"
            style="width: 150px;"
          />

          <v-btn icon variant="tonal" color="#ee6f38" size="small" rounded="lg" @click="loadUsers" :loading="loading">
            <i class="fas fa-sync-alt"></i>
          </v-btn>
        </div>
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :search="search"
        :loading="loading"
        hover
        items-per-page="10"
        style="background: transparent;"
      >
        <!-- Avatar + Nombre -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center ga-3 py-3">
            <v-avatar size="38" :color="getAvatarColor(item.role)" elevation="2">
              <span class="text-white font-weight-bold" style="font-size: 0.85rem;">
                {{ item.nombre?.charAt(0) }}{{ item.apellido?.charAt(0) }}
              </span>
            </v-avatar>
            <div>
              <p class="font-weight-bold text-body-2 mb-0" :style="{ color: txtPrimary, lineHeight: '1.3' }">
                {{ item.nombre }} {{ item.apellido }}
              </p>
              <p :style="{ fontSize: '0.72rem', color: txtSecondary, marginBottom: 0 }">ID #{{ item.id }}</p>
            </div>
          </div>
        </template>

        <!-- Email -->
        <template v-slot:item.email="{ item }">
          <span :style="{ color: txtSecondary, fontSize: '0.85rem' }">{{ item.email }}</span>
        </template>

        <!-- Teléfono -->
        <template v-slot:item.telefono="{ item }">
          <span :style="{ color: txtSecondary, fontSize: '0.85rem' }">{{ item.telefono || '—' }}</span>
        </template>

        <!-- Rol con color de texto -->
        <template v-slot:item.role="{ item }">
          <div class="d-flex align-center ga-2">
            <i :class="getRoleIcon(item.role)" :style="{ color: getRoleHexColor(item.role), fontSize: '11px' }"></i>
            <span class="font-weight-bold text-caption" :style="{ color: getRoleHexColor(item.role), textTransform: 'uppercase' }">
              {{ getRoleLabel(item.role) }}
            </span>
          </div>
        </template>

        <!-- Estado con color de texto -->
        <template v-slot:item.activo="{ item }">
          <v-chip
            size="x-small"
            class="font-weight-bold"
            :color="item.activo ? 'success' : 'error'"
            variant="tonal"
            rounded="lg"
          >
            {{ item.activo ? 'Activo' : 'Inactivo' }}
          </v-chip>
        </template>

        <!-- Acciones -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex align-center ga-2">
            <v-btn icon variant="tonal" color="primary" size="x-small" rounded="lg" @click="openEditDialog(item)">
              <i class="fas fa-pen" style="font-size:10px;"></i>
            </v-btn>
            <v-btn icon variant="tonal" :color="item.activo ? 'warning' : 'success'" size="x-small" rounded="lg" @click="toggleStatus(item)">
              <i :class="item.activo ? 'fas fa-ban' : 'fas fa-check'" style="font-size:10px;"></i>
            </v-btn>
            <v-btn icon variant="tonal" color="error" size="x-small" rounded="lg" @click="confirmDelete(item)">
              <i class="fas fa-trash" style="font-size:10px;"></i>
            </v-btn>
          </div>
        </template>

        <template v-slot:no-data>
          <div class="text-center py-10" :style="{ color: txtSecondary }">
            <i class="fas fa-users-slash mb-3" style="font-size: 32px; opacity: 0.3;"></i>
            <p class="font-weight-bold">Sin usuarios</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ═══ DIALOG CREAR / EDITAR ═══ -->
    <v-dialog v-model="dialog" max-width="580" scrollable>
      <v-card rounded="xl" :style="{ background: cardBg }">
        <!-- Header -->
        <div class="dialog-header-custom" :style="{ padding: '18px 20px', background: headerBg, borderBottom: `1px solid ${cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <div class="d-flex align-center ga-3">
            <div class="dialog-icon" :style="{ width: '38px', height: '38px', borderRadius: '10px', background: isDark ? 'rgba(238,111,56,0.15)' : 'rgba(238,111,56,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
              <i :class="editMode ? 'fas fa-user-edit' : 'fas fa-user-plus'" style="color: #ee6f38;"></i>
            </div>
            <div>
              <h3 class="font-weight-bold" :style="{ color: txtPrimary, fontSize: '1.1rem', margin: 0 }">
                {{ editMode ? 'Editar Usuario' : 'Nuevo Usuario' }}
              </h3>
              <p :style="{ fontSize: '0.75rem', color: txtSecondary, marginBottom: 0 }">
                {{ editMode ? 'Ajusta los detalles de la cuenta' : 'Registra un nuevo miembro en el sistema' }}
              </p>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="closeDialog" :color="txtSecondary">
            <i class="fas fa-times"></i>
          </v-btn>
        </div>

        <v-card-text class="pa-6">
          <v-form ref="form" v-model="valid">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field label="Nombre" v-model="formData.nombre" variant="outlined" density="comfortable" rounded="lg" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Apellido" v-model="formData.apellido" variant="outlined" density="comfortable" rounded="lg" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email" v-model="formData.email" variant="outlined" density="comfortable" rounded="lg" :rules="[rules.required, rules.email]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="Teléfono" v-model="formData.telefono" variant="outlined" density="comfortable" rounded="lg" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12" md="6">
                <v-select label="Rol" v-model="formData.role" :items="rolesForCreate" variant="outlined" density="comfortable" rounded="lg" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  :label="editMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined" density="comfortable" rounded="lg"
                  :rules="editMode ? [] : [rules.required, rules.minLength]"
                >
                  <template v-slot:append-inner>
                     <v-icon @click="showPassword = !showPassword" style="cursor: pointer;">{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider :style="{ borderColor: cardBorder }" />
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn variant="text" :color="txtSecondary" class="text-none" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" class="text-none px-6 font-weight-bold" rounded="lg" @click="saveUser" :loading="saving">
            {{ editMode ? 'Actualizar' : 'Crear Usuario' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══ DIALOG CONFIRMAR ELIMINACIÓN ═══ -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="xl" :style="{ background: cardBg }">
        <div class="pa-8 text-center">
          <div :style="{ width: '60px', height: '60px', borderRadius: '50%', background: isDark ? 'rgba(244,67,54,0.15)' : '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }">
            <i class="fas fa-trash-alt"></i>
          </div>
          <h3 :style="{ color: txtPrimary, fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px' }">Eliminar Usuario</h3>
          <p :style="{ fontSize: '0.88rem', color: txtSecondary, marginBottom: '24px' }">
            ¿Estás seguro de eliminar a <strong>{{ userToDelete?.nombre }} {{ userToDelete?.apellido }}</strong>? Esta acción es irreversible.
          </p>
          <div class="d-flex ga-3">
            <v-btn block variant="tonal" :color="txtSecondary" rounded="lg" @click="deleteDialog = false" class="text-none">Cancelar</v-btn>
            <v-btn block color="error" variant="flat" rounded="lg" @click="deleteUser" :loading="deleting" class="text-none font-weight-bold">Eliminar</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- ═══ SNACKBAR ═══ -->
    <v-snackbar v-model="snackbar" :color="isDark ? 'grey-darken-4' : snackbarColor" :timeout="3000" rounded="xl" location="bottom right">
      <div class="d-flex align-center ga-2 font-weight-bold">
        <i :class="snackbarColor === 'success' ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-circle text-error'"></i>
        <span>{{ snackbarText }}</span>
      </div>
    </v-snackbar>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSuperAdminStore } from '@/stores/superadmin';
import api from '@/plugins/axios';
import { useCustomizerStore } from '@/stores/customizer';

const superAdminStore = useSuperAdminStore();
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#64748b');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#f0f0f0');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');
const inputBg = computed(() => isDark.value ? '#0d111b' : '#ffffff');

const search       = ref('');
const filterRole   = ref<string | null>(null);
const filterStatus = ref<boolean | null>(null);
const dialog       = ref(false);
const deleteDialog = ref(false);
const editMode     = ref(false);
const loading      = ref(false);
const saving       = ref(false);
const deleting     = ref(false);
const userToDelete = ref<any>(null);
const showPassword = ref(false);
const form         = ref();
const valid        = ref(false);

const snackbar      = ref(false);
const snackbarText  = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'Usuario',   key: 'nombre',   sortable: true  },
  { title: 'Email',     key: 'email',    sortable: true  },
  { title: 'Teléfono',  key: 'telefono', sortable: false },
  { title: 'Rol',       key: 'role',     sortable: true  },
  { title: 'Estado',    key: 'activo',   sortable: true  },
  { title: 'Acciones',  key: 'actions',  sortable: false },
];

const roles = [
  { title: 'Administrador', value: 'administrador' },
  { title: 'Barbero',       value: 'barbero'       },
  { title: 'Cliente',       value: 'cliente'       },
];

const rolesForCreate = [
  { title: 'Administrador', value: 'administrador' },
  { title: 'Barbero',       value: 'barbero'       },
  { title: 'Cliente',       value: 'cliente'       },
];

const statusOptions = [
  { title: 'Activo',   value: true  },
  { title: 'Inactivo', value: false },
];

const formData = ref({
  nombre: '', apellido: '', email: '',
  telefono: '', password: '', role: '', foto: '',
});

const rules = {
  required:  (v: any)    => !!v || 'Campo requerido',
  email:     (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => (v && v.length >= 6) || 'Mínimo 6 caracteres',
};

// ── Helpers de color / ícono ──────────────────────────────────
const getRoleHexColor = (role: string) => {
  const map: Record<string, string> = {
    superadmin:    '#7c3aed',
    administrador: '#ee6f38',
    barbero:       '#16a34a',
    cliente:       '#2563eb',
  };
  return map[role] || '#888';
};

const getAvatarColor = (role: string) => {
  const map: Record<string, string> = {
    superadmin:    'purple',
    administrador: 'deep-orange',
    barbero:       'green',
    cliente:       'blue',
  };
  return map[role] || 'grey';
};

const getRoleIcon = (role: string) => {
  const map: Record<string, string> = {
    superadmin:    'fas fa-crown',
    administrador: 'fas fa-user-shield',
    barbero:       'fas fa-cut',
    cliente:       'fas fa-user',
  };
  return map[role] || 'fas fa-user';
};

const getRoleLabel = (role: string) => {
  const map: Record<string, string> = {
    superadmin:    'Superadmin',
    administrador: 'Administrador',
    barbero:       'Barbero',
    cliente:       'Cliente',
  };
  return map[role] || role;
};

// ── Stats ─────────────────────────────────────────────────────
const statsCards = computed(() => {
  const users = superAdminStore.users;
  return [
    {
      label: 'Total Usuarios', icon: 'fas fa-users',
      value: users.length,
      color: '#1a1a2e', bg: 'rgba(26,26,46,0.08)',
    },
    {
      label: 'Activos', icon: 'fas fa-user-check',
      value: users.filter(u => u.activo).length,
      color: '#16a34a', bg: 'rgba(22,163,74,0.1)',
    },
    {
      label: 'Administradores', icon: 'fas fa-user-shield',
      value: users.filter(u => u.role === 'administrador').length,
      color: '#ee6f38', bg: 'rgba(238,111,56,0.1)',
    },
    {
      label: 'Barberos', icon: 'fas fa-cut',
      value: users.filter(u => u.role === 'barbero').length,
      color: '#2563eb', bg: 'rgba(37,99,235,0.1)',
    },
  ];
});

// ── Filtros ───────────────────────────────────────────────────
const filteredUsers = computed(() => {
  let users = superAdminStore.users;
  if (filterRole.value)   users = users.filter(u => u.role === filterRole.value);
  if (filterStatus.value !== null && filterStatus.value !== undefined)
    users = users.filter(u => u.activo === filterStatus.value);
  return users;
});

// ── CRUD ──────────────────────────────────────────────────────
const loadUsers = async () => {
  loading.value = true;
  try { await superAdminStore.fetchAllUsers(); }
  catch { showSnackbar('Error al cargar usuarios', 'error'); }
  finally { loading.value = false; }
};

const openCreateDialog = () => {
  editMode.value    = false;
  showPassword.value = false;
  formData.value = { nombre: '', apellido: '', email: '', telefono: '', password: '', role: '', foto: '' };
  dialog.value = true;
};

const openEditDialog = (user: any) => {
  editMode.value    = true;
  showPassword.value = false;
  userToDelete.value = user;
  formData.value = {
    nombre: user.nombre, apellido: user.apellido,
    email: user.email,   telefono: user.telefono,
    password: '',        role: user.role,
    foto: user.foto || '',
  };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value       = false;
  showPassword.value = false;
  formData.value = { nombre: '', apellido: '', email: '', telefono: '', password: '', role: '', foto: '' };
};

const saveUser = async () => {
  const { valid } = await form.value?.validate();
  if (!valid) return;

  saving.value = true;
  try {
    if (editMode.value) {
      const updateData: any = { ...formData.value };
      if (!updateData.password) delete updateData.password;
      await api.put(`/auth/superadmin/update-user/${userToDelete.value.id}`, updateData, { withCredentials: true });
      await superAdminStore.fetchAllUsers();
      showSnackbar('Usuario actualizado correctamente', 'success');
    } else {
      const endpoint =
        formData.value.role === 'administrador' ? '/auth/superadmin/create-admin'  :
        formData.value.role === 'barbero'        ? '/auth/superadmin/create-barber' :
                                                   '/auth/superadmin/create-client';
      await api.post(endpoint, formData.value, { withCredentials: true });
      await superAdminStore.fetchAllUsers();
      showSnackbar('Usuario creado correctamente', 'success');
    }
    closeDialog();
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al guardar usuario', 'error');
  } finally {
    saving.value = false;
  }
};

const toggleStatus = async (user: any) => {
  try {
    await superAdminStore.toggleUserStatus(user.id);
    showSnackbar(`Usuario ${user.activo ? 'desactivado' : 'activado'} correctamente`, 'success');
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
    showSnackbar('Usuario eliminado correctamente', 'success');
    deleteDialog.value = false;
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar usuario', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value  = text;
  snackbarColor.value = color;
  snackbar.value      = true;
};

onMounted(loadUsers);
</script>

<style scoped>
.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 18px;
  box-shadow: 0 4px 12px rgba(238,111,56,0.25);
}
.stat-card { transition: all 0.25s ease; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important; border-color: #ee6f38 !important; }
.stat-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.stat-value { font-weight: 800; line-height: 1.2; margin: 0; }
.stat-icon-box { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }

.table-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 12px; padding: 16px 20px;
}
.search-field  { max-width: 280px; }
.filter-group  { display: flex; align-items: center; gap: 8px; }

@media (max-width: 960px) {
  .table-toolbar  { flex-direction: column; align-items: stretch; }
  .search-field   { max-width: 100%; }
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .filter-group { flex-wrap: wrap; }
}
</style>