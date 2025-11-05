import { defineStore } from "pinia";

interface Barbero {
  id: number
  nombre: string
  apellido: string
  foto: string
}

interface ReservaState {
  fechaSeleccionada: string | null
  horaSeleccionada: string | null
  barberoSeleccionado: Barbero | null
  serviciosSeleccionados: number[] // IDs de servicios
  currentTab: number // Índice del tab actual
}

export const useReservaStore = defineStore('reserva', {
  state: (): ReservaState => ({
    fechaSeleccionada: null,
    horaSeleccionada: null,
    barberoSeleccionado: null,
    serviciosSeleccionados: [],
    currentTab: 0
  }),

  getters: {
    // Obtener el día de la semana en español (sin acentos)
    diaSemana: (state) => {
      if (!state.fechaSeleccionada) return null
      
      const diasSemana: Record<number, string> = {
        0: 'domingo',
        1: 'lunes',
        2: 'martes',
        3: 'miercoles',
        4: 'jueves',
        5: 'viernes',
        6: 'sabado'
      }
      
      const fecha = new Date(state.fechaSeleccionada)
      return diasSemana[fecha.getDay()]
    },

    // Verificar si hay fecha y hora seleccionadas
    tieneFechaYHora: (state) => {
      return !!(state.fechaSeleccionada && state.horaSeleccionada)
    },

    // ✅ NUEVO: Verificar si el tab actual debe tener botón habilitado
    botonHabilitadoPorTab: (state) => {
      switch(state.currentTab) {
        case 0: // Servicios
          return state.serviciosSeleccionados.length > 0
        case 1: // Fecha y Hora
          return !!(state.fechaSeleccionada && state.horaSeleccionada)
        case 2: // Profesional
          return !!state.barberoSeleccionado
        case 3: // Confirmación
          return false // Se maneja desde el componente
        default:
          return false
      }
    },

    // ✅ NUEVO: Objeto con fecha y hora para pasar a DetalleReserva
    fechaYHoraObj: (state) => ({
      fecha: state.fechaSeleccionada,
      hora: state.horaSeleccionada
    })
  },

  actions: {
    // ✅ Actualizar servicios
    setServicios(serviciosIds: number[]) {
      this.serviciosSeleccionados = serviciosIds
    },

    // ✅ Actualizar fecha y hora
    setFechaHora(fecha: string, hora: string) {
      this.fechaSeleccionada = fecha
      this.horaSeleccionada = hora
    },

    // ✅ Actualizar barbero (ahora guarda el objeto completo)
    setBarbero(barbero: Barbero | null) {
      this.barberoSeleccionado = barbero
    },

    // ✅ Actualizar tab actual
    setCurrentTab(index: number) {
      this.currentTab = index
    },

    // ✅ Resetear toda la reserva
    resetReserva() {
      this.fechaSeleccionada = null
      this.horaSeleccionada = null
      this.barberoSeleccionado = null
      this.serviciosSeleccionados = []
      this.currentTab = 0
    }
  }
})