<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCustomizerStore } from '@/stores/customizer';

const authStore = useAuthStore();
const customizer = useCustomizerStore();
const router = useRouter();

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
const txtPrimary = computed(() => isDark.value ? '#ffffff' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#94a3b8' : '#aaa');
const borderColor = computed(() => isDark.value ? '#1e293b' : '#f0f0f0');
const hoverBg = computed(() => isDark.value ? 'rgba(255,255,255,0.05)' : '#f8f8f8');
const hoverBgDanger = computed(() => isDark.value ? 'rgba(239,68,68,0.1)' : '#fff5f5');

const handleLogout = async () => {
  await authStore.logout();
  router.replace('/');
};

const getRolLabel = (role?: string) => {
  if (!role) return 'Usuario';
  const roles: Record<string, string> = {
    administrador: 'Administrador',
    barbero: 'Barbero',
    cliente: 'Cliente',
    superadmin: 'Super Admin',
  };
  return roles[role.toLowerCase()] || role;
};

const getRolColor = (role?: string) => {
  const r = role?.toLowerCase() || '';
  if (r === 'administrador' || r === 'superadmin') {
    return isDark.value 
      ? { bg: 'rgba(255,193,7,0.15)', text: '#ffc107', icon: 'fas fa-crown' }
      : { bg: '#fff3e0', text: '#e65100', icon: 'fas fa-crown' };
  }
  if (r === 'barbero') {
    return isDark.value
      ? { bg: 'rgba(0,230,118,0.15)', text: '#00e676', icon: 'fas fa-scissors' }
      : { bg: '#e8f5e9', text: '#2e7d32', icon: 'fas fa-scissors' };
  }
  return isDark.value
    ? { bg: 'rgba(79,142,247,0.15)', text: '#4f8ef7', icon: 'fas fa-user' }
    : { bg: '#e3f2fd', text: '#1565c0', icon: 'fas fa-user' };
};
</script>

<template>
  <div style="width: 100%; max-width: 300px;">
    <!-- Header usuario -->
    <div style="padding: 20px 18px 16px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <!-- Avatar -->
        <div
          v-if="!authStore.user?.foto"
          style="
            width: 46px; height: 46px; border-radius: 12px;
            background: linear-gradient(135deg, #ee6f38, #ff9a6c);
            display: flex; align-items: center; justify-content: center;
            color: white; font-size: 18px; font-weight: 800;
            box-shadow: 0 4px 12px rgba(238,111,56,0.25);
            flex-shrink: 0;
          "
        >
          {{ authStore.user?.nombre?.charAt(0) }}{{ authStore.user?.apellido?.charAt(0) }}
        </div>
        <v-img
          v-else
          :src="authStore.user.foto"
          cover
          style="
            width: 46px; max-width: 46px; height: 46px; border-radius: 12px;
            box-shadow: 0 4px 12px rgba(238,111,56,0.25);
            flex-shrink: 0;
          "
        ></v-img>

        <div style="flex: 1; min-width: 0;">
          <p :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary, margin: '0', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
            {{ authStore.user?.nombre }} {{ authStore.user?.apellido }}
          </p>
          <p :style="{ fontSize: '0.78rem', color: txtSecondary, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">
            {{ authStore.user?.email }}
          </p>
        </div>
      </div>

      <!-- Rol badge -->
      <div
        :style="{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '4px 12px', borderRadius: '6px', marginTop: '12px',
          background: getRolColor(authStore.user?.role || authStore.user?.Role).bg,
          color: getRolColor(authStore.user?.role || authStore.user?.Role).text,
          fontSize: '0.72rem', fontWeight: '700', textTransform: 'capitalize',
        }"
      >
        <i :class="getRolColor(authStore.user?.role || authStore.user?.Role).icon" style="font-size: 10px;"></i>
        {{ getRolLabel(authStore.user?.role || authStore.user?.Role) }}
      </div>
    </div>

    <div :style="{ height: '1px', background: borderColor }"></div>

    <!-- Opciones -->
    <div style="padding: 8px 10px;">
      <!-- Mi Perfil -->
      <div
        class="menu-item"
        @click="router.push('/dashboard')"
        :style="{ '--hover-bg': hoverBg }"
      >
        <div :style="{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(79,142,247,0.15)' : '#e3f2fd', color: isDark ? '#4f8ef7' : '#1565c0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }">
          <i class="fas fa-user"></i>
        </div>
        <div>
          <p :style="{ fontSize: '0.85rem', fontWeight: '600', color: txtPrimary, margin: '0' }">Mi Perfil</p>
          <p :style="{ fontSize: '0.68rem', color: txtSecondary, margin: '0' }">Ver mi información</p>
        </div>
      </div>

      <!-- Configuración -->
      <div
        class="menu-item"
        :style="{ '--hover-bg': hoverBg }"
      >
        <div :style="{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(124,92,252,0.15)' : '#f3e5f5', color: isDark ? '#7c5cfc' : '#6a1b9a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }">
          <i class="fas fa-cog"></i>
        </div>
        <div>
          <p :style="{ fontSize: '0.85rem', fontWeight: '600', color: txtPrimary, margin: '0' }">Configuración</p>
          <p :style="{ fontSize: '0.68rem', color: txtSecondary, margin: '0' }">Preferencias de cuenta</p>
        </div>
      </div>
    </div>

    <div :style="{ height: '1px', background: borderColor }"></div>

    <!-- Cerrar sesión -->
    <div style="padding: 8px 10px;">
      <div
        class="menu-item-danger"
        @click="handleLogout"
        :style="{ '--hover-bg-danger': hoverBgDanger }"
      >
        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(239,68,68,0.15); color: #ff5252; display: flex; align-items: center; justify-content: center; font-size: 13px;">
          <i class="fas fa-sign-out-alt"></i>
        </div>
        <p style="font-size: 0.85rem; font-weight: 700; color: #ff5252; margin: 0;">Cerrar Sesión</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 10px 12px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.2s ease;
}
.menu-item:hover {
  background: var(--hover-bg);
}

.menu-item-danger {
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 10px 12px; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.2s ease;
}
.menu-item-danger:hover {
  background: var(--hover-bg-danger);
}
</style>