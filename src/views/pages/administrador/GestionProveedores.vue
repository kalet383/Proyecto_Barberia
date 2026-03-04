<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-6">Gestión de Proveedores</h1>
      </v-col>
    </v-row>

    <!-- Filtros y Acciones -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar proveedor"
          variant="outlined"
          density="comfortable"
          clearable
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="2" offset-md="6">
        <v-btn
          block
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nuevo Proveedor
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tabla de Proveedores -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="proveedores"
            :search="search"
            :loading="loading"
            class="elevation-1"
          >
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

    <!-- Dialog Crear/Editar Proveedor -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.nombre"
                  label="Nombre"
                  variant="outlined"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="formData.direccion"
                  label="Dirección"
                  variant="outlined"
                  :rules="[rules.required]"
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
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveProveedor" :loading="saving">
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
          ¿Está seguro que desea eliminar al proveedor <strong>{{ proveedorToDelete?.nombre }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteProveedor" :loading="deleting">Eliminar</v-btn>
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

const formData = ref({
  id: null,
  nombre: '',
  direccion: '',
  telefono: '',
  email: '',
});

const rules = {
  required: (v: any) => !!v || 'Campo requerido',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
};

const fetchProveedores = async () => {
  loading.value = true;
  try {
    const response = await api.get('/proveedor');
    proveedores.value = response.data;
  } catch (error) {
    showSnackbar('Error al cargar proveedores', 'error');
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  editMode.value = false;
  formData.value = {
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  };
  dialog.value = true;
};

const openEditDialog = (item: any) => {
  editMode.value = true;
  formData.value = { ...item };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  formData.value = {
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
  };
};

// ... dentro de GestionProveedores.vue

const saveProveedor = async () => {
  if (!await form.value?.validate()) return;
  
  saving.value = true;
  try {
    if (editMode.value && formData.value.id) {
      // --- SOLUCIÓN AQUÍ ---
      // 1. Extraemos el ID y dejamos el resto de datos en 'datosParaEnviar'
      const { id, ...datosParaEnviar } = formData.value;

      // 2. Enviamos el ID en la URL, pero el objeto SIN ID en el cuerpo
      await api.patch(`/proveedor/${id}`, datosParaEnviar);
      
      showSnackbar('Proveedor actualizado correctamente', 'success');
    } else {
      // CREAR (POST)
      // Aquí también es buena práctica no enviar el ID si es null
      const { id, ...datosParaEnviar } = formData.value;
      
      await api.post('/proveedor', datosParaEnviar);
      showSnackbar('Proveedor creado correctamente', 'success');
    }
    closeDialog();
    await fetchProveedores();
  } catch (error: any) {
    // Imprimir el error en consola para ver detalles
    console.error(error); 
    // Mostrar el mensaje exacto que devuelve el backend
    const msg = error.response?.data?.message 
                ? (Array.isArray(error.response.data.message) 
                    ? error.response.data.message[0] 
                    : error.response.data.message)
                : 'Error al guardar datos';
    showSnackbar(msg, 'error');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (item: any) => {
  proveedorToDelete.value = item;
  deleteDialog.value = true;
};

const deleteProveedor = async () => {
  deleting.value = true;
  try {
    await api.delete(`/proveedor/${proveedorToDelete.value.id}`);
    showSnackbar('Proveedor eliminado exitosamente', 'success');
    await fetchProveedores();
    deleteDialog.value = false;
  } catch (error: any) {
    showSnackbar(error.response?.data?.message || 'Error al eliminar proveedor', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  fetchProveedores();
});
</script>

<style scoped>
.text-h3 {
  color: rgb(var(--v-theme-primary));
}
</style>
