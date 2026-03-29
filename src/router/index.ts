import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import PublicRoutes from './PublicRoutes';
import { useAuthStore } from '@/stores/auth';
import { useProductosStore } from '@/stores/useProductosStore';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/pages/checkout/CheckoutPage.vue'),
      meta: { requiresAuth: false, requiresCart: true } // 🎯 Requiere carrito
    },
    MainRoutes,
    PublicRoutes
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const productosStore = useProductosStore();
  
  console.log('Usuario en auth:', auth.user);

  console.log('ROUTER GUARD EJECUTADO');
  console.log('De:', from.path);
  console.log('A:', to.path);
  
  console.log('🛡️ Middleware - Going to:', to.path);
  console.log('👤 User in middleware:', auth.user);
  console.log('🔐 Is authenticated:', auth.isAuthenticated);

  // 🎯 PROTEGER /checkout - debe tener carrito
  if (to.path === '/checkout') {
    if (!productosStore.ComprasCarrito || productosStore.ComprasCarrito.length === 0) {
      console.log('❌ Intento de acceder a checkout sin carrito - redirigiendo a inicio');
      return next('/');
    }
  }

  // 🎯 NUNCA intentes cargar usuario automáticamente en la página principal
  // Solo carga si va a rutas protegidas (no públicas)
  const publicPages = ['/login', '/login1', '/register', '/', '/checkout']; 
  const isPublicPage = publicPages.includes(to.path);

  if (!auth.user && !isPublicPage && !from.path.startsWith('/dashboard')) {
    try {
      console.log('Intentando cargar usuario para ruta protegida...');
      await auth.loadUser();
    } catch (error) {
      console.log('No hay sesión activa en ruta protegida');
    }
  }

  // 🎯 Si viene del dashboard y tiene usuario, bloquear ir a login
  if (auth.user && (to.path === '/login' || to.path === '/login1') && from.path.startsWith('/dashboard')) {
    console.log('Bloqueando navegación desde dashboard a login');
    return next(false);
  }

  // la ruta requiere autenticación si tiene `meta.requiresAuth` explícitamente en true
  const authRequired = to.matched.some(record => record.meta.requiresAuth === true);

  // Si requiere auth y no hay usuario
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

  // Normalizar rol del usuario para comparaciones seguras
  const userRole = auth.user ? (((auth.user as any).role || (auth.user as any).Role || '') as string).toLowerCase() : '';
  console.log('userRole normalizado en guard:', userRole);

  // Si la ruta requiere SuperAdmin explícitamente
  const requiresSuperAdmin = to.matched.some(record => record.meta.requiresSuperAdmin === true);
  if (requiresSuperAdmin) {
    if (!auth.user || userRole !== 'superadmin') {
      return next('/');
    }
  }

  // Si la ruta requiere Admin explícitamente (acepta administrador o superadmin)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin === true);
  if (requiresAdmin) {
    if (!auth.user || (userRole !== 'administrador' && userRole !== 'superadmin')) {
      return next('/');
    }
  }

  // Si ya está logueado e intenta entrar a /login -> lo manda al home
  if (auth.user && (to.path === '/login' || to.path === '/login1')) {
    return next(auth.returnUrl || '/');
  }

  // 🎯 Redirigir SuperAdmin fuera del dashboard genérico si es necesario
  if (auth.user && userRole === 'superadmin' && (to.path === '/dashboard' || to.path === '/dashboard/default' || to.path === '/inicio-dashboard')) {
    return next('/superadmin/dashboard');
  }

  next();
});