
<template>
  <v-container>
    <!-- ═══ HEADER ═══ -->
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #ee6f38, #ff9a6c); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; box-shadow: 0 4px 12px rgba(238,111,56,0.25);">
          <i class="fas fa-box-open"></i>
        </div>
        <div>
          <h2 :style="{ fontSize: '1.25rem', fontWeight: '800', color: txtPrimary, margin: 0 }">Gestión de Productos</h2>
          <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Inventario, publicaciones y ofertas</p>
        </div>
      </div>
      <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0', color: isDark ? '#ffb74d' : '#e65100', fontSize: '0.82rem', fontWeight: '700' }">
        <i class="fas fa-cubes" style="font-size: 10px;"></i>
        {{ productoStore.productos.length }} productos
      </span>
    </div>

    <!-- Loading -->
    <v-progress-linear v-if="productoStore.loading" color="#ee6f38" indeterminate rounded class="mb-4" />

    <!-- Error -->
    <v-alert v-if="productoStore.error" type="error" variant="tonal" rounded="lg" closable class="mb-4">
      {{ productoStore.error }}
    </v-alert>

    <!-- Empty -->
    <div
      v-if="!productoStore.loading && productoStore.productos.length === 0"
      :style="{ textAlign: 'center', padding: '48px 20px', background: headerBg, border: `1px dashed ${cardBorder}`, borderRadius: '12px', marginBottom: '16px' }"
    >
      <div :style="{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', color: '#ee6f38' }">
        <i class="fas fa-box-open"></i>
      </div>
      <p :style="{ fontWeight: '700', color: txtPrimary, margin: '0 0 4px' }">Sin productos</p>
      <p :style="{ fontSize: '0.82rem', color: txtSecondary, margin: 0 }">Registra compras para agregar productos</p>
    </div>

    <!-- ═══ GRID DE PRODUCTOS ═══ -->
    <v-row>
      <v-col v-for="producto in productoStore.productos" :key="producto.id" cols="12" sm="6" md="4" lg="3">
        <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, overflow: 'hidden', height: '100%', display: 'flex', 'flex-direction': 'column', background: cardBg }">
          
          <!-- Imagen -->
          <div style="position: relative; overflow: hidden;">
            <v-img :src="producto.imagenUrl || '/imagenes/logo/logo2.png'" height="175" cover />

            <!-- Badge oferta -->
            <div
              v-if="producto.en_oferta"
              style="position: absolute; top: 10px; left: 0; display: inline-flex; align-items: center; gap: 4px; padding: 4px 12px 4px 8px; border-radius: 0 6px 6px 0; background: #2e7d32; color: white; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;"
            >
              <i class="fas fa-bolt" style="font-size: 9px;"></i>
              {{ producto.dias_oferta || 'Oferta' }}
            </div>

            <!-- Badge stock -->
            <div
              :style="{
                position: 'absolute', top: '10px', right: '10px',
                padding: '3px 8px', borderRadius: '6px',
                fontSize: '0.65rem', fontWeight: '700',
                background: producto.stock > 0 ? '#2e7d32' : '#c62828',
                color: 'white',
              }"
            >
              {{ producto.stock > 0 ? producto.stock + ' uds' : 'Sin stock' }}
            </div>

            <!-- Overlay publicados -->
            <div
              v-if="producto.cantidad_publicada > 0"
              style="position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 10px 6px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; font-size: 0.7rem; font-weight: 700; text-align: right;"
            >
              <i class="fas fa-eye" style="font-size: 9px;"></i>
              {{ producto.cantidad_publicada }} publicados
            </div>
          </div>

          <!-- Info -->
          <div style="padding: 14px 14px 8px; flex: 1; display: flex; flex-direction: column;">
            <!-- Categoría -->
            <span :style="{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', background: isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0', color: isDark ? '#ffb74d' : '#e65100', fontSize: '0.62rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px', width: 'fit-content', marginBottom: '8px' }">
              <i class="fas fa-tag" style="font-size: 7px; margin-right: 3px;"></i>
              {{ producto.categoria?.nombre || 'Sin categoría' }}
            </span>

            <!-- Nombre -->
            <p :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary, lineHeight: '1.3', margin: '0 0 4px', overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': 2, '-webkit-box-orient': 'vertical' }">
              {{ producto.nombre }}
            </p>

            <!-- Descripción -->
            <p :style="{ fontSize: '0.76rem', color: txtSecondary, lineHeight: '1.4', margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', '-webkit-line-clamp': 2, '-webkit-box-orient': 'vertical' }">
              {{ producto.descripcion }}
            </p>

            <!-- Precio -->
            <div style="margin-top: auto;">
              <template v-if="producto.en_oferta">
                <span style="font-size: 1.15rem; font-weight: 800; color: #4caf50;">
                  ${{ Number(producto.precio_oferta).toLocaleString() }}
                </span>
                <span :style="{ fontSize: '0.8rem', color: isDark ? '#4b5563' : '#bbb', textDecoration: 'line-through', marginLeft: '6px' }">
                  ${{ Number(producto.precio_venta).toLocaleString() }}
                </span>
              </template>
              <template v-else>
                <span style="font-size: 1.15rem; font-weight: 800; color: #ee6f38;">
                  ${{ Number(producto.precio_venta).toLocaleString() }}
                </span>
              </template>
            </div>
          </div>

          <!-- ═══ BOTONES DE ACCIÓN ═══ -->
          <div style="padding: 10px 14px 14px; display: flex; flex-wrap: wrap; gap: 8px;">
            <!-- 🟢 Publicar -->
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                background: isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9',
                color: isDark ? '#4caf50' : '#2e7d32',
                fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                border: isDark ? '1px solid rgba(76,175,80,0.25)' : 'none'
              }"
              @click="openPublishDialog(producto)"
            >
              <i class="fas fa-upload" style="font-size: 10px;"></i>
              Publicar
            </span>

            <!-- 🔴 Retirar -->
            <span
              v-if="producto.cantidad_publicada > 0"
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                background: isDark ? 'rgba(239,68,68,0.15)' : '#ffebee',
                color: isDark ? '#f87171' : '#c62828',
                fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                border: isDark ? '1px solid rgba(239,68,68,0.25)' : 'none'
              }"
              @click="retirarPublicacion(producto)"
            >
              <i class="fas fa-eye-slash" style="font-size: 10px;"></i>
              Retirar
            </span>

            <!-- 🟠 Ofertar (Ya manejado parcialmente con isDark en el archivo, pero lo unificamos) -->
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '8px',
                background: producto.en_oferta ? (isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0') : (isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5'),
                color: producto.en_oferta ? (isDark ? '#fbbf24' : '#e65100') : (isDark ? '#9ca3af' : '#888'),
                fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                border: producto.en_oferta ? (isDark ? '1px solid rgba(251,191,36,0.25)' : 'none') : (isDark ? '1px solid rgba(255,255,255,0.1)' : 'none')
              }"
              @click="openOfertaDialog(producto)"
            >
              <i class="fas fa-percent" style="font-size: 10px;"></i>
              {{ producto.en_oferta ? 'En Oferta' : 'Ofertar' }}
            </span>

            <!-- 🔵 Editar -->
            <span
              :style="{
                display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '8px',
                background: isDark ? 'rgba(59,130,246,0.15)' : '#e3f2fd',
                color: isDark ? '#60a5fa' : '#1565c0',
                fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer',
                border: isDark ? '1px solid rgba(59,130,246,0.25)' : 'none'
              }"
              @click="openEditDialog(producto)"
            >
              <i class="fas fa-pen" style="font-size: 10px;"></i>
              Editar
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ═══ DIALOG PUBLICAR ═══ -->
    <v-dialog v-model="showPublishDialog" max-width="420">
      <v-card rounded="lg" :style="{ background: cardBg }">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div :style="{ width: '38px', height: '38px', borderRadius: '10px', background: isDark ? 'rgba(76,175,80,0.15)' : '#e8f5e9', color: isDark ? '#4caf50' : '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }">
              <i class="fas fa-upload"></i>
            </div>
            <div>
              <p :style="{ fontWeight: '800', fontSize: '1.05rem', margin: 0, color: txtPrimary }">Publicar producto</p>
              <p :style="{ fontSize: '0.75rem', color: txtSecondary, margin: 0 }">{{ selectedProduct?.nombre }}</p>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="showPublishDialog = false">
            <i class="fas fa-times" :style="{ color: txtSecondary }"></i>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          <v-text-field
            type="number" v-model.number="publishCantidad" label="Cantidad a publicar"
            variant="outlined" density="comfortable" rounded="lg"
            min="1" :max="availableStock"
            :rules="[v => v > 0 || 'Mayor a 0', v => v <= availableStock || 'Excede stock']"
          >
            <template v-slot:prepend-inner>
              <i class="fas fa-layer-group" style="color: #2e7d32; font-size: 14px;"></i>
            </template>
          </v-text-field>

          <div :style="{ background: isDark ? '#0d111b' : '#f8f8f8', borderRadius: '10px', padding: '12px 14px', marginTop: '8px', border: `1px solid ${cardBorder}` }">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span :style="{ fontSize: '0.78rem', color: txtSecondary }">Stock total</span>
              <span :style="{ fontSize: '0.78rem', fontWeight: '700', color: txtPrimary }">{{ selectedProduct?.stock || 0 }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span :style="{ fontSize: '0.78rem', color: txtSecondary }">Ya publicados</span>
              <span :style="{ fontSize: '0.78rem', fontWeight: '700', color: '#1976d2' }">{{ selectedProduct?.cantidad_publicada || 0 }}</span>
            </div>
            <v-divider class="my-2" />
            <div style="display: flex; justify-content: space-between;">
              <span :style="{ fontSize: '0.78rem', fontWeight: '700', color: txtPrimary }">Disponible</span>
              <span :style="{ fontSize: '0.78rem', fontWeight: '700', color: availableStock > 0 ? '#2e7d32' : '#ff5252' }">{{ availableStock }}</span>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px;">
          <span style="padding: 8px 18px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #666;" @click="showPublishDialog = false">
            Cancelar
          </span>
          <span
            :style="{
              padding: '8px 20px', borderRadius: '8px', cursor: canPublish ? 'pointer' : 'not-allowed',
              fontSize: '0.85rem', fontWeight: '700',
              background: canPublish ? '#e8f5e9' : '#f5f5f5',
              color: canPublish ? '#2e7d32' : '#bdbdbd',
            }"
            @click="canPublish && confirmPublish()"
          >
            <i class="fas fa-upload" style="font-size: 12px; margin-right: 4px;"></i>
            Publicar
          </span>
        </div>
      </v-card>
    </v-dialog>

    <!-- ═══ DIALOG OFERTA ═══ -->
    <v-dialog v-model="showOfertaDialog" max-width="500">
      <v-card rounded="lg">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #fff3e0; color: #e65100; display: flex; align-items: center; justify-content: center; font-size: 15px;">
              <i class="fas fa-percent"></i>
            </div>
            <div>
              <p style="font-weight: 700; font-size: 1.05rem; margin: 0;">Precio y Oferta</p>
              <p style="font-size: 0.75rem; color: #888; margin: 0;">{{ selectedOfertaProduct?.nombre }}</p>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="showOfertaDialog = false">
            <i class="fas fa-times" style="color: #999;"></i>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form ref="ofertaFormRef">
            <v-text-field type="number" v-model.number="ofertaForm.precio_venta" label="Precio Normal" min="0" prefix="$" :rules="[v => !!v || 'Requerido', v => v > 0 || 'Mayor a 0']" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
              <template v-slot:prepend-inner><i class="fas fa-dollar-sign" style="color: #ee6f38; font-size: 14px;"></i></template>
            </v-text-field>

            <v-switch v-model="ofertaForm.en_oferta" color="#4caf50" hide-details class="mb-2">
              <template v-slot:label>
                <span :style="{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', color: txtPrimary }">
                  <i :class="ofertaForm.en_oferta ? 'fas fa-toggle-on' : 'fas fa-toggle-off'" :style="{ color: ofertaForm.en_oferta ? '#4caf50' : '#ccc', fontSize: '14px' }"></i>
                  {{ ofertaForm.en_oferta ? 'Oferta activa' : 'Activar oferta' }}
                </span>
              </template>
            </v-switch>

            <template v-if="ofertaForm.en_oferta">
              <div :style="{ background: isDark ? 'rgba(255,152,0,0.05)' : '#fff8e1', border: `1px solid ${isDark ? 'rgba(255,152,0,0.2)' : '#fff3e0'}`, borderRadius: '10px', padding: '16px' }">
                <v-text-field type="number" v-model.number="ofertaForm.precio_oferta" label="Precio Oferta" min="0" prefix="$" :rules="[v => !!v || 'Requerido', v => v > 0 || 'Mayor a 0', v => v < ofertaForm.precio_venta || 'Menor al normal']" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
                  <template v-slot:prepend-inner><i class="fas fa-tag" style="color: #e65100; font-size: 14px;"></i></template>
                </v-text-field>
                <v-text-field v-model="ofertaForm.dias_oferta" label="Duración (Opcional)" hint="Ej: 3 Días, Solo hoy" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
                  <template v-slot:prepend-inner><i class="fas fa-calendar-day" style="color: #e65100; font-size: 14px;"></i></template>
                </v-text-field>
                <v-textarea v-model="ofertaForm.informacion_oferta" label="Info adicional (Opcional)" variant="outlined" density="comfortable" rounded="lg" rows="2">
                  <template v-slot:prepend-inner><i class="fas fa-info-circle" style="color: #e65100; font-size: 14px;"></i></template>
                </v-textarea>
              </div>
            </template>
          </v-form>
        </v-card-text>
        <v-divider />
        <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px;">
          <span style="padding: 8px 18px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #666;" @click="showOfertaDialog = false">Cancelar</span>
          <span style="padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; background: #fff3e0; color: #e65100;" @click="confirmOferta">
            <i class="fas fa-save" style="font-size: 12px; margin-right: 4px;"></i> Guardar
          </span>
        </div>
      </v-card>
    </v-dialog>

    <!-- ═══ DIALOG EDITAR ═══ -->
    <v-dialog v-model="showEditDialog" max-width="560">
      <v-card rounded="lg">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #e3f2fd; color: #1565c0; display: flex; align-items: center; justify-content: center; font-size: 15px;">
              <i class="fas fa-pen"></i>
            </div>
            <div>
              <p style="font-weight: 700; font-size: 1.05rem; margin: 0;">Editar Producto</p>
              <p style="font-size: 0.75rem; color: #888; margin: 0;">Modifica los datos</p>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="showEditDialog = false">
            <i class="fas fa-times" style="color: #999;"></i>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-5">
          <v-form ref="editFormRef">
            <v-text-field label="Nombre" v-model="editForm.nombre" :rules="[v => !!v || 'Requerido']" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
              <template v-slot:prepend-inner><i class="fas fa-box" style="color: #1565c0; font-size: 14px;"></i></template>
            </v-text-field>
            <v-textarea label="Descripción" v-model="editForm.descripcion" :rules="[v => !!v || 'Requerido']" auto-grow rows="2" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
              <template v-slot:prepend-inner><i class="fas fa-align-left" style="color: #1565c0; font-size: 14px;"></i></template>
            </v-textarea>
            <v-text-field label="Precio de venta" v-model.number="editForm.precio_venta" type="number" prefix="$" :rules="[v => !!v || 'Requerido']" variant="outlined" density="comfortable" rounded="lg" class="mb-3">
              <template v-slot:prepend-inner><i class="fas fa-dollar-sign" style="color: #ee6f38; font-size: 14px;"></i></template>
            </v-text-field>
            <v-text-field label="URL de imagen" v-model="editForm.imagenUrl" placeholder="https://..." variant="outlined" density="comfortable" rounded="lg" class="mb-3">
              <template v-slot:prepend-inner><i class="fas fa-image" style="color: #9c27b0; font-size: 14px;"></i></template>
            </v-text-field>
            <div v-if="editForm.imagenUrl" style="border: 1px solid #eee; border-radius: 10px; overflow: hidden; text-align: center; background: #fafafa;">
              <v-img :src="editForm.imagenUrl" max-height="140" cover />
            </div>
          </v-form>
        </v-card-text>
        <v-divider />
        <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px;">
          <span style="padding: 8px 18px; border-radius: 8px; border: 1px solid #e0e0e0; cursor: pointer; font-size: 0.85rem; font-weight: 600; color: #666;" @click="showEditDialog = false">Cancelar</span>
          <span style="padding: 8px 20px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-weight: 700; background: #e3f2fd; color: #1565c0;" @click="confirmEdit">
            <i class="fas fa-save" style="font-size: 12px; margin-right: 4px;"></i> Guardar
          </span>
        </div>
      </v-card>
    </v-dialog>

    <!-- ═══ TABLA DE CONTROL ═══ -->
    <v-card rounded="lg" elevation="0" :style="{ border: `1px solid ${cardBorder}`, marginTop: '32px', overflow: 'hidden', background: cardBg }">
      <div :style="{ padding: '16px 20px', borderBottom: `1px solid ${cardBorder}`, background: headerBg, display: 'flex', alignItems: 'center', gap: '10px' }">
        <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(30,136,229,0.1); color: #1e88e5; display: flex; align-items: center; justify-content: center; font-size: 14px;">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <span :style="{ fontSize: '0.95rem', fontWeight: '700', color: txtPrimary }">Control de Publicaciones</span>
      </div>

      <v-data-table :items="productoStore.productos" :headers="headers" hover items-per-page="10">
        <template v-slot:item.nombre="{ item }">
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px 0;">
            <span :style="{ width: '28px', height: '28px', borderRadius: '7px', background: isDark ? 'rgba(238,111,56,0.1)' : '#fff3e0', color: '#ee6f38', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700' }">
              {{ item.nombre?.charAt(0) }}
            </span>
            <span :style="{ fontWeight: '700', fontSize: '0.88rem', color: txtPrimary }">{{ item.nombre }}</span>
          </div>
        </template>

        <template v-slot:item.stock="{ item }">
          <span :style="{ fontWeight: '700', color: item.stock > 0 ? txtPrimary : '#ff5252' }">{{ item.stock }}</span>
        </template>

        <template v-slot:item.publicados="{ item }">
          <span style="font-weight: 700; color: #1565c0;">{{ item.cantidad_publicada || 0 }}</span>
        </template>

        <!-- ═══ ESTADO CON COLOR ═══ -->
        <template v-slot:item.estado="{ item }">
          <!-- Todo publicado = VERDE -->
          <span
            v-if="item.cantidad_publicada > 0 && item.cantidad_publicada >= item.stock"
            :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: isDark ? 'rgba(76,175,80,0.1)' : '#e8f5e9', color: isDark ? '#4caf50' : '#2e7d32', fontSize: '0.72rem', fontWeight: '700' }"
          >
            <i class="fas fa-check-circle" style="font-size: 9px;"></i>
            Todo publicado
          </span>
          <!-- Parcial = AZUL -->
          <span
            v-else-if="item.cantidad_publicada > 0"
            :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: isDark ? 'rgba(30,136,229,0.1)' : '#e3f2fd', color: isDark ? '#4f8ef7' : '#1565c0', fontSize: '0.72rem', fontWeight: '700' }"
          >
            <i class="fas fa-adjust" style="font-size: 9px;"></i>
            Parcial
          </span>
          <!-- No publicado = GRIS -->
          <span
            v-else
            :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5', color: isDark ? '#6b7280' : '#9e9e9e', fontSize: '0.72rem', fontWeight: '700' }"
          >
            <i class="fas fa-eye-slash" style="font-size: 9px;"></i>
            No publicado
          </span>
        </template>

        <!-- ═══ ACCIÓN CON COLOR ═══ -->
        <template v-slot:item.accion="{ item }">
          <span
            v-if="item.cantidad_publicada > 0"
            :style="{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 12px', borderRadius: '7px',
              background: isDark ? 'rgba(239,68,68,0.15)' : '#ffebee',
              color: isDark ? '#f87171' : '#c62828',
              fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer',
              border: isDark ? '1px solid rgba(239,68,68,0.25)' : 'none'
            }"
            @click="retirarPublicacion(item)"
          >
            <i class="fas fa-eye-slash" style="font-size: 10px;"></i>
            Retirar
          </span>
          <span v-else style="font-size: 0.78rem; color: #ccc;">—</span>
        </template>

        <template v-slot:no-data>
          <div style="text-align: center; padding: 24px;">
            <p style="font-size: 0.82rem; color: #aaa;">Sin datos</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" rounded="lg" color="grey-darken-4">
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-info-circle" style="font-size: 14px; color: #ee6f38;"></i>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useProductoStore } from '@/stores/producto';
import { useCustomizerStore } from '@/stores/customizer';

