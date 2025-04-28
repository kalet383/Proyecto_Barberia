<template>
    <section class="barberos-section">
        <v-container>
            <h2 class="tituloseccion">NUESTROS EQUIPO | Barberos profesionales</h2>
            <p>“En StyleHub, nuestros barberos son artistas del estilo. No solo dominan las tijeras y las máquinas, 
                también entienden que tu imagen habla por ti. Déjalo en manos de quienes viven para transformar tu look 
                en una declaración de actitud.”
            </p>
            <v-card class="mx-auto" max-width="344">
                <v-img height="200px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" cover></v-img>
                <v-card-title>
                    Top western road trips
                </v-card-title>
                <v-card-subtitle>
                    1,000 miles of wonder
                </v-card-subtitle>
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
        </v-container>
    </section>
</template>

<script setup>
    import { ref } from 'vue'
    const show = ref(false)
</script>

<style scoped>

    .barberos-section {
        background-color: #000;
    }

    .tituloseccion {
        color: white;
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 40px;
        text-align: center;
    }

    p {
        color: white;
        text-align: center;
        font-weight: bold;
    }

    .paginacion {
        color: white;
    }
</style>