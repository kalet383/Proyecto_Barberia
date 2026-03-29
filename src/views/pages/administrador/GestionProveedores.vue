<template>
  <v-container fluid>
    <!-- ═══ HEADER ═══ -->
    <div class="page-header mb-6">
      <div class="d-flex align-center ga-3">
        <div class="header-icon">
          <i class="fas fa-truck"></i>
        </div>
        <div>
          <h2 class="text-h5 font-weight-bold" style="color: #1a1a2e;">Gestión de Proveedores</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">Administra tus proveedores</p>
        </div>
      </div>
      <v-btn
        color="#ee6f38"
        class="text-none font-weight-bold"
        rounded="lg"
        elevation="2"
        @click="openCreateDialog"
      >
        <i class="fas fa-plus mr-2" style="font-size: 12px;"></i>
        Nuevo Proveedor
      </v-btn>
    </div>

    <!-- ═══ TABLA ═══ -->
    <v-card rounded="lg" elevation="0" class="table-card">
      <div class="table-toolbar">
        <v-text-field
          v-model="search"
          placeholder="Buscar proveedor..."
          variant="outlined"
          density="compact"
          hide-details
          clearable
          rounded="lg"
          class="search-field"
        >
          <template v-slot:prepend-inner>
            <i class="fas fa-search" style="color: #aaa; font-size: 13px;"></i>
          </template>
        </v-text-field>
        <v-chip variant="tonal" color="#ee6f38" size="small" label>
          {{ proveedores.length }} proveedores
        </v-chip>
      </div>

      <v-data-table
        :headers="headers"
        :items="proveedores"
        :search="search"
        :loading="loading"
        hover
        items-per-page="10"
      >
        <!-- Nombre con avatar -->
        <template v-slot:item.nombre="{ item }">
          <div class="d-flex align-center ga-3 py-2">
            <v-avatar size="34" color="#ee6f38" variant="tonal">
              <span class="font-weight-bold text-caption">{{ item.nombre?.charAt(0) }}</span>
            </v-avatar>
            <span class="font-weight-bold text-body-2">{{ item.nombre }}</span>
          </div>
        </template>

        <!-- Email -->
        <template v-slot:item.email="{ item }">
          <div class="d-flex align-center ga-2">
            <i class="fas fa-envelope" style="font-size: 11px; color: #ee6f38;"></i>
            <span class="text-body-2 text-medium-emphasis">{{ item.email }}</span>
          </div>
        </template>

        <!-- Teléfono -->
        <template v-slot:item.telefono="{ item }">
          <div class="d-flex align-center ga-2">
            <i class="fas fa-phone" style="font-size: 11px; color: #4caf50;"></i>
            <span class="text-body-2">{{ item.telefono }}</span>
          </div>
        </template>

        <!-- Dirección -->
        <template v-slot:item.direccion="{ item }">
          <div class="d-flex align-center ga-2">
            <i class="fas fa-map-marker-alt" style="font-size: 11px; color: #2196f3;"></i>
            <span class="text-body-2 text-medium-emphasis text-truncate" style="max-width: 200px;">{{ item.direccion }}</span>
          </div>
        </template>

        <!-- Acciones con colores -->
       <!-- Reemplaza el template de actions -->
<template v-slot:item.actions="{ item }">
  <div class="d-flex ga-1 justify-center">
    <v-tooltip text="Editar" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="flat"
          class="action-btn-edit"
          @click="openEditDialog(item)"
        >
          <i class="fas fa-pen" style="font-size: 12px;"></i>
        </v-btn>
      </template>
    </v-tooltip>

    <v-tooltip text="Eliminar" location="top">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          variant="flat"
          class="action-btn-delete"
          @click="confirmDelete(item)"
        >
          <i class="fas fa-trash" style="font-size: 12px;"></i>
        </v-btn>
      </template>
    </v-tooltip>
  </div>
