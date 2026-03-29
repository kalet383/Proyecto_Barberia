<template>
  <section id="ubicacion-section" class="ubicacion-section">

    <!-- Encabezado -->
    <div class="seccion-header text-center mb-10">
      <span class="seccion-eyebrow">
        <span class="eyebrow-line"></span>
        VISÍTANOS
        <span class="eyebrow-line"></span>
      </span>
      <h2 class="seccion-titulo">¿Cómo <span class="titulo-accent">llegar?</span></h2>
      <p class="seccion-desc">Encuéntranos fácilmente. Usa tu ubicación o escribe tu dirección para trazar la ruta.</p>
      <div class="titulo-subline"></div>
    </div>

    <!-- Mapa container -->
    <div class="mapa-wrapper">
      <div id="map" class="map">
        <!-- Controles flotantes -->
        <div class="map-controls">
          <div class="controls-group">
            <div class="input-wrapper">
              <i class="fas fa-search input-icon"></i>
              <input
                v-model="origenTexto"
                placeholder="Punto de partida..."
                class="input-floating"
                @keyup.enter="calculateRoute"
              />
            </div>
            <div class="buttons-row">
              <button @click="usarMiUbicacion" class="btn-floating btn-location">
                <i class="fas fa-location-crosshairs"></i>
                Mi ubicación
              </button>
              <button
                @click="toggleTracking"
                :class="['btn-floating', 'btn-tracking', { active: isTracking }]"
              >
                <i :class="isTracking ? 'fas fa-stop-circle' : 'fas fa-satellite-dish'"></i>
                {{ isTracking ? 'Detener' : 'Seguir' }}
              </button>
              <button @click="calculateRoute" class="btn-floating btn-route">
                <i class="fas fa-route"></i>
                ¿Cómo llegar?
              </button>
            </div>
            <button v-if="routingControl" @click="clearRoute" class="btn-floating btn-clear">
              <i class="fas fa-times mr-1"></i>
              Limpiar ruta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Info rápida -->
    <div class="info-rapida">
      <div class="info-item">
        <div class="info-icon-wrap"><i class="fas fa-map-marker-alt"></i></div>
        <div>
          <span class="info-label">Dirección</span>
          <span class="info-valor">Calle 30 Cr 4 - n° 3 - Local #5</span>
        </div>
      </div>
      <div class="info-sep"></div>
      <div class="info-item">
        <div class="info-icon-wrap"><i class="fas fa-clock"></i></div>
        <div>
          <span class="info-label">Horario</span>
          <span class="info-valor">Lun–Vie 9am–8pm · Sáb 9am–6pm</span>
        </div>
      </div>
      <div class="info-sep"></div>
      <div class="info-item">
        <div class="info-icon-wrap"><i class="fab fa-whatsapp"></i></div>
        <div>
          <span class="info-label">WhatsApp</span>
          <span class="info-valor">+57 300 123 4567</span>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet-routing-machine'
  import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
  import 'leaflet-control-geocoder'
  import 'leaflet-control-geocoder/dist/Control.Geocoder.css'

  const barberLat = 8.752611
  const barberLng = -75.884609

  const origenTexto = ref('')
  let origenCoords = null
  let map
  let routingControl
  let userMarker = null
  let watchId = null
  let isTracking = ref(false)

  async function getCoordsFromAddress(address) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=co&q=${encodeURIComponent(address + ', Colombia')}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      return null
    } catch (error) {
      console.error('Error geocoding:', error)
      return null
    }
  }

  onMounted(() => {
    map = L.map('map', { zoomControl: false }).setView([barberLat, barberLng], 14)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    const barberIcon = L.divIcon({
      className: 'custom-barber-icon',
      html: `<div class="marker-pin barber-pin"><div class="marker-icon">✂️</div></div>`,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    })

    const barberMarker = L.marker([barberLat, barberLng], { icon: barberIcon })
      .addTo(map)
      .bindPopup(`<div class="custom-popup"><h3>StyleHub Barber Shop</h3><p>📍 Tu destino</p></div>`)
      .openPopup()

    barberMarker.bindTooltip('StyleHub Barber Shop', {
      permanent: true,
      direction: 'top',
      offset: [0, -55],
      className: 'custom-tooltip barber-tooltip'
    })
  })

  function usarMiUbicacion() {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalización'); return }
    origenTexto.value = 'Obteniendo ubicación...'
    navigator.geolocation.getCurrentPosition(
      (pos) => { updateUserLocation(pos.coords.latitude, pos.coords.longitude); origenTexto.value = 'Mi ubicación actual' },
      (err) => { alert('No se pudo obtener tu ubicación.'); origenTexto.value = ''; console.error(err) },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  function toggleTracking() {
    if (!navigator.geolocation) { alert('Tu navegador no soporta geolocalización'); return }
    isTracking.value ? stopTracking() : startTracking()
  }

  function startTracking() {
    if (watchId) navigator.geolocation.clearWatch(watchId)
    origenTexto.value = 'Siguiendo ubicación...'
    isTracking.value = true
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updateUserLocation(pos.coords.latitude, pos.coords.longitude)
        origenTexto.value = 'Siguiendo ubicación en tiempo real'
        if (routingControl) updateRouteWithNewLocation(pos.coords.latitude, pos.coords.longitude)
      },
      (err) => { console.error('Error en seguimiento:', err); stopTracking(); alert('Error en el seguimiento') },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    )
  }

  function stopTracking() {
    if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null }
    isTracking.value = false
    if (origenTexto.value.includes('Siguiendo')) origenTexto.value = 'Mi ubicación actual'
  }

  function updateUserLocation(lat, lng) {
    origenCoords = [lat, lng]
    if (userMarker) map.removeLayer(userMarker)
    const userIcon = L.divIcon({
      className: 'custom-user-icon',
      html: `<div class="marker-pin user-pin ${isTracking.value ? 'tracking' : ''}"><div class="marker-icon">${isTracking.value ? '🎯' : '📍'}</div></div>`,
      iconSize: [35, 45],
      iconAnchor: [17.5, 45],
      popupAnchor: [0, -45]
    })
    userMarker = L.marker(origenCoords, { icon: userIcon }).addTo(map)
      .bindPopup(`<div class="custom-popup"><h3>Tu ubicación</h3><p>${isTracking.value ? '🎯 Siguiendo en tiempo real' : '📍 Punto de partida'}</p></div>`)
    userMarker.bindTooltip(isTracking.value ? 'Siguiendo...' : 'Tu ubicación', {
      permanent: true, direction: 'top', offset: [0, -50],
      className: `custom-tooltip user-tooltip ${isTracking.value ? 'tracking' : ''}`
    })
    if (!routingControl || !isTracking.value) {
      const bounds = L.latLngBounds([origenCoords, [barberLat, barberLng]])
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }

  function updateRouteWithNewLocation(lat, lng) {
    if (!routingControl) return
    routingControl.setWaypoints([L.latLng(lat, lng), L.latLng(barberLat, barberLng)])
  }

  async function calculateRoute() {
    let startLatLng = null
    if (origenCoords) {
      startLatLng = L.latLng(origenCoords[0], origenCoords[1])
    } else if (origenTexto.value && origenTexto.value !== 'Obteniendo ubicación...') {
      const coords = await getCoordsFromAddress(origenTexto.value)
      if (!coords) { alert('No se encontró la dirección.'); return }
      startLatLng = L.latLng(coords[0], coords[1])
      if (userMarker) map.removeLayer(userMarker)
      const searchIcon = L.divIcon({
        className: 'custom-search-icon',
        html: `<div class="marker-pin search-pin"><div class="marker-icon">🔍</div></div>`,
        iconSize: [35, 45], iconAnchor: [17.5, 45], popupAnchor: [0, -45]
      })
      userMarker = L.marker([coords[0], coords[1]], { icon: searchIcon }).addTo(map)
        .bindPopup(`<div class="custom-popup"><h3>Punto de inicio</h3><p>📍 ${origenTexto.value}</p></div>`)
      userMarker.bindTooltip(origenTexto.value, { permanent: true, direction: 'top', offset: [0, -50], className: 'custom-tooltip user-tooltip' })
    } else {
      alert('Por favor ingresa un punto de partida o usa tu ubicación.')
      return
    }
    if (routingControl) map.removeControl(routingControl)
    routingControl = L.Routing.control({
      waypoints: [startLatLng, L.latLng(barberLat, barberLng)],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: { styles: [{ color: '#ee6f38', weight: 5, opacity: 0.85 }] },
      createMarker: () => null,
      show: false,
    }).addTo(map)
    routingControl.on('routesfound', (e) => {
      const route = e.routes[0]
      const distance = (route.summary.totalDistance / 1000).toFixed(1)
      const timeMin = Math.round(route.summary.totalTime / 60)
      const popup = L.popup().setLatLng(startLatLng)
        .setContent(`<div class="route-info"><h3>🗺️ Ruta calculada</h3><p>📏 ${distance} km</p><p>⏱️ ~${timeMin} minutos</p></div>`)
        .openOn(map)
    })
  }

  function clearRoute() {
    if (routingControl) { map.removeControl(routingControl); routingControl = null }
    if (userMarker) { map.removeLayer(userMarker); userMarker = null }
    stopTracking()
    origenCoords = null
    origenTexto.value = ''
    map.setView([barberLat, barberLng], 14)
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.ubicacion-section {
  background: #0f0f0f;
  padding: 80px 40px;
}

/* Encabezado */
.seccion-header { max-width: 600px; margin: 0 auto 40px; }

.seccion-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: #ee6f38;
  text-transform: uppercase;
  margin-bottom: 16px;
  font-family: 'DM Sans', sans-serif;
}

.eyebrow-line {
  display: inline-block;
  width: 32px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ee6f38);
}
.eyebrow-line:last-child { background: linear-gradient(90deg, #ee6f38, transparent); }

.seccion-titulo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  font-weight: 400;
  color: white;
  letter-spacing: 2px;
  margin: 0 0 14px;
  line-height: 1;
}

.titulo-accent { color: #ee6f38; }

.seccion-desc {
  color: rgba(255,255,255,0.45);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 20px;
  font-family: 'DM Sans', sans-serif;
}

.titulo-subline {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #ee6f38, #ff9a6c);
  border-radius: 2px;
  margin: 0 auto;
}

/* Mapa */
.mapa-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid rgba(238,111,56,0.25);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
}

.map {
  width: 100%;
  height: 500px;
  position: relative;
}

/* Controles flotantes */
.map-controls {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1000;
  pointer-events: none;
}

.controls-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
}

