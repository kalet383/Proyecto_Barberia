<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ChevronRightIcon, TruckIcon, MapPinIcon, CreditCardIcon, BuildingBankIcon, CashIcon } from 'vue-tabler-icons';
import axios from '@/utils/axios'; // Or standard axios if utils not available, checking imports

const productosStore = useProductosStore();
const router = useRouter();

// Form state
const email = ref('');
const deliveryMethod = ref('envio'); // 'envio' or 'retiro'
const firstName = ref('');
const lastName = ref('');
const idNumber = ref('');
const address = ref('');
const apartamento = ref(''); // Nuevo
const city = ref('Montería');
const department = ref('Córdoba'); // Nuevo
const phone = ref('');
const paymentMethod = ref('paga-recibir'); // Default adjusted
const sameAsShipping = ref(true);

// Billing Address State
const billingValues = ref({
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    city: 'Montería',
    phone: ''
});

// Errors state
const errors = ref({
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    phone: '',
    email: ''
});

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
    errors.value = { firstName: '', lastName: '', idNumber: '', address: '', phone: '', email: '' };

    // Validation only if Shipping is selected
    if (deliveryMethod.value === 'envio') {
        if (!firstName.value) { errors.value.firstName = 'Requerido'; isValid = false; }
        if (!lastName.value) { errors.value.lastName = 'Requerido'; isValid = false; }
        if (!idNumber.value) { errors.value.idNumber = 'Requerido'; isValid = false; }
        if (!address.value) { errors.value.address = 'Requerido'; isValid = false; }
        if (!phone.value) { errors.value.phone = 'Requerido'; isValid = false; }
    }

    // You can add email validation here if needed
    // if (!email.value) { errors.value.email = 'Requerido'; isValid = false; }

    return isValid;
};

