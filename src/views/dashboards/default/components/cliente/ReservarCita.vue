<template>
    <div>
        <!-- Modal de selección -->
        <ModalseleccionReserva 
        v-model="modalSeleccion" 
        @seleccionar="handleSeleccion"
        />

        <!-- Modales de reserva -->
        <VistareservaCita v-model="modalReservaServicios" />
        <VistareservacitaBarbero v-model="modalReservaBarbero" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ModalseleccionReserva from './ModalseleccionReserva.vue'
    import VistareservaCita from '@/views/pages/VistareservaCita.vue'
    import VistareservacitaBarbero from '@/views/pages/VistareservacitaBarbero.vue'

    const modalSeleccion = ref(false)
    const modalReservaServicios = ref(false)
    const modalReservaBarbero = ref(false)

    const handleSeleccion = (tipo) => {
    if (tipo === 'servicios') {
        // Abrir modal de reserva por fecha/hora (desde servicios)
        modalReservaServicios.value = true
    } else if (tipo === 'barbero') {
        // Abrir modal de selección de barbero
        modalReservaBarbero.value = true
    }
    }
</script>