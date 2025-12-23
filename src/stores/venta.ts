import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export interface Venta {
  id: number;
  cliente: any;
  barbero?: any;
  producto: any;
  cantidad: number;
  precioUnitario: number;
  total: number;
  tipoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  fechaVenta: string;
  notas?: string;
}

export interface CreateVentaDto {
  clienteId: number;
  barberoId?: number;
  productoId: number;
  cantidad: number;
  tipoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  notas?: string;
}

export const useVentaStore = defineStore('venta', {
  state: () => ({
    ventas: [] as Venta[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalVentas: (state) => state.ventas.length,
    ventasRecientes: (state) => state.ventas.slice(0, 10),
  },

  actions: {
    async fetchVentas() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/venta', { withCredentials: true });
        this.ventas = data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ventas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createVenta(ventaData: CreateVentaDto) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post('/venta', ventaData, { withCredentials: true });
        await this.fetchVentas(); // Recargar lista
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al crear venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getVentasByCliente(clienteId: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/venta/cliente/${clienteId}`, { withCredentials: true });
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ventas del cliente';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getVentasByBarbero(barberoId: number) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/venta/barbero/${barberoId}`, { withCredentials: true });
        return data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar ventas del barbero';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getEstadisticas(fechaInicio?: string, fechaFin?: string) {
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);
        
        const { data } = await api.get(`/venta/estadisticas?${params.toString()}`, { 
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

    async deleteVenta(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/venta/${id}`, { withCredentials: true });
        await this.fetchVentas(); // Recargar lista
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar venta';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
