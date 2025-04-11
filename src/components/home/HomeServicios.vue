<template>
    <div>
        <v-container class="servicios-section">
    <h2 class="section-title">NUESTROS SERVICIOS</h2>

    <v-tabs v-model="tab" class="my-4" align-tabs="center">
      <v-tab v-for="(categoria, i) in categorias" :key="i">
        {{ categoria.nombre }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item v-for="(categoria, i) in categorias" :key="i">
        <v-row>
          <v-col v-for="(servicio, j) in categoria.servicios" :key="j" cols="12" sm="6" md="4">
            <v-card class="mx-auto" max-width="344">
              <v-img :src="servicio.imagen" height="200px" cover></v-img>

              <v-card-title>{{ servicio.nombre }}</v-card-title>
              <v-card-subtitle>{{ servicio.precio }} - {{ servicio.tiempo }}</v-card-subtitle>

              <v-card-actions>
                <v-btn color="#ee6f38" text="AGENDAR"></v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :icon="servicio.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  @click="toggleExpand(categoria.nombre, j)"
                ></v-btn>
              </v-card-actions>

              <v-expand-transition>
                <div v-show="servicio.show">
                  <v-divider></v-divider>
                  <v-card-text>{{ servicio.descripcion }}</v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>
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
        precio: '$120 MXN',
        tiempo: '30 min',
        descripcion: 'Un corte limpio y profesional.',
        imagen: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        show: false
      },
      {
        nombre: 'Fade moderno',
        precio: '$150 MXN',
        tiempo: '35 min',
        descripcion: 'Estilo degradado perfecto.',
        imagen: 'https://cdn.vuetifyjs.com/images/cards/road.jpg',
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
        imagen: 'https://cdn.vuetifyjs.com/images/cards/night.jpg',
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
        imagen: '/imagenes/cejas.jpg'
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

function toggleExpand(categoriaNombre, index) {
  const categoria = categorias.find(cat => cat.nombre === categoriaNombre)
  if (categoria) {
    categoria.servicios[index].show = !categoria.servicios[index].show
  }
}
</script>

<style scoped>
.servicios-section {
  padding: 60px 0;
  background-color: #f8f8f8;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: bold;
}
</style>