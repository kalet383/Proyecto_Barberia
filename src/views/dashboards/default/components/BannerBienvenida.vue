<template>
    <section class="p-6">
        <div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-1">
            <h1 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span class="text-indigo-500">👋</span> 
                {{ saludo }}, {{ nombreUsuario }}
            </h1>
            <p class="text-sm text-gray-500">
                Nos alegra verte de nuevo
            </p>
        </div>
    </section>
</template>

<script setup>
    import { computed } from 'vue'
    import { useAuthStore } from '../../../../stores/auth'

    const authStore = useAuthStore()

    const nombreUsuario = computed(() => {
        const u = authStore.user
        if (!u) return 'Usuario'
        return `${u.nombre} ${u.apellido}`
    })

    const saludo = computed(() => {
        const hora = new Date().getHours()
        if (hora < 12) return 'Buenos días'
        if (hora < 19) return 'Buenas tardes'
        return 'Buenas noches'
    })
</script>