.input-wrapper {
  position: relative;
  width: 260px;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #ee6f38;
  font-size: 13px;
}

.input-floating {
  width: 100%;
  padding: 10px 12px 10px 34px;
  border: 1.5px solid rgba(238,111,56,0.4);
  border-radius: 10px;
  font-size: 0.83rem;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  outline: none;
  transition: all 0.3s ease;
  font-family: 'DM Sans', sans-serif;
  color: #1a1a1a;
}

.input-floating::placeholder { color: #aaa; }

.input-floating:focus {
  border-color: #ee6f38;
  box-shadow: 0 4px 16px rgba(238,111,56,0.25);
}

.buttons-row {
  display: flex;
  gap: 6px;
}

.btn-floating {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.3px;
  font-family: 'DM Sans', sans-serif;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.btn-location {
  background: rgba(41,128,185,0.92);
  color: white;
  flex: 1;
}
.btn-location:hover { background: rgba(41,128,185,1); transform: translateY(-1px); }

.btn-route {
  background: rgba(238,111,56,0.92);
  color: white;
  flex: 1;
}
.btn-route:hover { background: rgba(213,94,45,1); transform: translateY(-1px); }

.btn-tracking {
  background: rgba(100,100,100,0.88);
  color: white;
  flex: 1;
}
.btn-tracking:hover { background: rgba(80,80,80,1); transform: translateY(-1px); }
.btn-tracking.active { background: rgba(231,76,60,0.9); }

.btn-clear {
  background: rgba(231,76,60,0.9);
  color: white;
  font-size: 0.68rem;
  padding: 6px 10px;
  align-self: flex-start;
}
.btn-clear:hover { background: rgba(192,57,43,1); transform: translateY(-1px); }

/* Marcadores Leaflet */
:deep(.custom-barber-icon), :deep(.custom-user-icon), :deep(.custom-search-icon) {
  background: none;
  border: none;
}

:deep(.marker-pin) {
  position: relative;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 16px rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.barber-pin) { background: linear-gradient(135deg, #ee6f38, #d55e2d); width: 40px; height: 40px; }
:deep(.user-pin) { background: linear-gradient(135deg, #3498db, #2980b9); width: 35px; height: 35px; }
:deep(.search-pin) { background: linear-gradient(135deg, #27ae60, #229954); width: 35px; height: 35px; }

:deep(.marker-icon) {
  transform: rotate(45deg);
  font-size: 18px;
  color: white;
}

:deep(.custom-tooltip) {
  background: rgba(10,10,10,0.85);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

:deep(.barber-tooltip) { background: linear-gradient(135deg, #ee6f38, #d55e2d); }
:deep(.barber-tooltip::before) { border-top-color: #ee6f38; }
:deep(.user-tooltip) { background: linear-gradient(135deg, #3498db, #2980b9); }
:deep(.user-tooltip::before) { border-top-color: #3498db; }

:deep(.custom-popup h3) { margin: 0 0 6px; color: #1a1a1a; font-size: 15px; font-weight: 700; }
:deep(.custom-popup p) { margin: 0; color: #666; font-size: 13px; }

:deep(.route-info) {
  text-align: center;
  padding: 10px;
  background: linear-gradient(135deg, #ee6f38, #d55e2d);
  color: white;
  border-radius: 8px;
}
:deep(.route-info h3) { margin: 0 0 8px; font-size: 15px; }
:deep(.route-info p) { margin: 3px 0; font-size: 13px; }

/* Info rápida */
.info-rapida {
  max-width: 1200px;
  margin: 24px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background: #141414;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 20px 32px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 28px;
  flex: 1;
  min-width: 200px;
}

.info-icon-wrap {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(238,111,56,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ee6f38;
  font-size: 15px;
  flex-shrink: 0;
}

.info-label {
  display: block;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
  margin-bottom: 3px;
  font-family: 'DM Sans', sans-serif;
}

.info-valor {
  display: block;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
}

.info-sep {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.08);
}

/* Responsive */
@media (max-width: 768px) {
  .ubicacion-section { padding: 60px 16px; }
  .map { height: 400px; }
  .map-controls { left: 10px; right: 10px; }
  .input-wrapper { width: 100%; }
  .buttons-row { flex-direction: column; }
  .info-rapida { flex-direction: column; gap: 16px; padding: 20px; }
  .info-sep { width: 40px; height: 1px; }
  .info-item { padding: 0; }
}
</style>