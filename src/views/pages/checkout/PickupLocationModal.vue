<template>
    <v-dialog v-model="dialog" max-width="900" scrollable content-class="pickup-dialog">
        <v-card class="pickup-modal">
            <!-- Header -->
            <div class="modal-header">
                <div class="header-content">
                    <div class="header-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <h2>Punto de Retiro</h2>
                        <p>Selecciona tu ubicación para calcular la distancia</p>
                    </div>
                </div>
                <button class="close-btn" @click="dialog = false">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <div class="modal-layout">
                    <!-- Left Panel: Search & Store Info -->
                    <div class="info-panel">
                        <!-- Search Section -->
                        <div class="search-section">
                            <div class="search-input-wrap">
                                <i class="fas fa-search"></i>
                                <input 
                                    v-model="origenTexto" 
                                    placeholder="Buscar dirección o código postal" 
                                    @keyup.enter="buscarDireccion"
                                />
                                <button v-if="origenTexto" class="clear-btn" @click="origenTexto = ''">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            
                            <button class="location-btn" @click="usarMiUbicacion">
                                <i class="fas fa-crosshairs"></i>
                                <span>Usar mi ubicación actual</span>
                            </button>
                        </div>

                        <!-- Store Card -->
                        <div class="stores-section">
                            <h4>Sucursal disponible</h4>
                            
                            <div class="store-card selected">
                                <div class="store-card-header">
                                    <div class="store-logo">
                                        <i class="fas fa-cut"></i>
                                    </div>
                                    <div class="store-info">
                                        <h5>StyleHub Barber Shop</h5>
                                        <span class="store-badge">Punto de Retiro</span>
                                    </div>
                                    <div class="store-price">GRATIS</div>
                                </div>
                                
                                <div class="store-address">
                                    <i class="fas fa-map-marker-alt"></i>
                                    <span>Calle Principal #123, Montería, Córdoba</span>
                                </div>
                                
                                <div class="store-meta">
                                    <div class="meta-item">
                                        <i class="fas fa-route"></i>
                                        <span v-if="distanceInfo">{{ distanceInfo }}</span>
                                        <span v-else class="calculating">Calculando...</span>
                                    </div>
                                    <div class="meta-item">
                                        <i class="fas fa-clock"></i>
                                        <span>Listo en 24 horas</span>
                                    </div>
                                </div>
                                
                                <div class="store-schedule">
                                    <h6>Horario de atención</h6>
                                    <div class="schedule-row">
                                        <span>Lunes - Viernes</span>
                                        <span>9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div class="schedule-row">
                                        <span>Sábados</span>
                                        <span>9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div class="schedule-row">
                                        <span>Domingos</span>
                                        <span>Cerrado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Panel: Map -->
                    <div class="map-panel">
                        <div id="checkout-map" class="map-container"></div>
                        
                        <!-- Loading Overlay -->
                        <transition name="fade">
                            <div v-if="loading" class="map-loading">
                                <div class="loading-spinner">
                                    <i class="fas fa-spinner fa-spin"></i>
                                </div>
                                <span>Calculando ruta...</span>
                            </div>
                        </transition>
                        
                        <!-- Distance Badge -->
                        <transition name="slide-up">
                            <div v-if="distanceInfo && !loading" class="distance-badge">
                                <i class="fas fa-car"></i>
                                <span>{{ distanceInfo }} de distancia</span>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
                <button class="btn-cancel" @click="dialog = false">Cancelar</button>
                <button 
                    class="btn-confirm" 
                    @click="confirmarUbicacion"
                    :disabled="!readyToConfirm"
                >
                    <i class="fas fa-check"></i>
                    Confirmar ubicación
                </button>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue', 'location-selected']);

const dialog = ref(false);
const origenTexto = ref('');
const loading = ref(false);
const distanceInfo = ref('');
const readyToConfirm = ref(false);
const currentUserCoords = ref(null);

const BARBER_COORDS = [8.752611, -75.884609];

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

