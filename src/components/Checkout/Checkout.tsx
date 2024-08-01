"use client";
import { useCartStore } from '@/hooks/useCartStore';
import { FIXED_SHIPPING_COST } from '@/actions/api';
import { useCheckout } from '@/app/context/CheckoutContext';
import { PaymentForm } from './sections/PaymentForm';
import { ShippingForm } from './sections/ShippingDetailsForm';
import SlideInFromBottomToTop from '@/shared/SlideIn';
import { convertToCurrency } from '@/utils/utils';


const OrderTotals = () => {
    const { totalPrice } = useCartStore();

    return (
        <div className="flex flex-col my-2">
            <div className="wide-block pb-1 pt-1">
                <div className="section-title mb-1">Order Totals</div>
                <div className="card mb-2">
                    <ul className="listview flush transparent simple-listview">
                        <li>Subtotal <span className="text-muted">{convertToCurrency(totalPrice)}</span></li>
                        <li>Shipping <span className="text-muted">£{FIXED_SHIPPING_COST}</span></li>
                        <li>Total <span className="text-primary font-weight-bold">£{totalPrice + FIXED_SHIPPING_COST}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SelectedShippingDetails = () => {
    const { shippingInfo, editShippingInfo, setEditShippingInfo, isShippingInfoValid } = useCheckout();

    return (
        <div className="flex flex-col">
            <SlideInFromBottomToTop isOpen={editShippingInfo} onClose={() => {
                setEditShippingInfo(false);
            }} title="Shipping Details">
                <ShippingForm />
            </SlideInFromBottomToTop>

            <div className="wide-block pb-1 pt-1">
                <div className="section-title mb-1">Shipping Address</div>
                <div className="card my-2">
                    <div className="flex justify-between pl-4 mt-1">
                        <h2 className="section-title !mb-1">Delivering to {shippingInfo.first_name} {shippingInfo.last_name}</h2>
                        <div className="flex justify-end">
                            <button
                                className="btn btn-outline !text-theme-primary"
                                onClick={() => setEditShippingInfo(true)}
                            >
                                Change
                            </button>
                        </div>
                    </div>
                    <div className="px-3 pb-2 flex flex-col">
                        <span>{shippingInfo.address_1}, {shippingInfo.address_2 && `${shippingInfo.address_2},`} {shippingInfo.city}</span>
                        <span>{shippingInfo.state}, {shippingInfo.postcode}, {shippingInfo.country}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CheckoutForm = () => {
    return (
        <div className="flex flex-col">
            <SelectedShippingDetails />
            <OrderTotals />
            <PaymentForm />
        </div>
    );
};

