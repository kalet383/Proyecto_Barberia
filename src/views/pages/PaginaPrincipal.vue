<template>
  <div class="page-container">
    <header class="header">
      <div class="logo">
        <img src="/imagenes/logo2.png" class="imagen-pequeña">
      </div>
      <nav class="nav">
        <ul>
          <li><a href="#">SERVICIOS</a></li>
          <li><a href="#">BARBEROS</a></li>
          <li><a href="#">PRODUCTOS</a></li>
          <li><a href="#">¿QUIENES SOMOS?</a></li>
          <li><a href="#">¿COMO LLEGAR?</a></li>
        </ul>
      </nav>
      <v-btn class="boton-inicio-seccion" color="#ee6f38" to="/login1">INICIAR SECCION</v-btn>
    </header>
        <v-container fluid class="carousel-container">
          <v-carousel  height="0vh" show-arrows="hover" cycle hide-delimiters hide-delimiter-background class="half-screen-carousel">
            <v-carousel-item v-for="(image, i) in images" :key="i">
              <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
            </v-carousel-item>
          </v-carousel>
          <div class="centered-contend">
            <h1 class="title">STYLEHUB: ESTILO, PRECISION Y CARACTER</h1>
            <v-btn class="boton-agendar" color="#ee6f38" to="/login1">¡AGENDA YA!</v-btn>
            <a href="#seccion-inferior" class="flecha-abajo">
              <i class="fa-solid fa-angle-down"></i>
            </a>
          </div>
        </v-container>
  </div>
</template>

<script setup>
  const images = [
  'https://img.freepik.com/fotos-premium/hombre-sentado-silla-barbero-mientras-barbero-corta-cabello-precision-barbero-cortando-cuidadosamente-barba-cliente-precision_538213-114313.jpg?w=996',
  'https://www.blac.media/wp-content/uploads/2022/11/pexels-rodnae-productions-7697394-scaled.jpg',
  'https://wallpapers.com/images/hd/barber-shop-background-d8q2uecwheabpqj0.jpg',
  'https://www.giomrbarber.com/wp-content/uploads/2024/01/escuela-de-barberia-en-bogota.jpeg',
  'https://s1.abcstatics.com/media/summum/2018/11/30/nathon-oski-546863-unsplash-k0MG--1248x698@abc.jpg',
];
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.header {
  position: absolute; /* Superponer el header sobre el carrusel */
  top: 0;
  left: 0;
  right: 0;
  z-index: 10; /* Asegurar que el header esté por encima del carrusel */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 55px;
  color: #ee6f38;
  
}

.imagen-pequeña {
  margin-top: 10px;
  width: 138px;
  height: auto;
}

.boton-inicio-seccion {
  font-size: 15px;
}

.nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 28px;
  margin-left: 50px;
}

.nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: border-bottom 0.3s ease;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  font-size: 17px;
  padding-bottom: 4px;
}

.nav ul li a:hover {
  border-bottom: 2px solid white;
  color: #ee6f38;
}

/* Estilos para el carrusel */
.carousel-container {
  padding: 0 !important;
  margin: 0 !important;
}

.half-screen-carousel {
  width: 100vw !important;
  height: 100vh !important; /* Mitad de la pantalla */
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegurar que la imagen se ajuste correctamente */
  position: relative
}

.centered-contend {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 11; /* Asegurarse de que esté por encima del carrusel */
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.boton-agendar {
  margin-top: 10px;
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

</style>
