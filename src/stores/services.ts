import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import axios from 'axios'

interface Service {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    duracionAprox: string
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
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                this.error = err.response.data.message
                } else {
                this.error = 'Error cargando servicios'
                }
            } finally {
                this.loading = false
            }
        },
    },
})
