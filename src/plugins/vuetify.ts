import { createVuetify } from 'vuetify'
import { h } from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { icons } from './mdi-icon'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { PurpleTheme, DarkTheme } from '@/theme/LightTheme'

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
      PurpleTheme,
      DarkTheme
    }
  },
  defaults: {
    VBtn: {},
    VCard: {
      rounded: 'md',
      elevation: 0,
      border: true
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VSelect: {
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VTextarea: {
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VFileInput: {
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VAutocomplete: {
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VCombobox: {
      color: 'primary',
      validateOn: 'submit lazy'
    },
    VTooltip: {
      location: 'top'
    }
  }
});
