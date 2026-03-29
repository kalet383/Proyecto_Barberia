<template>
  <div class="page-container">
    <header ref="headerRef" class="header">
      <div class="header-left d-flex align-center">
        <v-btn icon class="d-md-none mr-1 menu-trigger" variant="text" @click.stop="drawer = !drawer">
          <i class="fas fa-bars"></i>
        </v-btn>
        <div class="logo">
          <a href="/" @click.prevent="goHome">
            <img src="/public/imagenes/logo/logo2.png" class="imagen-pequeña" />
          </a>
        </div>
      </div>
      
      <nav class="nav d-none d-md-block">
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
        <v-btn icon class="carrito-btn mr-3" variant="text" @click="productosStore.abrirCarrito()">
          <v-badge color="error" :content="productosStore.totalProductos" v-if="productosStore.totalProductos > 0">
            <ShoppingCartIcon size="26" stroke-width="1.5" />
          </v-badge>
          <ShoppingCartIcon size="26" stroke-width="1.5" v-else />
        </v-btn>

        <!-- Usuario NO logueado -->
        <v-btn
          v-if="!authStore.isAuthenticated"
          class="boton-inicio-seccion"
          @click="openLoginModal"
        >
          INICIAR SESION
        </v-btn>

        <!-- Usuario LOGUEADO -->
        <div v-else class="user-menu">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="user-info">
                <v-avatar size="38" class="user-avatar">
                  <i v-if="!authStore.user?.foto" class="fas fa-user-circle"></i>
                  <v-img v-else :src="authStore.user.foto" alt="Usuario"></v-img>
                </v-avatar>
                <span class="user-name">{{ authStore.user?.nombre }}</span>
                <i class="fas fa-chevron-down chevron-icon"></i>
              </div>
            </template>

            <v-list class="user-dropdown">
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

              <v-list-item @click="irADashboard" class="menu-item">
                <template v-slot:prepend>
                  <i class="fas fa-user-circle menu-icon"></i>
                </template>
                <v-list-item-title>Mi Perfil</v-list-item-title>
              </v-list-item>

              <v-list-item @click="irAMisCitas" class="menu-item">
                <template v-slot:prepend>
                  <i class="fas fa-calendar-check menu-icon"></i>
                </template>
                <v-list-item-title>Mis Citas</v-list-item-title>
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

    <!-- Hero Section -->
    <v-container fluid class="carousel-container">
      <v-carousel
        height="0vh"
        show-arrows="hover"
        cycle
        hide-delimiters
        hide-delimiter-background
        class="half-screen-carousel"
      >
        <v-carousel-item v-for="(image, i) in images" :key="i">
          <img :src="image" alt="Imagen del carrusel" class="carousel-image" />
        </v-carousel-item>
      </v-carousel>

      <!-- Overlay oscuro con grain -->
      <div class="hero-overlay"></div>

      <!-- Contenido hero -->
      <div class="centered-contend">
        <!-- Línea decorativa superior -->
        <div class="hero-eyebrow">
          <span class="eyebrow-line"></span>
          <span class="eyebrow-text">BARBERÍA PREMIUM · MONTERÍA</span>
          <span class="eyebrow-line"></span>
        </div>

        <h1 class="title">
          ESTILO SIN <span class="title-accent">LÍMITES</span>
        </h1>
        <p class="hero-subtitle">Bienvenido a StyleHub</p>

        <div class="hero-actions">
          <button class="boton-agendar" @click="abrirModal()">
            <i class="fas fa-calendar-check mr-2"></i>
            ¡AGENDA YA!
          </button>
          <a href="#servicios-section" class="boton-explorar">
            Ver servicios
            <i class="fas fa-arrow-down ml-2"></i>
          </a>
        </div>

        <!-- Stats rápidas -->
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">500+</span>
            <span class="stat-label">Clientes</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">8+</span>
            <span class="stat-label">Barberos</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">5★</span>
            <span class="stat-label">Calificación</span>
          </div>
        </div>
      </div>

      <!-- Flecha scroll -->
      <a href="#servicios-section" class="flecha-abajo">
        <i class="fa-solid fa-angle-down"></i>
      </a>
    </v-container>

    <HomeServicios></HomeServicios>
    <HomeBarberos></HomeBarberos>
    <HomeProductos></HomeProductos>
    <HomeUbicacion></HomeUbicacion>
    <VistareservaCita v-model="showModal"></VistareservaCita>
    <VistareservacitaBarbero v-model="showModalBarbero"></VistareservacitaBarbero>
    <LoginModal />
    <RegisterModal />
    <FooterPagina></FooterPagina>

    <!-- WhatsApp -->
    <a
      href="https://api.whatsapp.com/send?phone=TU_NUMERO&text=Hola%20quiero%20más%20información"
      class="whatsapp-button"
      target="_blank"
    >
      <i class="fab fa-whatsapp whatsapp-icon"></i>
      <span class="whatsapp-text">Escríbenos por WhatsApp</span>
    </a>

    <!-- Menú móvil (Custom Overlay Drawer) -->
    <v-fade-transition>
      <div v-if="drawer" class="custom-mobile-menu d-md-none">
        
        <div class="drawer-header-custom pa-6">
          <img src="/public/imagenes/logo/logo2.png" style="width: 100px; height: auto;" />
          <v-btn icon variant="tonal" @click="drawer = false" class="close-drawer-btn" color="white">
            <i class="fas fa-times" style="font-size: 1.5rem;"></i>
          </v-btn>
        </div>
        
        <div class="menu-content pa-8">
          <a
            v-for="link in navigationLinks"
            :key="link.target"
            @click.prevent="navigateToSection(link.target)"
            href="#"
            class="mobile-nav-link"
          >
            <v-icon :icon="link.icon" color="#ee6f38" size="26" class="mr-6"></v-icon>
            <span class="text-h4 font-weight-bold text-uppercase" style="letter-spacing: 2px; font-family: 'Bebas Neue', sans-serif !important;">
              {{ link.text }}
            </span>
          </a>
        </div>
        
        <div class="drawer-footer pa-10 mt-auto text-center">
          <v-divider class="mb-8" color="rgba(255,255,255,0.1)"></v-divider>
          <p class="text-overline mb-6" style="color: #ee6f38">SÍGUENOS EN REDES</p>
          <div class="d-flex justify-center ga-6">
            <v-btn icon variant="outlined" color="white"><i class="fab fa-instagram"></i></v-btn>
            <v-btn icon variant="outlined" color="white"><i class="fab fa-facebook"></i></v-btn>
            <v-btn icon variant="outlined" color="white"><i class="fab fa-whatsapp"></i></v-btn>
          </div>
        </div>

      </div>
    </v-fade-transition>

    <v-snackbar v-model="snackbar" color="black" location="top right" :timeout="3000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="#ee6f38" variant="text" @click="snackbar = false">
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
import VistareservacitaBarbero from './VistareservacitaBarbero.vue';
import LoginModal from '@/components/shared/LoginModal.vue';
import RegisterModal from '@/components/shared/RegisterModal.vue';
import FooterPagina from './FooterPagina.vue';
import { ShoppingCartIcon } from 'vue-tabler-icons';