const initMap = () => {
    if (map) {
        map.remove();
    }

    map = L.map('checkout-map', { 
        zoomControl: false,
        attributionControl: false
    }).setView(BARBER_COORDS, 14);
    
    // Dark style map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // Custom zoom control
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    // Barber Marker
    const barberIcon = L.divIcon({
        className: 'custom-barber-marker',
        html: `
            <div class="marker-pulse"></div>
            <div class="marker-icon">
                <i class="fas fa-cut"></i>
            </div>
        `,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });

    L.marker(BARBER_COORDS, { icon: barberIcon })
        .addTo(map)
        .bindPopup(`
            <div style="text-align: center; padding: 8px;">
                <strong style="color: #ee6f38;">StyleHub Barber Shop</strong><br>
                <small>Punto de Retiro</small>
            </div>
        `)
        .openPopup();
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
            origenTexto.value = "📍 Mi ubicación actual";
            updateUserMarker(latitude, longitude);
            calculateRoute(latitude, longitude);
        },
        (err) => {
            loading.value = false;
            console.error(err);
            alert('No se pudo obtener la ubicación. Verifica los permisos.');
        }
    );
};

const buscarDireccion = async () => {
    if (!origenTexto.value || origenTexto.value.startsWith('📍')) return;
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
            alert('Dirección no encontrada. Intenta ser más específico.');
            loading.value = false;
        }
    } catch (e) {
        console.error(e);
        alert('Error al buscar la dirección');
        loading.value = false;
    }
};

const updateUserMarker = (lat, lng) => {
    if (userMarker) map.removeLayer(userMarker);
    
    const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
            <div class="user-marker-dot"></div>
            <div class="user-marker-ring"></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
    
    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    
    const bounds = L.latLngBounds([ [lat, lng], BARBER_COORDS ]);
    map.fitBounds(bounds, { padding: [60, 60] });
};

const calculateRoute = (lat, lng) => {
    if (routingControl) map.removeControl(routingControl);
    
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
            styles: [
                { color: '#ee6f38', weight: 5, opacity: 0.8 },
                { color: '#fff', weight: 2, opacity: 0.3 }
            ]
        },
        createMarker: () => null,
        addWaypoints: false,
        show: false,
        fitSelectedRoutes: false
    }).addTo(map);

    routingControl.on('routesfound', (e) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distKm = (summary.totalDistance / 1000).toFixed(1);
        
        distanceInfo.value = `${distKm} km`;
        readyToConfirm.value = true;
        loading.value = false;
    });

    routingControl.on('routingerror', () => {
        loading.value = false;
        distanceInfo.value = 'No se pudo calcular';
    });
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
/* Variables */
.pickup-modal {
    --primary: #ee6f38;
    --primary-dark: #d45a28;
    --dark: #1a1a1a;
    --darker: #111111;
    --card: #242424;
    --border: #333;
    --text: #ffffff;
    --text-muted: #888;
    --success: #22c55e;
    
    background: var(--dark) !important;
    border-radius: 20px !important;
    overflow: hidden;
    max-height: 90vh;
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-icon {
    width: 50px;
    height: 50px;
    background: rgba(255,255,255,0.2);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    color: white;
}

.header-content h2 {
    color: white;
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0;
}

.header-content p {
    color: rgba(255,255,255,0.8);
    font-size: 0.85rem;
    margin: 4px 0 0;
}

.close-btn {
    width: 40px;
    height: 40px;
    background: rgba(255,255,255,0.15);
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
}

.close-btn:hover {
    background: rgba(255,255,255,0.25);
    transform: rotate(90deg);
}

/* Body Layout */
.modal-body {
    padding: 0;
}

.modal-layout {
    display: flex;
    flex-direction: column;
}

@media (min-width: 768px) {
    .modal-layout {
        flex-direction: row;
        height: 500px;
    }
}

/* Info Panel */
.info-panel {
    padding: 24px;
    background: var(--darker);
    flex-shrink: 0;
}

@media (min-width: 768px) {
    .info-panel {
        width: 340px;
        overflow-y: auto;
    }
}

/* Search Section */
.search-section {
    margin-bottom: 24px;
}

.search-input-wrap {
    display: flex;
    align-items: center;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0 16px;
    margin-bottom: 12px;
    transition: border-color 0.2s;
}

.search-input-wrap:focus-within {
    border-color: var(--primary);
}

.search-input-wrap i {
    color: var(--text-muted);
    font-size: 0.9rem;
}

.search-input-wrap input {
    flex: 1;
    background: none;
    border: none;
    padding: 14px 12px;
    color: var(--text);
    font-size: 0.9rem;
    outline: none;
}

.search-input-wrap input::placeholder {
    color: #555;
}

.clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
}

