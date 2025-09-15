<template>
    <section id="ubicacion-section" class="v-container">
        <h2 class="tituloprincipal">¿COMO LLEGAR? | Nuestra Ubicacion</h2>
        <div class="mapa-ruta">
            <div class="controls">
                <input v-model="origenTexto" placeholder="Punto de partida" class="input"/>
                <button @click="usarMiUbicacion" class="btn">Usar mi ubicación</button>
                <button @click="calculateRoute" class="btn">¿Cómo llegar?</button>
            </div>
            <div id="map" class="map"></div>
        </div>
    </section>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import 'leaflet-routing-machine';
    import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
    import 'leaflet-control-geocoder';
    import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

    // coordenadas de tu barbería
    const barberLat = 8.752611;
    const barberLng = -75.884609;

    const origenTexto = ref('');
    let origenCoords = null; // para guardar coordenadas del navegador
    let map;
    let routingControl;

    // Geocodificar dirección → coordenadas con Nominatim
    async function getCoordsFromAddress(address) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&q=${encodeURIComponent(address)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    }

    onMounted(() => {
        map = L.map('map').setView([barberLat, barberLng], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);

        // Icono personalizado para barbería (rojo)
        const barberIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // marcador barbería con tooltip permanente
        L.marker([barberLat, barberLng], { icon: barberIcon })
        .addTo(map)
        .bindTooltip('StyleHub Barber Shop', { permanent: true, direction: 'top', offset: L.point(0, -30) })
        .openTooltip();
    });

    // obtiene coordenadas del navegador
    function usarMiUbicacion() {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                origenCoords = [pos.coords.latitude, pos.coords.longitude];
                origenTexto.value = 'Mi ubicación actual';

                // icono verde para el usuario
                const userIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                // marcador verde con tooltip permanente
                L.marker(origenCoords, { icon: userIcon })
                .addTo(map)
                .bindTooltip('Tu ubicación', { permanent: true, direction: 'top', offset: L.point(0, -30) })
                .openTooltip();
            },
            (err) => {
                alert('No se pudo obtener tu ubicación');
                console.error(err);
            }
        );
    }

    async function calculateRoute() {
        // determinar coordenadas de inicio
        let startLatLng = null;

        if (origenCoords) {
            // tenemos coordenadas del navegador
            startLatLng = L.latLng(origenCoords[0], origenCoords[1]);
        } else if (origenTexto.value) {
            // geocodificar texto
            const coords = await getCoordsFromAddress(origenTexto.value);
            if (!coords) {
            alert('No se encontró la dirección de origen');
            return;
            }
            startLatLng = L.latLng(coords[0], coords[1]);
        } else {
            alert('Escribe una dirección o usa tu ubicación');
            return;
        }

        // eliminar ruta previa si existe
        if (routingControl) {
            map.removeControl(routingControl);
        }

        routingControl = L.Routing.control({
            waypoints: [
            startLatLng,
            L.latLng(barberLat, barberLng)
            ],
            router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            routeWhileDragging: false,
            showAlternatives: false,
            language: 'es'
        }).addTo(map);

        // centrar mapa en la ruta encontrada
        routingControl.on('routesfound', () => {
            const bounds = routingControl.getPlan().getWaypoints().map(wp => wp.latLng);
            map.fitBounds(L.latLngBounds(bounds));
        });
    }
</script>

<style scoped>
    .tituloprincipal {
        text-align: center;
        font-size: 2rem;
        margin-bottom: 30px;
        font-weight: bold;
        margin-top: 3%;
    }

    .tituloprincipal::after {
        content: '';
        display: block;
        width: 300px;
        height: 4px;
        margin: 8px auto 0 auto;
        background: linear-gradient(to right, #000, #fff, #000);
        border-radius: 2px;
        background-size: 200%;
        animation: animateGradient 3s linear infinite;
    }

    @keyframes animateGradient {
        0% { background-position: 200% 0; }
        100% { background-position: 0 0; }
    }

    .mapa-ruta {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px solid #ee6f38;
        border-radius: 8px;
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1);
    }

    .controls {
        margin-bottom: 10px;
        display: flex;
        gap: 8px;
    }

    .input {
        flex: 1;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .btn {
        padding: 6px 12px;
        background-color: #ee6f38;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn:hover {
        background-color: #d55e2d;
    }

    .map {
        width: 100%;
        height: 500px;
        border: 2px solid #ee6f38;
        border-radius: 8px;
    }
</style>