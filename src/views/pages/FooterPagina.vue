<template>
  <footer class="footer-container">
    <!-- Efectos de fondo animados -->
    <div class="background-effects">
      <div class="blur-effect blur-1"></div>
      <div class="blur-effect blur-2"></div>
    </div>

    <!-- Línea decorativa superior -->
    <div class="top-line"></div>

    <v-container class="footer-content">
      <!-- Grid principal -->
      <v-row class="mb-8">
        <!-- Columna 1: Logo y descripción -->
        <v-col cols="12" md="6" lg="3">
          <div class="footer-section logo-section">
            <div class="logo-container">
              <h2 class="footer-logo">STYLEHUB</h2>
              <div class="logo-underline"></div>
            </div>
            <p class="footer-description">
              Donde el estilo no tiene límites. Tu barbería de confianza para lucir siempre impecable.
            </p>
            <div class="social-links">
              <a href="#" class="social-icon" aria-label="Facebook">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" class="social-icon" aria-label="Twitter">
                <i class="fab fa-twitter"></i>
              </a>
              <a href="#" class="social-icon" aria-label="TikTok">
                <i class="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </v-col>

        <!-- Columna 2: Enlaces rápidos -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <div class="footer-section">
            <h3 class="footer-title">
              <span class="title-arrow">→</span>
              Enlaces Rápidos
            </h3>
            <ul class="footer-links">
              <li><a href="#servicios-section">Servicios</a></li>
              <li><a href="#barberos-section">Barberos</a></li>
              <li><a href="#productos-section">Productos</a></li>
              <li><a href="#ubicacion-section">Galería</a></li>
              <li><a href="#">Nosotros</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </v-col>

        <!-- Columna 3: Contacto -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <div class="footer-section">
            <h3 class="footer-title">
              <span class="title-arrow">→</span>
              Contacto
            </h3>
            <ul class="contact-list">
              <li class="contact-item">
                <i class="fas fa-map-marker-alt contact-icon"></i>
                <span>Calle 123 #45-67<br>Bogotá, Colombia</span>
              </li>
              <li class="contact-item">
                <i class="fas fa-phone contact-icon"></i>
                <span>+57 300 123 4567</span>
              </li>
              <li class="contact-item">
                <i class="fas fa-envelope contact-icon"></i>
                <span>info@stylehub.com</span>
              </li>
            </ul>
          </div>
        </v-col>

        <!-- Columna 4: Horarios -->
        <v-col cols="12" sm="6" md="6" lg="3">
          <div class="footer-section">
            <h3 class="footer-title">
              <span class="title-arrow">→</span>
              Horarios
            </h3>
            <div class="schedule-list">
              <div class="schedule-item">
                <i class="fas fa-clock contact-icon"></i>
                <div class="schedule-content">
                  <div class="schedule-day">Lunes - Viernes:</div>
                  <div class="schedule-time">9:00 AM - 8:00 PM</div>
                  
                  <div class="schedule-day mt-3">Sábados:</div>
                  <div class="schedule-time">9:00 AM - 6:00 PM</div>
                  
                  <div class="schedule-day mt-3">Domingos:</div>
                  <div class="schedule-time">10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Newsletter -->
      <v-divider class="my-8 divider-custom"></v-divider>
      <v-row class="newsletter-section mb-8">
        <v-col cols="12">
          <div class="newsletter-content">
            <h3 class="newsletter-title">Suscríbete a Nuestro Newsletter</h3>
            <p class="newsletter-description">
              Recibe ofertas exclusivas y mantente al día con las últimas tendencias
            </p>
            <v-form class="newsletter-form" @submit.prevent="suscribirse">
              <v-text-field
                v-model="email"
                placeholder="Tu correo electrónico"
                variant="outlined"
                density="comfortable"
                class="newsletter-input"
                hide-details
              ></v-text-field>
              <v-btn
                type="submit"
                class="newsletter-btn"
                size="large"
                elevation="0"
              >
                Suscribirse
              </v-btn>
            </v-form>
          </div>
        </v-col>
      </v-row>

      <!-- Copyright y links legales -->
      <v-divider class="my-6 divider-custom"></v-divider>
      <v-row class="copyright-section">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="copyright-text">
            © 2025 <span class="brand-name">StyleHub</span>. Todos los derechos reservados.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <div class="legal-links">
            <a href="#">Política de Privacidad</a>
            <span class="separator">•</span>
            <a href="#">Términos y Condiciones</a>
            <span class="separator">•</span>
            <a href="#">Cookies</a>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Línea decorativa inferior -->
    <div class="bottom-line"></div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');

const suscribirse = () => {
  if (email.value) {
    alert('¡Gracias por suscribirte! ' + email.value);
    email.value = '';
  }
};
</script>

<style scoped>
.footer-container {
  position: relative;
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%);
  color: white;
  overflow: hidden;
  padding-top: 0;
}