const authStore = useAuthStore();
const productosStore = useProductosStore();
const router = useRouter();

const drawer = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');

const navigationLinks = [
  { text: 'Servicios', target: '#servicios-section', icon: 'fas fa-scissors' },
  { text: 'Barberos', target: '#barberos-section', icon: 'fas fa-user-tie' },
  { text: 'Productos', target: '#productos-section', icon: 'fas fa-box-open' },
  { text: 'Ubicación', target: '#ubicacion-section', icon: 'fas fa-map-marker-alt' },
  { text: 'Quiénes Somos', target: '#', icon: 'fas fa-info-circle' },
];

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
const showModalBarbero = ref(false);

const openLoginModal = () => {
  window.dispatchEvent(new CustomEvent('open-login-dialog'));
};

const handleScroll = () => {
  if (headerRef.value) {
    if (window.scrollY > 0) {
      headerRef.value.classList.add('sticky');
    } else {
      headerRef.value.classList.remove('sticky');
    }
  }
};

const handleResize = () => {
  if (window.innerWidth >= 960 && drawer.value) {
    drawer.value = false;
  }
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  if (!authStore.user) {
    try {
      await authStore.loadUser();
    } catch (error) {
      console.log('ℹ️ No hay sesión activa');
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});

const irADashboard = () => router.push('/dashboard');
const irAMisCitas = () => router.push('/mis-citas');
const goHome = () => router.replace('/');

const navigateToSection = (target) => {
  drawer.value = false;
  setTimeout(() => {
    if (target === '#') return;
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 150);
};

const cerrarSesion = async () => {
  await authStore.logout();
  router.replace('/');
};

function abrirModal() {
  showModal.value = true;
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* ─────────────────────────────────────────
   CSS VARIABLES
───────────────────────────────────────── */
:root {
  --naranja: #ee6f38;
  --naranja-light: #ff9a6c;
  --naranja-glow: rgba(238, 111, 56, 0.35);
  --negro: #0d0d0d;
  --negro-mid: #1a1a1a;
  --negro-card: #222222;
  --blanco: #ffffff;
  --gris: rgba(255,255,255,0.6);
}

body { margin: 0; padding: 0; }

.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'DM Sans', sans-serif;
}

/* ─────────────────────────────────────────
   HEADER
───────────────────────────────────────── */
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 55px;
  height: 90px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header.sticky {
  position: fixed;
  background: rgba(10, 10, 10, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(238, 111, 56, 0.15);
  height: 72px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.logo { flex-shrink: 0; }

.imagen-pequeña {
  width: 130px;
  height: auto;
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
}

.header.sticky .imagen-pequeña {
  width: 96px;
}

/* Nav */
.nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 36px;
  margin: 0;
  transition: all 0.3s ease;
}

.header.sticky .nav ul { gap: 24px; }

.nav ul li { position: relative; }

.nav ul li a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  padding-bottom: 4px;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}

.nav ul li a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  transition: width 0.3s ease;
  border-radius: 1px;
}

.nav ul li a:hover {
  color: #ee6f38;
}

.nav ul li a:hover::after {
  width: 100%;
}

/* Header actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.carrito-btn {
  color: rgba(255,255,255,0.85) !important;
  transition: color 0.2s !important;
}

.carrito-btn:hover {
  color: #ee6f38 !important;
}

/* Botón iniciar sesión */
.boton-inicio-seccion {
  background: transparent !important;
  color: white !important;
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  letter-spacing: 1.5px !important;
  border: 1.5px solid rgba(255,255,255,0.4) !important;
  border-radius: 4px !important;
  padding: 8px 20px !important;
  transition: all 0.3s ease !important;
  font-family: 'DM Sans', sans-serif !important;
  text-transform: uppercase !important;
}

.boton-inicio-seccion:hover {
  background: #ee6f38 !important;
  border-color: #ee6f38 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(238, 111, 56, 0.4) !important;
}

/* ─────────────────────────────────────────
   USER MENU
───────────────────────────────────────── */
.user-menu { position: relative; }

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 14px 6px 6px;
  border-radius: 40px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
}

