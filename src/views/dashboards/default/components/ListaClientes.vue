<template>
    <v-container>
        <h2 class="text-h5 mb-4">Clientes</h2>

        <!-- Loading -->
        <v-progress-linear v-if="clientStore.loading" indeterminate color="primary" />

        <!-- Error -->
        <v-alert v-if="clientStore.error" type="error" class="mb-4">
            {{ clientStore.error }}
        </v-alert>

        <!-- No hay clientes -->
        <v-alert v-if="!clientStore.loading && clientStore.clients.length === 0" type="info" class="mb-4">
            No hay clientes disponibles
        </v-alert>

        <!-- Tarjetas -->
        <v-row>
            <v-col v-for="cliente in clientStore.clients" :key="cliente.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-img :src="cliente.foto || 'https://via.placeholder.com/400x200?text=Sin+Foto'" height="200px"></v-img>

                    <v-card-title>
                        {{ cliente.nombre }} {{ cliente.apellido }}
                    </v-card-title>

                    <v-card-subtitle>
                        <div>{{ cliente.email }}</div>
                        <div><strong>Teléfono:</strong> {{ cliente.telefono || 'No registrado' }}</div>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { useClientStore } from '@/stores/client';
    import { onMounted } from 'vue';

    export default {
        name: 'ListaClientes',
        setup (){ 
            const clientStore = useClientStore()

            onMounted(() => {
                clientStore.getClients()
            })

            return{
                clientStore
            }
        },
    }
</script>