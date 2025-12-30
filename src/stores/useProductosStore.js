import { defineStore } from "pinia";

export const useProductosStore = defineStore('productos', {
    state: () => ({
        ComprasCarrito : [],
        categorias : [
            {
                id : 1,
                nombre : 'CABELLO',
                productos : [
                    {
                        id : 101, 
                        nombre : 'Cera Gel para cabello', 
                        precio : 12000, 
                        img : '/imagenes/productos/cabello/Cera_gel_cabello.webp',
                        resumen : 'Es la combinación perfecta entre la versatilidad de una cera y la fijación de un gel, diseñada para el hombre moderno que busca un estilo impecable. Con su fórmula única, esta cera gel ofrece una fijación firme y flexible que permite esculpir y definir el cabello con precisión.',
                        ingredientes : 'Agua (Aqua) (EAU), copolímero de acrilatos, carbómero, trietanolamina, propilenglicol, glicerina, triestearato de Sorbeth-450/cocoato de PEG-9/diestearato de PEG-32/diestearato de PEG-175, hidróxido de sodio, fenoxietanol/butilcarbamato de yodopropinilo, perfume (fragancia), salicilato de bencilo, limoneno, linalol, fosfolípidos/policuaternio-16/extracto de Rosmarinus officinalis (romero)/aceite de Mentha piperita (menta)/nicotinamida/pantenol/cafeína/biotina/acetato de tocoferilo, EDTA tetrasódico, extracto violeta 2 (CI 60730).',
                        modo_uso : 'Frote una pequeña cantidad entre sus manos y aplique en el cabello y estilizelo.',
                        cantidades : '200 gr',
                        beneficios : [
                            'Fijación fuerte pero flexible',
                            'No deja residuos',
                            'Aroma fresco'
                        ]
                    },
                    {
                        id : 102, 
                        nombre : 'Pomada para peinar', 
                        precio : 15000, 
                        img : '/imagenes/productos/cabello/pomada_para_peinar.jpg',
                        resumen : 'La arcilla para peinar artesanal de Don Juan ofrece un acabado mediano y un acabado mate natural que durará todo el día. Esta pomada de arcilla flexible permite peinados y volumen texturizados. Se lava fácilmente con agua.',
                        ingredientes : 'Agua, arcilla de caolín, cera de salvado de arroz, aceite de ricino hidrogenado PEG 40, aceite de semilla de uva, polisorbato 80, arcilla de bentonita, aceite de ricino hidrogenado, fragancia, fenoxietanol, ácido sórbico, glicol caprílico',
                        modo_uso : 'Recoja la cantidad deseada de producto y frótela entre las palmas de las manos. Aplicar con los dedos para secar el cabello para un look natural. Para una aplicación más fácil, aplicar sobre el cabello húmedo.',
                        cantidades : '4 oz',
                        beneficios : [
                            'Fijación media',
                            'Acabado natural mate',
                            'Aroma de brisa de verano'
                        ]
                    },
                    {
                        id : 103, 
                        nombre : 'Polvo texturizante', 
                        precio : 28000, 
                        img : '/imagenes/productos/cabello/polvo_texturizante.jpg',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    }
                ]
            },
            {
                id : 2,
                nombre : 'BARBA',
                productos : [
                    {
                        id : 201, 
                        nombre : 'Balsamo para barba', 
                        precio : 20000, 
                        img : '/imagenes/productos/barba/balsamo_barba.webp',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    },
                    {
                        id : 202, 
                        nombre : 'Tinte negro para barba', 
                        precio : 25000, 
                        img : '/imagenes/productos/barba/tinte_barba.webp',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    }
                ]
            },
            {
                id : 3,
                nombre : 'ROSTRO',
                productos : [
                    {
                        id : 301, 
                        nombre : 'Mascarilla Exfoliante', 
                        precio : 7000, 
                        img : '/imagenes/productos/rostro/mascarilla_exfoliante.jpg',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    },
                    {
                        id : 302, 
                        nombre : 'Jabon facial', 
                        precio : 22000, 
                        img : '/imagenes/productos/rostro/jabon_facial.webp',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    }
                ]
            },
            {
                id : 4,
                nombre : 'ARTICULOS',
                productos : [
                    {
                        id : 401, 
                        nombre : 'Shaver afeitadora', 
                        precio : 20000, 
                        img : '/imagenes/productos/articulos/shaver_profesional.webp',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    },
                    {
                        id : 402, 
                        nombre : 'Brocha para la barba', 
                        precio : 30000, 
                        img : '/imagenes/productos/articulos/brocha_barba.png',
                        resumen : '',
                        ingredientes : '',
                        modo_uso : '',
                        cantidades : '',
                        beneficios : []
                    }
                ]
            }
        ],
        mostrarDetalles: false,
        productoSeleccionado: null,
        carritoAbierto: false,
    }),

    // Normalizar datos: agregar precio_venta, stock y publicado por defecto para la demo
    // (En producción los productos vendrán del backend con estos campos)
    // Ejecutar una vez a la carga
    hydrate: () => {
        for (const cat of useProductosStore().categorias) {
            for (const p of cat.productos) {
                if (p.precio_venta === undefined) p.precio_venta = p.precio || 0;
                if (p.stock === undefined) p.stock = 10; // demo
                if (p.publicado === undefined) p.publicado = true;
            }
        }
    },

    getters: {
        totalProductos: (state) => {
            return state.ComprasCarrito.reduce((total, item) => total + item.cantidad, 0);
        },
        subtotalCarrito: (state) => {
            return state.ComprasCarrito.reduce((total, item) => total + (Number(item.precio || 0) * Number(item.cantidad || 0)), 0);
        }
    },

    actions: {
        abrirDetalles(producto) {
            this.productoSeleccionado = producto;
            this.mostrarDetalles = true;
        },
        cerrarDetalles() {
            this.mostrarDetalles = false;
            this.productoSeleccionado = null;
        },
        abrirCarrito() {
            this.carritoAbierto = true;
        },
        cerrarCarrito() {
            this.carritoAbierto = false;
        },
        AgregaralCarrito(producto) {
            const existente = this.ComprasCarrito.find(p => p.id === producto.id);
            const disponible = producto.cantidad_publicada !== undefined ? producto.cantidad_publicada : (producto.stock || 0);

            if (disponible <= 0) {
                // No hay unidades publicadas
                return;
            }

            if (existente) {
                // No permitir superar la cantidad publicada
                if (existente.cantidad >= disponible) return;
                existente.cantidad += 1;
            } else {
                // Normalizar precio e imagen para asegurar cálculos y visuales
                const precio = Number(producto.precio_venta ?? producto.precio ?? 0);
                const img = producto.imagenUrl || producto.img || '/imagenes/logo/logo2.png';
                this.ComprasCarrito.push({ ...producto, precio, img, cantidad: 1 });
            }
            this.abrirCarrito();
        },
        QuitarUno(productoId) {
            const item = this.ComprasCarrito.find(p => p.id === productoId);
            if (item) {
                if (item.cantidad > 1) {
                    item.cantidad -= 1;
                } else {
                    this.EliminarDelCarrito(productoId);
                }
            }
        },
        EliminarDelCarrito(productoId) {
            this.ComprasCarrito = this.ComprasCarrito.filter(p => p.id !== productoId);
        },
        VaciarCarrito() {
            this.ComprasCarrito = [];
        }
    }

});