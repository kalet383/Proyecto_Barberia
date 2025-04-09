<template>
  <header class="header">
    <div class="logo">
      <h1>STYLEHUB</h1>
    </div>
    <nav class="nav">
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Servicios</a></li>
        <li><a href="#">Barberos</a></li>
        <li><a href="#">¿Quienes somos?</a></li>
      </ul>
    </nav>
    <v-btn color="#ee6f38" to="/login1">Iniciar Sesión</v-btn>
  </header>
    <hr style="border: 1px solid black;">
  <v-container class="fill-height text-center" fluid style="background-color: white;">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1>BIENVENIDO A STYLEHUB</h1>
        <p>Gestor de Barberia</p>
        <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet :color="colors[i]" height="100%">
              <div class="d-flex fill-height justify-center align-center">
                <div class="text-h2">
                  {{ slide }}
                </div>
              </div>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  const colors = [
    'indigo',
    'warning',
    'pink darken-2',
    'red lighten-1',
    'deep-purple accent-4',
  ]
  const slides = [
    'Foto 1',
    'Foto 2',
    'Foto 3',
    'Foto 4',
    'Foto 5',
  ]
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;

  color: #ee6f38;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo h1 {
  margin: 0;
  font-size: 1.8rem;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  ;
}

.nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  margin-left: 500px;
}

.nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: color 0.3s ease;
  color: #ee6f38;
}

.nav ul li a:hover {
  color: #000000;
}
</style>
