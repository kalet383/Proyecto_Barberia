<template>
  <div class="text-center pa-4">
    <v-dialog v-model="props.modelValue" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
        <v-card-title class="text-center justify-center py-2">
          <h3>RESERVACION DE CITAS</h3>
        </v-card-title>
        <v-tabs
      v-model="tab"
      color="basil"
      grow
    >
      <v-tab
        v-for="item in items"
        :key="item"
        :text="item"
        :value="item"
      ></v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="item in items"
        :key="item"
        :value="item"
      >
        <v-card
          color="basil"
          flat
        >
          <v-card-text>{{ text }}</v-card-text>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { ref } from 'vue'

  export default {
    name: 'VistareservaCita',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
        default: false
      }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const notifications = ref(true)
      const sound = ref(false)
      const widgets = ref(true)
      const tabs = ref(['Perfil', 'Citas', 'Servicios', 'Configuracion'])
      const items = ['Perfil', 'Citas', 'Servicios', 'Configuracion']
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

      function closeDialog() {
        emit('update:modelValue', false)
      }

      return { props, notifications, sound, widgets, closeDialog, tabs, items, text}
    }
  }
</script>