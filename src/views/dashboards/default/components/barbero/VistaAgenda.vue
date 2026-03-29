<template>
  <v-container fluid class="pa-6">
    <!-- ═══════════════════════════════════════
         HEADER CON STATS
    ═══════════════════════════════════════ -->
    <div :style="{ borderRadius: '14px', overflow: 'hidden', marginBottom: '24px', background: isDark ? 'linear-gradient(135deg, #161d2f, #1e293b)' : 'linear-gradient(135deg, #1a1a2e, #252540)', border: `1px solid ${isDark ? '#1f2937' : 'rgba(238,111,56,0.15)'}`, position: 'relative' }">
      <!-- Decoración -->
      <div style="position: absolute; top: -40px; right: -20px; width: 140px; height: 140px; border-radius: 50%; background: rgba(238,111,56,0.06); pointer-events: none;"></div>
      <div style="position: absolute; bottom: -30px; left: 30%; width: 100px; height: 100px; border-radius: 50%; background: rgba(238,111,56,0.04); pointer-events: none;"></div>

      <div style="padding: 24px 28px; position: relative; z-index: 1;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <!-- Título -->
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 14px rgba(238,111,56,0.3);">
              <i class="fas fa-scissors" style="color: white;"></i>
            </div>
            <div>
              <h1 style="font-size: 1.3rem; font-weight: 800; color: white; margin: 0;">Mi Agenda</h1>
              <p style="font-size: 0.82rem; color: rgba(255,255,255,0.5); margin: 0;">{{ fechaHoyTexto }}</p>
            </div>
          </div>

          <!-- Stats del día -->
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <!-- Citas hoy -->
            <div style="text-align: center; padding: 8px 20px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); min-width: 80px;">
              <p style="font-size: 1.5rem; font-weight: 800; color: #ff9a6c; margin: 0; line-height: 1.2;">{{ estadisticasHoy.total }}</p>
              <p style="font-size: 0.68rem; color: rgba(255,255,255,0.5); margin: 0; font-weight: 600;">Citas Hoy</p>
            </div>
            <!-- Completadas -->
            <div style="text-align: center; padding: 8px 20px; border-radius: 10px; background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.15); min-width: 80px;">
              <p style="font-size: 1.5rem; font-weight: 800; color: #81c784; margin: 0; line-height: 1.2;">{{ estadisticasHoy.completadas }}</p>
              <p style="font-size: 0.68rem; color: rgba(255,255,255,0.5); margin: 0; font-weight: 600;">Completadas</p>
            </div>
            <!-- Ganado -->
            <div style="text-align: center; padding: 8px 20px; border-radius: 10px; background: rgba(33,150,243,0.1); border: 1px solid rgba(33,150,243,0.15); min-width: 80px;">
              <p style="font-size: 1.5rem; font-weight: 800; color: #90caf9; margin: 0; line-height: 1.2;">${{ estadisticasHoy.ganado }}</p>
              <p style="font-size: 0.68rem; color: rgba(255,255,255,0.5); margin: 0; font-weight: 600;">Ganado Hoy</p>
            </div>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div style="margin-top: 18px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.4);">Progreso del día</span>
            <span style="font-size: 0.75rem; color: #ff9a6c; font-weight: 700;">{{ estadisticasHoy.porcentaje }}%</span>
          </div>
          <div style="height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
            <div
              :style="{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #ee6f38, #ff9a6c)',
                width: estadisticasHoy.porcentaje + '%',
                transition: 'width 1s ease',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════
         TABS
    ═══════════════════════════════════════ -->
    <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', background: cardBg }">
      <!-- Tab headers -->
      <div :style="{ display: 'flex', borderBottom: `1px solid ${cardBorder}`, background: headerBg, overflowX: 'auto' }">
        <span
          v-for="tab in tabs"
          :key="tab.value"
          :style="{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '16px 24px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '800',
            color: tabActual === tab.value ? '#ee6f38' : txtSecondary,
            borderBottom: tabActual === tab.value ? '3px solid #ee6f38' : '3px solid transparent',
            background: tabActual === tab.value ? (isDark ? 'rgba(238,111,56,0.05)' : 'white') : 'transparent',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap',
          }"
          @click="tabActual = tab.value"
        >
          <i :class="tab.icon" :style="{ fontSize: '13px', color: tabActual === tab.value ? '#ee6f38' : (isDark ? '#4b5563' : '#aaa') }"></i>
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            :style="{
              padding: '1px 8px', borderRadius: '10px', fontSize: '0.68rem', fontWeight: '800',
              background: tabActual === tab.value ? (isDark ? 'rgba(238,111,56,0.2)' : '#fff3e0') : (isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'),
              color: tabActual === tab.value ? '#ee6f38' : (isDark ? '#4b5563' : '#aaa'),
              marginLeft: '4px'
            }"
          >
            {{ tab.count }}
          </span>
        </span>
      </div>

      <!-- Loading -->
      <div v-if="cargando" style="text-align: center; padding: 60px 20px;">
        <v-progress-circular indeterminate color="#ee6f38" size="48" width="3" />
        <p :style="{ margin: '16px 0 0', color: txtSecondary, fontSize: '0.88rem' }">Cargando agenda...</p>
      </div>

      <!-- ═══ TAB HOY ═══ -->
      <div v-else-if="tabActual === 'hoy'" style="padding: 24px;">
        <!-- Empty -->
        <div v-if="citasHoy.length === 0" style="text-align: center; padding: 64px 20px;">
          <div :style="{ width: '80px', height: '80px', borderRadius: '50%', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#ee6f38' }">
            <i class="fas fa-calendar-check"></i>
          </div>
          <h3 :style="{ fontWeight: '800', color: txtPrimary, margin: '0 0 8px', fontSize: '1.2rem' }">No tienes citas para hoy</h3>
          <p :style="{ color: txtSecondary, margin: 0, fontSize: '0.9rem' }">¡Disfruta tu día libre! 😎</p>
        </div>

        <!-- Lista de citas -->
        <div v-else style="display: flex; flex-direction: column; gap: 16px;">
          <div
            v-for="cita in citasHoy"
            :key="cita.id_cita"
            :style="{ border: `1px solid ${cardBorder}`, borderRadius: '14px', overflow: 'hidden', transition: 'all 0.25s ease', background: headerBg, borderLeftWidth: '5px', borderLeftColor: getColorInline(cita.estado) }"
            class="cita-card"
          >
            <div style="padding: 20px;">
              <!-- Header de la cita -->
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <!-- Hora -->
                  <span
                    :style="{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '800',
                      background: isDark ? 'rgba(238,111,56,0.15)' : getColorBg(cita.estado), color: isDark ? '#ee6f38' : getColorInline(cita.estado),
                    }"
                  >
                    <i class="fas fa-clock" style="font-size: 12px;"></i>
                    {{ formatearHora(cita.hora) }}
                  </span>
                  <!-- Estado -->
                  <span
                    :style="{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '5px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800',
                      background: isDark ? 'rgba(255,255,255,0.05)' : getColorBg(cita.estado), color: isDark ? '#f3f4f6' : getColorInline(cita.estado),
                      textTransform: 'uppercase', letterSpacing: '0.6px',
                    }"
                  >
                    <i :class="getIconoEstado(cita.estado)" style="font-size: 10px;"></i>
                    {{ cita.estado }}
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div style="display: flex; gap: 24px; flex-wrap: wrap;">
                <!-- Cliente -->
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 220px;">
                  <div :style="{ width: '42px', height: '42px', borderRadius: '12px', background: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', color: '#2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }">
                    <i class="fas fa-user"></i>
                  </div>
                  <div>
                    <p :style="{ fontSize: '0.72rem', color: txtSecondary, margin: 0, fontWeight: '700', textTransform: 'uppercase' }">Cliente</p>
                    <p :style="{ fontSize: '1rem', fontWeight: '800', color: txtPrimary, margin: 0 }">{{ getNombreCliente(cita.cliente) }}</p>
                  </div>
                </div>

                <!-- Servicio -->
                <div style="display: flex; align-items: center; gap: 12px; flex: 1; min-width: 220px;">
                  <div :style="{ width: '42px', height: '42px', borderRadius: '12px', background: isDark ? 'rgba(156,39,176,0.1)' : '#f3e5f5', color: '#9c27b0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }">
                    <i class="fas fa-scissors"></i>
                  </div>
                  <div>
                    <p :style="{ fontSize: '0.72rem', color: txtSecondary, margin: 0, fontWeight: '700', textTransform: 'uppercase' }">Servicio</p>
                    <p :style="{ fontSize: '1rem', fontWeight: '800', color: txtPrimary, margin: 0 }">{{ getNombreServicio(cita.servicio) }}</p>
                    <p :style="{ fontSize: '0.85rem', fontWeight: '800', color: '#4caf50', margin: 0 }">
                      ${{ getPrecioServicio(cita.servicio) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Acción -->
              <div style="margin-top: 20px;">
                <!-- Completar -->
                <v-btn
                  v-if="cita.estado === 'agendada'"
                  block
                  height="44"
                  rounded="lg"
                  color="#ee6f38"
                  elevation="0"
                  class="text-none font-weight-bold"
                  @click="abrirModalCompletar(cita)"
                >
                  <i class="fas fa-check-circle mr-2"></i>
                  Marcar como Completada
                </v-btn>

                <!-- Ya completada -->
                <div
                  v-else-if="cita.estado === 'completada'"
                  :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', background: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e9', color: '#4caf50', fontSize: '0.88rem', fontWeight: '700' }"
                >
                  <i class="fas fa-check-circle" style="font-size: 15px;"></i>
                  Servicio finalizado con éxito
                </div>

                <!-- Cancelada -->
                <div
                  v-else-if="cita.estado === 'cancelada'"
                  :style="{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', background: isDark ? 'rgba(239,83,80,0.1)' : '#ffebee', color: '#ef5350', fontSize: '0.88rem', fontWeight: '700' }"
                >
                  <i class="fas fa-times-circle" style="font-size: 15px;"></i>
                  Esta cita fue cancelada
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TAB PRÓXIMAS ═══ -->
      <div v-else-if="tabActual === 'proximas'" style="padding: 24px;">
        <!-- Empty -->
        <div v-if="citasProximas.length === 0" style="text-align: center; padding: 64px 20px;">
          <div :style="{ width: '80px', height: '80px', borderRadius: '50%', background: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', color: '#2196f3' }">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <h3 :style="{ fontWeight: '800', color: txtPrimary, margin: '0 0 8px' }">No hay citas próximas</h3>
          <p :style="{ color: txtSecondary, margin: 0, fontSize: '0.9rem' }">Tu agenda está libre por ahora</p>
        </div>

        <!-- Grid de citas -->
        <v-row v-else>
          <v-col v-for="cita in citasProximas" :key="cita.id_cita" cols="12" sm="6" lg="4">
            <div :style="{ border: `1px solid ${cardBorder}`, borderRadius: '14px', padding: '20px', background: headerBg, height: '100%', transition: 'all 0.25s ease' }" class="cita-card">
              <!-- Fecha y hora -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', background: isDark ? 'rgba(156,39,176,0.15)' : '#f3e5f5', color: isDark ? '#ce93d8' : '#6a1b9a', fontSize: '0.82rem', fontWeight: '800' }">
                  <i class="fas fa-calendar" style="font-size: 11px;"></i>
                  {{ formatearFechaCorta(cita.fecha) }}
                </span>
                <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '8px', background: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', color: isDark ? '#90caf9' : '#1565c0', fontSize: '0.78rem', fontWeight: '800' }">
                  <i class="fas fa-clock" style="font-size: 10px;"></i>
                  {{ formatearHora(cita.hora) }}
                </span>
              </div>

              <!-- Cliente -->
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <i class="fas fa-user" :style="{ fontSize: '13px', color: isDark ? '#90caf9' : '#1565c0' }"></i>
                <span :style="{ fontWeight: '800', fontSize: '0.92rem', color: txtPrimary }">{{ getNombreCliente(cita.cliente) }}</span>
              </div>

              <!-- Servicio -->
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <i class="fas fa-scissors" :style="{ fontSize: '13px', color: isDark ? '#ce93d8' : '#6a1b9a' }"></i>
                <span :style="{ fontSize: '0.88rem', color: txtSecondary, fontWeight: '500' }">{{ getNombreServicio(cita.servicio) }}</span>
              </div>

              <v-divider :style="{ borderColor: cardBorder, opacity: 0.1, marginBottom: '12px' }" />

              <!-- Precio -->
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-dollar-sign" style="font-size: 13px; color: #4caf50;"></i>
                <span style="font-weight: 900; color: #4caf50; font-size: 1rem;">${{ getPrecioServicio(cita.servicio) }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>

      <!-- ═══ TAB HISTORIAL ═══ -->
      <div v-else-if="tabActual === 'historial'" style="padding: 24px;">
        <!-- Filtro -->
        <div style="margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
          <i class="fas fa-filter" :style="{ color: txtSecondary, fontSize: '14px' }"></i>
          <v-select
            v-model="filtroHistorial"
            :items="opcionesFiltroHistorial"
            label="Filtrar por estado"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            hide-details
            style="max-width: 260px;"
          />
        </div>

        <!-- Stats del historial -->
        <v-row class="mb-8">
          <v-col v-for="stat in statsHistorial" :key="stat.label" cols="6" md="3">
            <div
              :style="{
                textAlign: 'center', padding: '20px 10px', borderRadius: '14px',
                background: isDark ? 'rgba(255,255,255,0.02)' : stat.bg, border: `1px solid ${isDark ? cardBorder : stat.border}`,
              }"
            >
              <div :style="{ width: '36px', height: '36px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }">
                <i :class="stat.icon" :style="{ fontSize: '16px', color: stat.color }"></i>
              </div>
              <p :style="{ fontSize: '1.6rem', fontWeight: '900', color: isDark ? '#f3f4f6' : stat.color, margin: '0 0 2px', lineHeight: '1.2' }">
                {{ stat.value }}
              </p>
              <p :style="{ fontSize: '0.72rem', color: txtSecondary, margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }">{{ stat.label }}</p>
            </div>
          </v-col>
        </v-row>

        <!-- Empty -->
        <div v-if="citasHistorialFiltradas.length === 0" style="text-align: center; padding: 48px 20px;">
          <div :style="{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px', color: isDark ? '#374151' : '#ccc' }">
            <i class="fas fa-inbox"></i>
          </div>
          <p :style="{ fontWeight: '800', color: txtPrimary, margin: 0 }">No hay registros con este filtro</p>
        </div>

        <!-- Tabla -->
        <v-card v-else variant="outlined" :style="{ borderColor: cardBorder, borderRadius: '12px', background: isDark ? 'transparent' : 'white' }">
          <v-data-table
            :headers="headersHistorial"
            :items="citasHistorialFiltradas"
            :items-per-page="10"
            hover
            :style="{ background: 'transparent' }"
          >
            <template v-slot:item.fecha="{ item }">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div :style="{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.08)', color: '#1976d2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 }">
                  <i class="far fa-calendar"></i>
                </div>
                <div>
                  <p :style="{ fontWeight: '800', fontSize: '0.88rem', color: txtPrimary, margin: 0 }">{{ formatearFechaCorta(item.fecha) }}</p>
                  <p :style="{ fontSize: '0.72rem', color: txtSecondary, margin: 0, textTransform: 'capitalize' }">{{ getDiaSemana(item.fecha) }}</p>
                </div>
              </div>
            </template>

            <template v-slot:item.hora="{ item }">
              <span :style="{ padding: '5px 12px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: txtPrimary, fontSize: '0.8rem', fontWeight: '800' }">
                {{ formatearHora(item.hora) }}
              </span>
            </template>

            <template v-slot:item.cliente="{ item }">
              <span :style="{ fontWeight: '800', fontSize: '0.92rem', color: txtPrimary }">{{ getNombreCliente(item.cliente) }}</span>
            </template>

            <template v-slot:item.servicio="{ item }">
              <div>
                <p :style="{ fontSize: '0.88rem', color: txtPrimary, margin: 0, fontWeight: '600' }">{{ getNombreServicio(item.servicio) }}</p>
                <p style="font-size: 0.8rem; color: #4caf50; font-weight: 800; margin: 0;">${{ getPrecioServicio(item.servicio) }}</p>
              </div>
            </template>

            <template v-slot:item.estado="{ item }">
              <span
                :style="{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 12px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '900',
                  background: isDark ? 'rgba(255,255,255,0.05)' : getColorBg(item.estado), color: isDark ? (item.estado === 'completada' ? '#81c784' : '#ef5350') : getColorInline(item.estado),
                  textTransform: 'uppercase', letterSpacing: '0.5px'
                }"
              >
                <i :class="getIconoEstado(item.estado)" style="font-size: 10px;"></i>
                {{ item.estado }}
              </span>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </v-card>

    <!-- ═══════════════════════════════════════
         MODAL COMPLETAR
    ═══════════════════════════════════════ -->
    <v-dialog v-model="modalCompletar" max-width="480" persistent>
      <v-card rounded="xl" :style="{ background: isDark ? '#0f172a' : 'white', overflow: 'hidden' }">
        <!-- Header verde -->
        <div style="padding: 24px; background: linear-gradient(135deg, #2e7d32, #43a047); color: white; display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px;">
            <i class="fas fa-check-circle"></i>
          </div>
          <div>
            <p style="font-weight: 900; font-size: 1.15rem; margin: 0;">Finalizar Servicio</p>
            <p style="font-size: 0.82rem; opacity: 0.9; margin: 0; font-weight: 500;">Confirma que el trabajo está terminado</p>
          </div>
        </div>

        <div style="padding: 28px;">
          <p :style="{ fontSize: '1rem', color: txtPrimary, margin: '0 0 20px', fontWeight: '500' }">¿Has terminado de atender a este cliente?</p>

          <!-- Info de la cita -->
          <v-card variant="tonal" border :color="isDark ? 'indigo' : ''" rounded="lg" class="pa-4 mb-5" :style="{ background: isDark ? 'rgba(30,41,59,0.5)' : '#f8f9fa' }">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <i class="fas fa-user" style="font-size: 14px; color: #1565c0; width: 20px;"></i>
              <span :style="{ fontSize: '0.92rem', color: txtPrimary }"><strong>Cliente:</strong> {{ getNombreCliente(citaSeleccionada.cliente) }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <i class="fas fa-scissors" style="font-size: 14px; color: #9c27b0; width: 20px;"></i>
              <span :style="{ fontSize: '0.92rem', color: txtPrimary }"><strong>Servicio:</strong> {{ getNombreServicio(citaSeleccionada.servicio) }}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <i class="fas fa-clock" style="font-size: 14px; color: #ee6f38; width: 20px;"></i>
              <span :style="{ fontSize: '0.92rem', color: txtPrimary }"><strong>Hora:</strong> {{ formatearHora(citaSeleccionada.hora) }}</span>
            </div>
            <v-divider class="my-3" :style="{ opacity: 0.1 }" />
            <div style="display: flex; align-items: center; gap: 12px;">
              <i class="fas fa-coins" style="font-size: 14px; color: #4caf50; width: 20px;"></i>
              <span :style="{ fontSize: '1.2rem', fontWeight: '900', color: '#4caf50' }">${{ getPrecioServicio(citaSeleccionada.servicio) }}</span>
            </div>
          </v-card>

          <!-- Info -->
          <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: isDark ? 'rgba(33,150,243,0.1)' : '#e3f2fd', borderRadius: '10px' }">
            <i class="fas fa-info-circle" style="color: #2196f3; font-size: 14px;"></i>
            <p :style="{ fontSize: '0.82rem', color: isDark ? '#90caf9' : '#1565c0', margin: 0, fontWeight: '600' }">Esta acción no se puede deshacer una vez finalizada.</p>
          </div>
        </div>

        <!-- Botones -->
        <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 28px', borderTop: `1px solid ${cardBorder}`, background: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' }">
          <v-btn
            variant="text"
            rounded="lg"
            class="text-none font-weight-bold"
            :color="txtSecondary"
            @click="cerrarModalCompletar"
          >
            Ahora no
          </v-btn>
          <v-btn
            rounded="lg"
            color="success"
            class="text-none font-weight-bold px-6"
            elevation="0"
            :loading="cargandoAccion"
            @click="confirmarCompletar()"
          >
            Sí, finalizar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="4000" location="top" rounded="xl" elevation="10">
      <div style="display: flex; align-items: center; gap: 10px; padding: 4px 8px;">
        <i :class="snackbarIcon" style="font-size: 18px;"></i>
        <span style="font-weight: 800; font-size: 0.95rem;">{{ snackbarText }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCitaStore } from '@/stores/cita'
