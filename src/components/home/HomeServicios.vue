<template>
  <div>
    <section id="servicios-section">
      <div class="promo-ticker">
          <div class="promo-track">
            <span>💈🔥 RECUERDA TODOS NUESTROS MIERCOLES DE CANDELA, CON TODA LA BARBERIA EN UN 20% DE DESCUENTO 💈🔥 | VEN Y DISFRUTA DE NUESTRO ESPACIO DE DISTRACCION CON NUESTRAS CONSOLAS DE VIDEOJUEGOS 🎮 | FINES DE SEMANA SERVICIO ESTANDAR CON GRANIZADO GRATIS 🥤</span>
          </div>
        </div>
      <v-container class="py-10" fluid>
        <h2 class="section-title">NUESTROS SERVICIOS | Lo que ofrecemos</h2>
        <v-row dense justify="center" align="stretch" class="espacio-cards">
          <v-col v-for="(servicio, k) in categorias[tab].servicios" :key="k" cols="12" sm="6" md="4" class="d-flex">
            <v-card class="mx-auto" max-width="400" :class="`tipo-${servicio.tipo}`">
              <div class="media-servicio">
                <video class="video-servicio" autoplay muted loop playsinline>
                  <source :src="servicio.video" type="video/mp4" />
                </video>
                <div class="titulo-superpuesto">{{ servicio.nombre }}</div>
              </div>
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
  import { ref, reactive} from 'vue'
  const tab = ref(0)
  const categorias = reactive([
    {
      servicios: [
        {
          nombre: 'SERVICIO ESTANDAR',
          tipo : 'estandar',
          precio: '💰 $15.000 COP',
          tiempo: '⏱️ 30 min',
          descripcion: 'Asesoria de imagen y corte de tu preferencia, incluye bebida',
          video : '/public/imagenes/servicios/videoservicioestandar.mp4'
        },
        {
          nombre: 'SERVICIO SILVER',
          tipo : 'silver',
          precio: '💰 $22.000 COP',
          tiempo: '⏱️ 40 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, mascarilla y bebida incluida',
          video : '/public/imagenes/servicios/videoserviciosilver.mp4'
        },
        {
          nombre: 'SERVICIO GOLD',
          tipo : 'gold',
          precio: '💰 $30.000 COP',
          tiempo: '⏱️ 60 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, lavado de cabello, masaje y bebida incluida',
          video : '/public/imagenes/servicios/videoserviciogold.mp4'
        }
      ]
    }
  ])
</script>

<style scoped>

  #servicios-section {
    background-color: black;
  } 

  .section-title {
    color: white;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 30px;
    font-weight: bold;
    margin-top: 2%;
  }

  .section-title::after {
    content: '';
    display: block;
    width: 300px;
    height: 4px;
    margin: 8px auto 0 auto;
    background: linear-gradient(to right, #000, #fff, #000);
    border-radius: 2px;
    background-size: 200%;
    animation: animateGradient 3s linear infinite;
  }

  @keyframes animateGradient {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: 0 0;
    }
  }

  /* Asegura que las tarjetas crezcan */
  .v-card {
    width: 100%;
    height: auto !important; /* Permitir que la tarjeta crezca según el contenido */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 1%;
    margin-bottom: 8%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .v-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px #ee6f38;
    border: 3px solid #ee6f38;
  }

  .media-servicio {
    position: relative;
    width: 100%;
    height: 350px;
    overflow: hidden;
    border-bottom: 3px solid black;
  }

  .video-servicio {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

  .v-card-subtitle {
    color: black;
    font-weight: bold;
    font-size: 16px;
  }

  .titulo-superpuesto {
    position: absolute;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    color: white;
    padding: 8px;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }

  /* Asegura que el texto no se corte */
  .v-card-subtitle,
  .v-card-text {
    overflow: visible;
    text-align: center;
    padding: 10px;
    flex-grow: 0;
  }

  /* Ajustar el contenedor de las tarjetas */
  .espacio-cards {
    margin-left: 12%;
    margin-right: 12%;
    /* max-width: 1200px; */ /* Limitar el ancho máximo para mejor control */
    /* height: auto !important; */ /* Asegurar que el contenedor no restrinja la altura */
    padding: 20px 0; /* Agregar algo de padding para espaciado */
  }

  /* Botón de acciones */
  .v-card-actions {
    padding: 8px;
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  .botonAgendar {
    color: #ee6f38;
    transition: background-color 0.3s ease;
    margin-bottom: 5%;
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
    height: 50px; /* Aumenta el valor a tu gusto */
    line-height: 30px; /* Centra verticalmente el texto */
    font-size: 20px; /* También puedes aumentar el tamaño del texto */
    overflow: hidden;
    background-color: #ee6f38;
    color: white;
    font-weight: bold;
    white-space: nowrap;
    border-top: 2px solid white;
    border-bottom: 2px solid white;
    padding: 10px 0;
  }

  .promo-track {
    display: inline-block;
    padding-left: 100%;
    animation: scroll-left 20s linear infinite;
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