const productoStore = useProductoStore();
const customizer = useCustomizerStore();
const isDark = computed(() => customizer.activeTheme === 'DarkTheme');

// Adaptive Colors
const txtPrimary = computed(() => isDark.value ? '#f3f4f6' : '#1a1a2e');
const txtSecondary = computed(() => isDark.value ? '#9ca3af' : '#888');
const cardBg = computed(() => isDark.value ? '#111827' : '#ffffff');
const cardBorder = computed(() => isDark.value ? '#1f2937' : '#eee');
const headerBg = computed(() => isDark.value ? '#161d2f' : '#fafafa');
const inputBg = computed(() => isDark.value ? '#0d111b' : '#ffffff');
const shadowColor = computed(() => isDark.value ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)');

const showPublishDialog = ref(false);
const selectedProduct = ref(null);
const publishCantidad = ref(1);

const showOfertaDialog = ref(false);
const savingOferta = ref(false);
const selectedOfertaProduct = ref(null);
const ofertaFormRef = ref(null);
const ofertaForm = ref({
  precio_venta: 0,
  en_oferta: false,
  precio_oferta: null,
  dias_oferta: '',
  informacion_oferta: ''
});

const showEditDialog = ref(false);
const savingEdit = ref(false);
const selectedEditProduct = ref(null);
const editFormRef = ref(null);
const editForm = ref({
  nombre: '',
  descripcion: '',
  precio_venta: 0,
  imagenUrl: '',
});

