import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export enum EstadoVenta {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  CANCELADA = 'CANCELADA',
  ENTREGADA = 'ENTREGADA',
}

export enum TipoPago {
  EFECTIVO = 'EFECTIVO',
  PAGO_CONTRA_ENTREGA = 'PAGO_CONTRA_ENTREGA',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

export interface DetalleVenta {
  id: number;
  producto: any;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  fechaVenta: string;
  total: number;
  estado: EstadoVenta;
  tipoPago: TipoPago;
  direccionEnvio?: string;
  notas?: string;
  cliente: any;
  detalles: DetalleVenta[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemVenta {
  productoId: number;
  cantidad: number;
}

export interface CreateVentaDto {
  clienteId: number;
  items: ItemVenta[];
  tipoPago: TipoPago;
  direccionEnvio?: string;
  notas?: string;
}

export const useVentaStore = defineStore('venta', {
  state: () => ({
    ventas: [] as Venta[],
    misVentas: [] as Venta[],
    ventaActual: null as Venta | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalVentas: (state) => state.ventas.length,
    ventasRecientes: (state) => state.ventas.slice(0, 10),
    ventasPendientes: (state) => state.ventas.filter(v => v.estado === EstadoVenta.PENDIENTE),
    ventasPagadas: (state) => state.ventas.filter(v => v.estado === EstadoVenta.PAGADA),
    ventasEntregadas: (state) => state.ventas.filter(v => v.estado === EstadoVenta.ENTREGADA),
    ventasCanceladas: (state) => state.ventas.filter(v => v.estado === EstadoVenta.CANCELADA),
  },

  actions: {
    // Admin/SuperAdmin: Obtener todas las ventas
    async fetchVentas() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/ventas', { withCredentials: true });
        this.ventas = data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ventas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Cliente: Obtener mis ventas
    async fetchMisVentas() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/ventas/mis-ventas', { withCredentials: true });
        this.misVentas = data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar tus ventas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Obtener una venta por ID
    async fetchVenta(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/ventas/${id}`, { withCredentials: true });
        this.ventaActual = data;
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar la venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Cliente: Crear una venta
    async createVenta(ventaData: CreateVentaDto) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/ventas', ventaData, { withCredentials: true });
        await this.fetchMisVentas(); // Recargar mis ventas
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin/SuperAdmin: Actualizar estado de venta
    async updateEstadoVenta(id: number, estado: EstadoVenta) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.patch(`/ventas/${id}`, { estado }, { withCredentials: true });
        await this.fetchVentas(); // Recargar lista
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al actualizar venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Cliente: Cancelar venta (solo si está PENDIENTE)
    async cancelarVenta(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.patch(`/ventas/${id}/cancelar`, {}, { withCredentials: true });
        await this.fetchMisVentas(); // Recargar mis ventas
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cancelar venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin/SuperAdmin: Obtener estadísticas
    async getEstadisticas(fechaInicio?: string, fechaFin?: string) {
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        
        const { data } = await api.get(`/ventas/estadisticas?${params.toString()}`, { 
          withCredentials: true 
        });
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar estadísticas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Admin/SuperAdmin: Obtener ventas por día
    async getVentasPorDia(fecha: string) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/ventas/por-dia?fecha=${fecha}`, { 
          withCredentials: true 
        });
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ventas del día';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