.location-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px;
    background: transparent;
    border: 2px dashed var(--border);
    border-radius: 12px;
    color: var(--primary);
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
}

.location-btn:hover {
    background: rgba(238,111,56,0.1);
    border-color: var(--primary);
}

/* Stores Section */
.stores-section h4 {
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 16px;
}

.store-card {
    background: var(--card);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s;
}

.store-card.selected {
    border-color: var(--primary);
    box-shadow: 0 0 20px rgba(238,111,56,0.15);
}

.store-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.store-logo {
    width: 44px;
    height: 44px;
    background: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.1rem;
}

.store-info {
    flex: 1;
}

.store-info h5 {
    color: var(--text);
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 4px;
}

.store-badge {
    font-size: 0.7rem;
    background: rgba(238,111,56,0.15);
    color: var(--primary);
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
}

.store-price {
    color: var(--success);
    font-weight: 700;
    font-size: 0.85rem;
}

.store-address {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
    font-size: 0.85rem;
    color: var(--text-muted);
}

.store-address i {
    color: var(--primary);
    margin-top: 2px;
}

.store-meta {
    display: flex;
    gap: 20px;
    margin-bottom: 16px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    color: var(--text-muted);
}

.meta-item i {
    color: var(--primary);
}

.meta-item .calculating {
    color: #555;
    font-style: italic;
}

.store-schedule {
    padding-top: 16px;
    border-top: 1px solid var(--border);
}

.store-schedule h6 {
    color: var(--text);
    font-size: 0.8rem;
    margin: 0 0 12px;
}

.schedule-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: var(--text-muted);
    padding: 6px 0;
}

/* Map Panel */
.map-panel {
    flex: 1;
    position: relative;
    min-height: 300px;
}

.map-container {
    width: 100%;
    height: 100%;
    min-height: 300px;
}

@media (min-width: 768px) {
    .map-container {
        min-height: 100%;
    }
}

.map-loading {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 1000;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner i {
    font-size: 1.5rem;
    color: white;
}

.map-loading span {
    color: white;
    font-size: 0.9rem;
}

.distance-badge {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background: var(--dark);
    color: white;
    padding: 12px 20px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 1000;
}

.distance-badge i {
    color: var(--primary);
}

/* Footer */
.modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    background: var(--darker);
    border-top: 1px solid var(--border);
}

.btn-cancel {
    flex: 1;
    padding: 14px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel:hover {
    background: var(--border);
}

.btn-confirm {
    flex: 2;
    padding: 14px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border: none;
    border-radius: 12px;
    color: white;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s;
}

.btn-confirm:hover:not(:disabled) {
    box-shadow: 0 8px 24px rgba(238,111,56,0.4);
}

.btn-confirm:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Custom Markers (Global styles needed) */
:global(.custom-barber-marker) {
    background: none !important;
    border: none !important;
}

:global(.custom-barber-marker .marker-pulse) {
    position: absolute;
    width: 50px;
    height: 50px;
    background: rgba(238,111,56,0.3);
    border-radius: 50%;
    animation: pulse 2s infinite;
}

:global(.custom-barber-marker .marker-icon) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36px;
    height: 36px;
    background: #ee6f38;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(238,111,56,0.5);
}

:global(.custom-user-marker) {
    background: none !important;
    border: none !important;
}

:global(.custom-user-marker .user-marker-dot) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 14px;
    height: 14px;
    background: #1a1a1a;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

:global(.custom-user-marker .user-marker-ring) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border: 2px solid rgba(26,26,26,0.3);
    border-radius: 50%;
    animation: ring-pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.8);
        opacity: 1;
    }
    100% {
        transform: scale(1.5);
        opacity: 0;
    }
}

@keyframes ring-pulse {
    0% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
    }
}
</style>