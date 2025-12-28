<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-2">
        <i class="fas fa-shopping-bag mr-3" style="color: #9c27b0;"></i>
        Mis Compras
      </h1>
      <p class="text-subtitle-1 text-grey-darken-1">
        Gestiona tus compras y pedidos realizados
      </p>
    </div>

    <!-- Estadísticas -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="primary" dark>
          <v-card-text>
            <div class="text-h6">Total Compras</div>
            <div class="text-h3 font-weight-bold">{{ estadisticas.total }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success" dark>
          <v-card-text>
            <div class="text-h6">Compras Pagadas</div>
            <div class="text-h3 font-weight-bold">{{ estadisticas.pagadas }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="text-h6">Pendientes</div>
            <div class="text-h3 font-weight-bold">{{ estadisticas.pendientes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info" dark>
          <v-card-text>
            <div class="text-h6">Total Gastado</div>
            <div class="text-h3 font-weight-bold">${{ estadisticas.totalGastado.toLocaleString() }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-card class="mb-6 elevation-2" rounded="lg">
      <v-card-text>
        <v-chip-group v-model="filtroEstado" mandatory color="primary">
          <v-chip value="todas" variant="outlined">
            <i class="fas fa-list mr-2"></i>
            Todas
          </v-chip>
          <v-chip value="PAGADA" variant="outlined">
            <i class="fas fa-check-circle mr-2"></i>
            Pagadas
          </v-chip>
          <v-chip value="PENDIENTE" variant="outlined">
            <i class="fas fa-clock mr-2"></i>
            Pendientes
          </v-chip>
          <v-chip value="CANCELADA" variant="outlined">
            <i class="fas fa-times-circle mr-2"></i>
            Canceladas
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-grey">Cargando compras...</p>
    </div>

    <!-- Sin ventas -->
    <v-card v-else-if="ventasFiltradas.length === 0" class="text-center py-12 elevation-2" rounded="lg">
      <i class="fas fa-shopping-bag fa-4x text-grey mb-4"></i>
      <h3 class="text-h5 mb-2">No tienes compras registradas</h3>
      <p class="text-grey">Realiza tu primera compra desde la sección de productos</p>
    </v-card>

    <!-- Lista de Ventas -->
    <v-row v-else>
      <v-col v-for="venta in ventasFiltradas" :key="venta.id" cols="12">
        <v-card 
          class="venta-card elevation-2" 
          rounded="lg"
          :class="getCardClass(venta.estado)"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h6">Compra #{{ venta.id }}</div>
              <div class="text-caption text-grey">
                {{ formatearFecha(venta.fechaVenta) }}
              </div>
            </div>
            <v-chip :color="getEstadoColor(venta.estado)" size="small">
              {{ venta.estado }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Productos -->
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey mb-2">Productos:</div>
              <div v-for="(detalle, index) in venta.detalles" :key="index" class="mb-2">
                <div class="d-flex justify-space-between">
                  <span>
                    <strong>{{ detalle.producto?.nombre }}</strong> 
                    x {{ detalle.cantidad }}
                  </span>
                  <span class="text-grey">${{ detalle.subtotal.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <v-divider class="my-3"></v-divider>

            <!-- Información adicional -->
            <v-row>
              <v-col cols="12" md="6">
                <div class="d-flex align-center mb-2">
                  <i class="fas fa-dollar-sign mr-3" style="color: #4caf50;"></i>
                  <div>
                    <div class="text-caption text-grey">Total</div>
                    <div class="text-h6 font-weight-bold" style="color: #4caf50;">
                      ${{ parseFloat(venta.total.toString()).toLocaleString() }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="d-flex align-center mb-2">
                  <i class="fas fa-credit-card mr-3" style="color: #2196f3;"></i>
                  <div>
                    <div class="text-caption text-grey">Método de Pago</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ venta.tipoPago }}
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" v-if="venta.barbero">
                <div class="d-flex align-center">
                  <i class="fas fa-user-tie mr-3" style="color: #9c27b0;"></i>
                  <div>
                    <div class="text-caption text-grey">Atendido por</div>
                    <div class="text-body-1 font-weight-medium">
                      {{ venta.barbero.nombre }} {{ venta.barbero.apellido }}
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-alert v-if="venta.notas" type="info" variant="tonal" class="mt-3">
              <strong>Notas:</strong> {{ venta.notas }}
            </v-alert>
          </v-card-text>

          <!-- Acciones -->
          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              v-if="venta.estado === 'PENDIENTE' || venta.estado === 'PAGADA'"
              color="error"
              variant="outlined"
              @click="abrirModalCancelar(venta)"
              :disabled="cargandoCancelacion"
            >
              <i class="fas fa-times-circle mr-2"></i>
              Cancelar Compra
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de Confirmación Cancelación -->
    <v-dialog v-model="modalCancelar" max-width="500" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-h5 pa-6 bg-error">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Confirmar Cancelación
        </v-card-title>
        
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">
            ¿Estás seguro de que deseas cancelar esta compra?
          </p>
          
          <v-alert type="warning" variant="tonal" class="mb-4">
            Esta acción cambiará el estado de la compra a "CANCELADA" y se restaurará el stock de los productos.
          </v-alert>

          <div v-if="ventaSeleccionada" class="pa-4 bg-grey-lighten-4 rounded">
            <div class="mb-2">
              <strong>Compra #:</strong> {{ ventaSeleccionada.id }}
            </div>
            <div class="mb-2">
              <strong>Fecha:</strong> {{ formatearFecha(ventaSeleccionada.fechaVenta) }}
            </div>
            <div>
              <strong>Total:</strong> ${{ parseFloat(ventaSeleccionada.total.toString()).toLocaleString() }}
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn variant="text" @click="cerrarModalCancelar" :disabled="cargandoCancelacion">
            No, mantener compra
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmarCancelacion"
            :loading="cargandoCancelacion"
          >
            <i class="fas fa-times mr-2"></i>
            Sí, cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top">
      <i :class="snackbarIcon" class="mr-2"></i>
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVentaStore } from '@/stores/venta'
import { useAuthStore } from '@/stores/auth'

const ventaStore = useVentaStore()
const authStore = useAuthStore()

// Estado
const filtroEstado = ref('todas')
const cargando = ref(false)
const cargandoCancelacion = ref(false)
const modalCancelar = ref(false)
const ventaSeleccionada = ref(null)
const misVentas = ref([])

// Snackbar
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const snackbarIcon = ref('fas fa-check-circle')

// Computed - Ventas filtradas
const ventasFiltradas = computed(() => {
  let ventas = misVentas.value

  // Aplicar filtro de estado
  if (filtroEstado.value !== 'todas') {
    ventas = ventas.filter(v => v.estado === filtroEstado.value)
  }

  // Ordenar por fecha (más recientes primero)
  return ventas.sort((a, b) => {
    const fechaA = new Date(a.fechaVenta)
    const fechaB = new Date(b.fechaVenta)
    return fechaB.getTime() - fechaA.getTime()
  })
})

// Estadísticas
const estadisticas = computed(() => {
  const total = misVentas.value.length
  const pagadas = misVentas.value.filter(v => v.estado === 'PAGADA').length
  const pendientes = misVentas.value.filter(v => v.estado === 'PENDIENTE').length
  const canceladas = misVentas.value.filter(v => v.estado === 'CANCELADA').length
  
  const totalGastado = misVentas.value
    .filter(v => v.estado === 'PAGADA')
    .reduce((sum, v) => sum + parseFloat(v.total.toString()), 0)

  return { total, pagadas, pendientes, canceladas, totalGastado }
})

// Funciones de formato
const formatearFecha = (fecha) => {
  if (!fecha) return 'N/A'
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEstadoColor = (estado) => {
  const colors = {
    PAGADA: 'success',
    PENDIENTE: 'warning',
    CANCELADA: 'error'
  }
  return colors[estado] || 'grey'
}

const getCardClass = (estado) => {
  return {
    'border-left-pagada': estado === 'PAGADA',
    'border-left-pendiente': estado === 'PENDIENTE',
    'border-left-cancelada': estado === 'CANCELADA'
  }
}

// Funciones de modal
const abrirModalCancelar = (venta) => {
  ventaSeleccionada.value = venta
  modalCancelar.value = true
}

const cerrarModalCancelar = () => {
  modalCancelar.value = false
  ventaSeleccionada.value = null
}

const confirmarCancelacion = async () => {
  if (!ventaSeleccionada.value) return

  cargandoCancelacion.value = true
  try {
    await ventaStore.updateEstado(ventaSeleccionada.value.id, 'CANCELADA')
    mostrarNotificacion('Compra cancelada exitosamente', 'success')
    cerrarModalCancelar()
    await cargarVentas()
  } catch (error) {
    const mensaje = error.response?.data?.message || 'Error al cancelar la compra. Intenta nuevamente.'
    mostrarNotificacion(mensaje, 'error')
  } finally {
    cargandoCancelacion.value = false
  }
}

const mostrarNotificacion = (texto, tipo) => {
  snackbarText.value = texto
  snackbarColor.value = tipo
  snackbarIcon.value = tipo === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
  snackbar.value = true
}

// Cargar ventas
const cargarVentas = async () => {
  if (!authStore.user?.id) return
  
  cargando.value = true
  try {
    const ventas = await ventaStore.getVentasByCliente(authStore.user.id)
    misVentas.value = ventas || []
  } catch (error) {
    console.error('Error al cargar ventas:', error)
    mostrarNotificacion('Error al cargar tus compras', 'error')
  } finally {
    cargando.value = false
  }
}

// Lifecycle
onMounted(() => {
  cargarVentas()
})
</script>

<style scoped>
.venta-card {
  transition: all 0.3s ease;
  position: relative;
}

.venta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.border-left-pagada {
  border-left: 4px solid #4caf50;
}

.border-left-pendiente {
  border-left: 4px solid #ff9800;
}

.border-left-cancelada {
  border-left: 4px solid #f44336;
}
</style>