</template>

        <!-- Empty -->
        <template v-slot:no-data>
          <div class="text-center py-8">
            <div class="empty-icon mb-3">
              <i class="fas fa-truck"></i>
            </div>
            <p class="font-weight-bold mb-1" style="color: #1a1a2e;">Sin proveedores</p>
            <p class="text-caption text-medium-emphasis">Agrega tu primer proveedor</p>
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5" />
        </template>
      </v-data-table>
    </v-card>

    <!-- ═══ DIALOG CREAR/EDITAR ═══ -->
    <v-dialog v-model="dialog" max-width="560" persistent>
      <v-card rounded="lg">
        <div class="dialog-header">
          <div class="d-flex align-center ga-3">
            <div class="dialog-icon" :style="editMode ? 'background: rgba(33,150,243,0.1); color: #2196f3;' : ''">
              <i :class="editMode ? 'fas fa-pen' : 'fas fa-plus'"></i>
            </div>
            <div>
              <h3 class="font-weight-bold" style="font-size: 1.1rem;">
                {{ editMode ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
              </h3>
              <p class="text-caption text-medium-emphasis mb-0">
                {{ editMode ? 'Modifica los datos del proveedor' : 'Registra un nuevo proveedor' }}
              </p>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="closeDialog" :disabled="saving">
            <i class="fas fa-times"></i>
          </v-btn>
        </div>

        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="form">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.nombre"
                  label="Nombre del proveedor"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <i class="fas fa-building" style="color: #ee6f38; font-size: 14px;"></i>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.direccion"
                  label="Dirección"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <i class="fas fa-map-marker-alt" style="color: #2196f3; font-size: 14px;"></i>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.telefono"
                  label="Teléfono"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required]"
                >
                  <template v-slot:prepend-inner>
                    <i class="fas fa-phone" style="color: #4caf50; font-size: 14px;"></i>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  :rules="[rules.required, rules.email]"
                >
                  <template v-slot:prepend-inner>
                    <i class="fas fa-envelope" style="color: #ee6f38; font-size: 14px;"></i>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" color="grey-darken-1" class="text-none" @click="closeDialog" :disabled="saving">
            Cancelar
          </v-btn>
          <v-btn
            :color="editMode ? '#2196f3' : '#ee6f38'"
            variant="flat"
            class="text-none font-weight-bold"
            rounded="lg"
            @click="saveProveedor"
            :loading="saving"
          >
            <i :class="editMode ? 'fas fa-save' : 'fas fa-plus'" class="mr-2" style="font-size: 13px;"></i>
            {{ editMode ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ═══ DIALOG ELIMINAR ═══ -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="lg" class="text-center pa-6">
        <div class="delete-icon mb-4">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 class="text-h6 font-weight-bold mb-2">¿Eliminar proveedor?</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Se eliminará <strong>{{ proveedorToDelete?.nombre }}</strong>. Esta acción no se puede deshacer.
        </p>
        <div class="d-flex ga-3 justify-center">
          <v-btn variant="outlined" color="grey-darken-1" class="text-none" rounded="lg" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="red-darken-1" variant="flat" class="text-none font-weight-bold" rounded="lg" @click="deleteProveedor" :loading="deleting">
            <i class="fas fa-trash mr-2" style="font-size: 12px;"></i>
            Eliminar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" rounded="lg">
      <div class="d-flex align-center ga-2">
        <i :class="snackbarColor === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" style="font-size: 14px;"></i>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const search = ref('');
const dialog = ref(false);
const deleteDialog = ref(false);
const editMode = ref(false);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const proveedorToDelete = ref<any>(null);
const proveedores = ref<any[]>([]);
const form = ref<any>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Dirección', key: 'direccion', sortable: true },
  { title: 'Teléfono', key: 'telefono', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Acciones', key: 'actions', sortable: false },
];

const formData = ref({ id: null as number | null, nombre: '', direccion: '', telefono: '', email: '' });

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
};

const fetchProveedores = async () => {
  loading.value = true;
  try {
    const res = await api.get('/proveedor');
    proveedores.value = res.data;
  } catch { showSnackbar('Error al cargar proveedores', 'error'); }
  finally { loading.value = false; }
};

const openCreateDialog = () => {
  editMode.value = false;
  formData.value = { id: null, nombre: '', direccion: '', telefono: '', email: '' };
  dialog.value = true;
};

const openEditDialog = (item: any) => {
  editMode.value = true;
  formData.value = { ...item };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  formData.value = { id: null, nombre: '', direccion: '', telefono: '', email: '' };
};

const saveProveedor = async () => {
  if (!await form.value?.validate()) return;
  saving.value = true;
  try {
    const { id, ...datos } = formData.value;
    if (editMode.value && id) {
      await api.patch(`/proveedor/${id}`, datos);
      showSnackbar('Proveedor actualizado', 'success');
    } else {
      await api.post('/proveedor', datos);
      showSnackbar('Proveedor creado', 'success');
    }
    closeDialog();
    await fetchProveedores();
  } catch (error: any) {
    const msg = error.response?.data?.message;
    showSnackbar(Array.isArray(msg) ? msg[0] : (msg || 'Error al guardar'), 'error');
  } finally { saving.value = false; }
};

const confirmDelete = (item: any) => { proveedorToDelete.value = item; deleteDialog.value = true; };

const deleteProveedor = async () => {
  deleting.value = true;
  try {
    await api.delete(`/proveedor/${proveedorToDelete.value.id}`);
    showSnackbar('Proveedor eliminado', 'success');
    await fetchProveedores();
    deleteDialog.value = false;
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar', 'error');
  } finally { deleting.value = false; }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text; snackbarColor.value = color; snackbar.value = true;
};

onMounted(() => fetchProveedores());
</script>

<style scoped>
/* ═══════════════════════════════════════
   BOTONES DE ACCIÓN CON COLOR REAL
═══════════════════════════════════════ */

/* 🔵 Editar / Ver */
.action-btn-edit {
  background: rgba(33, 150, 243, 0.12) !important;
  color: #1976d2 !important;
}
.action-btn-edit:hover {
  background: rgba(33, 150, 243, 0.22) !important;
  transform: scale(1.08);
}

/* 🔵 Ver detalles */
.action-btn-view {
  background: rgba(33, 150, 243, 0.12) !important;
  color: #1976d2 !important;
}
.action-btn-view:hover {
  background: rgba(33, 150, 243, 0.22) !important;
}

/* 🟠 Gestionar */
.action-btn-manage {
  background: rgba(238, 111, 56, 0.12) !important;
  color: #ee6f38 !important;
}
.action-btn-manage:hover {
  background: rgba(238, 111, 56, 0.22) !important;
}

/* 🔴 Eliminar / Cancelar */
.action-btn-delete {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #e53935 !important;
}
.action-btn-delete:hover {
  background: rgba(239, 68, 68, 0.2) !important;
  transform: scale(1.08);
}

/* 🔴 Cancelar acción (texto) */
.action-btn-danger {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #e53935 !important;
}
.action-btn-danger:hover {
  background: rgba(239, 68, 68, 0.2) !important;
}

/* 🟢 Completar / Éxito */
.action-btn-success {
  background: rgba(76, 175, 80, 0.12) !important;
  color: #2e7d32 !important;
}
.action-btn-success:hover {
  background: rgba(76, 175, 80, 0.22) !important;
}

/* 🟠 Guardar (naranja) */
.action-btn-save {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(238, 111, 56, 0.25) !important;
}
.action-btn-save:hover {
  box-shadow: 0 6px 18px rgba(238, 111, 56, 0.35) !important;
  transform: translateY(-1px);
}
.action-btn-save:disabled {
  background: #e0e0e0 !important;
  color: #999 !important;
  box-shadow: none !important;
}

/* Transición suave en todos */
.action-btn-edit,
.action-btn-view,
.action-btn-manage,
.action-btn-delete,
.action-btn-danger,
.action-btn-success,
.action-btn-save {
  transition: all 0.2s ease !important;
}

.page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.header-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25); }
.table-card { border: 1px solid #f0f0f0; overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
.search-field { max-width: 300px; }
.empty-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(238,111,56,0.08); display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 22px; color: #ee6f38; }
.dialog-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; }
.dialog-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(238,111,56,0.1); display: flex; align-items: center; justify-content: center; color: #ee6f38; font-size: 15px; }
.delete-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(239,68,68,0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto; color: #ef4444; font-size: 24px; }
@media (max-width: 600px) { .page-header { flex-direction: column; align-items: flex-start; } .search-field { max-width: 100%; } }
</style>