<template>
  <div>
    <section id="seccion-inferior">
      <v-container class="servicios-section">
        <h2 class="section-title">NUESTROS SERVICIOS</h2>
        <v-tabs v-model="tab" class="my-4" align-tabs="center">
          <v-tab v-for="(categoria, i) in categorias" :key="i">
            {{ categoria.nombre }}
          </v-tab>
        </v-tabs>
        <v-carousel height="400" progress="#ee6f38" hide-delimiters v-if="categorias[tab]">
          <v-carousel-item v-for="(grupo, j) in agruparServicios(categorias[tab].servicios, 3)" :key="j">
            <v-row dense justify="center">
              <v-col v-for="(servicio, k) in grupo" :key="k" cols="12" sm="6" md="4">
                <v-card class="mx-auto" max-width="400">
                  <v-img class="align-end text-white" height="225" :src="servicio.imagen" cover>
                    <v-card-title>{{ servicio.nombre }}</v-card-title>
                  </v-img>
                  <v-card-subtitle class="pt-4">
                    {{ servicio.precio }} - {{ servicio.tiempo }}
                  </v-card-subtitle>
                  <v-card-text>
                    {{ servicio.descripcion }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="#ee6f38" text="AGENDAR"></v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-container>
    </section>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  const tab = ref(0)
  const categorias = reactive([
    {
      nombre: 'CABELLO',
      servicios: [
        {
          nombre: 'Corte Clásico',
          precio: '$12.000',
          tiempo: '30 min',
          descripcion: 'Un corte limpio y profesional.',
          imagen: 'https://i.pinimg.com/originals/93/71/93/937193566fba4c2a407bcad4b1889d97.jpg',
          show: false
        },
        {
          nombre: 'Taper Fade',
          precio: '$15.000',
          tiempo: '35 min',
          descripcion: 'Estilo degradado perfecto.',
          imagen: 'https://blog.goldsupplier.com/wp-content/uploads/2024/11/low-taper-fade-curly-hair-2.jpg',
          show: false
        },
        {
          nombre: 'Low Fade',
          precio: '$15.000',
          tiempo: '35 min',
          descripcion: 'Estilo degradado perfecto.',
          imagen: 'https://i.pinimg.com/736x/57/56/b1/5756b13874ab279d439fd789ced7398c.jpg',
          show: false
        },
        {
          nombre: 'Low Fade',
          precio: '$15.000',
          tiempo: '35 min',
          descripcion: 'Estilo degradado perfecto.',
          imagen: 'https://i.pinimg.com/736x/57/56/b1/5756b13874ab279d439fd789ced7398c.jpg',
          show: false
        }
      ]
    },
    {
      nombre: 'BARBA',
      servicios: [
        {
          nombre: 'Diseño de Barba',
          precio: '$100 MXN',
          tiempo: '25 min',
          descripcion: 'Barba con estilo y detalle.',
          imagen: 'https://i.pinimg.com/736x/bf/71/ab/bf71abcc025fe6229405db631b94a0f8.jpg',
          show: false
        },
        {
          nombre: 'Diseño de Barba',
          precio: '$100 MXN',
          tiempo: '25 min',
          descripcion: 'Barba con estilo y detalle.',
          imagen: 'https://i.pinimg.com/736x/bf/71/ab/bf71abcc025fe6229405db631b94a0f8.jpg',
          show: false
        },
        {
          nombre: 'Diseño de Barba',
          precio: '$100 MXN',
          tiempo: '25 min',
          descripcion: 'Barba con estilo y detalle.',
          imagen: 'https://i.pinimg.com/736x/bf/71/ab/bf71abcc025fe6229405db631b94a0f8.jpg',
          show: false
        },
        {
          nombre: 'Diseño de Barba',
          precio: '$100 MXN',
          tiempo: '25 min',
          descripcion: 'Barba con estilo y detalle.',
          imagen: 'https://i.pinimg.com/736x/bf/71/ab/bf71abcc025fe6229405db631b94a0f8.jpg',
          show: false
        }
      ]
    },
    {
      nombre: 'CEJAS',
      servicios: [
        {
          nombre: 'Diseño de Cejas',
          precio: '$80 MXN',
          tiempo: '15 min',
          descripcion: 'Perfilado preciso y natural.',
          imagen: 'https://2356021.fs1.hubspotusercontent-na1.net/hubfs/2356021/linea%20en%20la%20ceja%20hombre%20barberia%202.webp'
        }
      ]
    },
    {
      nombre: 'COMBOS STYLEHUB',
      servicios: [
        {
          nombre: 'Corte + Barba',
          precio: '$200 MXN',
          tiempo: '50 min',
          descripcion: 'Paquete completo de estilo.',
          imagen: '/imagenes/combo.jpg'
        }
      ]
    }
  ])

  function agruparServicios(servicios, tamGrupo) {
    const grupos = []
    for (let i = 0; i < servicios.length; i += tamGrupo) {
      grupos.push(servicios.slice(i, i + tamGrupo))
    }
    return grupos
  }

</script>

<style scoped>

.servicios-section {
  padding: 60px 0;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: bold;
}

</style>