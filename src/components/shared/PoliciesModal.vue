<script setup lang="ts">
import { ref } from 'vue';
import { XIcon } from 'vue-tabler-icons';

const isOpen = ref(false);
const title = ref('');
const content = ref('');

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
    <v-dialog v-model="isOpen" max-width="800" scrollable>
        <v-card class="policies-modal">
            <v-card-title class="pa-4 d-flex align-center bg-grey-lighten-4 sticky-title">
                <span class="text-h5 font-weight-bold text-uppercase">{{ title }}</span>
                <v-spacer></v-spacer>
                <v-btn icon variant="text" @click="close">
                    <XIcon size="24" />
                </v-btn>
            </v-card-title>

            <v-card-text class="pa-6 policy-content">
                <div v-html="content" class="text-body-1 whitespace-pre-wrap"></div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pa-4 d-flex justify-end">
                <v-btn color="black" variant="flat" @click="close" class="text-white">
                    Cerrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.policies-modal {
    border-radius: 8px;
}

.sticky-title {
    position: sticky;
    top: 0;
    z-index: 10;
}

.policy-content {
    line-height: 1.8;
}

.whitespace-pre-wrap {
    white-space: pre-wrap;
}

.policy-content :deep(h3) {
    margin-top: 24px;
    margin-bottom: 12px;
    font-weight: bold;
    color: #000;
}

.policy-content :deep(p) {
    margin-bottom: 16px;
}
</style>
