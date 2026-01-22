<template>
    <v-dialog v-model="dialog" max-width="800" scrollable>
        <v-card class="rounded-lg">
            <v-card-title class="d-flex justify-space-between align-center pa-4 bg-white border-bottom">
                <span class="text-h6 font-weight-bold">Lugares de retiro</span>
                <v-btn icon variant="text" @click="dialog = false" density="compact">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            
            <v-card-text class="pa-0 bg-grey-lighten-5">
                <div class="pa-4 bg-white mb-2">
                    <!-- Search & Controls -->
                    <div class="d-flex gap-2 align-center mb-3">
                        <div class="flex-grow-1 position-relative">
                             <input 
                                v-model="origenTexto" 
                                placeholder="Ingresa tu ubicación o código postal" 
                                class="custom-search-input w-100"
                                @keyup.enter="buscarDireccion"
                            />
                        </div>
                        <v-btn icon variant="text" class="bg-grey-lighten-4" @click="buscarDireccion">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </div>
                    
                    <div class="d-flex align-center cursor-pointer text-primary" @click="usarMiUbicacion">
                        <v-icon size="18" class="mr-2">mdi-crosshairs-gps</v-icon>
                        <span class="text-body-2 font-weight-medium">Usar mi ubicación</span>
                    </div>
                </div>

                <!-- Map Container -->
                 <div class="map-container position-relative">
                    <div id="checkout-map" class="map-view"></div>
                    
                    <!-- Loading Overlay -->
                    <div v-if="loading" class="map-loading overlay-center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    </div>
                </div>

                <!-- Stores List (Only one mostly) -->
                <div class="pa-4 stores-list">
                    <v-subheader class="px-0 text-caption font-weight-bold text-grey-darken-1">SUCURSALES DISPONIBLES</v-subheader>
                    
                    <div 
                        class="store-item pa-4 border rounded bg-white cursor-pointer transition-swing"
                        :class="{'selected-store': true}"
                        @click="seleccionarSucursal"
                    >
                        <div class="d-flex justify-space-between align-start mb-1">
                            <div class="font-weight-bold text-body-2">StyleHub Barber Shop</div>
                            <div class="text-success font-weight-bold text-caption">GRATIS</div>
                        </div>
                        <div class="text-caption text-grey-darken-1 mb-2">Calle Principal #123, Montería, Córdoba</div>
                        
                        <div class="d-flex align-center gap-4 text-caption text-grey-darken-2">
                            <div class="d-flex align-center">
                                <v-icon size="14" class="mr-1">mdi-map-marker-distance</v-icon>
                                <span>{{ distanceInfo || 'Calculando...' }}</span>
                            </div>
                            <div class="d-flex align-center">
                                <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                                <span>Normalmente listo en 24 horas</span>
                            </div>
                        </div>
                    </div>
                </div>

            </v-card-text>
            <v-card-actions class="pa-4 bg-white border-top">
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="dialog = false" class="text-capitalize">Cancelar</v-btn>
                <v-btn 
                    color="black" 
                    variant="flat" 
                    @click="confirmarUbicacion" 
                    :disabled="!readyToConfirm"
                    class="text-white text-capitalize px-6"
                    style="background-color: #000 !important; color: #fff !important;"
                >
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
// Note: leaflet-routing-machine CSS should be imported globally or here if strictly needed, usually works 
// but might need explicit css import if markers look weird. 
// We will rely on the fact that HomeUbicacion used it successfully.

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'location-selected']);

const dialog = ref(false);
const origenTexto = ref('');
const loading = ref(false);
const distanceInfo = ref('');
const readyToConfirm = ref(false);
const currentUserCoords = ref(null);

// Barber Location (Montería as per context/reference)
// Reference: const barberLat = 8.752611; const barberLng = -75.884609;
const BARBER_COORDS = [8.752611, -75.884609]; // 8.752611, -75.884609

let map = null;
let userMarker = null;
let routingControl = null;

watch(() => props.modelValue, (val) => {
    dialog.value = val;
    if (val) {
        nextTick(() => {
            initMap();
        });
    }
});

watch(dialog, (val) => {
    emit('update:modelValue', val);
});

// Initialize Map
const initMap = () => {
    if (map) {
        map.remove(); // Clean reset
    }

    // Default view: Montería
    map = L.map('checkout-map', { zoomControl: false }).setView(BARBER_COORDS, 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Barber Marker
    const barberIcon = L.divIcon({
        className: 'custom-barber-icon',
        html: `<div style="background-color: #ee6f38; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">✂️</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    L.marker(BARBER_COORDS, { icon: barberIcon }).addTo(map).bindPopup("<b>StyleHub Barber Shop</b><br>Punto de Retiro").openPopup();
};

const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
        alert('Geolocalización no soportada');
        return;
    }
    loading.value = true;
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            currentUserCoords.value = [latitude, longitude];
            origenTexto.value = "Mi ubicación actual";
            updateUserMarker(latitude, longitude);
            calculateRoute(latitude, longitude); // Auto calculate route
            loading.value = false;
        },
        (err) => {
            loading.value = false;
            console.error(err);
            alert('No se pudo obtener la ubicación');
        }
    );
};

const buscarDireccion = async () => {
    if (!origenTexto.value) return;
    loading.value = true;
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&q=${encodeURIComponent(origenTexto.value + ', Colombia')}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            currentUserCoords.value = [lat, lon];
            updateUserMarker(lat, lon);
            calculateRoute(lat, lon);
        } else {
            alert('Dirección no encontrada');
        }
    } catch (e) {
        console.error(e);
        alert('Error al buscar dirección');
    } finally {
        loading.value = false;
    }
};

const updateUserMarker = (lat, lng) => {
    if (userMarker) map.removeLayer(userMarker);
    const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div style="background-color: #000; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    // Fit bounds
    const bounds = L.latLngBounds([ [lat, lng], BARBER_COORDS ]);
    map.fitBounds(bounds, { padding: [50, 50] });
};

const calculateRoute = (lat, lng) => {
    if (routingControl) map.removeControl(routingControl);
    
    // We use OSRM for simple routing just to get distance/time
    // Or we can use simple haversine if we don't want the visual line clutter,
    // but the user's ref uses leaflet-routing-machine.
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(lat, lng),
            L.latLng(BARBER_COORDS[0], BARBER_COORDS[1])
        ],
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving'
        }),
        lineOptions: {
            styles: [{ color: '#000', weight: 4, opacity: 0.7 }]
        },
        createMarker: () => null, // We handle markers manually
        addWaypoints: false,
        show: false // Don't show the instructions panel
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distKm = (summary.totalDistance / 1000).toFixed(1);
        const timeMin = Math.round(summary.totalTime / 60);
        
        distanceInfo.value = `${distKm} km`;
        readyToConfirm.value = true;
        
        // Emit info potentially
    });
};

const seleccionarSucursal = () => {
    // Just highlights visually, maybe logic if multiple stores
};

const confirmarUbicacion = () => {
    emit('location-selected', {
        distance: distanceInfo.value,
        coords: currentUserCoords.value,
        address: origenTexto.value
    });
    dialog.value = false;
};

</script>

<style scoped>
.border-bottom { border-bottom: 1px solid #e0e0e0; }
.border-top { border-top: 1px solid #e0e0e0; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }

.custom-search-input {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.2s;
}
.custom-search-input:focus {
    border-color: #000;
}

.map-view {
    width: 100%;
    height: 300px;
    background: #eee;
}

.selected-store {
    border-color: #000 !important;
    background-color: #f9f9f9 !important;
    border-width: 2px !important;
}

.overlay-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}
</style>
