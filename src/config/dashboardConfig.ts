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
        {
        title: "Clientes",
        icon: "mdi-account-multiple",
        to: "/lista-clientes"
        },
        {
        title: "Barberos",
        icon: "mdi-account-tie",
        to: "/lista-barberos"
        },
        {
        title: "Servicios",
        icon: "mdi-account-tie",
        to: "/lista-servicios"
        },
        {
        title: "Crear Barbero",
        icon: "mdi-account-plus",
        to: "/crear-barbero"
        },
        {
        title: "Crear Servicio",
        icon: "mdi-account-plus",
        to: "/crear-servicio"
        },
        { divider: true },
        { header: 'Pages' },
        commonItems.authentication,
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
        {
        title: "Mis Citas",
        icon: "mdi-calendar-account",
        to: "/mis-citas"
        },
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