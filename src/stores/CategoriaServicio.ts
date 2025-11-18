import api from "@/plugins/axios";
import axios from "axios";
import { defineStore } from "pinia";

interface CategoriaServicio {
    id?: number;
    nombre: string;
}

interface CategoriaServicioState {
    categoriasServicio: CategoriaServicio[];
    loading: boolean;
    error: string | null;
}

export const useCategoriaServicioStore = defineStore('categoriaServicio', {
    state: (): CategoriaServicioState => ({
        categoriasServicio: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getCategoriasServicio() {
            this.loading = true;
            try {
                const { data } = await api.get('/categoria-servicio', { withCredentials: true});
                this.categoriasServicio = data;
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al obtener las categorias de los servicios';
                }
                return [];
            } finally {
                this.loading = false;
            }
        },

        async createCategoriaServicio(payload: CategoriaServicio) {
            this.loading = true;
            try {
                const { data } = await api.post('/categoria-servicio', payload, { withCredentials: true });
                this.categoriasServicio.push(data);
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al crear la categoria';
                }
            } finally {
                this.loading = false;
            }
        }
    }
})