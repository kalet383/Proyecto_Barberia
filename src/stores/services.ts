import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import axios from 'axios'

interface Service {
    id?: number
    nombre: string
    descripcion: string
    precio: number
    duracionAprox: string
    categoriaId: number
    categoria?: any
    publicado: boolean
    destacado: boolean
    imagenUrl?: string
    videoUrl?: string
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

    getters: {
        featuredServices: (state) => state.services.filter(s => s.publicado), // Only filtering by published now
        regularServices: (state) => state.services.filter(s => s.publicado),
        allPublishedServices: (state) => state.services.filter(s => s.publicado),
    },

    actions: {
        async getServices() {
            this.loading = true
            try {
                const { data } = await api.get('/servicio', { withCredentials: true })
                this.services = data
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
        },
        async updateService(id: number, payload: Partial<Service>) {
            this.loading = true
            try {
                const { data } = await api.patch(`/servicio/${id}`, payload, { withCredentials: true })
                const index = this.services.findIndex(s => s.id === id)
                if (index !== -1) {
                    this.services[index] = data
                }
                return data
            } catch (err: unknown) {
                console.error(err);
                throw err;
            } finally {
                this.loading = false
            }
        },
        async deleteService(id: number) {
            this.loading = true
            try {
                await api.delete(`/servicio/${id}`, { withCredentials: true })
                this.services = this.services.filter(s => s.id !== id)
            } catch (err: unknown) {
                console.error(err);
                throw err;
            } finally {
                this.loading = false
            }
        }
    },
})
