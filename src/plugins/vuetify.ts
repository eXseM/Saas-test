import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

const darkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#bb86fc',
    'primary-darken-1': '#3700b3',
    secondary: '#03dac6',
    'secondary-darken-1': '#018786',
    error: '#cf6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'darkTheme',
    themes: {
      darkTheme
    }
  }
})