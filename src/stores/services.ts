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
        // Servicios que se muestran en el carrusel de inicio (Solo publicados y destacados)
        featuredServices: (state) => state.services.filter(s => s.publicado && s.destacado),
        
        // Servicios "normales" (Publicados pero no destacados)
        nonFeaturedServices: (state) => state.services.filter(s => s.publicado && !s.destacado),
        
        // Todos los publicados (Para el modal de agendar)
        allPublishedServices: (state) => state.services.filter(s => s.publicado),
        
        // Alias para compatibilidad si se usa en otros sitios
        regularServices: (state) => state.services.filter(s => s.publicado),
    },

    actions: {
        async getServices() {
            this.loading = true
            try {
                const { data } = await api.get('/servicio', { withCredentials: true })
                this.services = data.map((s: any) => ({
                    ...s,
                    precio: Number(s.precio) || 0
                }));
                return this.services;
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
                    // Mergear para no perder campos como 'categoria' si el backend no los devuelve en el PATCH
                    this.services[index] = { 
                        ...this.services[index], 
                        ...data,
                        precio: data.precio !== undefined ? Number(data.precio) : this.services[index].precio
                    }
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
