<template>
  <div class="page-container">
    <header ref="headerRef" class="header">
      <div class="logo">
        <a href="/" @click="location.reload()">
          <img src="/imagenes/logo2.png" class="imagen-pequeña" />
        </a>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="#">SERVICIOS</a></li>
          <li><a href="#">BARBEROS</a></li>
          <li><a href="#">PRODUCTOS</a></li>
          <li><a href="#">¿COMO LLEGAR?</a></li>
          <li><a href="#">¿QUIENES SOMOS?</a></li>
        </ul>
      </nav>
      <v-btn class="boton-inicio-seccion" color="#ee6f38" to="/login1">INICIAR SESION</v-btn>
    </header>
        <v-container fluid class="carousel-container">
          <v-carousel  height="0vh" show-arrows="hover" cycle hide-delimiters hide-delimiter-background class="half-screen-carousel">
            <v-carousel-item v-for="(image, i) in images" :key="i">
              <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
            </v-carousel-item>
          </v-carousel>
          <div class="centered-contend">
            <h1 class="title">ESTILO SIN LIMITES, BIENVENIDO A STYLEHUB.</h1>
            <v-btn class="boton-agendar" color="#ee6f38" to="/login1">¡AGENDA YA!</v-btn>
            <a href="#seccion-inferior" class="flecha-abajo">
              <i class="fa-solid fa-angle-down"></i>
            </a>
          </div>
        </v-container>
  </div>
  <HomeServicios></HomeServicios>
  <HomeBarberos></HomeBarberos>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import HomeServicios from '@/components/home/HomeServicios.vue';
  import HomeBarberos from '@/components/home/HomeBarberos.vue';
  const images = [
    'https://img.freepik.com/fotos-premium/hombre-sentado-silla-barbero-mientras-barbero-corta-cabello-precision-barbero-cortando-cuidadosamente-barba-cliente-precision_538213-114313.jpg?w=996',
    'https://www.blac.media/wp-content/uploads/2022/11/pexels-rodnae-productions-7697394-scaled.jpg',
    'https://wallpapers.com/images/hd/barber-shop-background-d8q2uecwheabpqj0.jpg',
    'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?cs=srgb&dl=pexels-thgusstavo-1813272.jpg&fm=jpg',
    'https://s1.abcstatics.com/media/summum/2018/11/30/nathon-oski-546863-unsplash-k0MG--1248x698@abc.jpg',
  ];

  // Crear una referencia para el header
  const headerRef = ref(null);

  // Función para manejar el scroll
  const handleScroll = () => {
    if (headerRef.value) {
      if (window.scrollY > 0) {
        headerRef.value.classList.add('sticky');
      } else {
        headerRef.value.classList.remove('sticky');
      }
    }
  };

  // Agregar y remover el event listener al montar y desmontar el componente
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: absolute; /* Superponer el header sobre el carrusel */
  top: 0;
  left: 0;
  right: 0;
  z-index: 99; /* Asegurar que el header esté por encima del carrusel */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 55px;
  color: #ee6f38;
  transition: all 0.3s ease;
}

.header.sticky {
  position: fixed;
  top: 0; /* Asegúrate de que esté pegado al tope */
  width: 100%; /* Ocupa todo el ancho */
  background-color: rgba(0, 0, 0, 0.70);
  backdrop-filter: blur(5px);
  z-index: 99;
  padding: 0px 40px; /* Reducir el padding */
  height: 95px; /* Reducir la altura del header */
}

.imagen-pequeña {
  margin-top: 10px;
  width: 138px;
  height: auto;
  transition: all 0.3s ease; /* Animación suave */
}

.header.sticky .imagen-pequeña {
  width: 100px; /* Reducir tamaño del logo */
  margin-top: 5px;
}

.boton-inicio-seccion {
  font-size: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
}

.header.sticky .boton-inicio-seccion {
  font-size: 12px; /* Reducir tamaño del texto */
  padding: 4px 8px; /* Reducir el padding del botón */
}

.nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 28px;
  margin-left: 50px;
  transition: all 0.3s ease;
}

.header.sticky .nav ul {
  gap: 20px; /* Reducir el espacio entre enlaces */
  margin-left: 30px;
}

.nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  font-size: 17px;
  padding-bottom: 4px;
}

.header.sticky .nav ul li a {
  font-size: 14px; /* Reducir tamaño de fuente */
}

.nav ul li a:hover {
  border-bottom: 2px solid white;
  color: #ee6f38;
}

/* Estilos para el carrusel */
.carousel-container {
  padding: 0 !important;
  margin: 0 !important;
  position: relative; /* Asegura que el contenedor sea un punto de referencia */
  height: 100vh; /* Mantén la altura para que ocupe la pantalla */
  overflow: hidden; /* Evita que el carrusel desborde */
  background: transparent !important;
}

.half-screen-carousel {
  width: 100vw !important;
  height: 100vh !important; /* Mitad de la pantalla */
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegurar que la imagen se ajuste correctamente */
  position: absolute;
  top: 0;
  left: 0;
}

.centered-contend {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 5; /* Asegurarse de que esté por encima del carrusel */
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.boton-agendar {
  margin-top: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  font-size: 18px
}

.flecha-abajo {
  display: block;
  font-size: 3rem;
  color: white;
  opacity: 0.6;
  text-align: center;
  margin-top: 20px;
  transition: opacity 0.3s, transform 0.3s;
  animation: bounce 2s infinite;
}

.flecha-abajo:hover {
  opacity: 2;
  transform: translateY(4px);
  cursor: pointer;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

.title {
  display: inline-block;
  font-weight: bold;
  font-size: 2rem;
  color: white;
  transition: transform 0.2s ease, text-shadow 0.2s ease;
}

.title:hover {
  transform: scale(1.02);
  text-shadow: 0 0 10px black, 0 0 20px black;
}

@media (min-width: 1024px) {
  .centered-contend {
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 11;
    margin-top: 80px;
  }
}
</style>