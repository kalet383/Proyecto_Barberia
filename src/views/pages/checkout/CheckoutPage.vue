<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useAuthStore } from '@/stores/auth';
import { useVentaStore, TipoPago } from '@/stores/venta';
import { useRouter } from 'vue-router';
import { ChevronRightIcon, TruckIcon, MapPinIcon, CashIcon } from 'vue-tabler-icons';
import PickupLocationModal from './PickupLocationModal.vue';

const productosStore = useProductosStore();
const authStore = useAuthStore();
const ventaStore = useVentaStore();
const router = useRouter();

// Form state
const contactEmail = ref('');
const deliveryMethod = ref('envio'); // 'envio' or 'retiro'
const country = ref('Colombia');

const firstName = ref('');
const lastName = ref('');
const idNumber = ref('');
const address = ref('');
const apartamento = ref('');
const city = ref('Montería');
const department = ref('Córdoba');
const phone = ref('');

// Billing Form state
const billingFirstName = ref('');
const billingLastName = ref('');
const billingIdNumber = ref('');
const billingAddress = ref('');
const billingCity = ref('');
const billingPhone = ref('');

const paymentMethod = ref<string>('wompi'); // Default to first option in image usually
const sameAsShipping = ref(true);
const saveInfo = ref(false);
const emailUpdates = ref(false);

const discountCode = ref('');

// Constants
const DEPARTMENTS = ['Córdoba', 'Antioquia', 'Bogotá D.C.', 'Cundinamarca']; // Demo list

// Modal state
const showConfirmModal = ref(false);
const orderData = ref<any>(null);

// Dialog State
const showLoginDialog = ref(false);
const showSuccessDialog = ref(false);
const confirmedOrderId = ref<number | null>(null);
const showShippingPolicy = ref(false);

// Pickup Logic
const showPickupModal = ref(false);
const pickupInfo = ref({
    distance: '',
    address: '',
    coords: null as any
});

const openPickupModal = () => {
    showPickupModal.value = true;
};

const handleLocationSelected = (data: any) => {
    pickupInfo.value = data;
    // user explicitly chose a location or confirmed pickup details
};

// Errors state
const errors = ref({
    email: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    phone: '',
    city: ''
});

// Initialize email if user is logged in
watch(() => authStore.user, (user) => {
    if (user) {
        const u = user as any;
        contactEmail.value = u.email || '';
        firstName.value = u.nombre || '';
        lastName.value = u.apellido || '';
        if (u.telefono) phone.value = u.telefono;
    }
}, { immediate: true });

// Shipping cost
const shippingCost = computed(() => deliveryMethod.value === 'envio' ? 13900 : 0);
const total = computed(() => productosStore.subtotalCarrito + shippingCost.value);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(value);
};