const snackbar = ref(false);
const snackbarText = ref('');

const availableStock = computed(() => {
  if (!selectedProduct.value) return 0;
  return Math.max(0, (selectedProduct.value.stock || 0) - (selectedProduct.value.cantidad_publicada || 0));
});

const canPublish = computed(() => {
  return publishCantidad.value > 0 && publishCantidad.value <= availableStock.value;
});

const notify = (text) => { snackbarText.value = text; snackbar.value = true; };

const openPublishDialog = (producto) => {
  selectedProduct.value = producto;
  const available = Math.max(0, producto.stock - (producto.cantidad_publicada || 0));
  publishCantidad.value = available > 0 ? 1 : 0;
  showPublishDialog.value = true;
};

const openOfertaDialog = (producto) => {
  selectedOfertaProduct.value = producto;
  ofertaForm.value = {
    precio_venta: Number(producto.precio_venta) || 0,
    en_oferta: !!producto.en_oferta,
    precio_oferta: producto.precio_oferta ? Number(producto.precio_oferta) : null,
    dias_oferta: producto.dias_oferta || '',
    informacion_oferta: producto.informacion_oferta || ''
  };
  showOfertaDialog.value = true;
};

const openEditDialog = (producto) => {
  selectedEditProduct.value = producto;
  editForm.value = {
    nombre: producto.nombre || '',
    descripcion: producto.descripcion || '',
    precio_venta: Number(producto.precio_venta) || 0,
    imagenUrl: producto.imagenUrl || '',
  };
  showEditDialog.value = true;
};

