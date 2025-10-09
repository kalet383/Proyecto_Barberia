import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import axios from 'axios'

interface Barber {
  id?: number
  nombre: string
  apellido: string
  email: string
  password: string
  telefono?: string
  foto?: string
}

interface BarberState {
  barbers: Barber[]
  loading: boolean
  error: string | null
}

export const useBarberStore = defineStore('barber', {
  state: (): BarberState => ({
    barbers: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getBarbers() {
      this.loading = true
      try {
        const { data } = await api.get('/auth', { withCredentials: true })
        this.barbers = data.filter((u: any) => u.role === 'barbero')
        return data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          this.error = err.response.data.message
        } else {
          this.error = 'Error cargando barberos'
        }
        return [];
      } finally {
        this.loading = false
      }
    },

    async createBarber(payload: Barber) {
      this.loading = true
      try {
        const { data } = await api.post('/auth/register-barber', payload, { withCredentials: true })
        // agregar el barbero nuevo a la lista
        this.barbers.push(data)
        return data
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          this.error = err.response.data.message
        } else {
          this.error = 'Error creando barbero'
        }
        throw this.error
      } finally {
        this.loading = false
      }
    },
  },
})
