// /stores/reserva.ts
import { defineStore } from 'pinia'

// Declara interfaces mínimas para tipar
export interface Servicio {
  id: number
  nombre: string
  // agrega aquí los campos que tengas en services.ts
}

export interface Barbero {
  id: number
  nombre: string
  // agrega aquí los campos que tengas en barber.ts
}

export const useReservaStore = defineStore('reserva', {
  state: () => ({
    servicioSeleccionado: null as Servicio | null,
    barberoSeleccionado: null as Barbero | null,
    horaSeleccionada: null as string | null,
    email: '' as string
  }),
  getters: {
    datosReserva: (state) => ({
      servicioId: state.servicioSeleccionado?.id || null,
      barberoId: state.barberoSeleccionado?.id || null,
      hora: state.horaSeleccionada,
      email: state.email
    })
  },
  actions: {
    seleccionarServicio(servicio: Servicio) {
      this.servicioSeleccionado = servicio
    },
    seleccionarBarbero(barbero: Barbero) {
      this.barberoSeleccionado = barbero
    },
    seleccionarHora(hora: string) {
      this.horaSeleccionada = hora
    },
    setEmail(email: string) {
      this.email = email
    },
    reset() {
      this.servicioSeleccionado = null
      this.barberoSeleccionado = null
      this.horaSeleccionada = null
      this.email = ''
    },
    async confirmarReserva() {
      const payload = this.datosReserva
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Error al confirmar la reserva')
      return await res.json()
    }
  }
})
