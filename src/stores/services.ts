import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import axios from 'axios'

interface Service {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    duracionAprox: string
    categoria: string
}

interface ServiceState {
    services: Service[]
    loading: boolean
    error: string | null
}

export const useServiceStore = defineStore('service', {
    state: (): ServiceState => ({
        services: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getServices() {
            this.loading = true
            try {
                const { data } = await api.get('/servicio', { withCredentials: true })
                this.services = data // ajusta a tu API
                return data;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                this.error = err.response.data.message
                } else {
                this.error = 'Error cargando servicios'
                }
                return [];
            } finally {
                this.loading = false
            }
        },
        async createService(payload: Service) {
            this.loading = true
            try {
                const { data } = await api.post('/servicio', payload, { withCredentials: true })
                this.services.push(data)
                return data
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    this.error = err.response.data.message
                } else {
                    this.error = 'Error creando servicio'
                }
                throw this.error
            } finally {
                this.loading = false
            }
        }
    },
})
