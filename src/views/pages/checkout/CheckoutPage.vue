<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useAuthStore } from '@/stores/auth';
import { useVentaStore, TipoPago } from '@/stores/venta';
import { useRouter } from 'vue-router';
import { ChevronRightIcon, TruckIcon, MapPinIcon, CashIcon, ShieldCheckIcon, ArrowLeftIcon } from 'vue-tabler-icons';
import PickupLocationModal from './PickupLocationModal.vue';


const productosStore = useProductosStore();
const authStore = useAuthStore();
const ventaStore = useVentaStore();
const router = useRouter();

const contactEmail = ref('');
const deliveryMethod = ref('envio');
const country = ref('Colombia');
const firstName = ref('');
const lastName = ref('');
const idNumber = ref('');
const address = ref('');
const apartamento = ref('');
const city = ref('Montería');
const department = ref('Córdoba');
const phone = ref('');
const billingFirstName = ref('');
const billingLastName = ref('');
const billingIdNumber = ref('');
const billingAddress = ref('');
const billingCity = ref('');
const billingPhone = ref('');
const paymentMethod = ref<string>('wompi');
const sameAsShipping = ref(true);
const saveInfo = ref(false);
const emailUpdates = ref(false);
const discountCode = ref('');

const DEPARTMENTS = ['Córdoba', 'Antioquia', 'Bogotá D.C.', 'Cundinamarca'];

const showConfirmModal = ref(false);
const orderData = ref<any>(null);
const showLoginDialog = ref(false);
const showSuccessDialog = ref(false);
const confirmedOrderId = ref<number | null>(null);
const showShippingPolicy = ref(false);

const showPickupModal = ref(false);
const pickupInfo = ref({ distance: '', address: '', coords: null as any });

const openPickupModal = () => { showPickupModal.value = true; };
const handleLocationSelected = (data: any) => { pickupInfo.value = data; };

const errors = ref({ email: '', firstName: '', lastName: '', idNumber: '', address: '', phone: '', city: '' });

watch(() => authStore.user, (user) => {
    if (user) {
        const u = user as any;
        contactEmail.value = u.email || '';
        firstName.value = u.nombre || '';
        lastName.value = u.apellido || '';
        if (u.telefono) phone.value = u.telefono;
    }
}, { immediate: true });

const shippingCost = computed(() => deliveryMethod.value === 'envio' ? 13900 : 0);
const total = computed(() => productosStore.subtotalCarrito + shippingCost.value);

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

const validateForm = () => {
    let isValid = true;
    errors.value = { email: '', firstName: '', lastName: '', idNumber: '', address: '', phone: '', city: '' };
    if (deliveryMethod.value === 'envio') {
        if (!firstName.value) { errors.value.firstName = 'Requerido'; isValid = false; }
        if (!lastName.value) { errors.value.lastName = 'Requerido'; isValid = false; }
        if (!idNumber.value) { errors.value.idNumber = 'Requerido'; isValid = false; }
        if (!address.value) { errors.value.address = 'Requerido'; isValid = false; }
        if (!city.value) { errors.value.city = 'Requerido'; isValid = false; }
        if (!phone.value) { errors.value.phone = 'Requerido'; isValid = false; }
    }
    if (deliveryMethod.value === 'retiro' || !sameAsShipping.value) {
        if (!billingFirstName.value) isValid = false;
        if (!billingLastName.value) isValid = false;
        if (!billingIdNumber.value) isValid = false;
        if (!billingAddress.value) isValid = false;
        if (!billingCity.value) isValid = false;
        if (!billingPhone.value) isValid = false;
    }
    return isValid;
};

const prepareOrderData = () => {
    const direccion = deliveryMethod.value === 'envio'
        ? `${address.value}${apartamento.value ? ', ' + apartamento.value : ''}, ${city.value}, ${department.value}`
        : 'Barbería StyleHub - Montería';
    const notas = deliveryMethod.value === 'envio'
        ? `Cliente: ${firstName.value} ${lastName.value} - ${idNumber.value}. Tel: ${phone.value}`
        : 'Retiro en Barbería';
    return { direccion, notas, cliente: `${firstName.value} ${lastName.value}`, telefono: phone.value, metodoEntrega: deliveryMethod.value === 'envio' ? 'Envío a domicilio' : 'Retiro en Barbería' };
};

const showConfirmationModal = () => {
    if (!validateForm()) return;
    if (!authStore.user) { showLoginDialog.value = true; return; }
    orderData.value = prepareOrderData();
    showConfirmModal.value = true;
};

const goToLogin = () => {
    const formData = { email: contactEmail.value, firstName: firstName.value, lastName: lastName.value, idNumber: idNumber.value, address: address.value, apartamento: apartamento.value, city: city.value, department: department.value, phone: phone.value, deliveryMethod: deliveryMethod.value, paymentMethod: paymentMethod.value, autoOpenModal: true };
    localStorage.setItem('checkout_temp_data', JSON.stringify(formData));
    router.push({ path: '/login1', query: { redirect: '/checkout' } });
};

const finishOrderProcess = () => { router.push('/mis-compras'); };
const goToHome = () => { router.push('/'); };
const goBack = () => { router.back(); };

onMounted(async () => {
    const savedData = localStorage.getItem('checkout_temp_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            contactEmail.value = parsed.email || '';
            firstName.value = parsed.firstName || '';
            lastName.value = parsed.lastName || '';
            idNumber.value = parsed.idNumber || '';
            address.value = parsed.address || '';
            apartamento.value = parsed.apartamento || '';
            city.value = parsed.city || 'Montería';
            department.value = parsed.department || 'Córdoba';
            phone.value = parsed.phone || '';
            deliveryMethod.value = parsed.deliveryMethod || 'envio';
            paymentMethod.value = parsed.paymentMethod || 'wompi';
            localStorage.removeItem('checkout_temp_data');
        } catch (e) { console.error('Error restoring checkout data', e); }
    }
});

