import {  defineStore } from 'pinia';
import api from '@/plugins/axios';
import axios from 'axios';

export interface FranjaHoraria {
    id?: number;
    hora_inicio: string;
    hora_fin: string;
}

interface FranjaHorariaState {
    franjasHorarias: FranjaHoraria[];
    loading: boolean;
    error: string | null;
}

export const useFranjaHorariaStore = defineStore('franjaHoraria', {
    state: (): FranjaHorariaState => ({
        franjasHorarias: [],
        loading: false,
        error: null,
    }),

    actions: {
        async getFranjasHorarias() {
            this.loading = true;
            try {
                const { data } = await api.get('/franja-horaria', { withCredentials: true });
                this.franjasHorarias = data;
                return data;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    this.error = err.response.data.message;
                } else {
                    this.error = 'Error cargando franjas horarias';
                }
                return [];
            } finally {
                this.loading = false;
            }
        },

        async createFranjaHoraria(payload: FranjaHoraria) {
            this.loading = true;
            try {
                const { data } = await api.post('/franja-horaria', payload, { withCredentials: true });
                this.franjasHorarias.push(data);
                return data;
            } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    this.error = err.response.data.message;
                } else {
                    this.error = 'Error al crear franja horaria';
                }
                throw this.error;
            } finally {
                this.loading = false;
            }
        }
    }
}); 