import { useServiceStore } from '@/stores/services'
import { useAuthStore } from '@/stores/auth'
import { useCustomizerStore } from '@/stores/customizer'
import api from '@/plugins/axios'

const citaStore = useCitaStore()
const serviceStore = useServiceStore()
const authStore = useAuthStore()
const customizer = useCustomizerStore()

const isDark = computed(() => customizer.activeTheme === 'DarkTheme');
const tabActual = ref('hoy')
const cargando = ref(false)
const cargandoAccion = ref(false)
const modalCompletar = ref(false)
const citaSeleccionada = ref(null)
const filtroHistorial = ref('todas')
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const snackbarIcon = ref('fas fa-check-circle')

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');

const opcionesFiltroHistorial = [
  { title: 'Todas', value: 'todas' },
  { title: 'Completadas', value: 'completada' },
  { title: 'Canceladas', value: 'cancelada' }
]

const headersHistorial = [
  { title: 'Fecha', key: 'fecha' },
  { title: 'Hora', key: 'hora' },
  { title: 'Cliente', key: 'cliente' },
  { title: 'Servicio', key: 'servicio' },
  { title: 'Estado', key: 'estado' }
]

// Tabs config
const tabs = computed(() => [
  { value: 'hoy', label: 'Hoy', icon: 'fas fa-calendar-day', count: citasHoy.value.length },
  { value: 'proximas', label: 'Próximas', icon: 'fas fa-calendar-alt', count: citasProximas.value.length },
  { value: 'historial', label: 'Historial', icon: 'fas fa-history', count: 0 },
])

