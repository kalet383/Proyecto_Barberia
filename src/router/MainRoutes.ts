import CrearBarbero from '@/views/dashboards/default/components/CrearBarbero.vue';
import CrearCategoriaproducto from '@/views/dashboards/default/components/CrearCategoriaproducto.vue';
import CrearProducto from '@/views/dashboards/default/components/CrearProducto.vue';
import CrearServicio from '@/views/dashboards/default/components/CrearServicio.vue';
import ListaBarberos from '@/views/dashboards/default/components/ListaBarberos.vue';
import ListaCategorias from '@/views/dashboards/default/components/ListaCategorias.vue';
import ListaClientes from '@/views/dashboards/default/components/ListaClientes.vue';
import ListaProductos from '@/views/dashboards/default/components/ListaProductos.vue';
import ListaServicios from '@/views/dashboards/default/components/ListaServicios.vue';
import DefaultDashboard from '@/views/dashboards/default/DefaultDashboard.vue';

const MainRoutes = {
  path: '/dashboard',
  meta: {
    requiresAuth: true
  },
  redirect: '/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'LandingPage',
      path: '/dashboard',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    },
    {
      path: '/inicio-dashboard',
      name: 'DefaultDashboard',
      component: DefaultDashboard
    },
    {
      path: '/crear-barbero',
      name: 'CrearBarbero',
      component: CrearBarbero
    },
    {
      path: '/crear-servicio',
      name: 'CrearServicio',
      component: CrearServicio
    },
    {
      path: '/crear-categoria-producto',
      name: 'CrearCategoriaproducto',
      component: CrearCategoriaproducto
    },
    {
      path: '/crear-producto',
      name: 'CrearProducto',
      component: CrearProducto
    },
    {
      path: '/lista-barberos',
      name: 'ListaBarberos',
      component: ListaBarberos
    },
    {
      path: '/lista-clientes',
      name: 'ListaClientes',
      component: ListaClientes
    },
    {
      path: '/lista-servicios',
      name: 'ListaServicios',
      component: ListaServicios
    },
    {
      path: '/lista-productos',
      name: 'ListaProductos',
      component: ListaProductos
    },
    {
      path: '/lista-categorias',
      name: 'ListaCategorias',
      component: ListaCategorias
    },
    {
      name: 'Starter',
      path: '/starter',
      component: () => import('@/views/StarterPage.vue')
    },
    {
      name: 'Tabler Icons',
      path: '/icons/tabler',
      component: () => import('@/views/utilities/icons/TablerIcons.vue')
    },
    {
      name: 'Material Icons',
      path: '/icons/material',
      component: () => import('@/views/utilities/icons/MaterialIcons.vue')
    },
    {
      name: 'Typography',
      path: '/utils/typography',
      component: () => import('@/views/utilities/typography/TypographyPage.vue')
    },
    {
      name: 'Shadows',
      path: '/utils/shadows',
      component: () => import('@/views/utilities/shadows/ShadowPage.vue')
    },
    {
      name: 'Colors',
      path: '/utils/colors',
      component: () => import('@/views/utilities/colors/ColorPage.vue')
    }
  ]
};

export default MainRoutes;
