<template>
  <div>
    <section id="seccion-inferior">
      <v-container class="servicios-section">
        <h2 class="section-title">NUESTROS SERVICIOS</h2>
        <v-carousel v-model="indicesCarrusel[tab]" progress="#ee6f38" hide-delimiters v-if="categorias[tab]">
          <v-carousel-item v-for="(grupo, j) in agruparServicios(categorias[tab].servicios, 3)" :key="j">
            <v-row dense justify="center" class="espacio-cards">
              <v-col v-for="(servicio, k) in grupo" :key="k" cols="12" sm="6" md="4" class="d-flex">
                <v-card class="mx-auto card-servicio" max-width="400">
                  <v-img class="img-servicio text-white" :src="servicio.imagen" cover>
                    <v-card-title>{{ servicio.nombre }}</v-card-title>
                  </v-img>
                  <v-card-subtitle class="pt-4">
                    {{ servicio.precio }} - {{ servicio.tiempo }}
                  </v-card-subtitle>
                  <v-card-text>
                    {{ servicio.descripcion }}
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="#ee6f38" class="botonAgendar">AGENDAR</v-btn>
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
  import { ref, reactive, watchEffect} from 'vue'
  const tab = ref(0)
  const indicesCarrusel = ref({})
  const categorias = reactive([
    {
      servicios: [
        {
          nombre: 'SERVICIO ESTANDAR',
          precio: '$15.000 COP',
          tiempo: '30 min',
          descripcion: 'Asesoria de imagen y corte de tu preferencia, incluye bebida',
          imagen: 'https://media.istockphoto.com/id/1473584884/es/foto/barbero-cortando-el-cabello-con-maquinilla-de-afeitar-el%C3%A9ctrica.jpg?s=612x612&w=0&k=20&c=JHW3q7t8M8ui6i-OrI9OFm1_OXvENagz7Auig58Kexw=',
          show: false
        },
        {
          nombre: 'SERVICIO SILVER',
          precio: '$22.000 COP',
          tiempo: '40 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, mascarilla y bebida incluida',
          imagen: 'https://thebarbercompany.pe/wp-content/uploads/2019/04/serv4.webp',
          show: false
        },
        {
          nombre: 'SERVICIO GOLD',
          precio: '$30.000 COP',
          tiempo: '60 min',
          descripcion: 'Asesoria de imagen, corte de tu preferencia, perfilado de barba, cejas, lavado de cabello, masaje y bebida incluida',
          imagen: 'https://www.clubdecaballeros.co/wp-content/uploads/2022/04/IMG_0427.jpg',
          show: false
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

  .v-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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

  /* Asegurar que el carrusel no corte las tarjetas */
  .v-carousel,
  .v-carousel__item {
    overflow: visible !important;
    height: auto !important; /* Permitir que el carrusel crezca según el contenido */
    min-height: 500px; /* Altura mínima para evitar que se colapse */
  }

  /* Botón de acciones */
  .v-card-actions {
    padding: 16px;
    display: flex;
    justify-content: center;
    flex-shrink: 0; /* Evita que el botón se comprima */
    margin-bottom: 10px; /* Agregar espacio debajo del botón */
  }

  /* Estilos para las flechas del carrusel */
  :deep(.v-carousel__controls) {
    position: absolute; /* Posicionar los controles fuera del flujo normal */
    top: 50%; /* Centrar verticalmente */
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between; /* Separar las flechas a los extremos */
    padding: 0 20px; /* Espacio en los bordes */
    transform: translateY(-50%); /* Ajustar el centrado vertical */
    z-index: 10; /* Asegurar que las flechas estén por encima del contenido */
  }

  /* Estilos para los botones de las flechas */
  :deep(.v-btn--icon.v-btn--density-default) {
    background-color: rgba(0, 0, 0, 0.6); /* Fondo semitransparente */
    color: white; /* Color de la flecha */
    width: 50px; /* Tamaño de los botones */
    height: 50px;
    border-radius: 50%; /* Hacer los botones circulares */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3); /* Sombra para mejor visibilidad */
    transition: background-color 0.3s ease;
  }

  /* Hover para las flechas */
  :deep(.v-btn--icon.v-btn--density-default:hover) {
    background-color: #ee6f38; /* Color de fondo al pasar el ratón */
  }

  /* Asegurar que las flechas estén visibles en pantallas pequeñas */
  @media (max-width: 600px) {
    :deep(.v-carousel__controls) {
      padding: 0 10px; /* Reducir el padding en pantallas pequeñas */
    }

    :deep(.v-btn--icon.v-btn--density-default) {
      width: 40px; /* Reducir el tamaño de las flechas */
      height: 40px;
    }
  }
</style>