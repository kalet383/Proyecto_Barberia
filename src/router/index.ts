import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    PublicRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  console.log('Usuario en auth:', auth.user);

  console.log('ROUTER GUARD EJECUTADO');
  console.log('De:', from.path);
  console.log('A:', to.path);
  
  console.log('🛡️ Middleware - Going to:', to.path);
  console.log('👤 User in middleware:', auth.user);
  console.log('🔐 Is authenticated:', auth.isAuthenticated);

  // 👇 NUEVO: Siempre intentar cargar usuario si no existe en memoria
  if (!auth.user) {
    try {
      await auth.loadUser();
    } catch (error) {
      console.log('No hay sesión activa');
    }
  }

  // páginas públicas (no requieren login)
  const publicPages = ['/login', '/login1', '/register']; // 👈 ajusta según lo que tengas
  const isPublicPage = publicPages.includes(to.path);

  // 🎯 NUEVA LÓGICA: Si viene del dashboard y tiene usuario, bloquear ir a login
  if (auth.user && (to.path === '/login' || to.path === '/login1') && from.path.startsWith('/dashboard')) {
    console.log('Bloqueando navegación desde dashboard a login');
    return next(false); // Bloquea la navegación
  }

  // la ruta requiere autenticación si tiene `meta.requiresAuth`
  const authRequired = !isPublicPage && to.matched.some(record => record.meta.requiresAuth);

  // 🎯 NUEVA LÓGICA: Si requiere auth y no hay usuario, intentar cargar desde cookies
  if (authRequired && !auth.user) {
    try {
      console.log('Intentando cargar usuario desde cookies...');
      await auth.loadUser();
      console.log('Usuario cargado correctamente desde cookies');
    } catch (error) {
      console.log('No se pudo cargar usuario - redirigiendo a login');
      auth.returnUrl = to.fullPath;
      return next('/login');
    }
  }

  // si ya está logueado e intenta entrar a /login -> lo mando al home o returnUrl
  if (auth.user && to.path === '/login') {
    return next(auth.returnUrl || '/');
  }

  next();
});