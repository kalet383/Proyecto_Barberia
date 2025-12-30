<template>
  <div class="page-container">
    <header ref="headerRef" class="header">
      <div class="logo">
        <a href="/" @click.prevent="goHome">
          <img src="/public/imagenes/logo/logo2.png" class="imagen-pequeña" />
        </a>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="#servicios-section">SERVICIOS</a></li>
          <li><a href="#barberos-section">BARBEROS</a></li>
          <li><a href="#productos-section">PRODUCTOS</a></li>
          <li><a href="#ubicacion-section">¿COMO LLEGAR?</a></li>
          <li><a href="#">¿QUIENES SOMOS?</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <!-- Carrito de Compras -->
        <v-btn icon class="text-white mr-4" variant="text" @click="productosStore.abrirCarrito()">
          <v-badge color="error" :content="productosStore.totalProductos" v-if="productosStore.totalProductos > 0">
            <ShoppingCartIcon size="28" stroke-width="1.5" />
          </v-badge>
          <ShoppingCartIcon size="28" stroke-width="1.5" v-else />
        </v-btn>

        <!-- Usuario NO logueado -->
        <v-btn 
          v-if="!authStore.isAuthenticated" 
          class="boton-inicio-seccion" 
          to="/login1"
        >
          INICIAR SESION
        </v-btn>

        <!-- Usuario LOGUEADO -->
        <div v-else class="user-menu">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="user-info">
                <v-avatar size="40" class="user-avatar">
                  <i v-if="!authStore.user?.foto" class="fas fa-user-circle"></i>
                  <v-img v-else :src="authStore.user.foto" alt="Usuario"></v-img>
                </v-avatar>
                <span class="user-name">{{ authStore.user?.nombre }}</span>
                <i class="fas fa-chevron-down chevron-icon"></i>
              </div>
            </template>

            <v-list class="user-dropdown">
              <!-- Header del menú -->
              <v-list-item class="user-header">
                <div class="user-header-content">
                  <v-avatar size="50" class="mb-2">
                    <i v-if="!authStore.user?.foto" class="fas fa-user-circle fa-3x text-orange"></i>
                    <v-img v-else :src="authStore.user.foto" alt="Usuario"></v-img>
                  </v-avatar>
                  <v-list-item-title class="font-weight-bold text-h6">
                    {{ authStore.user?.nombre }} {{ authStore.user?.apellido }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-caption">
                    {{ authStore.user?.email }}
                  </v-list-item-subtitle>
                </div>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <!-- Opciones del menú -->
              <v-list-item @click="irADashboard" class="menu-item">
                <template v-slot:prepend>
                  <i class="fas fa-chart-line menu-icon"></i>
                </template>
                <v-list-item-title>Mi Dashboard</v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="irAMisCitas" class="menu-item">
                <template v-slot:prepend>
                  <i class="fas fa-calendar-check menu-icon"></i>
                </template>
                <v-list-item-title>Mis Citas</v-list-item-title>
              </v-list-item>
              
              <v-list-item @click="irAPerfil" class="menu-item">
                <template v-slot:prepend>
                  <i class="fas fa-user-edit menu-icon"></i>
                </template>
                <v-list-item-title>Mi Perfil</v-list-item-title>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item @click="cerrarSesion" class="menu-item logout-item">
                <template v-slot:prepend>
                  <i class="fas fa-sign-out-alt menu-icon text-red"></i>
                </template>
                <v-list-item-title class="text-red font-weight-medium">
                  Cerrar Sesión
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <CartModal />
      </div>
    </header>

    <!-- Resto del contenido -->
    <v-container fluid class="carousel-container">
      <v-carousel height="0vh" show-arrows="hover" cycle hide-delimiters hide-delimiter-background class="half-screen-carousel">
        <v-carousel-item v-for="(image, i) in images" :key="i">
          <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
        </v-carousel-item>
      </v-carousel>
      <div class="centered-contend">
        <h1 class="title">ESTILO SIN LIMITES, BIENVENIDO A STYLEHUB.</h1>
        <v-btn class="boton-agendar" @click="abrirModal()">¡AGENDA YA!</v-btn>
        <a href="#servicios-section" class="flecha-abajo">
          <i class="fa-solid fa-angle-down"></i>
        </a>
      </div>
    </v-container>

    <HomeServicios></HomeServicios>
    <HomeBarberos></HomeBarberos>
    <HomeProductos></HomeProductos>
    <HomeUbicacion></HomeUbicacion>
    <VistareservaCita v-model="showModal"></VistareservaCita>
    <FooterPagina></FooterPagina>

    <!-- API whatsapp -->
    <a href="https://api.whatsapp.com/send?phone=TU_NUMERO&text=Hola%20quiero%20más%20información" class="whatsapp-button" target="_blank">
      <i class="fab fa-whatsapp"></i>
      <span class="parrafowhatsapp">Escribemos por Whatsapp</span>
    </a>

    <v-snackbar v-model="snackbar" color="black" location="top right" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="primary" variant="text" @click="snackbar = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useProductosStore } from '@/stores/useProductosStore';
import { useRouter } from 'vue-router';
import HomeServicios from '@/views/pages/HomeServicios.vue';
import HomeBarberos from '@/views/pages/HomeBarberos.vue';
import HomeProductos from '@/views/pages/HomeProductos.vue';
import HomeUbicacion from './HomeUbicacion.vue';
import CartModal from '@/components/shared/CartModal.vue';
import VistareservaCita from './VistareservaCita.vue';
import FooterPagina from './FooterPagina.vue';
import { ShoppingCartIcon } from 'vue-tabler-icons';

const authStore = useAuthStore();
const productosStore = useProductosStore();
const router = useRouter();

const snackbar = ref(false);
const snackbarText = ref('');

watch(() => productosStore.totalProductos, (newCount, oldCount) => {
  if (newCount > oldCount) {
    snackbarText.value = '¡Producto añadido al carrito! 🛒';
    snackbar.value = true;
  }
});

const images = [
  'https://img.freepik.com/fotos-premium/hombre-sentado-silla-barbero-mientras-barbero-corta-cabello-precision-barbero-cortando-cuidadosamente-barba-cliente-precision_538213-114313.jpg?w=996',
  'https://www.blac.media/wp-content/uploads/2022/11/pexels-rodnae-productions-7697394-scaled.jpg',
  'https://wallpapers.com/images/hd/barber-shop-background-d8q2uecwheabpqj0.jpg',
  'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?cs=srgb&dl=pexels-thgusstavo-1813272.jpg&fm=jpg',
  'https://s1.abcstatics.com/media/summum/2018/11/30/nathon-oski-546863-unsplash-k0MG--1248x698@abc.jpg',
];

const headerRef = ref(null);
const showModal = ref(false);

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  
  if (!authStore.user) {
    try {
      console.log('🔄 Cargando usuario desde cookies...');
      await authStore.loadUser();
      console.log('✅ Usuario cargado:', authStore.user);
    } catch (error) {
      console.log('ℹ️ No hay sesión activa');
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const handleScroll = () => {
  if (headerRef.value) {
    if (window.scrollY > 0) {
      headerRef.value.classList.add('sticky');
    } else {
      headerRef.value.classList.remove('sticky');
    }
  }
};

const irADashboard = () => {
  router.push('/dashboard');
};

const irAMisCitas = () => {
  router.push('/mis-citas');
};

const irAPerfil = () => {
  router.push('/perfil');
};

const goHome = () => {
  router.replace('/');
};

const cerrarSesion = async () => {
  await authStore.logout();
  // 🎯 Redirigir al home en lugar de recargar (evita que nos lleve a /login)
  router.replace('/');
};

function abrirModal() {
  showModal.value = true;
}
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 55px;
  transition: all 0.3s ease;
}

.header.sticky {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 99;
  padding: 0px 40px;
  height: 95px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.logo {
  flex-shrink: 0;
}

.imagen-pequeña {
  margin-top: 10px;
  width: 138px;
  height: auto;
  transition: all 0.3s ease;
}

.header.sticky .imagen-pequeña {
  width: 100px;
  margin-top: 5px;
}

.boton-inicio-seccion {
  background-color:#ee6f38;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
}

.boton-inicio-seccion:hover {
  background-color: white;
  color: #ee6f38;
  padding-bottom: 4px;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(238, 111, 56, 0.4);
}

.header.sticky .boton-inicio-seccion {
  font-size: 12px;
  padding: 4px 8px;
}

/* 🎨 ESTILOS DEL MENÚ DE USUARIO */
.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 30px;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(238, 111, 56, 0.15), rgba(238, 111, 56, 0.25));
  border: 2px solid rgba(238, 111, 56, 0.4);
  backdrop-filter: blur(5px);
}

.user-info:hover {
  background: linear-gradient(135deg, rgba(238, 111, 56, 0.3), rgba(238, 111, 56, 0.4));
  border-color: #ee6f38;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 111, 56, 0.4);
}

.user-avatar {
  background-color: #ee6f38;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.user-avatar i {
  color: white;
  font-size: 24px;
}

.user-name {
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.chevron-icon {
  color: white;
  font-size: 14px;
  transition: transform 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
}

.user-info:hover .chevron-icon {
  transform: translateY(2px);
}

.header.sticky .user-name {
  font-size: 14px;
  max-width: 120px;
}

.header.sticky .user-info {
  padding: 6px 16px;
}

/* 🎨 DROPDOWN MENU */
.user-dropdown {
  min-width: 280px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.user-header {
  background: linear-gradient(135deg, #ee6f38, #ff8c61);
  padding: 20px !important;
}

.user-header-content {
  text-align: center;
  color: white;
}

.text-orange {
  color: white !important;
}

.menu-item {
  padding: 12px 20px !important;
  transition: all 0.2s ease;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(238, 111, 56, 0.1);
  padding-left: 24px !important;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
  color: #ee6f38;
  margin-right: 12px;
}

.logout-item:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

.text-red {
  color: #f44336 !important;
}

/* RESTO DE ESTILOS (sin cambios) */
.nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 30px;
  margin: 0;
  transition: all 0.3s ease;
  justify-content: center;
  flex-wrap: nowrap;
  width: auto;
}

.header.sticky .nav ul {
  gap: 20px;
}

.nav ul li a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  transition: all 0.3s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  font-size: 17px;
  padding-bottom: 4px;
  white-space: nowrap;
}

.header.sticky .nav ul li a {
  font-size: 15px;
}

.nav ul li a:hover {
  border-bottom: 2px solid white;
  color: #ee6f38;
  padding-left: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.carousel-container {
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: transparent !important;
}

.half-screen-carousel {
  width: 100vw !important;
  height: 100vh !important;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  z-index: 5;
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
  bottom: 20px;
  right: 20px;
  background-color: #ee6f38; 
  color: white;
  width: 240px; 
  height: 35px;
  padding: 12px 20px;
  border-radius: 0px;
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

/* Media Queries */
@media (max-width: 767px) {
  .user-name {
    display: none;
  }

  .user-info {
    padding: 8px;
    gap: 0;
  }

  .chevron-icon {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .user-name {
    max-width: 100px;
    font-size: 14px;
  }
}
</style>