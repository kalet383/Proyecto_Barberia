<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SettingsIcon, LogoutIcon, UserIcon } from 'vue-tabler-icons';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.replace('/');
};
</script>

<template>
  <div class="pa-4">
    <h4 class="mb-n1">{{ authStore.user?.nombre }} {{ authStore.user?.apellido }}</h4>
    <span class="text-subtitle-2 text-medium-emphasis">{{ authStore.user?.role }}</span>

    <v-divider class="my-3"></v-divider>

    <v-list class="mt-3">
      <v-list-item color="secondary" rounded="md" @click="handleLogout">
        <template v-slot:prepend>
          <LogoutIcon size="20" class="mr-2" />
        </template>
        <v-list-item-title class="text-subtitle-2"> Cerrar Sesión</v-list-item-title>
      </v-list-item>
    </v-list>
  </div>
</template>