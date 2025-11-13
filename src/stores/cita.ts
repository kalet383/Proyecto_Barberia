// stores/citaStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = 'http://localhost:3000/cita';

export const useCitaStore = defineStore('cita', {
  state: () => ({
    citas: [] as any[],
    citaActual: null as { id_cita: number } | null,
    cargando: false,
    error: null,
    barberosDisponibles: [],
    horariosAlternativos: [],
    barberosAlternativos: []
  }),

  getters: {
    // Obtener citas por cliente
    citasPorCliente: (state) => (clienteId: any) => {
      return state.citas.filter(cita => cita.clienteId === clienteId);
    },

    // Obtener citas por estado
    citasPorEstado: (state) => (estado: any) => {
      return state.citas.filter(cita => cita.estado === estado);
    }
  },

  actions: {
    /**
     * Crear cita con múltiples servicios
     */
    async crearCita(datosReserva: { clienteId: any; barberoId: any; servicioId: any; hora: any; fecha: any; }) {
      this.cargando = true;
      this.error = null;
      this.horariosAlternativos = [];
      this.barberosAlternativos = [];

      try {
        const citaData = {
          clienteId: datosReserva.clienteId,
          barberoId: datosReserva.barberoId,
          servicioId: datosReserva.servicioId, // Array de IDs
          hora: datosReserva.hora,
          fecha: datosReserva.fecha,
          estado: 'agendada'
        };

        const response = await axios.post(API_URL, citaData);

        // Verificar si hubo conflictos
        if (response.data.disponible === false) {
          this.error = response.data.mensaje;
          this.horariosAlternativos = response.data.horarios_alternativos || [];
          this.barberosAlternativos = response.data.otros_barberos || [];

          return {
            success: false,
            mensaje: response.data.mensaje,
            horariosAlternativos: this.horariosAlternativos,
            barberosAlternativos: this.barberosAlternativos
          };
        }

        // Citas creadas exitosamente
        this.citas.push(...response.data.citas);

        return {
          success: true,
          mensaje: response.data.mensaje,
          citas: response.data.citas,
          total_citas: response.data.total_citas
        };

      } catch (error: any) {
        console.error('❌ Error al crear cita:', error);
        this.error = error.response?.data?.message || 'Error al agendar la cita';
        
        return {
          success: false,
          mensaje: this.error
        };
      } finally {
        this.cargando = false;
      }
    },

    /**
     * Obtener barberos disponibles
     */
    async obtenerBarberosDisponibles(fecha: any, hora: any, servicioId: any) {
      this.cargando = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_URL}/${fecha}/${hora}/${servicioId}`);
        this.barberosDisponibles = response.data.barberos_disponibles || [];
        return response.data;
      } catch (error: any) {
        console.error('Error al obtener barberos:', error);
        this.error = error.response?.data?.message || 'Error al buscar barberos';
        throw error;
      } finally {
        this.cargando = false;
      }
    },

    /**
     * Obtener todas las citas
     */
    async obtenerCitas() {
      this.cargando = true;
      try {
        const response = await axios.get(API_URL);
        this.citas = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar citas';
        throw error;
      } finally {
        this.cargando = false;
      }
    },

    /**
     * Obtener cita por ID
     */
    async obtenerCita(id: any) {
      this.cargando = true;
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        this.citaActual = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al cargar cita';
        throw error;
      } finally {
        this.cargando = false;
      }
    },

    /**
     * Eliminar cita
     */
    async eliminarCita(id: any) {
      this.cargando = true;
      try {
        await axios.delete(`${API_URL}/${id}`);
        this.citas = this.citas.filter(cita => cita.id_cita !== id);
        
        if (this.citaActual?.id_cita === id) {
          this.citaActual = null;
        }
        
        return true;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Error al eliminar cita';
        throw error;
      } finally {
        this.cargando = false;
      }
    },

    // Limpiar estado
    limpiarAlternativas() {
      this.horariosAlternativos = [];
      this.barberosAlternativos = [];
      this.error = null;
    },

    limpiarCitaActual() {
      this.citaActual = null;
    },
  }
});