/* Efectos de fondo */
.background-effects {
  position: absolute;
  inset: 0;
  opacity: 0.1;
  pointer-events: none;
}

.blur-effect {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(100px);
}

.blur-1 {
  top: 0;
  left: 25%;
  background-color: #ee6f38;
  animation: pulse1 4s ease-in-out infinite;
}

.blur-2 {
  bottom: 0;
  right: 25%;
  background-color: #ff8c61;
  animation: pulse2 4s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes pulse1 {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.1); opacity: 0.15; }
}

@keyframes pulse2 {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.2); opacity: 0.15; }
}

/* Líneas decorativas */
.top-line,
.bottom-line {
  height: 2px;
  background: linear-gradient(90deg, transparent, #ee6f38, transparent);
}

.bottom-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.footer-content {
  position: relative;
  z-index: 10;
  padding-top: 64px !important;
  padding-bottom: 32px !important;
}

/* Sección del logo */
.logo-section {
  padding-right: 20px;
}

.logo-container {
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.footer-logo {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ee6f38, #ff8c61);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.logo-underline {
  height: 3px;
  width: 80px;
  background: linear-gradient(90deg, #ee6f38, transparent);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.logo-container:hover .logo-underline {
  width: 120px;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.7;
  margin-bottom: 24px;
  font-size: 0.95rem;
}

/* Redes sociales */
.social-links {
  display: flex;
  gap: 16px;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f2937, #111827);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #374151;
  transition: all 0.3s ease;
  color: #9ca3af;
  text-decoration: none;
}

.social-icon:hover {
  border-color: #ee6f38;
  color: #ee6f38;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4);
}

/* Secciones del footer */
.footer-section {
  height: 100%;
}

.footer-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-arrow {
  color: #ee6f38;
  font-size: 1.5rem;
}

/* Enlaces */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: #ee6f38;
  transform: translateX(8px);
  font-weight: 600;
}

/* Contacto */
.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateX(4px);
}

.contact-item:hover .contact-icon {
  transform: scale(1.2);
}

.contact-item:hover span {
  color: white;
}

.contact-icon {
  color: #ee6f38;
  font-size: 1.1rem;
  min-width: 20px;
  margin-top: 2px;
  transition: transform 0.3s ease;
}

.contact-item span {
  color: #9ca3af;
  font-size: 0.9rem;
  line-height: 1.6;
  transition: color 0.3s ease;
}

/* Horarios */
.schedule-list {
  display: flex;
  gap: 12px;
}

.schedule-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.schedule-content {
  flex: 1;
}

.schedule-day {
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.schedule-time {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

/* Newsletter */
.newsletter-section {
  margin-top: 20px;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.newsletter-description {
  color: #9ca3af;
  margin-bottom: 24px;
  font-size: 1rem;
}

.newsletter-form {
  display: flex;
  gap: 12px;
  max-width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.newsletter-input {
  flex: 1;
  min-width: 250px;
}

.newsletter-input :deep(.v-field) {
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.newsletter-input :deep(.v-field:hover) {
  border-color: #ee6f38;
}

.newsletter-input :deep(.v-field--focused) {
  border-color: #ee6f38;
  box-shadow: 0 0 0 2px rgba(238, 111, 56, 0.2);
}

.newsletter-input :deep(.v-field__input) {
  color: white;
  padding: 0 24px;
}

.newsletter-input :deep(.v-field__input::placeholder) {
  color: #6b7280;
}

.newsletter-btn {
  background: linear-gradient(135deg, #ee6f38, #ff8c61) !important;
  color: white !important;
  font-weight: bold;
  border-radius: 50px;
  padding: 0 32px !important;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.newsletter-btn:hover {
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(238, 111, 56, 0.4) !important;
}

/* Divisor */
.divider-custom {
  border-color: rgba(55, 65, 81, 0.5);
}

/* Copyright */
.copyright-section {
  padding-top: 16px;
}

.copyright-text {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

.brand-name {
  color: #ee6f38;
  font-weight: 600;
}

.legal-links {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.legal-links a {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.legal-links a:hover {
  color: #ee6f38;
}

.separator {
  color: #6b7280;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 960px) {
  .footer-logo {
    font-size: 2rem;
  }
  
  .newsletter-title {
    font-size: 1.5rem;
  }
  
  .footer-section {
    margin-bottom: 32px;
  }
}

@media (max-width: 600px) {
  .footer-content {
    padding-top: 48px !important;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-input {
    width: 100%;
    min-width: 100%;
  }
  
  .newsletter-btn {
    width: 100%;
  }
  
  .legal-links {
    flex-direction: column;
    gap: 8px;
  }
  
  .separator {
    display: none;
  }
  
  .copyright-section [class*="text-md-"] {
    text-align: center !important;
  }
}

@media (max-width: 400px) {
  .social-icon {
    width: 38px;
    height: 38px;
  }
  
  .footer-logo {
    font-size: 1.75rem;
  }
}
</style>