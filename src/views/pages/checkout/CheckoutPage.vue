<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProductosStore } from '@/stores/useProductosStore';
import { useAuthStore } from '@/stores/auth';
import { useVentaStore, TipoPago } from '@/stores/venta';
import { useRouter } from 'vue-router';
import { ChevronRightIcon, TruckIcon, MapPinIcon, CashIcon } from 'vue-tabler-icons';

const productosStore = useProductosStore();
const authStore = useAuthStore();
const ventaStore = useVentaStore();
const router = useRouter();

// Form state
const deliveryMethod = ref('envio'); // 'envio' or 'retiro'
const firstName = ref('');
const lastName = ref('');
const idNumber = ref('');
const address = ref('');
const apartamento = ref('');
const city = ref('Montería');
const department = ref('Córdoba');
const phone = ref('');
const paymentMethod = ref<string>('PAGO_CONTRA_ENTREGA');
const sameAsShipping = ref(true);

// Modal state
const showConfirmModal = ref(false);
const orderData = ref<any>(null);

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
    phone: ''
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
    errors.value = { firstName: '', lastName: '', idNumber: '', address: '', phone: '' };

    // Validation only if Shipping is selected
    if (deliveryMethod.value === 'envio') {
        if (!firstName.value) { errors.value.firstName = 'Requerido'; isValid = false; }
        if (!lastName.value) { errors.value.lastName = 'Requerido'; isValid = false; }
        if (!idNumber.value) { errors.value.idNumber = 'Requerido'; isValid = false; }
        if (!address.value) { errors.value.address = 'Requerido'; isValid = false; }
        if (!phone.value) { errors.value.phone = 'Requerido'; isValid = false; }
    }

    return isValid;
};

const prepareOrderData = () => {
    const direccion = deliveryMethod.value === 'envio' 
        ? `${address.value}${apartamento.value ? ', ' + apartamento.value : ''}, ${city.value}, ${department.value}`
        : 'Retiro en sucursal';

    const notas = deliveryMethod.value === 'envio'
        ? `Cliente: ${firstName.value} ${lastName.value} - ${idNumber.value}. Tel: ${phone.value}`
        : 'Retiro en sucursal';

    return {
        direccion,
        notas,
        cliente: `${firstName.value} ${lastName.value}`,
        telefono: phone.value,
        metodoEntrega: deliveryMethod.value === 'envio' ? 'Envío a domicilio' : 'Retiro en sucursal'
    };
};

const showConfirmationModal = () => {
    if (!validateForm()) {
        // Use a snackbar or small dialog instead of alert if possible, or just return.
        // For now, I'll allow alert for validation error as it wasn't explicitly forbidden, 
        // but user disliked "localhost says". I'll use a simple approach or just rely on field errors.
        // Actually, field errors are shown. I can just focus the first error.
        return;
    }

    if (!authStore.user) {
        showLoginDialog.value = true;
        return;
    }

    orderData.value = prepareOrderData();
    showConfirmModal.value = true;
};

// Dialog State
const showLoginDialog = ref(false);
const showSuccessDialog = ref(false);
const confirmedOrderId = ref<number | null>(null);

const goToLogin = () => {
    // Save form data to persist across login
    const formData = {
        firstName: firstName.value,
        lastName: lastName.value,
        idNumber: idNumber.value,
        address: address.value,
        apartamento: apartamento.value,
        city: city.value,
        department: department.value,
        phone: phone.value,
        deliveryMethod: deliveryMethod.value,
        paymentMethod: paymentMethod.value
    };
    localStorage.setItem('checkout_temp_data', JSON.stringify(formData));
    
    // Redirect to login with return path
    router.push({ path: '/login1', query: { redirect: '/checkout' } });
};

const finishOrderProcess = () => {
    router.push('/mis-compras');
};

const goToHome = () => {
    router.push('/');
};