const validateForm = () => {
    let isValid = true;
    errors.value = { email: '', firstName: '', lastName: '', idNumber: '', address: '', phone: '', city: '' };

    if (!contactEmail.value) { errors.value.email = 'Requerido'; isValid = false; }
    else if (!/.+@.+\..+/.test(contactEmail.value)) { errors.value.email = 'Email inválido'; isValid = false; }

    if (deliveryMethod.value === 'envio') {
        if (!firstName.value) { errors.value.firstName = 'Requerido'; isValid = false; }
        if (!lastName.value) { errors.value.lastName = 'Requerido'; isValid = false; }
        if (!idNumber.value) { errors.value.idNumber = 'Requerido'; isValid = false; }
        if (!address.value) { errors.value.address = 'Requerido'; isValid = false; }
        if (!city.value) { errors.value.city = 'Requerido'; isValid = false; }
        if (!phone.value) { errors.value.phone = 'Requerido'; isValid = false; }
    }

    // Billing validation if applicable
    if (deliveryMethod.value === 'retiro' || !sameAsShipping.value) {
         if (!billingFirstName.value) isValid = false;
         if (!billingLastName.value) isValid = false;
         if (!billingIdNumber.value) isValid = false;
         if (!billingAddress.value) isValid = false;
         if (!billingCity.value) isValid = false;
         if (!billingPhone.value) isValid = false;
         // Note: kept simple for now, can add specific error messages later if needed
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

    return {
        direccion,
        notas,
        cliente: `${firstName.value} ${lastName.value}`,
        telefono: phone.value,
        metodoEntrega: deliveryMethod.value === 'envio' ? 'Envío a domicilio' : 'Retiro en Barbería'
    };
};

const showConfirmationModal = () => {
    if (!validateForm()) return;

    // Check if user is logged in
    if (!authStore.user) {
        // Here we could check if email already exists in backend, but for now simple logic:
        // If not authenticated, force login flow to associate order or register
        showLoginDialog.value = true;
        return;
    }

    // Verify email match?
    // User wants: "fill form, then if email detected ask login".
    // We already check !authStore.user.
    
    orderData.value = prepareOrderData();
    showConfirmModal.value = true;
};


const goToLogin = () => {
    const formData = {
        email: contactEmail.value,
        firstName: firstName.value,
        lastName: lastName.value,
        idNumber: idNumber.value,
        address: address.value,
        apartamento: apartamento.value,
        city: city.value,
        department: department.value,
        phone: phone.value,
        deliveryMethod: deliveryMethod.value,
        paymentMethod: paymentMethod.value,
        autoOpenModal: true
    };
    localStorage.setItem('checkout_temp_data', JSON.stringify(formData));
    router.push({ path: '/login1', query: { redirect: '/checkout' } });
};

const finishOrderProcess = () => {
    router.push('/mis-compras');
};

const goToHome = () => {
    router.push('/');
};

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
            
            if (parsed.autoOpenModal && authStore.user) {
                setTimeout(() => {
                    showConfirmationModal();
                }, 100);
            }
            localStorage.removeItem('checkout_temp_data');
        } catch (e) {
            console.error('Error restoring checkout data', e);
        }
    }
});

