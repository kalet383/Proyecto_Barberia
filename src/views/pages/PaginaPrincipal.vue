<template>
  <div class="page-container">
    <header ref="headerRef" class="header">
      <div class="logo">
        <a href="/" @click="location.reload()">
          <img src="/public/imagenes/logo/logo2.png" class="imagen-pequeña" />
        </a>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="#servicios-section">SERVICIOS</a></li>
          <li><a href="#barberos-section">BARBEROS</a></li>
          <li><a href="#productos-section">PRODUCTOS</a></li>
          <li><a href="#">¿COMO LLEGAR?</a></li>
          <li><a href="#">¿QUIENES SOMOS?</a></li>
        </ul>
      </nav>
      <div>
        <v-btn class="boton-inicio-seccion" to="/login1">INICIAR SESION</v-btn>
      </div>
        <CarritoCompra></CarritoCompra>
    </header>
        <v-container fluid class="carousel-container">
          <v-carousel  height="0vh" show-arrows="hover" cycle hide-delimiters hide-delimiter-background class="half-screen-carousel">
            <v-carousel-item v-for="(image, i) in images" :key="i">
              <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
            </v-carousel-item>
          </v-carousel>
          <div class="centered-contend">
            <h1 class="title">ESTILO SIN LIMITES, BIENVENIDO A STYLEHUB.</h1>
            <v-btn class="boton-agendar" to="/login1">¡AGENDA YA!</v-btn>
            <a href="#servicios-section" class="flecha-abajo">
              <i class="fa-solid fa-angle-down"></i>
            </a>
          </div>
        </v-container>
  </div>
  <HomeServicios></HomeServicios>
  <HomeBarberos></HomeBarberos>
  <HomeProductos></HomeProductos>

  <!-- API whatsapp -->
  <a href="https://api.whatsapp.com/send?phone=TU_NUMERO&text=Hola%20quiero%20más%20información"
    class="whatsapp-button" target="_blank">
    <i class="fab fa-whatsapp"></i>
    <span class="parrafowhatsapp">Escribemos por Whatsapp</span>
  </a>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import HomeServicios from '@/views/pages/HomeServicios.vue';
  import HomeBarberos from '@/views/pages/HomeBarberos.vue';
  import HomeProductos from '@/views/pages/HomeProductos.vue';
  import CarritoCompra from '@/components/shared/CarritoCompra.vue';
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

  body {
    margin: 0;
    padding: 0;
  }

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
    background-color:#ee6f38;
    color: white;
    font-size: 16px;
    margin-left: 110%;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    transition: all 0.3s ease;
  }

  .boton-inicio-seccion:hover {
    background-color: white;
    color: #ee6f38;
    padding-bottom: 4px;
  }

  .header.sticky .boton-inicio-seccion {
    font-size: 12px; /* Reducir tamaño del texto */
    padding: 4px 8px; /* Reducir el padding del botón */
    margin-left: 250%;
  }

  .nav ul {
    list-style: none;
    padding: 0;
    display: flex;
    gap: 30px;
    margin-left: 250px;
    transition: all 0.3s ease;
    justify-content: center;
    flex-wrap: nowrap; /* Evita que los elementos se envuelvan, pero puedes cambiar a wrap si prefieres */
    width: 100%; /* Asegura que ocupe el espacio disponible */
    max-width: 600px; /* Limita el ancho máximo para que no se desborde */
  }

  .header.sticky .nav ul {
    gap: 20px; /* Reducir aún más el espacio entre enlaces */
    max-width: 500px; /* Ajusta el ancho máximo en el estado sticky */
    margin: 70 auto; /* Centra el ul */
  }

  .nav ul li a {
    text-decoration: none;
    color: white;
    font-weight: bold;
    transition: all 0.3s ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    font-size: 17px;
    padding-bottom: 4px;
    white-space: nowrap; /* Evita que el texto se envuelva */
  }

  .header.sticky .nav ul li a {
    font-size: 15px; /* Reducir tamaño de fuente */
    margin-left: 30%;
  }

  .nav ul li a:hover {
    border-bottom: 2px solid white;
    color: #ee6f38;
    padding-left: 12px;
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
    background-color:#ee6f38;
    color: white;
    margin-top: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    font-size: 18px
  }

  .boton-agendar:hover {
    background-color: white;
    color: #ee6f38;
    padding-bottom: 4px;
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

  .whatsapp-button { 
    position: fixed; 
    bottom: 20px; right: 20px;
    background-color: #ee6f38; 
    color: white;
    width: 240px; 
    height: 50px;
    padding: 12px 20px;
    border-radius: 20px;
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); 
    transition: transform 0.3s ease;
    text-decoration: none;
    padding-left: 1%;
    z-index: 1000;
    white-space: nowrap;
  }

  .whatsapp-button:hover {
    transform: scale(1.05);
  }

  .whatsapp-button i {
    font-size: 20px;
    margin-right: 10px;
  }
</style>