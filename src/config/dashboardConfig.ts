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
    HelpIcon,
    HomeIcon,
    CalendarIcon,
    CalendarEventIcon,
    HistoryIcon,
    ShoppingCartIcon,
    UserIcon,
    UsersIcon,
    ScissorsIcon,
    TruckIcon,
    PackageIcon,
    TagIcon,
    SettingsIcon,
    ReportAnalyticsIcon,
    ChartInfographicIcon,
    CurrencyDollarIcon,
    Receipt2Icon,
    BriefcaseIcon,
    ShoppingBagIcon
} from 'vue-tabler-icons';

// Opciones comunes que pueden usar todos los roles
const commonItems = {
  dashboard: {
    title: 'Dashboard Principal',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  PaginaPrincipal: {
    title: 'Pagina Principal',
    icon: HomeIcon,
    to: '/'
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
      icon: UsersIcon,
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
      icon: ScissorsIcon,
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
      icon: ScissorsIcon, 
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
        },
        {
          title: 'Categorías',
          icon: TagIcon,
          to: '/lista-categorias-servicio'
        },
        {
          title: 'Crear Categoría',
          icon: CircleIcon,
          to: '/crear-categoria-servicio'
        }
      ]
    },
    productos: {
      title: 'Productos',
      icon: PackageIcon,
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
        },
        {
          title: 'Categorías',
          icon: TagIcon,
          to: '/lista-categorias-producto'
        },
        {
          title: 'Crear Categoría',
          icon: CircleIcon,
          to: '/crear-categoria-producto'
        }
      ]
    },
    dashboardCita: {
      title: 'Dashboard Citas',
      icon: CalendarIcon,
      to: '/dashboard-citas'
    },
    gestionCitas: {
      title: 'Gestionar Citas',
      icon: CalendarEventIcon,
      to: '/gestion-citas'
    }
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
    agendarCita: {
      title: 'Reservar Cita',
      icon: CalendarIcon,
      to: '/reservar-cita'
    },
    citas: {
      title: 'Mis Citas',
      icon: CalendarEventIcon,
      to: '/mis-citas',
      children: [
        {
          title: 'Citas actuales',
          icon: CircleIcon,
          to: '/mis-citas'
        },
        {
          title: 'Historial de citas',
          icon: HistoryIcon,
          to: '/historial-citas'
        }
      ]
    }
  },
  barbero: {
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
    agendaCitas: {
      title: 'Mi agenda',
      icon: CalendarIcon, 
      to: '/agenda-citas'
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
            icon: HomeIcon,
            to: "/inicio-dashboard"
        },
        { divider: true },
        { header: 'Administración' },
        commonItems.administrador.clientes,
        commonItems.administrador.barberos,
        {
            title: "Proveedores",
            icon: TruckIcon,
            to: "/administrador/proveedores"
        },
        {
            title: "Compras",
            icon: ShoppingBagIcon,
            children: [
                {
                    title: "Nueva compra",
                    icon: CircleIcon,
                    to: "/administrador/compras/nueva"
                },
                {
                    title: "Historial de compras",
                    icon: HistoryIcon,
                    to: "/administrador/compras/historial"
                }
            ]
        },
        commonItems.administrador.servicios,
        commonItems.administrador.productos,
        { divider: true },
        { header: 'Gestion de Ventas' },
        {
            title: "Ventas",
            icon: CurrencyDollarIcon,
            to: "/administrador/ventas"
        },
        { divider: true },
        { header: 'Gestion de citas' },
        commonItems.administrador.dashboardCita,
        commonItems.administrador.gestionCitas
    ],

    "menubarbero": [
        { header: 'Menu Barbero' },
        {
            title: "Inicio",
            icon: HomeIcon,
            to: "/inicio-dashboard"
        },
        { divider: true },
        { header: 'Trabajo' },
        commonItems.barbero.agendaCitas,
        {
            title: "Clientes",
            icon: UsersIcon,
            to: "/lista-clientes"
        },
        { divider: true },
        { header: 'Utilidades' },
        commonItems.icons
    ],

    "menucliente": [
        { header: 'Menu Cliente' },
        {
            title: 'Dashboard Principal',
            icon: DashboardIcon,
            to: '/dashboard/default'
        },
        commonItems.PaginaPrincipal,
        { divider: true },
        { header: 'Servicios' },
        commonItems.cliente.agendarCita,
        commonItems.cliente.citas,
        {
            title: "Historial",
            icon: HistoryIcon,
            to: "/historial"
        },
        { divider: true },
        { header: 'Compras' },
        {
            title: "Mis Compras",
            icon: ShoppingCartIcon,
            to: "/mis-compras"
        },
        { divider: true },
        { header: 'Cuenta' },
        {
            title: "Mi Perfil",
            icon: UserIcon,
            to: "/dashboard/default"
        }
    ],

    "menusuperadmin": [
        { header: 'Super Administrador' },
        {
            title: "Dashboard y Estadísticas",
            icon: DashboardIcon,
            to: "/superadmin/dashboard"
        },
        { divider: true },
        { header: 'Gestión Principal' },
        {
            title: "Gestión de Usuarios",
            icon: UsersIcon,
            to: "/superadmin/usuarios",
            subCaption: "Admins, Barberos, Clientes"
        },
        { divider: true },
        { header: 'Control Operativo' },
        {
            title: "Todas las Ventas",
            icon: CurrencyDollarIcon,
            to: "/superadmin/ventas"
        },
        {
            title: "Historial de Compras",
            icon: HistoryIcon,
            to: "/superadmin/compras/historial"
        },
        {
             title: "Inventario (Productos)",
             icon: PackageIcon,
             to: "/lista-productos"
         }
     ]
 };