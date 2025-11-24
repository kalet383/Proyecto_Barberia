<template>
    <v-container>
        <h2 class="text-h5 mb-4">Barberos</h2>

        <!-- Loading -->
        <v-progress-linear v-if="barberStore.loading" indeterminate color="primary" />

        <!-- Error -->
        <v-alert v-if="barberStore.error" type="error" class="mb-4">
            {{ barberStore.error }}
        </v-alert>

        <!-- No hay barberos -->
        <v-alert v-if="!barberStore.loading && barberStore.barbers.length === 0" type="info" class="mb-4">
            No hay barberos disponibles
        </v-alert>

        <!-- Tarjetas -->
        <v-row>
            <v-col v-for="barbero in barberStore.barbers" :key="barbero.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img :src="barbero.foto || 'https://via.placeholder.com/400x200?text=Sin+Foto'" height="200px"></v-img>

                    <v-card-title>
                        {{ barbero.nombre }} {{ barbero.apellido }}
                    </v-card-title>

                    <v-card-subtitle>
                        <div>{{ barbero.email }}</div>
                        <div><strong>Teléfono:</strong> {{ barbero.telefono || 'No registrado' }}</div>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { onMounted } from 'vue'
    import { useBarberStore } from '@/stores/barber'

    const barberStore = useBarberStore()

    onMounted(() => {
        barberStore.getBarbers()
    })
</script>