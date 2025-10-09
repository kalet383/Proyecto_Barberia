import api from "@/plugins/axios";
import axios from "axios";
import { defineStore } from "pinia";

interface CategoriaProducto {
    id?: number;
    nombre: string;
}

interface CategoriaProductoState {
    categoriasProducto: CategoriaProducto[];
    loading: boolean;
    error: string | null;
}

export const useCategoriaProductoStore = defineStore('categoriaProducto', {
    state: (): CategoriaProductoState => ({
        categoriasProducto: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getCategoriasProducto() {
            this.loading = true;
            try {
                const { data } = await api.get('/categoria-producto', { withCredentials: true });
                this.categoriasProducto = data;
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al obtener las categorías de producto';
                }
                return [];
            } finally {
                this.loading = false;
            }
        },
        async createCategoriaProducto(payload: CategoriaProducto) {
            this.loading = true;
            try {
                const { data } = await api.post('/categoria-producto', payload, { withCredentials: true });
                this.categoriasProducto.push(data);
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al crear la categoría';
                }
            } finally {
                this.loading = false;
            }
        }
    }
})