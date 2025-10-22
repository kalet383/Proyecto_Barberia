import { defineStore } from "pinia";

interface ReservaState {
  fechaSeleccionada: string | null
  horaSeleccionada: string | null
  barberoSeleccionado: number | null
  serviciosSeleccionados: number[]
}

export const useReservaStore = defineStore('reserva', {
  state: (): ReservaState => ({
    fechaSeleccionada: null,
    horaSeleccionada: null,
    barberoSeleccionado: null,
    serviciosSeleccionados: []
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
    }
  },

  actions: {
    setFechaHora(fecha: string, hora: string) {
      this.fechaSeleccionada = fecha
      this.horaSeleccionada = hora
    },

    setBarbero(barberoId: number) {
      this.barberoSeleccionado = barberoId
    },

    resetReserva() {
      this.fechaSeleccionada = null
      this.horaSeleccionada = null
      this.barberoSeleccionado = null
      this.serviciosSeleccionados = []
    }
  }
})