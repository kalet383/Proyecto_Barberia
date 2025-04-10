import { createVuetify } from 'vuetify'
import { h } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { icons } from './mdi-icon' // si tienes íconos personalizados
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { PurpleTheme } from '@/theme/LightTheme'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...aliases,
      ...icons
    },
    sets: {
      mdi,
      fa: {
        component: (props: any) => h('i', { class: props.icon }),
      },
    }
  },
  
  theme: {
    defaultTheme: 'PurpleTheme',
    themes: {
      PurpleTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md'
    },
    VTextField: {
      rounded: 'lg'
    },
    VTooltip: {
      // set v-tooltip default location to top
      location: 'top'
    }
  }
});