const finalizeOrder = async () => {
    if (!validateForm()) {
        alert('Por favor completa todos los campos obligatorios.');
        return;
    }
    
    // Check auth
    const authStore = useAuthStore();
    
    if (!authStore.user) {
         if (confirm('Debes iniciar sesión para que la compra quede registrada en tu historial. ¿Deseas iniciar sesión ahora? (Si cancelas, no se guardará la compra)')) {
            router.push('/login');
            return;
         }
         // If they don't want to login, for now we effectively block or we need a guest API. 
         // User emphasized "al iniciar sesion debe estar en su historial". 
         // So blocking is safer for requirements.
         return;
    }
    
    try {
        const payload = productosStore.ComprasCarrito.map(item => ({
            clienteId: authStore.user.id,
            barberoId: null, // Optional, could be selected if "Retiro" implies a barber relation? Assuming null for web sales.
            productoId: item.id,
            cantidad: item.cantidad,
            tipoPago: paymentMethod.value,
            notas: `Envío a: ${address.value}, ${city.value}, ${department.value}. Tel: ${phone.value}. Cliente: ${firstName.value} ${lastName.value} - ${idNumber.value}`
        }));

        console.log('Enviando orden:', payload);

        // Call Backend
        const response = await axios.post('/venta/bulk', payload);

        if (response.data.success) {
            alert('¡Pedido realizado con éxito! Gracias por tu compra.');
            productosStore.VaciarCarrito();
            router.push('/');
        } else {
             alert('Hubo un problema procesando tu orden: ' + (response.data.mensaje || 'Error desconocido'));
        }
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
    <v-container class="checkout-page py-8">
        <v-row>
            <!-- Form Side -->
            <v-col cols="12" md="7">
                <div class="checkout-form pr-md-8">
                    <div class="brand-logo mb-6">
                        <h2 class="text-h4 font-weight-bold">STYLEHUB</h2>
                    </div>

                    <!-- Breadcrumbs -->
                    <div class="d-flex align-center text-caption text-grey mb-8">
                        <span class="text-black">Carrito</span>
                        <ChevronRightIcon size="14" class="mx-2" />
                        <span class="text-black font-weight-bold">Información</span>
                        <ChevronRightIcon size="14" class="mx-2" />
                        <span>Pago</span>
                    </div>

                    <!-- Contact -->
                    <div class="section mb-8">
                        <div class="d-flex justify-space-between align-center mb-4">
                            <h3 class="text-h6 font-weight-bold">Contacto</h3>
                            <v-btn variant="text" size="small" to="/login" class="text-none">¿Ya tienes una cuenta? Iniciar sesión</v-btn>
                        </div>
                        <v-text-field v-model="email" label="Correo electrónico" placeholder="Email" variant="outlined" density="comfortable"></v-text-field>
                        <v-checkbox label="Enviarme novedades y ofertas por correo electrónico" hide-details density="compact"></v-checkbox>
                    </div>

                    <!-- Delivery -->
                    <div class="section mb-8">
                        <h3 class="text-h6 font-weight-bold mb-4">Selecciona el tipo de envío:</h3>
                        <v-radio-group v-model="deliveryMethod" class="delivery-options border rounded" hide-details>
                            <v-radio value="envio" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center justify-space-between w-100">
                                        <div class="d-flex align-center">
                                            <div class="d-flex flex-column">
                                                <span class="font-weight-bold">ESTÁNDAR Entrega de 2 a 5 días hábiles según la ubicación.</span>
                                                <span class="text-caption text-grey">Se envía al día siguiente</span>
                                            </div>
                                        </div>
                                        <div class="font-weight-bold">$13.900,00</div>
                                    </div>
                                </template>
                            </v-radio>
                            <v-radio value="retiro" class="pa-4 w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center justify-space-between w-100">
                                        <div class="d-flex align-center">
                                            <MapPinIcon size="20" class="mr-3" />
                                            <span>Retiro en Sucursal</span>
                                        </div>
                                        <div class="font-weight-bold">Gratis</div>
                                    </div>
                                </template>
                            </v-radio>
                        </v-radio-group>
                    </div>

                    <!-- Address Form (Always visible or toggled based on preference, currently toggled) -->
                    <div class="section mb-8" v-if="deliveryMethod === 'envio'">
                        <v-row>
                            <v-col cols="12" class="py-1">
                                <v-select label="País/Región" :items="['Colombia']" variant="outlined" density="comfortable" model-value="Colombia" readonly disabled></v-select>
                            </v-col>
                            <v-col cols="12" md="6" class="py-1">
                                <v-text-field v-model="firstName" label="Nombre (Obligatorio)" variant="outlined" density="comfortable" :error-messages="errors.firstName"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="py-1">
                                <v-text-field v-model="lastName" label="Apellidos (Obligatorio)" variant="outlined" density="comfortable" :error-messages="errors.lastName"></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-1">
                                <v-text-field v-model="idNumber" label="Cédula, NIT o Pasaporte (Obligatorio - Solo números)" variant="outlined" density="comfortable" :error-messages="errors.idNumber"></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-1">
                                <v-text-field v-model="address" label="Dirección y Barrio (Obligatorio)" variant="outlined" density="comfortable" :error-messages="errors.address"></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-1">
                                <v-text-field v-model="apartamento" label="Número de Casa, Torre, Apartamento (Opcional)" variant="outlined" density="comfortable"></v-text-field>
                            </v-col>
                            <v-col cols="4" class="py-1">
                                <v-select v-model="department" label="Departamento" :items="['Córdoba']" variant="outlined" density="comfortable" readonly></v-select>
                            </v-col>
                            <v-col cols="4" class="py-1">
                                <v-text-field v-model="city" label="Ciudad" variant="outlined" density="comfortable" readonly></v-text-field>
                            </v-col>
                            <v-col cols="4" class="py-1">
                                <v-text-field label="Código postal (opcional)" variant="outlined" density="comfortable"></v-text-field>
                            </v-col>
                            <v-col cols="12" class="py-1">
                                <v-text-field v-model="phone" label="Teléfono (Obligatorio)" variant="outlined" density="comfortable" :error-messages="errors.phone">
                                    <template v-slot:append-inner>
                                        <v-tooltip location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" icon="mdi-help-circle-outline" size="small"></v-icon>
                                            </template>
                                            <span>Usado para contactarte sobre la entrega</span>
                                        </v-tooltip>
                                    </template>
                                </v-text-field>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- Pickup info (Only for Retiro) -->
                    <div class="section mb-8" v-else>
                        <h3 class="text-subtitle-1 font-weight-bold mb-2">Lugares de retiro</h3>
                        <v-card variant="outlined" class="pa-4 bg-grey-lighten-4">
                            <div class="d-flex justify-space-between align-center">
                                <div>
                                    <div class="font-weight-bold">CAPITÁN BARBAS® Montería</div>
                                    <div class="text-caption">Calle 123 #45-67, Montería, Córdoba</div>
                                    <div class="text-caption text-success font-weight-bold">Gratis • Normalmente listo en 24 horas</div>
                                </div>
                                <v-btn variant="text" size="small" color="primary">Ver mapa</v-btn>
                            </div>
                        </v-card>
                    </div>

                    <!-- Payment Methods -->
                    <div class="section mb-8">
                        <h3 class="text-h6 font-weight-bold mb-2">Formas de Pago</h3>
                        <p class="text-caption text-grey mb-4">Todas las transacciones son seguras y están encriptadas.</p>
                        
                        <v-radio-group v-model="paymentMethod" class="payment-options border rounded" hide-details>
                            <v-radio value="wompi" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center justify-space-between w-100">
                                        <div class="d-flex align-center">
                                            <span class="mr-2">Wompi</span>
                                        </div>
                                        <div class="d-flex gap-1">
                                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" width="30"></v-img>
                                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" width="30"></v-img>
                                            <v-img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" width="30"></v-img>
                                        </div>
                                    </div>
                                </template>
                            </v-radio>
                            
                            <v-radio value="paga-recibir" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center font-weight-bold">
                                        Paga al Recibir
                                    </div>
                                </template>
                            </v-radio>
                             <!-- Info Paga al Recibir -->
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'paga-recibir'" class="pa-4 bg-grey-lighten-4 border-bottom text-body-2 text-grey-darken-2">
                                    <div class="d-flex justify-center mb-4">
                                        <CashIcon size="40" stroke-width="1.5" />
                                    </div>
                                    <p align="justify">Con Paga al Recibir, ahora puedes recibir tu pedido y pagar únicamente cuando lo tengas en tus manos. Este método te permite revisar tu compra antes de pagar, brindándote mayor seguridad y tranquilidad en cada transacción, sin necesidad de registros, suscripciones, ni compartir datos bancarios.</p>
                                </div>
                            </v-expand-transition>

                            <v-radio value="bancolombia" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        Transferencia Bancolombia
                                    </div>
                                </template>
                            </v-radio>
                             <!-- Info Bancolombia -->
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'bancolombia'" class="pa-4 bg-grey-lighten-4 border-bottom text-body-2 text-grey-darken-2">
                                     <p class="mb-2" align="justify">Realiza el pago de tu pedido desde la aplicación de Bancolombia haciendo una transferencia electrónica a nuestra cuenta, tendrás mayor control sobre tu pago y la seguridad de realizarlo directamente desde tu banco, sin necesidad de compartir tus datos bancarios en línea.</p>
                                     <p align="justify">Una vez que hagas clic en "Finalizar el pedido", te mostraremos los datos de nuestra cuenta en Bancolombia para que puedas completar tu compra de manera fácil y rápida. ¡Así, compras con total tranquilidad y comodidad!</p>
                                </div>
                            </v-expand-transition>

                            <v-radio value="davivienda" class="pa-4 w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        Transferencia Davivienda
                                    </div>
                                </template>
                            </v-radio>
                            <!-- Info Davivienda -->
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'davivienda'" class="pa-4 bg-grey-lighten-4 text-body-2 text-grey-darken-2">
                                     <p class="mb-2" align="justify">Realiza el pago de tu pedido desde la aplicación de Davivienda haciendo una transferencia electrónica a nuestra cuenta, tendrás mayor control sobre tu pago y la seguridad de realizarlo directamente desde tu banco, sin necesidad de compartir tus datos bancarios en línea.</p>
                                     <p align="justify">Una vez que hagas clic en "Finalizar el pedido", te mostraremos los datos de nuestra cuenta en Davivienda para que puedas completar tu compra de manera fácil y rápida. ¡Así, compras con total tranquilidad y comodidad!</p>
                                </div>
                            </v-expand-transition>
                        </v-radio-group>
                    </div>

                    <!-- Billing Address -->
                    <div class="section mb-8">
                        <h3 class="text-h6 font-weight-bold mb-4">Dirección de facturación</h3>
                        <v-radio-group v-model="sameAsShipping" class="border rounded" hide-details>
                            <v-radio :value="true" label="La misma dirección de envío" class="pa-4 border-bottom w-100 mr-0"></v-radio>
                            <v-radio :value="false" label="Usar una dirección de facturación distinta" class="pa-4 w-100 mr-0"></v-radio>
                        </v-radio-group>

                        <!-- Secondary Form for Billing -->
                        <v-expand-transition>
                            <div v-if="!sameAsShipping" class="pa-4 border-left border-right border-bottom bg-grey-lighten-5">
                                 <v-row>
                                    <v-col cols="12" class="py-1">
                                        <v-select label="País/Región" :items="['Colombia']" variant="outlined" density="comfortable" model-value="Colombia" readonly disabled></v-select>
                                    </v-col>
                                    <v-col cols="12" md="6" class="py-1">
                                        <v-text-field v-model="billingValues.firstName" label="Nombre (Obligatorio)" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6" class="py-1">
                                        <v-text-field v-model="billingValues.lastName" label="Apellidos (Obligatorio)" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="py-1">
                                        <v-text-field v-model="billingValues.idNumber" label="Cédula, NIT o Pasaporte (Obligatorio - Solo números)" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" class="py-1">
                                        <v-text-field v-model="billingValues.address" label="Dirección y Barrio (Obligatorio)" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6" class="py-1">
                                        <v-text-field v-model="billingValues.city" label="Ciudad" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="6" class="py-1">
                                        <v-text-field v-model="billingValues.phone" label="Teléfono (Obligatorio)" variant="outlined" density="comfortable"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expand-transition>
                    </div>

                    <v-btn 
                        color="black" 
                        size="large" 
                        block 
                        @click="finalizeOrder" 
                        class="text-white font-weight-bold" 
                        height="48"
                        style="background-color: black !important; color: white !important;"
                    >
                        Pagar ahora
                    </v-btn>

                    <div class="footer-links mt-12 pt-6 border-top d-flex gap-4 text-caption text-primary">
                        <a href="#">Política de reembolso</a>
                        <a href="#">Política de envíos</a>
                        <a href="#">Política de privacidad</a>
                        <a href="#">Términos de servicio</a>
                    </div>
                </div>
            </v-col>

            <!-- Summary Side -->
            <v-col cols="12" md="5" class="bg-grey-lighten-5 py-8 px-md-8 border-left min-vh-100">
                <div class="order-summary sticky-top">
                    <v-list class="bg-transparent pa-0 mb-6">
                        <v-list-item v-for="item in (productosStore.ComprasCarrito as Product[])" :key="item.id" class="px-0 py-4 border-bottom">
                            <template v-slot:prepend>
                                <v-badge color="grey-darken-1" :content="item.cantidad" location="right top" overlap>
                                    <v-img :src="item.img" width="64" height="64" cover class="border rounded"></v-img>
                                </v-badge>
                            </template>
                            <div class="ml-4 d-flex justify-space-between align-center w-100">
                                <div>
                                    <div class="text-subtitle-2 font-weight-bold">{{ item.nombre }}</div>
                                    <div class="text-caption text-grey">Cantidad: {{ item.cantidad }}</div>
                                </div>
                                <div class="font-weight-bold">{{ formatCurrency(item.precio * item.cantidad) }}</div>
                            </div>
                        </v-list-item>
                    </v-list>

                    <div class="discount-code d-flex gap-2 mb-8">
                        <v-text-field label="Código de descuento o tarjeta de regalo" variant="outlined" density="comfortable" hide-details></v-text-field>
                        <v-btn variant="flat" color="grey-lighten-2" height="48">Aplicar</v-btn>
                    </div>

                    <div class="totals py-4">
                        <div class="d-flex justify-space-between mb-2">
                            <span>Subtotal</span>
                            <span class="font-weight-bold">{{ formatCurrency(productosStore.subtotalCarrito) }}</span>
                        </div>
                        <div class="d-flex justify-space-between mb-2">
                            <span class="d-flex align-center">Envíos <v-icon size="14" class="ml-1" color="grey">mdi-help-circle-outline</v-icon></span>
                            <span class="font-weight-bold" v-if="deliveryMethod === 'envio'">{{ formatCurrency(shippingCost) }}</span>
                            <span class="text-success font-weight-bold" v-else>Gratis</span>
                        </div>
                        <div class="d-flex justify-space-between mt-4 text-h5 font-weight-bold">
                            <span>Total</span>
                            <div class="text-right">
                                <span class="text-caption text-grey mr-2">COP</span>
                                <span>{{ formatCurrency(total) }}</span>
                            </div>
                        </div>
                        <div class="text-caption text-grey text-right">Incluye {{ formatCurrency(total * 0.19) }} de impuestos</div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.checkout-page {
    max-width: 1200px;
}

.border-bottom {
    border-bottom: 1px solid #e0e0e0;
}

.border-top {
    border-top: 1px solid #e0e0e0;
}

.border-left {
    border-left: 1px solid #e0e0e0;
}

.min-vh-100 {
    min-height: 100vh;
}

.sticky-top {
    position: sticky;
    top: 100px;
}

.delivery-options :deep(.v-selection-control) {
    display: none;
}

.payment-options :deep(.v-selection-control) {
    display: none;
}

.v-radio--selected {
    background-color: #f8f9fa;
    border: 2px solid #000 !important;
}

.text-primary {
    color: #ee6f38 !important;
}

.text-success {
    color: #4caf50 !important;
}
</style>