const confirmOrder = async () => {
    try {
        let tipoPagoBackend: TipoPago;
        switch (paymentMethod.value) {
            case 'pago_al_recibir':
                tipoPagoBackend = TipoPago.PAGO_CONTRA_ENTREGA;
                break;
            case 'transferencia_bancolombia':
            case 'transferencia_davivienda':
                tipoPagoBackend = TipoPago.TRANSFERENCIA;
                break;
            case 'wompi':
                // Assuming wompi is handled as online/card or just mapped to transfer for now/demo
                // Or maybe specific enum if exists. Using TRANSFERENCIA or PAGO_CONTRA_ENTREGA as placeholder?
                // The existing store only has EFECTIVO, PAGO_CONTRA_ENTREGA, TRANSFERENCIA.
                // I will map Wompi to TRANSFERENCIA (simulated online) or default.
                tipoPagoBackend = TipoPago.TRANSFERENCIA; 
                break;
            default:
                tipoPagoBackend = TipoPago.PAGO_CONTRA_ENTREGA;
        }

        const ventaData = {
            clienteId: (authStore.user as any).id,
            items: (productosStore.ComprasCarrito as any[]).map(item => ({
                productoId: item.id,
                cantidad: item.cantidad
            })),
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

interface Product {
    id: number;
    nombre: string;
    precio: number;
    img: string;
    cantidad: number;
}
</script>

<template>
    <v-container fluid class="checkout-page pa-0">
        <v-row no-gutters>
            <!-- Form Side -->
            <v-col cols="12" md="7" class="form-column py-8 px-4 px-md-16 border-right">
                <div class="checkout-form max-width-600 mx-auto mx-md-0 ml-md-auto">
                    <!-- Brand -->
                    <div class="brand-logo mb-6 text-center text-md-left">
                        <img src="/public/imagenes/logo/logo2.png" width="120" alt="StyleHub">
                    </div>

                    <!-- Breadcrumbs -->
                    <div class="d-flex align-center text-caption text-grey mb-8 justify-center justify-md-start">
                        <span class="text-primary cursor-pointer" @click="router.push('/carrito')">Carrito</span>
                        <ChevronRightIcon size="14" class="mx-2" />
                        <span class="text-black font-weight-bold">Información</span>
                        <ChevronRightIcon size="14" class="mx-2" />
                        <span>Envíos</span>
                         <ChevronRightIcon size="14" class="mx-2" />
                        <span>Pago</span>
                    </div>

                    <!-- Contact -->
                    <div class="section mb-8">
                        <div class="d-flex justify-space-between align-center mb-2">
                            <h3 class="text-h6 font-weight-bold">Contacto</h3>
                            <div v-if="!authStore.user">
                                <span class="text-body-2 mr-1">¿Ya tienes cuenta?</span>
                                <a href="#" @click.prevent="goToLogin" class="text-primary text-decoration-none font-weight-medium">Iniciar sesión</a>
                            </div>
                        </div>
                        <v-text-field 
                            v-model="contactEmail" 
                            label="Correo electrónico" 
                            variant="outlined" 
                            density="comfortable"
                            :error-messages="errors.email"
                            placeholder="tucorreo@ejemplo.com"
                            bg-color="white"
                        ></v-text-field>
                        <v-checkbox v-model="emailUpdates" label="Enviarme novedades y ofertas por correo electrónico" density="compact" hide-details class="mt-n2"></v-checkbox>
                    </div>

                    <!-- Delivery Method Toggle -->
                     <div class="section mb-6">
                        <h3 class="text-h6 font-weight-bold mb-3">Entrega</h3>
                        <div class="delivery-toggle border rounded mb-4 d-flex overflow-hidden">
                            <div 
                                class="toggle-option w-50 text-center py-3 cursor-pointer d-flex justify-center align-center gap-2"
                                :class="{ 'active': deliveryMethod === 'envio' }"
                                @click="deliveryMethod = 'envio'"
                            >
                                <TruckIcon size="20" /> Envío
                            </div>
                            <div 
                                class="toggle-option w-50 text-center py-3 cursor-pointer d-flex justify-center align-center gap-2 border-left"
                                :class="{ 'active': deliveryMethod === 'retiro' }"
                                @click="deliveryMethod = 'retiro'"
                            >
                                <MapPinIcon size="20" /> Retiro
                            </div>
                        </div>

                        <!-- Shipping Form -->
                        <div v-if="deliveryMethod === 'envio'">
                            <v-select 
                                v-model="country" 
                                label="País/Región" 
                                :items="['Colombia']" 
                                variant="outlined" 
                                density="comfortable" 
                                bg-color="white"
                                class="mb-3"
                            ></v-select>

                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="firstName" label="Nombre (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.firstName"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="lastName" label="Apellidos (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.lastName"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="idNumber" class="mt-3" label="Cédula, NIT o Pasaporte (Obligatorio - Solo números)" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.idNumber"></v-text-field>

                            <v-text-field v-model="address" class="mt-3" label="Dirección y Barrio (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.address"></v-text-field>

                            <v-text-field v-model="apartamento" class="mt-3" label="Número de Casa, Torre, Apartamento (Opcional)" variant="outlined" density="comfortable" bg-color="white"></v-text-field>

                            <v-row dense class="mt-3">
                                <v-col cols="4">
                                    <v-text-field v-model="city" label="Ciudad" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.city"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-select v-model="department" label="Departamento" :items="DEPARTMENTS" variant="outlined" density="comfortable" bg-color="white"></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="Código postal (opc...)" variant="outlined" density="comfortable" bg-color="white"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="phone" class="mt-3" label="Teléfono (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="errors.phone">
                                <template v-slot:append-inner>
                                    <v-icon icon="mdi-help-circle-outline" size="small" color="grey"></v-icon>
                                </template>
                            </v-text-field>

                             <v-checkbox v-model="saveInfo" label="Guardar mi información y consultar más rápidamente la próxima vez" density="compact" hide-details class="mt-n1"></v-checkbox>
                            
                             <h3 class="text-subtitle-1 font-weight-bold mt-6 mb-3">Método de envío</h3>
                             <div class="border rounded pa-4 d-flex justify-space-between align-center bg-grey-lighten-5">
                                 <div>
                                     <div class="text-body-2 font-weight-medium">ESTÁNDAR Entrega de 2 a 5 días hábiles</div>
                                 </div>
                                 <div class="font-weight-bold text-body-2">$13.900,00</div>
                             </div>
                        </div>
                        
                        <!-- Pickup Info -->
                        <div v-else>
                             <!-- Distance / Location Alert -->
                            <div class="bg-grey-lighten-4 pa-4 rounded mb-4 text-body-2 border">
                                <div class="d-flex align-start">
                                    <v-icon size="18" class="mr-2 mt-1" color="grey-darken-2">mdi-information-outline</v-icon>
                                    <div>
                                        <div v-if="pickupInfo.distance">La barbería StyleHub está a <strong>{{ pickupInfo.distance }} km</strong> de tu ubicación.</div>
                                        <div v-else>La barbería StyleHub está en Montería. Calcula la distancia desde tu ubicación.</div>
                                        
                                        <div class="mt-1">
                                            <a href="#" class="text-decoration-underline text-grey-darken-3 mr-1" @click.prevent="openPickupModal">Cambia tu ubicación</a>
                                            <span class="text-grey">o</span>
                                            <a href="#" class="text-decoration-underline text-grey-darken-3 ml-1" @click.prevent="deliveryMethod = 'envio'">enviar a la dirección</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <!-- Store Card -->
                            <v-card variant="outlined" class="pa-4 bg-white border cursor-pointer" @click="openPickupModal">
                                <div class="d-flex justify-space-between align-start">
                                    <div>
                                        <div class="font-weight-bold text-subtitle-1">StyleHub Barber Shop</div>
                                        <div class="text-caption text-grey-darken-1 mt-1">Calle Principal #123, Montería, Córdoba</div>
                                        
                                        <div class="d-flex align-center mt-2 gap-3 text-caption">
                                            <div class="d-flex align-center">
                                                <v-icon size="14" class="mr-1">mdi-map-marker-distance</v-icon>
                                                <span v-if="pickupInfo.distance">{{ pickupInfo.distance }} km</span>
                                                <span v-else>-- km</span>
                                            </div>
                                            <div class="d-flex align-center">
                                                <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                                                <span>Normalmente listo en 24 horas</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="font-weight-bold text-success text-caption">GRATIS</div>
                                </div>
                            </v-card>
                            
                            <div class="d-flex justify-space-between align-center px-2 py-3 cursor-pointer" @click="openPickupModal">
                                <span class="text-body-2">Cambiar lugar</span>
                                <v-icon size="16">mdi-chevron-right</v-icon>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Methods -->
                    <div class="section mb-8">
                        <h3 class="text-h6 font-weight-bold mb-2">Formas de Pago</h3>
                        <p class="text-caption text-grey mb-4">Todas las transacciones son seguras y están encriptadas.</p>
                        
                        <v-radio-group v-model="paymentMethod" class="payment-options border rounded overflow-hidden" hide-details>
                            
                            <!-- Wompi -->
                            <v-radio value="wompi" class="pa-4 border-bottom w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <div class="d-flex align-center justify-space-between w-100">
                                        <span class="font-weight-bold ml-2">Wompi</span>
                                        <div class="d-flex gap-1">
                                            <v-img src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png" width="30" height="20" contain></v-img>
                                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" width="30" height="20" contain></v-img>
                                        </div>
                                    </div>
                                </template>
                            </v-radio>
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'wompi'" class="pa-6 bg-grey-lighten-5 border-bottom text-body-2 text-center text-grey-darken-2">
                                     <v-icon size="48" class="mb-2">mdi-monitor-cellphone</v-icon>
                                     <p>Después de hacer clic en "Pagar ahora", serás redirigido a Wompi para completar tu compra de forma segura.</p>
                                </div>
                            </v-expand-transition>

                            <!-- Paga al recibir -->
                            <v-radio value="pago_al_recibir" class="pa-4 border-bottom w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <span class="font-weight-bold ml-2">Paga al Recibir</span>
                                </template>
                            </v-radio>
                             <v-expand-transition>
                                <div v-if="paymentMethod === 'pago_al_recibir'" class="pa-4 bg-grey-lighten-5 border-bottom text-body-2 text-grey-darken-2">
                                    <p>Paga en efectivo al momento de la entrega.</p>
                                </div>
                            </v-expand-transition>

                            <!-- Bancolombia -->
                            <v-radio value="transferencia_bancolombia" class="pa-4 border-bottom w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <span class="font-weight-bold ml-2">Transferencia Bancolombia</span>
                                </template>
                            </v-radio>

                             <!-- Davivienda -->
                            <v-radio value="transferencia_davivienda" class="pa-4 w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <span class="font-weight-bold ml-2">Transferencia Davivienda</span>
                                </template>
                            </v-radio>

                        </v-radio-group>
                    </div>

                    <!-- Billing Address -->
                    <div class="section mb-8">
                         <h3 class="text-h6 font-weight-bold mb-3">Dirección de facturación</h3>
                         
                         <!-- Toggle only for Shipping -->
                         <v-radio-group v-if="deliveryMethod === 'envio'" v-model="sameAsShipping" class="payment-options border rounded overflow-hidden mb-4" hide-details>
                            <v-radio :value="true" class="pa-4 border-bottom w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <span class="font-weight-medium ml-2">La misma dirección de envío</span>
                                </template>
                            </v-radio>
                            <v-radio :value="false" class="pa-4 w-100 mr-0 bg-white">
                                <template v-slot:label>
                                    <span class="font-weight-medium ml-2">Usar una dirección de facturación distinta</span>
                                </template>
                            </v-radio>
                        </v-radio-group>

                        <!-- Billing Form (Shows if Retiro OR Different Address) -->
                        <div v-if="deliveryMethod === 'retiro' || !sameAsShipping">
                            <v-select 
                                label="País/Región" 
                                :items="['Colombia']" 
                                model-value="Colombia"
                                variant="outlined" 
                                density="comfortable" 
                                bg-color="white"
                                class="mb-3"
                            ></v-select>

                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="billingFirstName" label="Nombre (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="!billingFirstName && !sameAsShipping ? 'Requerido' : ''"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="billingLastName" label="Apellidos (Obligatorio)" variant="outlined" density="comfortable" bg-color="white" :error-messages="!billingLastName && !sameAsShipping ? 'Requerido' : ''"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="billingIdNumber" class="mt-3" label="Cédula, NIT o Pasaporte (Obligatorio - Solo números)" variant="outlined" density="comfortable" bg-color="white"></v-text-field>

                            <v-text-field v-model="billingAddress" class="mt-3" label="Dirección y Barrio (Obligatorio)" variant="outlined" density="comfortable" bg-color="white"></v-text-field>

                            <v-text-field class="mt-3" label="Número de Casa, Torre, Apartamento (Opcional)" variant="outlined" density="comfortable" bg-color="white"></v-text-field>

                            <v-row dense class="mt-3">
                                <v-col cols="4">
                                    <v-text-field v-model="billingCity" label="Ciudad" variant="outlined" density="comfortable" bg-color="white"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                     <v-select label="Departamento" :items="DEPARTMENTS" model-value="Córdoba" variant="outlined" density="comfortable" bg-color="white"></v-select>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field label="Código postal" variant="outlined" density="comfortable" bg-color="white"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="billingPhone" class="mt-3" label="Teléfono (Obligatorio)" variant="outlined" density="comfortable" bg-color="white">
                                <template v-slot:append-inner>
                                    <v-icon icon="mdi-help-circle-outline" size="small" color="grey"></v-icon>
                                </template>
                            </v-text-field>
                        </div>
                    </div>

                    <v-btn 
                        color="black" 
                        size="large" 
                        block 
                        @click="showConfirmationModal" 
                        class="text-white font-weight-bold text-none rounded-md" 
                        height="56"
                        flat
                        style="background-color: #000 !important; color: #fff !important;"
                    >
                        Pagar ahora
                    </v-btn>

                    <div class="footer-links mt-12 pt-6 border-top d-flex flex-wrap gap-4 text-caption text-primary">
                        <a href="#" class="text-decoration-underline text-grey-darken-1">Política de reembolso</a>
                        <a href="#" class="text-decoration-underline text-grey-darken-1">Política de envíos</a>
                        <a href="#" class="text-decoration-underline text-grey-darken-1">Política de privacidad</a>
                        <a href="#" class="text-decoration-underline text-grey-darken-1">Términos del servicio</a>
                    </div>
                </div>
            </v-col>

            <!-- Summary Side -->
            <v-col cols="12" md="5" class="bg-grey-lighten-5 py-8 px-4 px-md-10 border-left min-vh-100">
                <div class="order-summary sticky-top pt-md-8 max-width-450">
                    <v-list class="bg-transparent pa-0 mb-6">
                        <v-list-item v-for="item in (productosStore.ComprasCarrito as Product[])" :key="item.id" class="px-0 py-3">
                            <template v-slot:prepend>
                                <div class="item-img-container position-relative">
                                    <v-img :src="item.img" width="64" height="64" cover class="border rounded bg-white"></v-img>
                                    <v-badge color="grey-darken-3" text-color="white" :content="item.cantidad" class="qty-badge" offset-x="-10" offset-y="-10" floating></v-badge>
                                </div>
                            </template>
                            <div class="ml-4 d-flex justify-space-between align-center w-100">
                                <div>
                                    <div class="text-body-2 font-weight-bold mb-1">{{ item.nombre }}</div>
                                    <div class="text-caption text-grey">1.3 oz (Travel Size)</div> <!-- Hardcoded stub based on img, can be dynamic -->
                                </div>
                                <div class="font-weight-medium text-body-2">{{ formatCurrency(item.precio * item.cantidad) }}</div>
                            </div>
                        </v-list-item>
                    </v-list>

                    <v-divider class="mb-6"></v-divider>

                    <div class="discount-code d-flex gap-3 mb-6">
                        <v-text-field 
                            v-model="discountCode" 
                            label="Código de descuento o tarjeta de regalo" 
                            variant="outlined" 
                            density="comfortable" 
                            hide-details 
                            bg-color="white"
                        ></v-text-field>
                        <v-btn variant="outlined" color="grey-darken-1" height="48" class="text-none">Aplicar</v-btn>
                    </div>

                    <v-divider class="mb-6"></v-divider>

                    <div class="totals py-2">
                        <div class="d-flex justify-space-between mb-2 text-body-2">
                            <span>Subtotal</span>
                            <span class="font-weight-bold">{{ formatCurrency(productosStore.subtotalCarrito) }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-2 text-body-2">
                             <div class="d-flex align-center">
                                <span>{{ deliveryMethod === 'retiro' ? 'Retiro en tienda' : 'Envíos' }}</span>
                                <v-icon size="14" class="ml-1 cursor-pointer text-grey" @click="showShippingPolicy = true">mdi-help-circle-outline</v-icon>
                            </div>
                            <span class="font-weight-bold" v-if="deliveryMethod === 'envio'">{{ formatCurrency(shippingCost) }}</span>
                            <span class="text-success font-weight-bold" v-else>GRATIS</span>
                        </div>
                        
                        <v-divider class="my-4"></v-divider>
                        
                        <div class="d-flex justify-space-between align-center">
                            <span class="text-h6 font-weight-bold">Total</span>
                            <div class="d-flex align-baseline">
                                <span class="text-caption text-grey mr-2">COP</span>
                                <span class="text-h5 font-weight-bold">{{ formatCurrency(total) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>

        <!-- Modals -->
        <PickupLocationModal 
            v-model="showPickupModal" 
            @location-selected="handleLocationSelected" 
        />

        <!-- Shipping Policy Modal -->
        <v-dialog v-model="showShippingPolicy" max-width="700" scrollable>
            <v-card class="rounded-lg">
                <v-card-title class="d-flex justify-space-between align-center pa-4 bg-white border-bottom">
                     <span class="text-h6 font-weight-bold">POLÍTICA DE ENVÍO</span>
                     <v-btn icon variant="text" @click="showShippingPolicy = false" density="compact">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text class="pa-6 text-body-2">
                    <p class="mb-4">El transporte de los artículos comprados en CAPIMARKET.COM y/o en tiendas físicas se realizará a través de una empresa de mensajería especializada.</p>
                    
                    <p class="mb-4">Los plazos de entrega serán con carácter general de un máximo de (8) días laborables. Dichos plazos pueden variar en función de las circunstancias concretas de cada pedido, como la disponibilidad del producto escogido o la zona de envío. Asimismo, en circunstancias excepcionales dicho plazo podría verse alterado por incidencias extraordinarias en el transportista o por dificultades en la entrega de la mercancía. En estos casos, el plazo de entrega puede ser de hasta (15) días hábiles.</p>
                    
                    <p class="mb-4">Para evitar incidencias en la entrega (direcciones erróneas, imposibilidad de encontrar a alguien en el domicilio etc.), es indispensable completar correctamente el correspondiente formulario siendo obligatorio rellenar la casilla relativa a los teléfonos de contacto.</p>
                    
                    <p class="mb-4">La responsabilidad de CAPITÁN BARBAS® queda limitada en casos de fuerza mayor (huelgas, fenómenos climatológicos adversos que impidan el tráfico normal por tierra, mar o aire,…). En estos casos, se entregarán los pedidos lo antes posible, y los plazos arriba indicados no aplicarán.</p>
                    
                    <p class="mb-4">Los plazos de entrega dependen del tiempo de gestión del pedido y del envío, pudendo variar en función de la red de distribución provista por las agencias de transporte en cada región. En el momento de la entrega el Cliente no deberá hacer pago alguno salvo que haya elegido como medio de pago el contra-entrega, en cuyo caso, deberá abonar el importe del pedido, el transporte y el recargo de este servicio en el momento de la recepción.</p>
                    
                    <p class="mb-4">Los plazos de gestión de un pedido varían para cada venta, si bien, en condiciones normales, el plazo mínimo de gestión de un pedido realizado a través de CAPIMARKET.COM antes de las 14:00 horas, en día habíl, será de (1) día y el máximo de (15) días, dependiendo del tipo o clase de producto y del lugar de entrega.</p>
                    
                    <p class="mb-4">CAPITÁN BARBAS® no asume responsabilidad alguna por las consecuencias de posibles retrasos en el envío.</p>
                    
                    <p class="mb-4">Nuestros transportistas intentan entregar hasta 2 veces en la dirección proporcionada por el cliente, en horario laboral de 9:00 a.m a 6:00 p.m. Es responsabilidad del cliente estar presente en la dirección de entrega proporcionada a CAPIMARKET.COM.</p>
                    
                    <p class="mb-4">En caso de no localizar al destinatario en el lugar indicado en el pedido, la agencia de transporte deja una nota de aviso con un teléfono para que pueda concretar fecha, hora y lugar exactos del segundo intento de entrega y, en su defecto, éste se realizará al día hábil siguiente. Si tras este no se logra la entrega, el transportista devolverá el paquete a origen, y CAPITÁN BARBAS® reintegrará el importe del pedido, deduciendo los costes asociados a la devolución.</p>
                    
                    <p class="mb-4">Si la dirección de entrega de tu orden está erronea, se cobrará un domicilio adicional.</p>
                    
                    <h3 class="font-weight-bold mb-2">No encuentro la respuesta a mi pregunta, ¿qué hago?</h3>
                    <p>Si tienes dudas ESCRIBE O LLAMA +57 (350) 489-7346.</p>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="showConfirmModal" max-width="600">
            <v-card>
                <v-card-title class="pa-4 bg-black text-white text-h6 font-weight-bold">Confirmar Compra</v-card-title>
                <v-card-text class="pa-6">
                     <p>Estás a un paso de completar tu pedido. Revisa los detalles.</p>
                     <v-divider class="my-4"></v-divider>
                     <div><strong>Total a Pagar:</strong> {{ formatCurrency(total) }}</div>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="showConfirmModal = false">Cancelar</v-btn>
                    <v-btn color="black" variant="flat" @click="confirmOrder">Confirmar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Login Dialog -->
        <v-dialog v-model="showLoginDialog" max-width="450">
            <v-card class="rounded-lg">
                <v-card-title class="text-h6 py-4 px-6">
                    Inicia sesión para continuar
                </v-card-title>
                <v-card-text class="px-6 pb-6">
                    <p class="text-body-2 text-grey-darken-1 mb-4">
                        Ya existe una cuenta asociada a <strong>{{ contactEmail }}</strong> o necesitas crear una para continuar con el pedido y hacer seguimiento.
                    </p>
                    <v-btn block color="primary" @click="goToLogin" size="large" class="text-none">
                        Iniciar Sesión / Registrarse
                    </v-btn>
                    <v-btn block variant="text" class="mt-2 text-none" @click="showLoginDialog = false">
                        Volver
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        
        <!-- Success Dialog -->
        <v-dialog v-model="showSuccessDialog" max-width="500" persistent>
             <v-card class="text-center pa-8 rounded-lg">
                <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
                <h2 class="text-h5 font-weight-bold mb-2">¡Gracias por tu compra!</h2>
                <p class="text-body-1 text-grey mb-6">Tu pedido #{{ confirmedOrderId }} ha sido confirmado.</p>
                <v-btn block color="black" size="large" class="mb-3 text-none" @click="finishOrderProcess">Ver mis pedidos</v-btn>
                <v-btn block variant="text" class="text-none" @click="goToHome">Volver a la tienda</v-btn>
             </v-card>
        </v-dialog>

    </v-container>
</template>

<style scoped>
.checkout-page {
    background-color: white;
    min-height: 100vh;
}

.max-width-600 {
    max-width: 600px;
}

.max-width-450 {
    max-width: 450px;
}

.brand-logo img {
    display: inline-block;
}

.cursor-pointer {
    cursor: pointer;
}

.form-column {
    min-height: 100vh;
}

.toggle-option {
    background-color: #fff;
    color: #666;
    transition: all 0.2s;
}

.toggle-option:hover {
    background-color: #f5f5f5;
}

.toggle-option.active {
    background-color: #f0f0f0;
    color: #000;
    font-weight: bold;
    border: 1px solid #000;
}

.delivery-toggle {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
}

.min-vh-100 {
    min-height: 100vh;
}

.sticky-top {
    position: sticky;
    top: 20px;
}

/* Customizing Vuetify inputs to look more like Shopify */
:deep(.v-field__outline) {
    --v-field-border-opacity: 0.15;
}

:deep(.v-field:hover .v-field__outline) {
    --v-field-border-opacity: 0.3;
}

:deep(.v-field--focused .v-field__outline) {
    --v-field-border-width: 2px;
    --v-field-border-opacity: 1;
    color: #ee6f38;
}

.qty-badge :deep(.v-badge__badge) {
    background-color: rgba(100,100,100,0.9) !important;
    font-size: 11px;
    height: 20px;
    min-width: 20px;
    padding: 0 4px;
}

.payment-options {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}

.border-left {
    border-left: 1px solid #e0e0e0;
}

.border-right {
    border-right: 1px solid #e0e0e0;
}

@media (max-width: 960px) {
    .border-right, .border-left {
        border: none;
    }
    .form-column {
        order: 2;
    }
    .bg-grey-lighten-5 {
        order: 1;
        border-bottom: 1px solid #e0e0e0;
    }
}
</style>
