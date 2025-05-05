<template>
  <div>
    <section id="seccion-inferior">
      <div class="promo-ticker">
          <div class="promo-track">
            <span>💈🔥 RECUERDA TODOS NUESTROS MIERCOLES DE CANDELA, CON TODA LA BARBERIA EN UN 20% DE DESCUENTO 💈🔥 | VEN Y DISFRUTA DE NUESTRO ESPACIO DE DISTRACCION CON NUESTRAS CONSOLAS DE VIDEOJUEGOS 🎮 | FINES DE SEMANA SERVICIO ESTANDAR CON GRANIZADO GRATIS 🥤</span>
          </div>
        </div>
      <v-container class="servicios-section">
        <h2 class="section-title">NUESTROS SERVICIOS</h2>
        <v-row dense justify="center" class="espacio-cards">
          <v-col v-for="(servicio, k) in categorias[tab].servicios" :key="k" cols="12" sm="6" md="4" class="d-flex">
            <v-card class="mx-auto card-servicio" max-width="400" :class="`tipo-${servicio.tipo}`">
              <v-img class="img-servicio" :src="servicio.imagen" cover>
                <v-card-title class="titulo-superpuesto"> {{ servicio.nombre }} </v-card-title>
              </v-img>
              <v-card-subtitle class="pt-4"> {{ servicio.precio }} - {{ servicio.tiempo }} </v-card-subtitle>
              <v-card-text> {{ servicio.descripcion }} </v-card-text>
              <v-card-actions>
                <v-btn class="botonAgendar">AGENDAR</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script setup>
  import { ref, reactive, watchEffect} from 'vue'
  const tab = ref(0)
  const indicesCarrusel = ref({})
  const categorias = reactive([
    {
      servicios: [
        {
          nombre: 'SERVICIO ESTANDAR',
          tipo : 'estandar',
          precio: '💰 $15.000 COP',
          tiempo: '⏱️ 30 min',
          descripcion: 'Asesoria de imagen y corte de tu preferencia, incluye bebida',
          imagen: '/public/imagenes/servicios/servicioESTANDAR.jpg'
        },
        {
          nombre: 'SERVICIO SILVER',
          tipo : 'silver',
          precio: '💰 $22.000 COP',
          tiempo: '⏱️ 40 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, mascarilla y bebida incluida',
          imagen: '/public/imagenes/servicios/servicioSILVER.webp'
        },
        {
          nombre: 'SERVICIO GOLD',
          tipo : 'gold',
          precio: '💰 $30.000 COP',
          tiempo: '⏱️ 60 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, lavado de cabello, masaje y bebida incluida',
          imagen: '/public/imagenes/servicios/servicioGOLD.jpg'
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

  watchEffect(() => {
    categorias.forEach((_, index) => {
      if (indicesCarrusel.value[index] === undefined) {
        indicesCarrusel.value[index] = 0; // Cada categoría empieza en la primera página
      }
    });
  });

</script>

<style scoped>

  #seccion-inferior {
    position: relative;
    z-index: 2;
    margin-top: 0; /* Asegura que no haya margen superior que cause espacios */
  }

  .servicios-section {
    padding: 60px 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: visible !important; /* Permitir que el contenido desborde si es necesario */
  }

  .section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
    margin-top: 1%;
  }

  /* Asegura que las tarjetas crezcan */
  .v-card {
    width: 100%;
    max-width: 400px;
    height: auto !important; /* Permitir que la tarjeta crezca según el contenido */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 4%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .tipo-estandar {
    border: 2px solid #9e9e9e;
  }

  .tipo-silver {
    border: 2px solid #607d8b;
    background-color: #eceff1;
  }

  .tipo-gold {
    border: 2px solid #fbc02d;
    background-color: #fffde7;
  }

  .v-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    border: 2px solid black;
  }

  .v-card-subtitle {
    color: black;
    font-weight: bold;
    font-size: 16px;
  }

  .titulo-superpuesto {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Fondo semitransparente */
    color: white;
    padding: 8px;
    font-weight: bold;
    text-align: center;
  }

  .card-servicio {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: auto; /* Asegurar que la tarjeta no tenga altura fija */
  }

  /* Imagen no muy alta */
  .img-servicio {
    height: 300px;
    object-fit: cover;
  }

  /* Asegura que el texto no se corte */
  .v-card-subtitle,
  .v-card-text {
    overflow: visible;
    white-space: normal;
    text-align: center;
    padding: 16px;
  }

  /* Ajustar el contenedor de las tarjetas */
  .espacio-cards {
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px; /* Limitar el ancho máximo para mejor control */
    height: auto !important; /* Asegurar que el contenedor no restrinja la altura */
    padding: 20px 0; /* Agregar algo de padding para espaciado */
  }

  /* Botón de acciones */
  .v-card-actions {
    padding: 16px;
    display: flex;
    justify-content: center;
    margin-bottom: 6px; /* Agregar espacio debajo del botón */
  }

  .botonAgendar {
    color: #ee6f38;
    transition: background-color 0.3s ease;
  }

  .botonAgendar:hover {
    background-color: #ff7043;
    color: white;
    padding-left: 60px;
    padding-right: 60px;
    transform: scale(1.1);
    box-shadow: 0 5px 13px rgba(255, 87, 34, 0.4);
  }

  .promo-ticker {
    height: 80px; /* Aumenta el valor a tu gusto */
    line-height: 60px; /* Centra verticalmente el texto */
    font-size: 20px; /* También puedes aumentar el tamaño del texto */
    overflow: hidden;
    background-color: #ee6f38;
    color: #000;
    font-weight: bold;
    white-space: nowrap;
    border-top: 2px solid black;
    border-bottom: 2px solid black;
    padding: 10px 0;
  }

  .promo-track {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 15s linear infinite;
  }

  .promo-ticker:hover .promo-track {
    animation-play-state: paused;
  }

  @keyframes scroll-left {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>