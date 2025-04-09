<template>
  <div class="page-container">
    <header class="header">
      <div class="logo">
        <img src="/imagenes/logo2.png" class="imagen-pequeña">
      </div>
      <nav class="nav">
        <ul>
          <li><a href="#">Servicios</a></li>
          <li><a href="#">Barberos</a></li>
          <li><a href="#">¿Quienes somos?</a></li>
          <li><a href="#">¿Como llegar?</a></li>
        </ul>
      </nav>
      <v-btn class="boton" color="#ee6f38" to="/login1">Iniciar Sesión</v-btn>
    </header>
      
    <v-container fluid class="carousel-container">
          <v-carousel  height="0vh" show-arrows="hover" cycle hide-delimiter-background class="half-screen-carousel">
            <v-carousel-item v-for="(image, i) in images" :key="i">
              <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
            </v-carousel-item>
          </v-carousel>
    </v-container>
  </div>
</template>

<script setup>
  const images = [
  'https://img.freepik.com/fotos-premium/hombre-sentado-silla-barbero-mientras-barbero-corta-cabello-precision-barbero-cortando-cuidadosamente-barba-cliente-precision_538213-114313.jpg?w=996',
  'https://st4.depositphotos.com/2760050/24509/i/450/depositphotos_245097428-stock-photo-hipster-with-beard-covered-with.jpg',
  'https://img.freepik.com/fotos-premium/primer-plano-blanco-negro-hombre-recortandose-barba-barberia-hombre-esta-relajado-ojos-cerrados_36682-70735.jpg?w=360',
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
  padding: 0px 40px;
  color: #ee6f38;
   /* Fondo semitransparente para legibilidad */
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(3px);
}

.imagen-pequeña {
  width: 125px;
  height: auto;
}

.boton {
  font-size: 20px;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-left: 50px;
}

.nav ul li a {
  text-decoration: none;
  color: #ee6f38;
  font-weight: bold;
  transition: color 0.3s ease;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  font-size: 20px;
}

.nav ul li a:hover {
  color: white;
}

/* Estilos para el carrusel */
.carousel-container {
  padding: 0 !important;
  margin: 0 !important;
}

.half-screen-carousel {
  width: 100vw !important;
  height: 80vh !important; /* Mitad de la pantalla */
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegurar que la imagen se ajuste correctamente */
}
</style>
