import CrearBarbero from '@/views/dashboards/default/components/administrador/administracion/CrearBarbero.vue';
import CrearCategoriaproducto from '@/views/dashboards/default/components/administrador/administracion/CrearCategoriaproducto.vue';
import CrearCategoriaservicio from '@/views/dashboards/default/components/administrador/administracion/CrearCategoriaservicio.vue';
import CrearProducto from '@/views/dashboards/default/components/administrador/administracion/CrearProducto.vue';
import CrearServicio from '@/views/dashboards/default/components/administrador/administracion/CrearServicio.vue';
import ListaBarberos from '@/views/dashboards/default/components/administrador/administracion/ListaBarberos.vue';
import ListaCategoriasproducto from '@/views/dashboards/default/components/administrador/administracion/ListaCategoriasproducto.vue';
import ListaCategoriasservicio from '@/views/dashboards/default/components/administrador/administracion/ListaCategoriasservicio.vue';
import ListaClientes from '@/views/dashboards/default/components/administrador/administracion/ListaClientes.vue';
import ListaProductos from '@/views/dashboards/default/components/administrador/administracion/ListaProductos.vue';
import ListaServicios from '@/views/dashboards/default/components/administrador/administracion/ListaServicios.vue';
import DashboardCitas from '@/views/dashboards/default/components/administrador/gestion-de-citas/DashboardCitas.vue';
import GestionarCitas from '@/views/dashboards/default/components/administrador/gestion-de-citas/GestionarCitas.vue';
import VistaAgenda from '@/views/dashboards/default/components/barbero/VistaAgenda.vue';
import ModalseleccionReserva from '@/views/dashboards/default/components/cliente/ModalseleccionReserva.vue';
import ReservarCita from '@/views/dashboards/default/components/cliente/ReservarCita.vue';
import VistaCitasActuales from '@/views/dashboards/default/components/cliente/VistaCitasActuales.vue';
import VistaHistorialCitas from '@/views/dashboards/default/components/cliente/VistaHistorialCitas.vue';
import DefaultDashboard from '@/views/dashboards/default/DefaultDashboard.vue';
import PaginaPrincipal from '@/views/pages/PaginaPrincipal.vue';

// SuperAdmin Views
import DashboardSuperAdmin from '@/views/pages/superadmin/DashboardSuperAdmin.vue';
import GestionUsuarios from '@/views/pages/superadmin/GestionUsuarios.vue';
import GestionVentas from '@/views/pages/superadmin/GestionVentas.vue';

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
      path: '/pages/pagina-principal',
      name: 'PaginaPrincipal',
      component: PaginaPrincipal
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
      path: '/crear-categoria-servicio',
      name: 'CrearCategoriaservicio',
      component: CrearCategoriaservicio
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
      path: '/lista-categorias-producto',
      name: 'ListaCategoriasproducto',
      component: ListaCategoriasproducto
    },
    {
      path: '/lista-categorias-servicio',
      name: 'ListaCategoriasservicio',
      component: ListaCategoriasservicio
    },
    {
      path: '/dashboard-citas',
      name: 'DashboardCitas',
      component: DashboardCitas
    },
    {
      path: '/gestion-citas',
      name: 'GestionarCitas',
      component: GestionarCitas
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
    },
    {
      path: '/modalseleccion-reserva',
      name: 'ModalseleccionReserva',
      component: ModalseleccionReserva,
      meta: { requiresAuth: true }
    },
    {
      path: '/reservar-cita',
      name: 'ReservarCita',
      component: ReservarCita
    },
    {
      path: '/mis-citas',
      name: 'VistaCitasActuales',
      component: VistaCitasActuales
    },
    {
      path: '/historial-citas',
      name: 'VistaHistorialCitas',
      component: VistaHistorialCitas
    },
    {
      path: '/agenda-citas',
      name: 'VistaAgenda',
      component: VistaAgenda
    },
    // SuperAdmin Routes
    {
      path: '/superadmin/dashboard',
      name: 'DashboardSuperAdmin',
      component: DashboardSuperAdmin,
      meta: { requiresAuth: true, requiresSuperAdmin: true }
    },
    {
      path: '/superadmin/usuarios',
      name: 'GestionUsuarios',
      component: GestionUsuarios,
      meta: { requiresAuth: true, requiresSuperAdmin: true }
    },
    {
      path: '/superadmin/ventas',
      name: 'GestionVentas',
      component: GestionVentas,
      meta: { requiresAuth: true, requiresSuperAdmin: true }
    },
    {
      path: '/superadmin/reportes',
      name: 'ReportesSuperAdmin',
      component: DashboardSuperAdmin, // Reutilizamos el dashboard por ahora
      meta: { requiresAuth: true, requiresSuperAdmin: true }
    }
  ],
};

export default MainRoutes;
