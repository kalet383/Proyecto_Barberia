import { defineStore } from "pinia";

export const useProductosStore = defineStore('productos', {
    state: () => ({
        categorias : [
            {
                id : 1,
                nombre : 'CABELLO',
                productos : [
                    {id : 101, nombre : 'Cera Gel para cabello', precio : 12000, img : '/imagenes/productos/cabello/Cera_gel_cabello.webp'},
                    {id : 102, nombre : 'Pomada para peinar', precio : 15000, img : '/imagenes/productos/cabello/pomada_para_peinar.jpg'},
                    {id : 103, nombre : 'Polvo texturizante', precio : 28000, img : '/imagenes/productos/cabello/polvo_texturizante.jpg'}
                ]
            },
            {
                id : 2,
                nombre : 'BARBA',
                productos : [
                    {id : 201, nombre : 'Balsamo para barba', precio : 20000, img : '/imagenes/productos/barba/balsamo_barba.webp'},
                    {id : 202, nombre : 'Tinte negro para barba', precio : 25000, img : '/imagenes/productos/barba/tinte_barba.webp'}
                ]
            },
            {
                id : 3,
                nombre : 'ROSTRO',
                productos : [
                    {id : 301, nombre : 'Mascarilla Exfoliante', precio : 7000, img : '/imagenes/productos/rostro/mascarilla_exfoliante.jpg'},
                    {id : 302, nombre : 'Jabon facial', precio : 22000, img : '/imagenes/productos/rostro/jabon_facial.webp'}
                ]
            },
            {
                id : 4,
                nombre : 'ARTICULOS',
                productos : [
                    {id : 401, nombre : 'Shaver afeitadora', precio : 20000, img : '/imagenes/productos/articulos/shaver_profesional.webp'},
                    {id : 402, nombre : 'Brocha para la barba', precio : 30000, img : '/imagenes/productos/articulos/brocha_barba.png'}
                ]
            }
        ],
        mostrarDetalles: false,
        productoSeleccionado: null,
    }),

    /* getters: {
        todosLosProductos: (state) =>
        state.categorias.flatMap(categoria => categoria.productos),

        obtenerProductoPorId: (state) => (id) => {
            return state.categorias.flatMap(cat => cat.productos).find(p => p.id === id);
        }
    }, */

    actions: {
        abrirDetalles(producto) {
            this.productoSeleccionado = producto;
            this.mostrarDetalles = true;
        },
        cerrarDetalles() {
            this.mostrarDetalles = false;
            this.productoSeleccionado = null;
        }
    }

});