import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
// import { fakeBackend } from '@/utils/helpers/fake-backend'; // ❌ deshabilitar
import '@fortawesome/fontawesome-free/css/all.css';

// Axios plugin (asegúrate de tener el archivo en src/plugins/axios.ts)
import '@/plugins/axios';

// print
import print from 'vue3-print-nb';

// Pinia store
import { useAuthStore } from '@/stores/auth';

const app = createApp(App);

// fakeBackend(); // ❌ deshabilitar para usar tu API real

// Inicializar Pinia y cargar token guardado
const pinia = createPinia();
app.use(pinia);

const auth = useAuthStore(pinia);
auth.loadFromStorage();

app.use(router);
app.use(PerfectScrollbarPlugin);
app.use(VueTablerIcons);
app.use(print);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');