// Fecha hoy texto
const fechaHoyTexto = computed(() => {
  return new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

// Mis citas
const misCitas = computed(() => {
  if (!Array.isArray(citaStore.citas) || !authStore.user) return []
  return citaStore.citas.filter(cita => cita.barbero?.id === authStore.user.id)
})

const citasHoy = computed(() => {
  const hoy = new Date()
  const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
  return misCitas.value.filter(c => c.fecha.split('T')[0] === fechaHoy).sort((a, b) => a.hora.localeCompare(b.hora))
})

const citasProximas = computed(() => {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)
  return misCitas.value
    .filter(c => {
      if (c.estado !== 'agendada') return false
      const [y, m, d] = c.fecha.split('T')[0].split('-')
      return new Date(y, m - 1, d) > hoy
    })
    .sort((a, b) => new Date(`${a.fecha} ${a.hora}`).getTime() - new Date(`${b.fecha} ${b.hora}`).getTime())
    .slice(0, 12)
})

const citasHistorial = computed(() => {
  return misCitas.value
    .filter(c => c.estado === 'completada' || c.estado === 'cancelada')
    .sort((a, b) => new Date(`${b.fecha} ${b.hora}`).getTime() - new Date(`${a.fecha} ${a.hora}`).getTime())
})

const citasHistorialFiltradas = computed(() => {
  if (filtroHistorial.value === 'todas') return citasHistorial.value
  return citasHistorial.value.filter(c => c.estado === filtroHistorial.value)
})

const estadisticasHoy = computed(() => {
  const total = citasHoy.value.length
  const completadas = citasHoy.value.filter(c => c.estado === 'completada').length
  const ganado = citasHoy.value.filter(c => c.estado === 'completada').reduce((s, c) => s + (parseFloat(c.servicio?.precio || 0) || 0), 0)
  return { total, completadas, ganado: ganado.toFixed(0), porcentaje: total > 0 ? Math.round((completadas / total) * 100) : 0 }
})

const estadisticasHistorial = computed(() => {
  const total = citasHistorial.value.length
  const completadas = citasHistorial.value.filter(c => c.estado === 'completada').length
  const canceladas = citasHistorial.value.filter(c => c.estado === 'cancelada').length
  const totalGanado = citasHistorial.value.filter(c => c.estado === 'completada').reduce((s, c) => s + (parseFloat(c.servicio?.precio || 0) || 0), 0)
  return { total, completadas, canceladas, totalGanado: totalGanado.toFixed(0) }
})

const statsHistorial = computed(() => [
  { label: 'Total citas', value: estadisticasHistorial.value.total, icon: 'fas fa-calendar', color: '#ee6f38', bg: '#fff3e0', border: '#ffe0b2' },
  { label: 'Completadas', value: estadisticasHistorial.value.completadas, icon: 'fas fa-check-circle', color: '#2e7d32', bg: '#e8f5e9', border: '#c8e6c9' },
  { label: 'Canceladas', value: estadisticasHistorial.value.canceladas, icon: 'fas fa-times-circle', color: '#c62828', bg: '#ffebee', border: '#ffcdd2' },
  { label: 'Total ganado', value: '$' + estadisticasHistorial.value.totalGanado, icon: 'fas fa-dollar-sign', color: '#1565c0', bg: '#e3f2fd', border: '#bbdefb' },
])

// Helpers
const cargarDatos = async () => {
  cargando.value = true
  try { await Promise.all([citaStore.obtenerCitas(), serviceStore.getServices()]) }
  catch (e) { console.error(e) }
  finally { cargando.value = false }
}

const formatearFechaCorta = (f) => {
  const [y, m, d] = f.split('T')[0].split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getDiaSemana = (f) => {
  const [y, m, d] = f.split('T')[0].split('-')
  return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long' })
}

const formatearHora = (h) => {
  const [hr, mn] = h.split(':')
  const d = new Date(); d.setHours(parseInt(hr), parseInt(mn))
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })
}

