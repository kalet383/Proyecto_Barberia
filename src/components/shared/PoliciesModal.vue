<script setup lang="ts">
import { ref, computed } from 'vue';
import { XIcon } from 'vue-tabler-icons';

const isOpen = ref(false);
const title = ref('');
const content = ref('');

const iconMap: { [key: string]: string } = {
    'POLÍTICA DE PRIVACIDAD': 'fas fa-shield-alt',
    'TÉRMINOS DE SERVICIO': 'fas fa-file-contract',
    'POLÍTICA DE REEMBOLSO': 'fas fa-undo',
    'POLÍTICA DE ENVÍO': 'fas fa-truck',
    'POLÍTICA DE TRATAMIENTO DE DATOS': 'fas fa-lock'
};

const currentIcon = computed(() => iconMap[title.value] || 'fas fa-file-alt');

const open = (newTitle: string, newContent: string) => {
    title.value = newTitle;
    content.value = newContent;
    isOpen.value = true;
};

const close = () => {
    isOpen.value = false;
};

defineExpose({
    open
});
</script>

<template>
    <v-dialog v-model="isOpen" max-width="850" scrollable transition="fade-transition">
        <v-card class="policies-modal">
            <!-- Header con ícono y gradiente -->
            <div class="modal-header-gradient">
                <div class="header-content">
                    <div class="header-icon">
                        <i :class="currentIcon"></i>
                    </div>
                    <div class="header-text">
                        <h2 class="modal-title">{{ title }}</h2>
                        <p class="modal-subtitle">StyleHub</p>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon variant="text" @click="close" class="close-btn">
                        <XIcon size="28" />
                    </v-btn>
                </div>
            </div>

            <!-- Contenido -->
            <v-card-text class="pa-8 policy-content">
                <div v-html="content" class="text-content"></div>
            </v-card-text>

            <!-- Footer con botón mejorado -->
            <v-divider class="footer-divider"></v-divider>
            <v-card-actions class="pa-6 d-flex justify-end">
                <v-btn 
                    variant="elevated" 
                    @click="close" 
                    class="close-button-footer"
                    size="large"
                >
                    <i class="fas fa-check mr-2"></i> Entendido
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.policies-modal {
    border-radius: 16px !important;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
}

.modal-header-gradient {
    background: linear-gradient(135deg, #ee6f38 0%, #ff9a6c 100%);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 28px 32px;
}

.header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    flex-shrink: 0;
}

.header-icon i {
    color: white;
    font-size: 28px;
}

.header-text {
    flex: 1;
    color: white;
}

.modal-title {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
}

.modal-subtitle {
    margin: 6px 0 0 0;
    font-size: 0.85rem;
    opacity: 0.9;
    font-weight: 500;
    letter-spacing: 1px;
    font-family: 'DM Sans', sans-serif;
}

.close-btn {
    color: white !important;
    transition: all 0.3s ease !important;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.15) !important;
    transform: rotate(90deg) !important;
}

/* Contenido */
.policy-content {
    background: #fafafa;
    min-height: 300px;
}

.text-content {
    color: #333;
    font-size: 0.95rem;
    line-height: 1.9;
    font-family: 'DM Sans', sans-serif;
}

.policy-content :deep(h3) {
    margin-top: 32px;
    margin-bottom: 16px;
    font-size: 1.15rem;
    font-weight: 700;
    color: #ee6f38;
    letter-spacing: 0.5px;
    font-family: 'DM Sans', sans-serif;
    text-transform: uppercase;
}

.policy-content :deep(h3:first-child) {
    margin-top: 0;
}

.policy-content :deep(p) {
    margin-bottom: 16px;
    color: #555;
}

.policy-content :deep(strong) {
    color: #333;
    font-weight: 700;
}

/* Footer divider */
.footer-divider {
    opacity: 0.1 !important;
}

/* Botón footer */
.close-button-footer {
    background: linear-gradient(135deg, #ee6f38, #ff9a6c) !important;
    color: white !important;
    font-weight: 700 !important;
    letter-spacing: 0.8px !important;
    text-transform: uppercase !important;
    border-radius: 8px !important;
    padding: 12px 36px !important;
    font-family: 'DM Sans', sans-serif !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.close-button-footer:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 12px 30px rgba(238, 111, 56, 0.4) !important;
}

.close-button-footer:active {
    transform: translateY(0) !important;
}
</style>