.user-info:hover {
  background: rgba(238, 111, 56, 0.2);
  border-color: rgba(238, 111, 56, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(238, 111, 56, 0.25);
}

.user-avatar {
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  border: 2px solid rgba(255,255,255,0.2);
}

.user-avatar i { color: white; font-size: 20px; }

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.chevron-icon {
  color: rgba(255,255,255,0.6);
  font-size: 11px;
  transition: transform 0.3s ease;
}

.user-info:hover .chevron-icon {
  transform: rotate(180deg);
  color: #ee6f38;
}

.header.sticky .user-name { font-size: 0.8rem; }

/* Dropdown */
.user-dropdown {
  min-width: 280px;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25) !important;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06) !important;
}

.user-header {
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d) !important;
  padding: 20px !important;
}

.user-header-content {
  text-align: center;
  color: white;
}

.user-header-content .v-list-item-title {
  color: white !important;
}

.user-header-content .v-list-item-subtitle {
  color: rgba(255,255,255,0.5) !important;
}

.text-orange { color: #ee6f38 !important; }

.menu-item {
  padding: 12px 20px !important;
  transition: all 0.2s ease;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(238, 111, 56, 0.06);
  padding-left: 26px !important;
}

.menu-icon {
  font-size: 16px;
  width: 22px;
  text-align: center;
  color: #ee6f38;
  margin-right: 12px;
}

.logout-item:hover { background-color: rgba(244, 67, 54, 0.06) !important; }
.text-red { color: #f44336 !important; }

/* ─────────────────────────────────────────
   HERO / CAROUSEL
───────────────────────────────────────── */
.carousel-container {
  padding: 0 !important;
  margin: 0 !important;
  position: relative;
  height: 100vh;
  overflow: hidden;
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
  transform: scale(1.05);
  animation: slowZoom 8s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  from { transform: scale(1.05); }
  to { transform: scale(1.12); }
}

/* Overlay con gradiente sofisticado */
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.3) 0%,
      rgba(0,0,0,0.55) 40%,
      rgba(0,0,0,0.8) 75%,
      rgba(0,0,0,0.92) 100%
    );
  z-index: 2;
}

