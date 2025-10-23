<template>
    <div style="height: 100%;">
        <v-card class="h-100" subtitle="Detalles de tu cita" v-for="servicio in servicios" :key="servicio.id">
            <template v-slot:prepend>
                <v-avatar size="75">
                    <v-img src="/public/imagenes/logo/logo2.png" alt="Logo"></v-img>
                </v-avatar>
            </template>

            <template v-slot:title>
                <span class="font-weight-black">Barberia StyleHub</span>
            </template>

            <v-card-text>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum perspiciatis deleniti, ipsa quis obcaecati laudantium reprehenderit odio sunt corporis labore quae, harum dicta nihil earum minus itaque, dolorem est! Numquam.</p>
            </v-card-text>

            <v-card-actions>
                <v-btn>Siguiente</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: 'DetalleReserva',
        props: ["servicios"],
        setup() {

        }
    }
</script>