<template>
    <v-container>
        <h2 class="text-h5 mb-4">Servicios de la barberia</h2>

        <!-- Loading -->
        <v-progress-linear v-if="ServicioStore.loading" indeterminate color="primary" />
        
        <!-- Error -->
        <v-alert v-if="ServicioStore.error" type="error" class="mb-4">
            {{ ServicioStore.error }}
        </v-alert>

        <!-- No hay servicios -->
        <v-alert v-if="!ServicioStore.loading && ServicioStore.services.length === 0" type="info" class="mb-4">
            No hay servicios disponibles
        </v-alert>

        <!-- Tarjetas -->
        <v-row>
            <v-col v-for="servicio in ServicioStore.services" :key="servicio.id" cols="12" sm="6" md="4">
                <v-card>
                    <v-card-title>
                        {{ servicio.nombre  }}
                    </v-card-title>
                    <v-card-subtitle>
                        <div>{{ servicio.descripcion }}</div>
                        <div><strong>Precio: </strong> {{ servicio.precio || 'No registrado' }} 
                            <strong>- Duracion Aproximada: </strong>  {{  servicio.duracionAprox  }}
                        <strong>Categoria: </strong> {{ servicio.categoria || 'No registrada' }}
                        </div>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
    import { useServiceStore } from '@/stores/services';
    import { useCategoriaServicioStore } from '@/stores/CategoriaServicio';
    import { onMounted } from 'vue';

    const ServicioStore = useServiceStore()
    const CategoriaServicioStore = useCategoriaServicioStore()

    onMounted(() => {
        ServicioStore.getServices()
        CategoriaServicioStore.getCategoriasServicio()
    })
</script>