// Restore form data if exists
import { onMounted } from 'vue';
onMounted(() => {
    const savedData = localStorage.getItem('checkout_temp_data');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            firstName.value = parsed.firstName || '';
            lastName.value = parsed.lastName || '';
            idNumber.value = parsed.idNumber || '';
            address.value = parsed.address || '';
            apartamento.value = parsed.apartamento || '';
            city.value = parsed.city || 'Montería';
            department.value = parsed.department || 'Córdoba';
            phone.value = parsed.phone || '';
            deliveryMethod.value = parsed.deliveryMethod || 'envio';
            paymentMethod.value = parsed.paymentMethod || 'PAGO_CONTRA_ENTREGA';
            
            // Clean up
            localStorage.removeItem('checkout_temp_data');
        } catch (e) {
            console.error('Error restoring checkout data', e);
        }
    }
});

const confirmOrder = async () => {
    try {
        // Map payment method to backend enum
        let tipoPagoBackend: TipoPago;
        switch (paymentMethod.value) {
            case 'EFECTIVO':
                tipoPagoBackend = TipoPago.EFECTIVO;
                break;
            case 'TRANSFERENCIA':
            case 'bancolombia':
            case 'davivienda':
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
            notas: orderData.value.notas
        };

        const result = await ventaStore.createVenta(ventaData);

        showConfirmModal.value = false;
        confirmedOrderId.value = result.id;
        showSuccessDialog.value = true;
        // Do not empty cart immediately if we want to show order details? 
        // Logic says empty it now.
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
                            </div>
                        </v-card>
                    </div>

                    <!-- Payment Methods -->
                    <div class="section mb-8">
                        <h3 class="text-h6 font-weight-bold mb-2">Formas de Pago</h3>
                        <p class="text-caption text-grey mb-4">Todas las transacciones son seguras y están encriptadas.</p>
                        
                        <v-radio-group v-model="paymentMethod" class="payment-options border rounded" hide-details>
                            <v-radio value="PAGO_CONTRA_ENTREGA" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center font-weight-bold">
                                        Paga al Recibir
                                    </div>
                                </template>
                            </v-radio>
                             <!-- Info Paga al Recibir -->
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'PAGO_CONTRA_ENTREGA'" class="pa-4 bg-grey-lighten-4 border-bottom text-body-2 text-grey-darken-2">
                                    <div class="d-flex justify-center mb-4">
                                        <CashIcon size="40" stroke-width="1.5" />
                                    </div>
                                    <p align="justify">Con Paga al Recibir, ahora puedes recibir tu pedido y pagar únicamente cuando lo tengas en tus manos. Este método te permite revisar tu compra antes de pagar, brindándote mayor seguridad y tranquilidad en cada transacción, sin necesidad de registros, suscripciones, ni compartir datos bancarios.</p>
                                </div>
                            </v-expand-transition>

                            <v-radio value="TRANSFERENCIA" class="pa-4 border-bottom w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        Transferencia Bancaria
                                    </div>
                                </template>
                            </v-radio>
                             <!-- Info Transferencia -->
                            <v-expand-transition>
                                <div v-if="paymentMethod === 'TRANSFERENCIA'" class="pa-4 bg-grey-lighten-4 border-bottom text-body-2 text-grey-darken-2">
                                     <p class="mb-2" align="justify">Realiza el pago de tu pedido desde tu aplicación bancaria haciendo una transferencia electrónica a nuestra cuenta, tendrás mayor control sobre tu pago y la seguridad de realizarlo directamente desde tu banco.</p>
                                     <p align="justify">Una vez que hagas clic en "Pagar ahora", te mostraremos los datos de nuestra cuenta para que puedas completar tu compra de manera fácil y rápida.</p>
                                </div>
                            </v-expand-transition>

                            <v-radio value="EFECTIVO" class="pa-4 w-100 mr-0">
                                <template v-slot:label>
                                    <div class="d-flex align-center">
                                        Efectivo (Retiro en sucursal)
                                    </div>
                                </template>
                            </v-radio>
                        </v-radio-group>
                    </div>

                    <v-btn 
                        color="black" 
                        size="large" 
                        block 
                        @click="showConfirmationModal" 
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

        <!-- Confirmation Modal -->
        <v-dialog v-model="showConfirmModal" max-width="600">
            <v-card>
                <v-card-title class="text-h5 font-weight-bold pa-6 bg-primary text-white">
                    Confirmar Compra
                </v-card-title>
                <v-card-text class="pa-6">
                    <div v-if="orderData">
                        <h3 class="text-h6 font-weight-bold mb-4">Resumen de tu pedido</h3>
                        
                        <v-divider class="my-4"></v-divider>
                        
                        <div class="mb-3">
                            <strong>Cliente:</strong> {{ orderData.cliente }}
                        </div>
                        <div class="mb-3" v-if="authStore.user">
                            <strong>Email:</strong> {{ authStore.user.email }}
                        </div>
                        <div class="mb-3">
                            <strong>Teléfono:</strong> {{ orderData.telefono }}
                        </div>
                        <div class="mb-3">
                            <strong>Método de entrega:</strong> {{ orderData.metodoEntrega }}
                        </div>
                        <div class="mb-3">
                            <strong>Dirección:</strong> {{ orderData.direccion }}
                        </div>
                        <div class="mb-3">
                            <strong>Método de pago:</strong> 
                            <span v-if="paymentMethod === 'PAGO_CONTRA_ENTREGA'">Pago contra entrega</span>
                            <span v-else-if="paymentMethod === 'TRANSFERENCIA'">Transferencia bancaria</span>
                            <span v-else>Efectivo</span>
                        </div>

                        <v-divider class="my-4"></v-divider>

                        <h4 class="font-weight-bold mb-3">Productos:</h4>
                        <div v-for="item in (productosStore.ComprasCarrito as any[])" :key="item.id" class="d-flex justify-space-between mb-2">
                            <span>{{ item.nombre }} x{{ item.cantidad }}</span>
                            <span class="font-weight-bold">{{ formatCurrency(item.precio * item.cantidad) }}</span>
                        </div>

                        <v-divider class="my-4"></v-divider>

                        <div class="d-flex justify-space-between text-h6 font-weight-bold">
                            <span>Total:</span>
                            <span>{{ formatCurrency(total) }}</span>
                        </div>
                    </div>
                </v-card-text>
                <v-card-actions class="pa-6">
                    <v-btn color="grey" variant="text" @click="showConfirmModal = false">
                        Cancelar
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="flat" @click="confirmOrder" :loading="ventaStore.loading">
                        Confirmar Pedido
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Login Required Dialog -->
        <v-dialog v-model="showLoginDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6 bg-warning text-white">
                    Inicio de Sesión Requerido
                </v-card-title>
                <v-card-text class="pa-4 text-center">
                    <v-icon size="64" color="warning" class="mb-4">mdi-account-alert</v-icon>
                    <p class="text-body-1">Debes iniciar sesión para completar tu compra.</p>
                </v-card-text>
                <v-card-actions class="justify-center pa-4">
                    <v-btn color="grey" variant="text" @click="showLoginDialog = false">Cancelar</v-btn>
                    <v-btn color="primary" variant="elevated" @click="goToLogin">Iniciar Sesión</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Success Dialog -->
        <v-dialog v-model="showSuccessDialog" max-width="500" persistent>
            <v-card>
                <v-card-title class="text-h5 bg-success text-white text-center py-4">
                    ¡Pedido Realizado con Éxito!
                </v-card-title>
                <v-card-text class="pa-6 text-center">
                    <v-icon size="80" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
                    <h3 class="text-h6 font-weight-bold mb-2">Pedido #{{ confirmedOrderId }}</h3>
                    <p class="text-body-1 mb-4">Gracias por tu compra. Hemos Recibido tu pedido correctamente.</p>
                </v-card-text>
                <v-card-actions class="flex-column gap-2 pa-6">
                    <v-btn color="primary" size="large" block variant="elevated" @click="finishOrderProcess">
                        Ver Pedido en Mis Compras
                    </v-btn>
                     <v-btn color="secondary" variant="text" block @click="goToHome">
                        Volver al Inicio
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
