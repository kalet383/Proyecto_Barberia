import { defineStore } from "pinia";

interface Barbero {
    id: number
    nombre: string
    apellido: string
    foto: string
    email?: string
    telefono?: string
}

interface Horario {
    id: number
    Dia_semana: string
    franja: {
        id_franja: number
        hora_inicio: string
        hora_fin: string
    }
}

interface ReservaBarberoState {
    barberoPreseleccionado: Barbero | null
    horariosBarbero: Horario[]
    serviciosSeleccionados: number[]
    fechaSeleccionada: string | null
    horaSeleccionada: string | null
    currentTab: number
}

export const useReservaBarberoStore = defineStore('reservaBarbero', {
    state: (): ReservaBarberoState => ({
        barberoPreseleccionado: null,
        horariosBarbero: [],
        serviciosSeleccionados: [],
        fechaSeleccionada: null,
        horaSeleccionada: null,
        currentTab: 0
    }),

    getters: {
        // Obtener el día de la semana en español (sin acentos)
        diaSemana: (state) => {
            if (!state.fechaSeleccionada) return null
            
            const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
            const fecha = new Date(state.fechaSeleccionada + 'T00:00:00')
            return diasSemana[fecha.getDay()]
        },

        // Verificar si hay fecha y hora seleccionadas
        tieneFechaYHora: (state) => {
            return !!(state.fechaSeleccionada && state.horaSeleccionada)
        },

        // Verificar si el tab actual debe tener botón habilitado
        botonHabilitadoPorTab: (state) => {
            switch(state.currentTab) {
                case 0: // Servicios
                return state.serviciosSeleccionados.length > 0
                case 1: // Fecha y Hora
                return !!(state.fechaSeleccionada && state.horaSeleccionada)
                case 2: // Confirmación
                return false // Se maneja desde el componente
                default:
                return false
            }
        },

        // Obtener días disponibles del barbero
        diasDisponiblesBarbero: (state) => {
            if (!state.horariosBarbero || state.horariosBarbero.length === 0) {
                return []
            }
            
            // Extraer días únicos
            const dias = [...new Set(state.horariosBarbero.map(h => h.Dia_semana))]
            return dias
        },

        // Obtener franjas horarias de un día específico
        franjasDelDia: (state) => (diaSemana: string) => {
            if (!state.horariosBarbero || state.horariosBarbero.length === 0) {
                return []
            }
            
            return state.horariosBarbero
                .filter(h => h.Dia_semana === diaSemana)
                .map(h => h.franja)
                .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
        },

        // Obtener nombre completo del barbero
        nombreCompletoBarbero: (state) => {
            if (!state.barberoPreseleccionado) return ''
            return `${state.barberoPreseleccionado.nombre} ${state.barberoPreseleccionado.apellido}`
        }
    },

    actions: {
        // Inicializar reserva con barbero
        inicializarConBarbero(barbero: Barbero, horarios: Horario[]) {
            this.barberoPreseleccionado = barbero
            this.horariosBarbero = horarios
            this.currentTab = 0
            
            console.log('✅ Reserva iniciada con barbero:', barbero.nombre)
            console.log('📅 Horarios cargados:', horarios.length)
        },

        // Actualizar servicios
        setServicios(serviciosIds: number[]) {
            this.serviciosSeleccionados = serviciosIds
        },

        // Actualizar fecha y hora
        setFechaHora(fecha: Date | string, hora: string) {
            if (fecha instanceof Date) {
                this.fechaSeleccionada = fecha.toISOString().split('T')[0]
            } else {
                this.fechaSeleccionada = fecha
            }
            this.horaSeleccionada = hora
        },

        // Actualizar tab actual
        setCurrentTab(index: number) {
            this.currentTab = index
        },

        // Resetear toda la reserva
        resetReserva() {
            this.barberoPreseleccionado = null
            this.horariosBarbero = []
            this.serviciosSeleccionados = []
            this.fechaSeleccionada = null
            this.horaSeleccionada = null
            this.currentTab = 0
            
            console.log('🔄 Reserva de barbero reseteada')
        }
    }
})