const confirmOrder = async () => {
    try {
        let tipoPagoBackend: TipoPago;
        switch (paymentMethod.value) {
            case 'pago_al_recibir': tipoPagoBackend = TipoPago.PAGO_CONTRA_ENTREGA; break;
            case 'transferencia_bancolombia':
            case 'transferencia_davivienda': tipoPagoBackend = TipoPago.TRANSFERENCIA; break;
            case 'wompi': tipoPagoBackend = TipoPago.TRANSFERENCIA; break;
            default: tipoPagoBackend = TipoPago.PAGO_CONTRA_ENTREGA;
        }
        const ventaData = {
            clienteId: (authStore.user as any).id,
            items: (productosStore.ComprasCarrito as any[]).map(item => ({ productoId: item.id, cantidad: item.cantidad })),
            tipoPago: tipoPagoBackend,
            direccionEnvio: orderData.value.direccion,
            notas: orderData.value.notas + (paymentMethod.value === 'wompi' ? ' (Pago Wompi)' : '')
        };
        const result = await ventaStore.createVenta(ventaData);
        showConfirmModal.value = false;
        confirmedOrderId.value = result.id;
        showSuccessDialog.value = true;
        productosStore.VaciarCarrito();
    } catch (error: any) {
        console.error('Error al procesar la orden:', error);
        alert('Error al procesar la orden: ' + (error.response?.data?.message || error.message));
    }
};

interface Product { id: number; nombre: string; precio: number; img: string; cantidad: number; }
</script>

