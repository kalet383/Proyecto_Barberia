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
                        <v-card-subtitle> 1,000 miles of wonder </v-card-subtitle>
                        <v-card-actions>
                            <v-btn color="orange-lighten-2" text="Explore"></v-btn>
                            <v-spacer></v-spacer>
                            <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
                        </v-card-actions>
                        <v-expand-transition>
                            <div v-show="show">
                                <v-divider></v-divider>
                                <v-card-text>
                                    I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                                </v-card-text>
                            </div>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </section>
</template>

<script setup>
    import { ref } from 'vue'
    const show = ref(false)
    const barberos = ref([
        {
            nombre : 'JUAN PEREZ | Juancho',
            foto : 'https://img.freepik.com/fotos-premium/herramientas-barbero-retrato-hombre-cuidado-cabello-bienestar-peine-servicio-barba-brazos-cruzados-profesionales-persona-barberia-peluqueria-salon-belleza-o-peinado_590464-368962.jpg?semt=ais_hybrid&w=740'
        },
        {
            nombre : 'MARCOS GOMEZ | Marquitos',
            foto : ''
        },
        {
            nombre : 'JULIAN MARTINEZ',
            foto : ''
        },
        {
            nombre : 'LUIS MARQUEZ | Lucho',
            foto : ''
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

    .paginacion {
        color: white;
    }
</style>