/* Contenido hero */
.centered-contend {
  position: absolute;
  bottom: 14%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 5;
  color: white;
  width: 100%;
  max-width: 860px;
  padding: 0 24px;
}

/* Eyebrow */
.hero-eyebrow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  animation: fadeInDown 0.8s ease both;
}

.eyebrow-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ee6f38);
}

.eyebrow-line:last-child {
  background: linear-gradient(90deg, #ee6f38, transparent);
}

.eyebrow-text {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ee6f38;
  text-transform: uppercase;
  font-family: 'DM Sans', sans-serif;
}

/* Title */
.title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(3.5rem, 9vw, 7rem);
  font-weight: 400;
  color: white;
  line-height: 0.95;
  letter-spacing: 2px;
  margin: 0 0 16px;
  animation: fadeInUp 0.9s ease 0.2s both;
  text-shadow: 0 4px 30px rgba(0,0,0,0.5);
}

.title-accent {
  color: #ee6f38;
  position: relative;
  display: inline-block;
}

.title-accent::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  border-radius: 2px;
  animation: widthGrow 1.2s ease 0.8s both;
}

@keyframes widthGrow {
  from { transform: scaleX(0); transform-origin: left; }
  to { transform: scaleX(1); transform-origin: left; }
}

.hero-subtitle {
  font-size: clamp(0.9rem, 2.5vw, 1.15rem);
  font-weight: 300;
  color: rgba(255,255,255,0.65);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0 0 36px;
  font-family: 'DM Sans', sans-serif;
  animation: fadeInUp 0.9s ease 0.3s both;
}

/* Botones hero */
.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 48px;
  animation: fadeInUp 0.9s ease 0.45s both;
}

.boton-agendar {
  padding: 16px 36px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  box-shadow: 0 8px 30px rgba(238, 111, 56, 0.45);
  display: flex;
  align-items: center;
}

.boton-agendar:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(238, 111, 56, 0.55);
  background: linear-gradient(135deg, #d4612f, #ee6f38);
}

.boton-agendar:active {
  transform: translateY(-1px);
}

.boton-explorar {
  display: flex;
  align-items: center;
  padding: 15px 28px;
  background: transparent;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
}

.boton-explorar:hover {
  border-color: rgba(255,255,255,0.7);
  color: white;
  background: rgba(255,255,255,0.08);
  transform: translateY(-2px);
}

/* Stats */
.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 18px 28px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  display: inline-flex;
  animation: fadeInUp 0.9s ease 0.6s both;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 28px;
}

