<template>
    <section class="barberos-section">
        <v-container>
            <h2 class="tituloseccion">NUESTROS EQUIPO | Barberos profesionales</h2>
            <p>“En StyleHub, nuestros barberos son artistas del estilo. No solo dominan las tijeras y las máquinas, 
                también entienden que tu imagen habla por ti. Déjalo en manos de quienes viven para transformar tu look 
                en una declaración de actitud.”
            </p>
            <v-row>
                <v-col v-for="(barbero, index) in barberos" :key="index" cols="12" sm="6" md="3">
                    <v-card class="mx-auto" max-width="330">
                        <v-img height="340px" :src="barbero.foto" cover></v-img>
                        <v-card-title> {{ barbero.nombre }} </v-card-title>
                        <v-card-text> {{ barbero.descripcion }} </v-card-text>
                        <v-card-actions>
                            <v-btn> {{ barbero.boton }} </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<script setup>
    import { ref } from 'vue'
    const barberos = ref([
        {
            nombre : 'JUAN PEREZ | Juancho',
            foto : '/imagenes/barberos/barberoJUAN.png',
            descripcion : 'Barbero - Especialista en cualquier tipo de corte, en barba y masajes - 5 años de experiencia',
            boton : 'AGENDAR CON JUAN'
        },
        {
            nombre : 'ANDREW GOMEZ | Drew',
            foto : '/imagenes/barberos/barberoANDREW.jpg',
            descripcion : 'Barbero - Especialista en cualquier tipo de corte, en barba y masajes - 5 años de experiencia',
            boton : 'AGENDAR CON ANDREW'
        },
        {
            nombre : 'ENRIQUE LOPEZ | Kike',
            foto : '/imagenes/barberos/barberoENRIQUE.jpg',
            descripcion : 'Barbero - Especialista en cualquier tipo de corte, en barba y masajes - 5 años de experiencia',
            boton : 'AGENDAR CON ENRIQUE'
        },
        {
            nombre : 'JAKE MARQUEZ | Jay',
            foto : '/imagenes/barberos/barberoJAKE.jpg',
            descripcion : 'Barbero - Especialista en cualquier tipo de corte, en barba y masajes - 5 años de experiencia',
            boton : 'AGENDAR CON JAKE'
        }
    ])
</script>

<style scoped>

    .barberos-section {
        background-color: #000;
    }

    .tituloseccion {
        color: white;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
    }

    p {
        color: white;
        text-align: center;
        font-weight: bold;
        margin-bottom: 2%;
    }

    .v-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .v-card:hover {
        transform: scale(1.03);
        box-shadow: 0 0 18px #ee6f38;
        border: 2px solid #ee6f38;
    }

    .v-card-title {
        text-align: center;
        font-weight: bold;
    }

    .v-card-text {
        font-weight: bold;
        white-space: normal;
        text-align: start;
    }

    .v-card-actions {
        justify-content: center;
    }
</style>