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

  // páginas públicas (no requieren login)
  const publicPages = ['/login', '/register']; // 👈 ajusta según lo que tengas
  const isPublicPage = publicPages.includes(to.path);

  // la ruta requiere autenticación si tiene `meta.requiresAuth`
  const authRequired = !isPublicPage && to.matched.some(record => record.meta.requiresAuth);

  // si requiere login y no hay usuario, redirige
  if (authRequired && !auth.user) {
    auth.returnUrl = to.fullPath;
    return next('/login');
  }

  // si ya está logueado e intenta entrar a /login -> lo mando al home o returnUrl
  if (auth.user && to.path === '/login') {
    return next(auth.returnUrl || '/');
  }

  next();
});