.stat-num {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  color: #ee6f38;
  line-height: 1;
  letter-spacing: 1px;
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 3px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.15);
}

/* Flecha scroll */
.flecha-abajo {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: rgba(255,255,255,0.4);
  text-align: center;
  transition: all 0.3s ease;
  animation: bounceArrow 2.5s ease-in-out infinite;
  z-index: 5;
  text-decoration: none;
}

.flecha-abajo:hover {
  color: #ee6f38;
}

@keyframes bounceArrow {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.4; }
  50% { transform: translateX(-50%) translateY(8px); opacity: 0.8; }
}

/* ─────────────────────────────────────────
   ANIMACIONES ENTRADA
───────────────────────────────────────── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─────────────────────────────────────────
   WHATSAPP
───────────────────────────────────────── */
.whatsapp-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #ee6f38, #ff9a6c);
  color: white;
  height: 44px;
  padding: 0 20px 0 14px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 24px rgba(238, 111, 56, 0.45);
  transition: all 0.3s ease;
  text-decoration: none;
  z-index: 1000;
  white-space: nowrap;
  font-family: 'DM Sans', sans-serif;
}

.whatsapp-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(238, 111, 56, 0.55);
}

.whatsapp-icon {
  font-size: 20px;
}

.whatsapp-text {
  font-size: 0.8rem;
}

/* ─────────────────────────────────────────
   CUSTOM MOBILE MENU
───────────────────────────────────────── */
.custom-mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 99999;
  display: flex;
  flex-direction: column;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: 20px 0;
  color: white !important;
  text-decoration: none;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.mobile-nav-link:hover, .mobile-nav-link:active {
  color: #ee6f38 !important;
  padding-left: 15px;
  background: rgba(238, 111, 56, 0.05);
}

.drawer-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-drawer-btn {
  background: rgba(255,255,255,0.1) !important;
  border: 1px solid rgba(255,255,255,0.2) !important;
}

.menu-content {
  flex: 1;
  overflow-y: auto;
}

.menu-trigger {
  color: white !important;
  font-size: 1.4rem;
  z-index: 10;
  cursor: pointer;
}

.header-left {
  display: flex !important;
  align-items: center !important;
}

/* ─────────────────────────────────────────
   MEDIA QUERIES
───────────────────────────────────────── */
@media (max-width: 767px) {
  .header { 
    padding: 0 16px; 
    height: 72px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  }
  .header.sticky { padding: 0 16px; height: 64px; }

  .header-actions { gap: 8px; }
  
  .imagen-pequeña { width: 80px; margin-top: 0; }
  .header.sticky .imagen-pequeña { width: 70px; }

  .user-name, .chevron-icon { display: none; }
  .user-info { padding: 4px; gap: 0; border-radius: 50%; border: none; background: transparent; }

  .hero-stats { 
    flex-direction: row; 
    gap: 0; 
    width: 100%;
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 12px 0;
  }
  .stat-divider { width: 1px; height: 24px; }
  .stat-item { padding: 0 12px; }
  .stat-num { font-size: 1.4rem; }
  .stat-label { font-size: 0.55rem; }

  .hero-actions { 
    width: 100%;
    padding: 0 20px;
    gap: 12px; 
  }
  .boton-agendar, .boton-explorar { width: 100%; justify-content: center; height: 50px; font-size: 0.8rem; }

  .centered-contend { 
    bottom: 12%; 
    padding: 0;
  }
  
  .title { margin-bottom: 8px; }
  .hero-subtitle { margin-bottom: 24px; }

  .whatsapp-text { display: none; }
  .whatsapp-button { padding: 0; width: 56px; height: 56px; border-radius: 50%; }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .header { padding: 0 32px; }
  .nav ul { gap: 20px; }
  .nav ul li a { font-size: 0.7rem; }
  .user-name { max-width: 90px; font-size: 0.8rem; }
}

@media (min-width: 1024px) {
  .centered-contend {
    bottom: 12%;
  }
}
</style>