const confirmPublish = async () => {
  if (!selectedProduct.value) return;
  try {
    await productoStore.publishProducto(selectedProduct.value.id, publishCantidad.value);
    showPublishDialog.value = false;
    selectedProduct.value = null;
    await productoStore.getProductos();
    notify('Producto publicado correctamente');
  } catch (e) {
    showPublishDialog.value = false;
    notify(productoStore.error || e?.response?.data?.message || 'Error al publicar');
  }
};

const confirmOferta = async () => {
  if (!selectedOfertaProduct.value) return;
  const { valid } = await ofertaFormRef.value.validate();
  if (!valid) return;
  savingOferta.value = true;
  try {
    const payload = { ...ofertaForm.value };
    if (!payload.en_oferta) {
      payload.precio_oferta = null;
      payload.dias_oferta = null;
      payload.informacion_oferta = null;
    }
    await productoStore.updateProducto(selectedOfertaProduct.value.id, payload);
    showOfertaDialog.value = false;
    notify('Configuración actualizada');
    await productoStore.getProductos();
  } catch (e) {
    notify('Error al guardar configuración');
  } finally { savingOferta.value = false; }
};

const confirmEdit = async () => {
  if (!selectedEditProduct.value) return;
  const { valid } = await editFormRef.value.validate();
  if (!valid) return;
  savingEdit.value = true;
  try {
    await productoStore.updateProducto(selectedEditProduct.value.id, { ...editForm.value });
    showEditDialog.value = false;
    notify('Producto actualizado');
    await productoStore.getProductos();
  } catch (e) {
    notify('Error al guardar cambios');
  } finally { savingEdit.value = false; }
};

const retirarPublicacion = async (producto) => {
  try {
    await productoStore.unpublishProducto(producto.id);
    await productoStore.getProductos();
    notify('Publicación retirada');
  } catch (e) {
    notify('Error al retirar');
  }
};

const headers = [
  { title: 'Nombre', key: 'nombre', sortable: true },
  { title: 'Stock', key: 'stock', sortable: true },
  { title: 'Publicados', key: 'publicados', sortable: false },
  { title: 'Estado', key: 'estado', sortable: false },
  { title: 'Acción', key: 'accion', sortable: false },
];

onMounted(async () => { await productoStore.getProductos(); });
</script>

<style scoped>
/* Mínimo CSS — todo inline para garantizar colores visibles */
</style>