<template>
    <div class="checkout-wrapper">
        <div class="mobile-summary-bar d-md-none">
            <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center gap-2">
                    <i class="fas fa-shopping-bag"></i>
                    <span>{{ productosStore.ComprasCarrito.length }} productos</span>
                </div>
                <span class="total-mobile">{{ formatCurrency(total) }}</span>
            </div>
        </div>

        <v-container fluid class="checkout-page pa-0">
            <v-row no-gutters>
                <v-col cols="12" md="7" lg="7" class="form-column">
                    <div class="form-scroll-area">
                        <div class="checkout-form">
                            <div class="checkout-header">
                                <a href="/" class="brand-logo" @click.prevent="goToHome">
                                    <img src="/public/imagenes/logo/logo2.png" alt="StyleHub">
                                </a>
                                <div class="breadcrumbs">
                                    <span class="step clickable" @click="goBack"><i class="fas fa-shopping-cart"></i> Carrito</span>
                                    <ChevronRightIcon size="14" />
                                    <span class="step active">Información</span>
                                    <ChevronRightIcon size="14" />
                                    <span class="step">Pago</span>
                                </div>
                            </div>

                            <button class="back-link" @click="goBack">
                                <ArrowLeftIcon size="18" /><span>Volver al carrito</span>
                            </button>

                            <section class="checkout-section">
                                <div class="section-header">
                                    <span class="section-number">1</span>
                                    <h2>Método de Entrega</h2>
                                </div>
                                <div class="delivery-options">
                                    <div class="delivery-card" :class="{ 'selected': deliveryMethod === 'envio' }" @click="deliveryMethod = 'envio'">
                                        <div class="card-radio"><div class="radio-dot"></div></div>
                                        <div class="card-icon"><TruckIcon size="28" stroke-width="1.5" /></div>
                                        <div class="card-content">
                                            <h4>Envío a Domicilio</h4>
                                            <p>Recibe en tu puerta en 2-5 días hábiles</p>
                                        </div>
                                        <div class="card-price">{{ formatCurrency(13900) }}</div>
                                    </div>
                                    <div class="delivery-card" :class="{ 'selected': deliveryMethod === 'retiro' }" @click="deliveryMethod = 'retiro'">
                                        <div class="card-radio"><div class="radio-dot"></div></div>
                                        <div class="card-icon"><MapPinIcon size="28" stroke-width="1.5" /></div>
                                        <div class="card-content">
                                            <h4>Retiro en Tienda</h4>
                                            <p>Listo en 24 horas - StyleHub Montería</p>
                                        </div>
                                        <div class="card-price free">GRATIS</div>
                                    </div>
                                </div>

                                <div v-if="deliveryMethod === 'envio'" class="shipping-form">
                                    <div class="form-grid">
                                        <div class="form-group full">
                                            <label>País/Región</label>
                                            <div class="custom-select">
                                                <select v-model="country"><option value="Colombia">🇨🇴 Colombia</option></select>
                                                <i class="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Nombre <span class="required">*</span></label>
                                            <input v-model="firstName" type="text" placeholder="Tu nombre" :class="{ 'error': errors.firstName }" />
                                            <span class="error-msg" v-if="errors.firstName">{{ errors.firstName }}</span>
                                        </div>
                                        <div class="form-group">
                                            <label>Apellidos <span class="required">*</span></label>
                                            <input v-model="lastName" type="text" placeholder="Tus apellidos" :class="{ 'error': errors.lastName }" />
                                            <span class="error-msg" v-if="errors.lastName">{{ errors.lastName }}</span>
                                        </div>
                                        <div class="form-group full">
                                            <label>Cédula / NIT <span class="required">*</span></label>
                                            <input v-model="idNumber" type="text" placeholder="Solo números" :class="{ 'error': errors.idNumber }" />
                                            <span class="error-msg" v-if="errors.idNumber">{{ errors.idNumber }}</span>
                                        </div>
                                        <div class="form-group full">
                                            <label>Dirección <span class="required">*</span></label>
                                            <input v-model="address" type="text" placeholder="Calle, número, barrio" :class="{ 'error': errors.address }" />
                                            <span class="error-msg" v-if="errors.address">{{ errors.address }}</span>
                                        </div>
                                        <div class="form-group full">
                                            <label>Apartamento / Casa (Opcional)</label>
                                            <input v-model="apartamento" type="text" placeholder="Torre, piso, apartamento..." />
                                        </div>
                                        <div class="form-group">
                                            <label>Ciudad <span class="required">*</span></label>
                                            <input v-model="city" type="text" :class="{ 'error': errors.city }" />
                                        </div>
                                        <div class="form-group">
                                            <label>Departamento</label>
                                            <div class="custom-select">
                                                <select v-model="department">
                                                    <option v-for="dep in DEPARTMENTS" :key="dep" :value="dep">{{ dep }}</option>
                                                </select>
                                                <i class="fas fa-chevron-down"></i>
                                            </div>
                                        </div>
                                        <div class="form-group full">
                                            <label>Teléfono <span class="required">*</span></label>
                                            <input v-model="phone" type="tel" placeholder="+57 300 000 0000" :class="{ 'error': errors.phone }" />
                                            <span class="error-msg" v-if="errors.phone">{{ errors.phone }}</span>
                                        </div>
                                    </div>
                                    <div class="shipping-method-box">
                                        <div class="method-info">
                                            <TruckIcon size="20" />
                                            <div><strong>Envío Estándar</strong><span>2 a 5 días hábiles</span></div>
                                        </div>
                                        <div class="method-price">{{ formatCurrency(13900) }}</div>
                                    </div>
                                </div>

                                <div v-else class="pickup-info">
                                    <div class="pickup-notice">
                                        <i class="fas fa-info-circle"></i>
                                        <div>
                                            <span v-if="pickupInfo.distance">La barbería está a <strong>{{ pickupInfo.distance }}</strong> de tu ubicación</span>
                                            <span v-else>Calcula la distancia desde tu ubicación</span>
                                            <div class="pickup-actions">
                                                <a @click.prevent="openPickupModal">Cambiar ubicación</a>
                                                <span>o</span>
                                                <a @click.prevent="deliveryMethod = 'envio'">Enviar a domicilio</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="store-card" @click="openPickupModal">
                                        <div class="store-icon"><i class="fas fa-store"></i></div>
                                        <div class="store-details">
                                            <h4>StyleHub Barber Shop</h4>
                                            <p>Calle Principal #123, Montería, Córdoba</p>
                                            <div class="store-meta">
                                                <span><i class="fas fa-route"></i> {{ pickupInfo.distance || '--' }} km</span>
                                                <span><i class="fas fa-clock"></i> Listo en 24h</span>
                                            </div>
                                        </div>
                                        <div class="store-free">GRATIS</div>
                                        <i class="fas fa-chevron-right store-arrow"></i>
                                    </div>
                                </div>
                            </section>

                            <section class="checkout-section">
                                <div class="section-header">
                                    <span class="section-number">2</span>
                                    <h2>Método de Pago</h2>
                                </div>
                                <p class="section-subtitle"><ShieldCheckIcon size="16" /> Todas las transacciones son seguras y encriptadas</p>
                                <div class="payment-options">
                                    <div class="payment-card" :class="{ 'selected': paymentMethod === 'wompi' }" @click="paymentMethod = 'wompi'">
                                        <div class="payment-header">
                                            <div class="payment-radio"><div class="radio-dot"></div></div>
                                            <div class="payment-title"><span>Tarjeta de Crédito/Débito</span><small>Wompi - Pago seguro</small></div>
                                            <div class="payment-icons">
                                                <img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" alt="Visa">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard">
                                            </div>
                                        </div>
                                        <transition name="expand">
                                            <div v-if="paymentMethod === 'wompi'" class="payment-body">
                                                <div class="payment-note"><i class="fas fa-external-link-alt"></i><span>Serás redirigido a Wompi para completar tu pago de forma segura</span></div>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="payment-card" :class="{ 'selected': paymentMethod === 'pago_al_recibir' }" @click="paymentMethod = 'pago_al_recibir'">
                                        <div class="payment-header">
                                            <div class="payment-radio"><div class="radio-dot"></div></div>
                                            <div class="payment-title"><span>Pago Contra Entrega</span><small>Paga cuando recibas tu pedido</small></div>
                                            <div class="payment-icon-single"><i class="fas fa-money-bill-wave"></i></div>
                                        </div>
                                        <transition name="expand">
                                            <div v-if="paymentMethod === 'pago_al_recibir'" class="payment-body">
                                                <div class="payment-note"><i class="fas fa-hand-holding-usd"></i><span>Paga en efectivo al momento de recibir tu pedido</span></div>
                                            </div>
                                        </transition>
                                    </div>
                                    <div class="payment-card" :class="{ 'selected': paymentMethod === 'transferencia_bancolombia' }" @click="paymentMethod = 'transferencia_bancolombia'">
                                        <div class="payment-header">
                                            <div class="payment-radio"><div class="radio-dot"></div></div>
                                            <div class="payment-title"><span>Transferencia Bancolombia</span><small>Cuenta de ahorros</small></div>
                                            <div class="payment-icon-single bank"><i class="fas fa-university"></i></div>
                                        </div>
                                    </div>
                                    <div class="payment-card" :class="{ 'selected': paymentMethod === 'transferencia_davivienda' }" @click="paymentMethod = 'transferencia_davivienda'">
                                        <div class="payment-header">
                                            <div class="payment-radio"><div class="radio-dot"></div></div>
                                            <div class="payment-title"><span>Transferencia Davivienda</span><small>Cuenta de ahorros</small></div>
                                            <div class="payment-icon-single bank davi"><i class="fas fa-university"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section class="checkout-section" v-if="deliveryMethod === 'envio'">
                                <div class="section-header">
                                    <span class="section-number">3</span>
                                    <h2>Dirección de Facturación</h2>
                                </div>
                                <div class="billing-options">
                                    <div class="billing-option" :class="{ 'selected': sameAsShipping }" @click="sameAsShipping = true">
                                        <div class="option-radio"><div class="radio-dot"></div></div>
                                        <span>Misma dirección de envío</span>
                                    </div>
                                    <div class="billing-option" :class="{ 'selected': !sameAsShipping }" @click="sameAsShipping = false">
                                        <div class="option-radio"><div class="radio-dot"></div></div>
                                        <span>Usar dirección diferente</span>
                                    </div>
                                </div>
                            </section>

                            <section class="checkout-section" v-if="deliveryMethod === 'retiro' || !sameAsShipping">
                                <div class="section-header" v-if="deliveryMethod === 'retiro'">
                                    <span class="section-number">3</span>
                                    <h2>Datos de Facturación</h2>
                                </div>
                                <div class="shipping-form">
                                    <div class="form-grid">
                                        <div class="form-group"><label>Nombre <span class="required">*</span></label><input v-model="billingFirstName" type="text" placeholder="Tu nombre" /></div>
                                        <div class="form-group"><label>Apellidos <span class="required">*</span></label><input v-model="billingLastName" type="text" placeholder="Tus apellidos" /></div>
                                        <div class="form-group full"><label>Cédula / NIT <span class="required">*</span></label><input v-model="billingIdNumber" type="text" placeholder="Solo números" /></div>
                                        <div class="form-group full"><label>Dirección <span class="required">*</span></label><input v-model="billingAddress" type="text" placeholder="Dirección completa" /></div>
                                        <div class="form-group"><label>Ciudad <span class="required">*</span></label><input v-model="billingCity" type="text" /></div>
                                        <div class="form-group"><label>Teléfono <span class="required">*</span></label><input v-model="billingPhone" type="tel" placeholder="+57 300 000 0000" /></div>
                                    </div>
                                </div>
                            </section>

                            <div class="checkout-actions">
                                <button class="pay-button" @click="showConfirmationModal">
                                    <i class="fas fa-lock"></i><span>Pagar {{ formatCurrency(total) }}</span>
                                </button>
                                <div class="secure-badge"><ShieldCheckIcon size="16" /><span>Pago 100% seguro y encriptado</span></div>
                            </div>

                            <div class="checkout-footer">
                                <a href="#">Política de reembolso</a>
                                <a href="#">Política de envíos</a>
                                <a href="#">Privacidad</a>
                                <a href="#">Términos</a>
                            </div>
                        </div>
                    </div>
                </v-col>

                <v-col cols="12" md="5" lg="5" class="summary-column d-none d-md-block">
                    <div class="summary-sticky">
                        <div class="summary-content">
                            <h3 class="summary-title">Resumen del Pedido</h3>
                            <div class="summary-products">
                                <div v-for="item in (productosStore.ComprasCarrito as Product[])" :key="item.id" class="summary-item">
                                    <div class="item-image">
                                        <img :src="item.img" :alt="item.nombre" />
                                        <span class="item-qty">{{ item.cantidad }}</span>
                                    </div>
                                    <div class="item-details">
                                        <h4>{{ item.nombre }}</h4>
                                        <span class="item-ref">REF: {{ item.id }}</span>
                                    </div>
                                    <div class="item-price">{{ formatCurrency(item.precio * item.cantidad) }}</div>
                                </div>
                            </div>
                            <div class="discount-section">
                                <div class="discount-input-wrap">
                                    <input v-model="discountCode" type="text" placeholder="Código de descuento" />
                                    <button class="discount-btn">Aplicar</button>
                                </div>
                            </div>
                            <div class="summary-totals">
                                <div class="total-row"><span>Subtotal</span><span>{{ formatCurrency(productosStore.subtotalCarrito) }}</span></div>
                                <div class="total-row">
                                    <span class="d-flex align-center gap-1">
                                        {{ deliveryMethod === 'retiro' ? 'Retiro' : 'Envío' }}
                                        <i class="fas fa-info-circle info-icon" @click="showShippingPolicy = true"></i>
                                    </span>
                                    <span v-if="deliveryMethod === 'envio'">{{ formatCurrency(shippingCost) }}</span>
                                    <span v-else class="free-shipping">GRATIS</span>
                                </div>
                                <div class="total-row final">
                                    <span>Total</span>
                                    <div class="final-price"><small>COP</small><strong>{{ formatCurrency(total) }}</strong></div>
                                </div>
                            </div>
                            <div class="trust-badges">
                                <div class="badge"><i class="fas fa-shield-alt"></i><span>Pago Seguro</span></div>
                                <div class="badge"><i class="fas fa-undo"></i><span>30 días devolución</span></div>
                                <div class="badge"><i class="fas fa-headset"></i><span>Soporte 24/7</span></div>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <PickupLocationModal v-model="showPickupModal" @location-selected="handleLocationSelected" />

        <!-- ===== MODAL: POLÍTICA DE ENVÍO ===== -->
        <v-dialog v-model="showShippingPolicy" max-width="520">
            <v-card class="modal-barber" rounded="xl">
                <div class="modal-barber__header">
                    <div class="modal-barber__header-icon"><i class="fas fa-truck"></i></div>
                    <div>
                        <h3 class="modal-barber__header-title">Política de Envío</h3>
                        <p class="modal-barber__header-sub">StyleHub Barber Shop</p>
                    </div>
                    <button class="modal-barber__close" @click="showShippingPolicy = false"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-barber__body">
                    <div class="shipping-policy-item">
                        <div class="shipping-policy-icon"><i class="fas fa-box"></i></div>
                        <div>
                            <strong>Empresa de mensajería</strong>
                            <p>El transporte se realizará a través de una empresa de mensajería especializada.</p>
                        </div>
                    </div>
                    <div class="shipping-policy-item">
                        <div class="shipping-policy-icon"><i class="fas fa-calendar-alt"></i></div>
                        <div>
                            <strong>Plazo de entrega</strong>
                            <p>Máximo <span class="text-accent">8 días laborables</span>. Puede variar según el pedido.</p>
                        </div>
                    </div>
                    <div class="shipping-policy-item">
                        <div class="shipping-policy-icon"><i class="fas fa-phone-alt"></i></div>
                        <div>
                            <strong>Datos obligatorios</strong>
                            <p>Es indispensable completar el formulario con el teléfono de contacto.</p>
                        </div>
                    </div>
                    <div class="shipping-policy-contact">
                        <i class="fas fa-headset"></i>
                        <div>
                            <span>¿Tienes dudas? Contáctanos</span>
                            <strong>+57 (350) 489-7346</strong>
                        </div>
                    </div>
                </div>
                <div class="modal-barber__footer single">
                    <button class="modal-barber__btn-primary" @click="showShippingPolicy = false">Entendido</button>
                </div>
            </v-card>
        </v-dialog>

        <!-- ===== MODAL: CONFIRMAR PEDIDO ===== -->
        <v-dialog v-model="showConfirmModal" max-width="480">
            <v-card class="modal-barber" rounded="xl">
                <div class="modal-barber__header">
                    <div class="modal-barber__header-icon"><i class="fas fa-receipt"></i></div>
                    <div>
                        <h3 class="modal-barber__header-title">Confirmar Pedido</h3>
                        <p class="modal-barber__header-sub">Revisa los detalles antes de continuar</p>
                    </div>
                    <button class="modal-barber__close" @click="showConfirmModal = false"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-barber__body">
                    <div class="confirm-table">
                        <div class="confirm-table__row">
                            <span class="confirm-table__label"><i class="fas fa-shopping-bag"></i> Productos</span>
                            <span class="confirm-table__value">{{ productosStore.ComprasCarrito.length }} item{{ productosStore.ComprasCarrito.length !== 1 ? 's' : '' }}</span>
                        </div>
                        <div class="confirm-table__row">
                            <span class="confirm-table__label"><i class="fas fa-truck"></i> Entrega</span>
                            <span class="confirm-table__value">{{ deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en tienda' }}</span>
                        </div>
                        <div class="confirm-table__row">
                            <span class="confirm-table__label"><i class="fas fa-credit-card"></i> Pago</span>
                            <span class="confirm-table__value">{{ paymentMethod === 'wompi' ? 'Tarjeta (Wompi)' : paymentMethod === 'pago_al_recibir' ? 'Contra entrega' : 'Transferencia' }}</span>
                        </div>
                        <div class="confirm-table__row confirm-table__row--total">
                            <span class="confirm-table__label"><i class="fas fa-coins"></i> Total a Pagar</span>
                            <span class="confirm-table__total">{{ formatCurrency(total) }}</span>
                        </div>
                    </div>
                    <div class="confirm-secure-note">
                        <i class="fas fa-shield-alt"></i>
                        <span>Tu compra está protegida. Pago 100% seguro.</span>
                    </div>
                </div>
                <div class="modal-barber__footer">
                    <button class="modal-barber__btn-secondary" @click="showConfirmModal = false">Cancelar</button>
                    <button class="modal-barber__btn-primary" @click="confirmOrder"><i class="fas fa-check"></i> Confirmar compra</button>
                </div>
            </v-card>
        </v-dialog>

        <!-- ===== MODAL: INICIAR SESIÓN ===== -->
        <v-dialog v-model="showLoginDialog" max-width="420">
            <v-card class="modal-barber modal-barber--login" rounded="xl">
                <div class="login-modal-deco">
                    <div class="login-modal-deco__avatar"><i class="fas fa-cut"></i></div>
                </div>
                <div class="login-modal-content">
                    <h3 class="login-modal-title">¡Un paso más!</h3>
                    <p class="login-modal-sub">Inicia sesión para completar tu compra y hacer seguimiento de tu pedido.</p>
                    <div class="login-modal-benefits">
                        <div class="login-modal-benefit"><i class="fas fa-box-open"></i><span>Seguimiento de pedidos en tiempo real</span></div>
                        <div class="login-modal-benefit"><i class="fas fa-history"></i><span>Historial de compras guardado</span></div>
                        <div class="login-modal-benefit"><i class="fas fa-tag"></i><span>Ofertas y descuentos exclusivos</span></div>
                    </div>
                    <button class="modal-barber__btn-primary w-full" @click="goToLogin">
                        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión / Registrarse
                    </button>
                    <button class="modal-barber__btn-ghost w-full" @click="showLoginDialog = false">Volver al checkout</button>
                </div>
            </v-card>
        </v-dialog>

        <!-- ===== MODAL: COMPRA EXITOSA ===== -->
        <v-dialog v-model="showSuccessDialog" max-width="460" persistent>
            <v-card class="modal-barber modal-barber--success" rounded="xl">
                <!-- Cabecera con confetti visual -->
                <div class="success-modal__top">
                    <div class="success-modal__rays"></div>
                    <div class="success-modal__check">
                        <i class="fas fa-check"></i>
                    </div>
                </div>

                <div class="success-modal__body">
                    <h2 class="success-modal__title">¡Gracias por tu compra!</h2>
                    <div class="success-modal__order-badge">
                        <i class="fas fa-hashtag"></i>
                        Pedido {{ confirmedOrderId }}
                    </div>
                    <p class="success-modal__msg">
                        Recibirás un correo con todos los detalles y el seguimiento de tu pedido.
                    </p>

                    <!-- Mini resumen -->
                    <div class="success-modal__info">
                        <div class="success-modal__info-row">
                            <i class="fas fa-truck"></i>
                            <span>{{ deliveryMethod === 'envio' ? 'Envío a domicilio — 2 a 5 días hábiles' : 'Retiro en StyleHub — Listo en 24h' }}</span>
                        </div>
                        <div class="success-modal__info-row">
                            <i class="fas fa-credit-card"></i>
                            <span>{{ paymentMethod === 'wompi' ? 'Pago con tarjeta (Wompi)' : paymentMethod === 'pago_al_recibir' ? 'Pago contra entrega' : 'Transferencia bancaria' }}</span>
                        </div>
                    </div>

                    <button class="modal-barber__btn-primary w-full" @click="finishOrderProcess">
                        <i class="fas fa-box-open"></i> Ver mis pedidos
                    </button>
                    <button class="modal-barber__btn-ghost w-full" @click="goToHome">
                        Seguir comprando
                    </button>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<style scoped>
.checkout-wrapper {
    --primary: #ee6f38;
    --primary-dark: #d45a28;
    --primary-light: #ff8c61;
    --dark: #1a1a1a;
    --darker: #111111;
    --card-bg: #242424;
    --border: #e0e0e0;
    --border-dark: #333;
    --text: #1a1a1a;
    --text-light: #666;
    --text-muted: #999;
    --success: #22c55e;
    --bg-light: #f8f8f8;
    min-height: 100vh;
    background: white;
}

.mobile-summary-bar { position: sticky; top: 0; z-index: 100; background: var(--dark); color: white; padding: 16px 20px; }
.mobile-summary-bar i { color: var(--primary); }
.total-mobile { font-weight: 700; font-size: 1.1rem; }
.checkout-page { min-height: 100vh; }
.form-column { background: white; }
.form-scroll-area { min-height: 100vh; padding: 40px 24px; }

@media (min-width: 960px) {
    .form-scroll-area { padding: 48px 64px 48px 48px; max-width: 680px; margin-left: auto; }
}

.summary-column { background: linear-gradient(180deg, var(--dark) 0%, var(--darker) 100%); min-height: 100vh; }
.summary-sticky { position: sticky; top: 0; height: 100vh; overflow-y: auto; padding: 48px 48px 48px 40px; }
.summary-content { max-width: 420px; }
.checkout-header { margin-bottom: 32px; }
.brand-logo img { height: 50px; margin-bottom: 24px; }
.breadcrumbs { display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: var(--text-muted); }
.breadcrumbs .step { transition: color 0.2s; }
.breadcrumbs .step.clickable { cursor: pointer; }
.breadcrumbs .step.clickable:hover { color: var(--primary); }
.breadcrumbs .step.active { color: var(--primary); font-weight: 600; }
.breadcrumbs .step i { margin-right: 6px; }
.back-link { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-light); font-size: 0.9rem; cursor: pointer; margin-bottom: 32px; transition: color 0.2s; }
.back-link:hover { color: var(--primary); }
.checkout-section { margin-bottom: 40px; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.section-number { width: 32px; height: 32px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
.section-header h2 { font-size: 1.25rem; font-weight: 700; color: var(--text); margin: 0; }
.section-subtitle { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px; }
.delivery-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.delivery-card { display: flex; align-items: center; gap: 16px; padding: 20px; border: 2px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.3s ease; background: white; }
.delivery-card:hover { border-color: #ccc; }
.delivery-card.selected { border-color: var(--primary); background: linear-gradient(135deg, rgba(238,111,56,0.05), rgba(238,111,56,0.02)); }
.card-radio { width: 22px; height: 22px; border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.delivery-card.selected .card-radio { border-color: var(--primary); }
.radio-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--primary); transform: scale(0); transition: transform 0.2s; }
.delivery-card.selected .radio-dot, .payment-card.selected .radio-dot, .billing-option.selected .radio-dot { transform: scale(1); }
.card-icon { width: 48px; height: 48px; background: var(--bg-light); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-light); flex-shrink: 0; }
.delivery-card.selected .card-icon { background: var(--primary); color: white; }
.card-content { flex: 1; }
.card-content h4 { font-size: 1rem; font-weight: 600; margin: 0 0 4px 0; color: var(--text); }
.card-content p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
.card-price { font-weight: 700; color: var(--text); font-size: 0.95rem; }
.card-price.free { color: var(--success); }
.shipping-form { background: var(--bg-light); border-radius: 16px; padding: 24px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: var(--text); margin-bottom: 8px; }
.form-group label .required { color: var(--primary); }
.form-group input, .custom-select select { width: 100%; padding: 14px 16px; border: 2px solid var(--border); border-radius: 10px; font-size: 0.95rem; background: white; transition: all 0.2s; outline: none; }
.form-group input:focus, .custom-select select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(238,111,56,0.1); }
.form-group input.error { border-color: #ef4444; }
.error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 4px; }
.custom-select { position: relative; }
.custom-select select { appearance: none; cursor: pointer; padding-right: 40px; }
.custom-select i { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
.shipping-method-box { display: flex; justify-content: space-between; align-items: center; background: white; border: 2px solid var(--primary); border-radius: 12px; padding: 16px 20px; margin-top: 20px; }
.method-info { display: flex; align-items: center; gap: 12px; color: var(--primary); }
.method-info div { display: flex; flex-direction: column; }
.method-info strong { color: var(--text); font-size: 0.95rem; }
.method-info span { font-size: 0.8rem; color: var(--text-muted); }
.method-price { font-weight: 700; color: var(--text); }
.pickup-info { display: flex; flex-direction: column; gap: 16px; }
.pickup-notice { display: flex; gap: 12px; padding: 16px; background: #fff8f5; border: 1px solid rgba(238,111,56,0.2); border-radius: 12px; }
.pickup-notice > i { color: var(--primary); font-size: 1.1rem; margin-top: 2px; }
.pickup-notice span { font-size: 0.9rem; color: var(--text); }
.pickup-actions { margin-top: 8px; font-size: 0.85rem; }
.pickup-actions a { color: var(--primary); cursor: pointer; text-decoration: underline; }
.pickup-actions span { color: var(--text-muted); margin: 0 8px; }
.store-card { display: flex; align-items: center; gap: 16px; padding: 20px; background: white; border: 2px solid var(--primary); border-radius: 12px; cursor: pointer; transition: all 0.3s; }
.store-card:hover { box-shadow: 0 8px 24px rgba(238,111,56,0.15); }
.store-icon { width: 50px; height: 50px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
.store-details { flex: 1; }
.store-details h4 { font-size: 1rem; font-weight: 700; margin: 0 0 4px 0; }
.store-details p { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 8px 0; }
.store-meta { display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-light); }
.store-meta i { margin-right: 4px; color: var(--primary); }
.store-free { font-weight: 700; color: var(--success); font-size: 0.85rem; }
.store-arrow { color: var(--text-muted); }
.payment-options { display: flex; flex-direction: column; border: 2px solid var(--border); border-radius: 12px; overflow: hidden; }
.payment-card { border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s; }
.payment-card:last-child { border-bottom: none; }
.payment-card:hover { background: var(--bg-light); }
.payment-card.selected { background: linear-gradient(135deg, rgba(238,111,56,0.05), rgba(238,111,56,0.02)); }
.payment-header { display: flex; align-items: center; gap: 16px; padding: 18px 20px; }
.payment-radio { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.payment-card.selected .payment-radio { border-color: var(--primary); }
.payment-title { flex: 1; display: flex; flex-direction: column; }
.payment-title span { font-weight: 600; color: var(--text); }
.payment-title small { font-size: 0.8rem; color: var(--text-muted); }
.payment-icons { display: flex; gap: 8px; }
.payment-icons img { height: 24px; width: auto; }
.payment-icon-single { width: 40px; height: 40px; background: var(--bg-light); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
.payment-icon-single.bank { background: #0052cc15; color: #0052cc; }
.payment-icon-single.davi { background: #ed1c2415; color: #ed1c24; }
.payment-body { padding: 0 20px 20px 56px; }
.payment-note { display: flex; align-items: center; gap: 12px; padding: 16px; background: var(--bg-light); border-radius: 10px; font-size: 0.85rem; color: var(--text-light); }
.payment-note i { color: var(--primary); }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
.billing-options { display: flex; flex-direction: column; border: 2px solid var(--border); border-radius: 12px; overflow: hidden; }
.billing-option { display: flex; align-items: center; gap: 16px; padding: 18px 20px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid var(--border); }
.billing-option:last-child { border-bottom: none; }
.billing-option:hover { background: var(--bg-light); }
.billing-option.selected { background: linear-gradient(135deg, rgba(238,111,56,0.05), rgba(238,111,56,0.02)); }
.option-radio { width: 20px; height: 20px; border: 2px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.billing-option.selected .option-radio { border-color: var(--primary); }
.checkout-actions { margin-top: 40px; }
.pay-button { width: 100%; padding: 18px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border: none; border-radius: 14px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 8px 24px rgba(238,111,56,0.35); transition: all 0.3s ease; }
.pay-button:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(238,111,56,0.45); }
.pay-button:active { transform: translateY(0); }
.secure-badge { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-size: 0.8rem; color: var(--text-muted); }
.secure-badge svg { color: var(--success); }
.checkout-footer { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); }
.checkout-footer a { font-size: 0.8rem; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
.checkout-footer a:hover { color: var(--primary); }
.summary-title { color: white; font-size: 1.3rem; font-weight: 700; margin: 0 0 32px 0; padding-bottom: 20px; border-bottom: 1px solid var(--border-dark); }
.summary-products { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; max-height: 280px; overflow-y: auto; padding-right: 8px; }
.summary-products::-webkit-scrollbar { width: 4px; }
.summary-products::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
.summary-item { display: flex; align-items: center; gap: 16px; }
.item-image { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
.item-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; border: 1px solid var(--border-dark); }
.item-qty { position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; background: var(--primary); color: white; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.item-details { flex: 1; min-width: 0; }
.item-details h4 { color: white; font-size: 0.9rem; font-weight: 600; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-ref { font-size: 0.75rem; color: #666; }
.item-price { color: white; font-weight: 600; font-size: 0.95rem; }
.discount-section { padding: 20px 0; border-top: 1px solid var(--border-dark); border-bottom: 1px solid var(--border-dark); margin-bottom: 20px; }
.discount-input-wrap { display: flex; gap: 10px; }
.discount-input-wrap input { flex: 1; background: var(--card-bg); border: 1px solid var(--border-dark); border-radius: 10px; padding: 14px 16px; color: white; font-size: 0.9rem; outline: none; transition: border-color 0.2s; }
.discount-input-wrap input:focus { border-color: var(--primary); }
.discount-input-wrap input::placeholder { color: #666; }
.discount-btn { padding: 14px 20px; background: transparent; border: 1px solid var(--primary); color: var(--primary); border-radius: 10px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.discount-btn:hover { background: var(--primary); color: white; }
.summary-totals { margin-bottom: 24px; }
.total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; color: #888; font-size: 0.95rem; }
.total-row .info-icon { font-size: 0.8rem; cursor: pointer; transition: color 0.2s; }
.total-row .info-icon:hover { color: var(--primary); }
.free-shipping { color: var(--success); font-weight: 600; }
.total-row.final { border-top: 1px solid var(--border-dark); padding-top: 20px; margin-top: 8px; }
.total-row.final span:first-child { color: white; font-weight: 700; font-size: 1.1rem; }
.final-price { display: flex; align-items: baseline; gap: 8px; }
.final-price small { color: #666; font-size: 0.8rem; }
.final-price strong { color: var(--primary); font-size: 1.5rem; font-weight: 700; }
.trust-badges { display: flex; justify-content: space-between; gap: 12px; padding: 20px; background: var(--card-bg); border-radius: 12px; }
.trust-badges .badge { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
.trust-badges .badge i { color: var(--primary); font-size: 1.2rem; }
.trust-badges .badge span { color: #888; font-size: 0.7rem; }

@media (max-width: 959px) {
    .form-scroll-area { padding: 24px 20px; }
    .form-grid { grid-template-columns: 1fr; }
    .form-group.full { grid-column: 1; }
    .delivery-card { flex-wrap: wrap; }
    .card-content { flex-basis: calc(100% - 100px); }
    .card-price { flex-basis: 100%; text-align: right; margin-top: 8px; }
    .trust-badges { flex-direction: column; gap: 16px; }
    .trust-badges .badge { flex-direction: row; justify-content: flex-start; }
}

/* =====================================================
   SISTEMA DE MODALES — ESTILO BARBERÍA (compartido)
   ===================================================== */
.modal-barber { background: #1a1a1a !important; overflow: hidden; }

.modal-barber__header {
    display: flex; align-items: center; gap: 16px;
    padding: 22px 24px;
    background: linear-gradient(135deg, #ee6f38 0%, #c95520 100%);
    position: relative;
}
.modal-barber__header::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px);
}
.modal-barber__header-icon {
    width: 48px; height: 48px; background: rgba(255,255,255,0.2);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; color: white; flex-shrink: 0; position: relative; z-index: 1;
}
.modal-barber__header-title { color: white; font-size: 1.15rem; font-weight: 700; margin: 0; position: relative; z-index: 1; }
.modal-barber__header-sub { color: rgba(255,255,255,0.75); font-size: 0.78rem; margin: 2px 0 0; position: relative; z-index: 1; }
.modal-barber__close {
    margin-left: auto; width: 36px; height: 36px; background: rgba(255,255,255,0.15);
    border: none; border-radius: 8px; color: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s; position: relative; z-index: 1; flex-shrink: 0;
}
.modal-barber__close:hover { background: rgba(255,255,255,0.28); transform: rotate(90deg); }
.modal-barber__body { padding: 24px; }
.modal-barber__footer { display: flex; gap: 12px; padding: 0 24px 24px; }
.modal-barber__footer.single { justify-content: flex-end; }

.modal-barber__btn-primary {
    flex: 1; padding: 14px 20px;
    background: linear-gradient(135deg, #ee6f38, #d45a28);
    color: white; border: none; border-radius: 10px;
    font-weight: 700; font-size: 0.95rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: all 0.25s; box-shadow: 0 4px 16px rgba(238,111,56,0.3);
}
.modal-barber__btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(238,111,56,0.45); }
.modal-barber__btn-secondary {
    flex: 1; padding: 14px 20px; background: #2a2a2a; color: #aaa;
    border: 1px solid #333; border-radius: 10px; font-weight: 600; font-size: 0.95rem; cursor: pointer; transition: all 0.2s;
}
.modal-barber__btn-secondary:hover { background: #333; color: white; }
.modal-barber__btn-ghost { background: transparent; border: none; color: #555; font-size: 0.9rem; cursor: pointer; padding: 12px; transition: color 0.2s; text-align: center; }
.modal-barber__btn-ghost:hover { color: #aaa; }
.w-full { width: 100%; }

/* — Política de envío — */
.shipping-policy-item { display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #242424; border-radius: 12px; margin-bottom: 10px; border-left: 3px solid #ee6f38; }
.shipping-policy-icon { width: 38px; height: 38px; background: rgba(238,111,56,0.12); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ee6f38; font-size: 0.95rem; flex-shrink: 0; }
.shipping-policy-item strong { display: block; color: white; font-size: 0.9rem; margin-bottom: 4px; }
.shipping-policy-item p { color: #888; font-size: 0.82rem; line-height: 1.5; margin: 0; }
.text-accent { color: #ee6f38; font-weight: 700; }
.shipping-policy-contact { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: rgba(238,111,56,0.08); border: 1px solid rgba(238,111,56,0.2); border-radius: 12px; margin-top: 14px; }
.shipping-policy-contact > i { font-size: 1.3rem; color: #ee6f38; }
.shipping-policy-contact span { display: block; font-size: 0.78rem; color: #888; }
.shipping-policy-contact strong { color: white; font-size: 0.95rem; }

/* — Confirmar pedido — */
.confirm-table { background: #242424; border-radius: 14px; overflow: hidden; margin-bottom: 16px; }
.confirm-table__row { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-bottom: 1px solid #2e2e2e; }
.confirm-table__row:last-child { border-bottom: none; }
.confirm-table__label { color: #888; font-size: 0.88rem; display: flex; align-items: center; gap: 8px; }
.confirm-table__label i { color: #ee6f38; width: 14px; }
.confirm-table__value { color: #ccc; font-size: 0.88rem; font-weight: 500; }
.confirm-table__row--total { background: rgba(238,111,56,0.06); }
.confirm-table__row--total .confirm-table__label { color: white; font-weight: 600; font-size: 0.95rem; }
.confirm-table__total { color: #ee6f38; font-weight: 800; font-size: 1.15rem; }
.confirm-secure-note { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(34,197,94,0.07); border: 1px solid rgba(34,197,94,0.2); border-radius: 10px; font-size: 0.82rem; color: #888; }
.confirm-secure-note i { color: #22c55e; }

/* — Login modal — */
.modal-barber--login { text-align: center; }
.login-modal-deco {
    position: relative; height: 90px;
    background: linear-gradient(135deg, #ee6f38 0%, #c95520 100%);
    display: flex; align-items: flex-end; justify-content: center;
}
.login-modal-deco::after {
    content: ''; position: absolute; inset: 0;
    background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 12px);
}
.login-modal-deco__avatar {
    position: relative; bottom: -28px; z-index: 2;
    width: 64px; height: 64px; background: #1a1a1a;
    border: 3px solid #ee6f38; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; color: #ee6f38;
    box-shadow: 0 4px 20px rgba(238,111,56,0.35);
}
.login-modal-content { padding: 44px 28px 28px; }
.login-modal-title { color: white; font-size: 1.3rem; font-weight: 700; margin: 0 0 8px; }
.login-modal-sub { color: #888; font-size: 0.88rem; line-height: 1.6; margin: 0 0 24px; }
.login-modal-benefits { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; text-align: left; }
.login-modal-benefit { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #242424; border-radius: 10px; font-size: 0.88rem; color: #ccc; }
.login-modal-benefit i { color: #ee6f38; width: 16px; text-align: center; }

/* — Modal éxito — */
.modal-barber--success { text-align: center; }

.success-modal__top {
    position: relative;
    height: 130px;
    background: linear-gradient(135deg, #ee6f38 0%, #c95520 100%);
    display: flex; align-items: flex-end; justify-content: center;
    overflow: hidden;
}

/* Rayos decorativos de fondo */
.success-modal__rays {
    position: absolute; inset: 0;
    background: repeating-conic-gradient(rgba(255,255,255,0.06) 0deg 10deg, transparent 10deg 20deg);
    animation: raysRotate 20s linear infinite;
}
@keyframes raysRotate { to { transform: rotate(360deg); } }

.success-modal__check {
    position: relative; bottom: -32px; z-index: 2;
    width: 72px; height: 72px;
    background: #1a1a1a;
    border: 4px solid #ee6f38;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; color: #ee6f38;
    box-shadow: 0 0 0 6px rgba(238,111,56,0.15), 0 8px 24px rgba(0,0,0,0.4);
    animation: checkPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes checkPop {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    100% { transform: scale(1) rotate(0deg);  opacity: 1; }
}

.success-modal__body { padding: 48px 28px 28px; }

.success-modal__title {
    color: white; font-size: 1.4rem; font-weight: 800;
    margin: 0 0 12px; letter-spacing: -0.3px;
}

.success-modal__order-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 16px;
    background: rgba(238,111,56,0.12);
    border: 1px solid rgba(238,111,56,0.3);
    border-radius: 20px;
    color: #ee6f38; font-weight: 700; font-size: 0.95rem;
    margin-bottom: 14px;
}
.success-modal__order-badge i { font-size: 0.8rem; }

.success-modal__msg {
    color: #888; font-size: 0.88rem; line-height: 1.6;
    margin: 0 0 20px;
}

.success-modal__info {
    display: flex; flex-direction: column; gap: 8px;
    background: #242424; border-radius: 12px;
    padding: 14px 16px; margin-bottom: 24px; text-align: left;
}
.success-modal__info-row {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.85rem; color: #aaa;
}
.success-modal__info-row i { color: #ee6f38; width: 14px; text-align: center; flex-shrink: 0; }
</style>