const getNombreCliente = (c) => c ? `${c.nombre} ${c.apellido}` : 'No disponible'
const getNombreServicio = (s) => s?.nombre || 'No disponible'
const getPrecioServicio = (s) => { const p = parseFloat(s?.precio || 0); return isNaN(p) ? '0' : p.toFixed(0) }

const getColorInline = (e) => ({ agendada: '#ee6f38', completada: '#2e7d32', cancelada: '#c62828' }[e] || '#888')
const getColorBg = (e) => ({ agendada: '#fff3e0', completada: '#e8f5e9', cancelada: '#ffebee' }[e] || '#f5f5f5')
const getIconoEstado = (e) => ({ agendada: 'fas fa-clock', completada: 'fas fa-check-circle', cancelada: 'fas fa-times-circle' }[e] || 'fas fa-question')

const abrirModalCompletar = (c) => { citaSeleccionada.value = c; modalCompletar.value = true }
const cerrarModalCompletar = () => { modalCompletar.value = false; citaSeleccionada.value = null }

const confirmarCompletar = async () => {
  if (!citaSeleccionada.value) return
  cargandoAccion.value = true
  try {
    await api.patch(`/cita/${citaSeleccionada.value.id_cita}/completar`)
    mostrarNotificacion('¡Servicio completado! 🎉', 'success')
    cerrarModalCompletar()
    await citaStore.obtenerCitas()
  } catch {
    mostrarNotificacion('Error al completar', 'error')
  } finally {
    cargandoAccion.value = false
  }
}

const mostrarNotificacion = (texto, tipo) => {
  snackbarText.value = texto
  snackbarColor.value = tipo
  snackbarIcon.value = tipo === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
  snackbar.value = true
}

onMounted(() => cargarDatos())
</script>

<style scoped>
.cita-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.is-dark .cita-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.v-data-table {
  --v-table-header-color: v-bind("txtPrimary");
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px !important;
  }
}
</style>