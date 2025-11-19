import {
    CircleIcon,
    WindmillIcon,
    TypographyIcon,
    ShadowIcon,
    PaletteIcon,
    KeyIcon,
    BugIcon,
    DashboardIcon,
    BrandChromeIcon,
    HelpIcon
} from 'vue-tabler-icons';

// Opciones comunes que pueden usar todos los roles
const commonItems = {
  dashboard: {
    title: 'Dashboard',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  administrador: {
    authentication: {
      title: 'Authentication',
      icon: KeyIcon,
      to: '/auth',
      children: [
        {
          title: 'Login',
          icon: CircleIcon,
          to: '/login1'
        },
        {
          title: 'Register',
          icon: CircleIcon,
          to: '/register'
        }
      ]
    },
    clientes: {
      title: 'Clientes',
      icon: KeyIcon,
      to: '/clientes',
      children: [
        {
          title: 'Lista de Clientes',
          icon: CircleIcon,
          to: '/lista-clientes'
        },
      ]
    },
    barberos: {
      title: 'Barberos',
      icon: KeyIcon,
      to: '/barberos',
      children: [
        {
          title: 'Lista de Barberos',
          icon: CircleIcon,
          to: '/lista-barberos'
        },
        {
          title: 'Crear Barbero',
          icon: CircleIcon,
          to: '/crear-barbero'
        }
      ]
    },
    servicios: {
      title: 'Servicios',
      icon: KeyIcon,
      to: '/servicios',
      children: [
        {
          title: 'Lista de Servicios',
          icon: CircleIcon,
          to: '/lista-servicios'
        },
        {
          title: 'Crear Servicio',
          icon: CircleIcon,
          to: '/crear-servicio'
        }
      ]
    },
    productos: {
      title: 'Productos',
      icon: KeyIcon,
      to: '/productos',
      children: [
        {
          title: 'Lista de Productos',
          icon: CircleIcon,
          to: '/lista-productos'
        },
        {
          title: 'Crear Producto',
          icon: CircleIcon,
          to: '/crear-producto'
        }
      ]
    },
    categoriasProductos: {
      title: 'Categorias de productos',
      icon: KeyIcon,
      to: '/categorias-productos',
      children: [
        {
          title: 'Lista de Categorias productos',
          icon: CircleIcon,
          to: '/lista-categorias-producto'
        },
        {
          title: 'Crear Categoria producto',
          icon: CircleIcon,
          to: '/crear-categoria-producto'
        }
      ]
    },
    categoriasServicios: {
      title: 'Categorias de servicios',
      icon: KeyIcon,
      to: '/categorias-servicios',
      children: [
        {
          title: 'Lista de Categorias servicios',
          icon: CircleIcon,
          to: '/lista-categorias-servicio'
        },
        {
          title: 'Crear Categoria servicio',
          icon: CircleIcon,
          to: '/crear-categoria-servicio'
        }
      ]
    },
  },
  cliente: {
    authentication: {
      title: 'Authentication',
      icon: KeyIcon,
      to: '/auth',
      children: [
        {
          title: 'Login',
          icon: CircleIcon,
          to: '/login1'
        },
        {
          title: 'Register',
          icon: CircleIcon,
          to: '/register'
        }
      ]
    },
    // agendarCita: {

    // },
    citas: {
      title: 'Mis Citas',
      icon: KeyIcon,
      to: '/mis-citas',
      children: [
        {
          title: 'Citas actuales',
          icon: CircleIcon,
          to: '/mis-citas'
        },
        {
          title: 'Historial de citas'
        }
      ]
    }
  },
  error404: {
    title: 'Error 404',
    icon: BugIcon,
    to: '/error'
  },
  typography: {
    title: 'Typography',
    icon: TypographyIcon,
    to: '/utils/typography'
  },
  shadows: {
    title: 'Shadows',
    icon: ShadowIcon,
    to: '/utils/shadows'
  },
  colors: {
    title: 'Colors',
    icon: PaletteIcon,
    to: '/utils/colors'
  },
  icons: {
    title: 'Icons',
    icon: WindmillIcon,
    to: '/forms/radio',
    children: [
      {
        title: 'Tabler Icons',
        icon: CircleIcon,
        to: '/icons/tabler'
      },
      {
        title: 'Material Icons',
        icon: CircleIcon,
        to: '/icons/material'
      }
    ]
  },
  samplePage: {
    title: 'Sample Page',
    icon: BrandChromeIcon,
    to: '/starter'
  },
  documentation: {
    title: 'Documentation',
    icon: HelpIcon,
    to: 'https://codedthemes.gitbook.io/berry-vuetify/',
    type: 'external'
  }
};

export default {
    "menuadministrador": [
        { header: 'Menu Administrador' },
        {
        title: "Inicio",
        icon: "mdi-account-multiple",
        to: "/inicio-dashboard"
        },
        { divider: true },
        { header: 'Administración' },
        commonItems.administrador.clientes,
        commonItems.administrador.barberos,
        commonItems.administrador.servicios,
        commonItems.administrador.productos,
        commonItems.administrador.categoriasProductos,
        commonItems.administrador.categoriasServicios,
        { divider: true },
        { header: 'Pages' },
        commonItems.administrador.authentication,
        commonItems.error404,
        { divider: true },
        { header: 'Utilities' },
        commonItems.typography,
        commonItems.shadows,
        commonItems.colors,
        commonItems.icons,
        { divider: true },
        commonItems.samplePage,
        commonItems.documentation
    ],

    "menubarbero": [
        { header: 'Menu Barbero' },
        {
        title: "Inicio",
        icon: "mdi-account-multiple",
        to: "/inicio-dashboard"
        },
        { divider: true },
        { header: 'Trabajo' },
        {
        title: "Mis Citas",
        icon: "mdi-calendar-clock",
        to: "/mis-citas"
        },
        {
        title: "Clientes",
        icon: "mdi-account-multiple",
        to: "/clientes"
        },
        { divider: true },
        { header: 'Utilidades' },
        commonItems.colors,
        commonItems.icons,
        { divider: true },
        commonItems.samplePage
    ],

    "menucliente": [
        { header: 'Menu Cliente' },
        commonItems.dashboard,
        { divider: true },
        { header: 'Servicios' },
        {
        title: "Reservar Cita",
        icon: "mdi-calendar-plus",
        to: "/login1"
        },
        commonItems.cliente.citas,
        {
        title: "Historial",
        icon: "mdi-history",
        to: "/historial"
        },
        { divider: true },
        { header: 'Cuenta' },
        {
        title: "Mi Perfil",
        icon: "mdi-account-circle",
        to: "/perfil"
        },
        { divider: true },
        commonItems.samplePage
    ]
};