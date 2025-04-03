<template>
    <header class="header">
    <div class="logo">
      <h1>STYLEHUB</h1>
    </div>
    <nav class="nav">
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Acerca</a></li>
        <li><a href="#">Servicios</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>
  </header>
  <hr style="border: 1px solid black;">
    <v-container class="fill-height text-center" fluid style="background-color: white;">
        <v-row justify="center">
            <v-col cols="12" md="8">
                <h1>BIENVENIDO A STYLEHUB</h1>
                <p>Gestor de Barberia</p>
                <v-btn color="primary" to="/login1">Iniciar Sesión</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

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
}

.nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: color 0.3s ease;
  color: #ee6f38;
}

.nav ul li a:hover {
  color: #000000;
}
</style>
