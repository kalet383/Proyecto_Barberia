import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 📦 Plugins y dependencias externas
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue3-apexcharts'
import VueTablerIcons from 'vue-tabler-icons'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import print from 'vue3-print-nb'

// 📦 Estilos globales
import '@fortawesome/fontawesome-free/css/all.css'
import '@/scss/style.scss'

// 📦 Configuración de Axios (plugin)
import '@/plugins/axios'

// 📦 Componentes y App principal
import App from './App.vue'
import { router } from './router'

// 📦 Pinia store
import { useAuthStore } from '@/stores/auth'

// =========================================
// Crear la aplicación
// =========================================
const app = createApp(App)

// Crear Pinia
const pinia = createPinia()

// Cargar token/auth desde Pinia antes de montar
useAuthStore(pinia)

// Usar plugins
app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(VueTablerIcons)
app.use(print)
app.use(VueApexCharts)
app.use(VueSidebarMenu)

// Montar app
app.mount('#app')
