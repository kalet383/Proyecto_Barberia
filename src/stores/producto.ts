import api from "@/plugins/axios";
import axios from "axios";
import { defineStore } from "pinia";

interface producto {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagenUrl: string;
    categoriaId: number;
}

interface ProductoState {
    productos: producto[];
    loading: boolean;
    error: string | null;
}

export const useProductoStore = defineStore('producto', {
    state: (): ProductoState => ({
        productos: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getProductos() {
            this.loading = true;
            this.error = null;
            try {
                const { data } = await api.get('/producto', { withCredentials: true });
                // Transformar los datos para asegurar tipos correctos
                this.productos = data.map((producto: any) => ({
                    ...producto,
                    precio: parseFloat(producto.precio) || 0,
                    stock: parseInt(producto.stock) || 0
                }));
                console.log('Productos cargados:', this.productos);
                return this.productos;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al obtener los productos';
                }
                return [];
            } finally {
                this.loading = false;
            }
        },
        async createProducto(payload: producto) {
            this.loading = true;
            try {
                const { data } = await api.post('/producto', payload, { withCredentials: true });
                this.productos.push(data);
                return data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.message) {
                    this.error = error.response.data.message;
                } else {
                    this.error = 'Error al crear el producto';
                }
            } finally {
                this.loading = false;
            }
        }
    }
})