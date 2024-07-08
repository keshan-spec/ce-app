"use client";


import React, { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUser } from '@/hooks/useUser';
import { UserSchema, userSchema } from '@/zod-schemas/billing-form';
import { IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { AuthUser } from '@/auth';
import { useCartStore } from '@/hooks/useCartStore';
import { useRouter } from 'next/navigation';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createOrder, createStripeSecret } from '@/actions/store-actions';
import { BASE_URL, FIXED_SHIPPING_COST } from '@/actions/api';
import clsx from 'clsx';
import { useCheckout } from '@/app/context/CheckoutContext';
import { BillingFieldType } from '@/types/store';
import { updateBillingInfo } from '@/actions/profile-actions';


const PaymentForm: React.FC = () => {
    const { cart, totalPrice, totalItems, stripeIntent, setStripeIntent } = useCartStore();
    const { shippingInfo } = useCheckout();

    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecretError, setClientSecretError] = useState<string | null>(null);

    useEffect(() => {
        if (loading) return;
        console.log('PaymentForm', totalPrice, totalItems);
        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        console.log("Creating payment intent", stripeIntent);

        setLoading(true);

        const response = await createStripeSecret(totalPrice + FIXED_SHIPPING_COST, cart, {
            name: `${shippingInfo.first_name} ${shippingInfo.last_name}`,
            email: shippingInfo.email,
        }, stripeIntent);

        if (response && response?.clientSecret && response?.intentId) {
            setClientSecret(response?.clientSecret);

            if (response?.isNew || !stripeIntent) {
                setStripeIntent(response?.intentId);
            }
        } else {
            setClientSecretError(response.error || "Failed to create payment intent");
        }

        setLoading(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: submitError } = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            redirect: "if_required",
            confirmParams: {
                return_url: `${BASE_URL}/checkout/payment-success?amount=${totalPrice}`,
            },
        });

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message);
        } else {
            // create order
            const response = await createOrder({
                cart,
                customer: {
                    first_name: shippingInfo.first_name,
                    last_name: shippingInfo.last_name,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                },
                shipping: shippingInfo,
                payment_intent: paymentIntent.id,
            });

            if (!response?.success) {
                setErrorMessage(response?.message);
                setLoading(false);
                return;
            }

            // Redirect to the payment success page
            router.push(`/checkout/payment-success?payment_intent=${paymentIntent.id}&order_id=${response.order_id}`);
        }
    };

    const renderLoading = () => (
        <div className="flex items-center justify-center h-full min-h-12">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-theme-primary"
                role="status"
            >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                </span>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col">
            <div className="wide-block pb-1 pt-1">
                <div className="section-title mb-1">Payment Details</div>

                <form onSubmit={handleSubmit}>
                    {((!clientSecret || !stripe || !elements) && !clientSecretError) ? renderLoading() : (
                        <div className="my-3">
                            {clientSecret && <PaymentElement options={{
                                layout: 'accordion',
                            }} />}

                            <div className={clsx(
                                "toast-box toast-bottom bg-danger",
                                errorMessage && "show !bottom-0"
                            )}>
                                <div className="in">
                                    <div className="text">
                                        {errorMessage}
                                    </div>
                                </div>
                                <button type="button"
                                    onClick={() => setErrorMessage("")} className="btn btn-sm btn-text-light close-button">OK</button>
                            </div>

                            {clientSecretError ? (
                                <div className="toast-box toast-bottom bg-danger text-center show !bottom-0">
                                    <div className="text text-center w-full">
                                        {clientSecretError}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    disabled={!stripe || loading}
                                    className="btn btn-primary btn-block disabled:opacity-50 disabled:animate-pulse mt-3"
                                >
                                    {!loading ? `Place Order` : "Processing..."}
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

const ShippingForm: React.FC = () => {
    const { shippingInfo, setShippingInfo, setEditShippingInfo } = useCheckout();

    const { register, handleSubmit, formState: { errors } } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            first_name: shippingInfo.first_name,
            last_name: shippingInfo.last_name,
            email: shippingInfo.email,
            phone: shippingInfo?.phone,
            address_1: shippingInfo?.address_1,
            address_2: shippingInfo?.address_2,
            city: shippingInfo?.city,
            state: shippingInfo?.state,
            postcode: shippingInfo?.postcode,
            country: shippingInfo?.country || '',
        }
    });

    const onSubmit: SubmitHandler<UserSchema> = async (data) => {
        setShippingInfo(data);
        try {
            const response = await updateBillingInfo(data);
            setEditShippingInfo(false);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    const fields: BillingFieldType[] = useMemo(() => [
        { label: "First Name", type: "text", name: "first_name", placeholder: "Enter your first name", required: true },
        { label: "Last Name", type: "text", name: "last_name", placeholder: "Enter your last name", required: true },
        { label: "Email", type: "email", name: "email", placeholder: "Enter your email", required: true },
        { label: "Phone", type: "tel", name: "phone", placeholder: "Enter your phone number", required: true },
        { label: "Address Line 1", type: "text", name: "address_1", placeholder: "Enter your address", required: true },
        { label: "Address Line 2", type: "text", name: "address_2", placeholder: "Enter your address" },
        { label: "City", type: "text", name: "city", placeholder: "Enter your city", required: true },
        { label: "County", type: "text", name: "state", placeholder: "Enter your county" },
        { label: "Postcode", type: "text", name: "postcode", placeholder: "Enter your postcode", required: true },
        {
            label: "Country", type: "select", name: "country", placeholder: "Select your country", required: true, options: [
                { label: "United Kingdom", value: "GB" },
                { label: "United States", value: "US" },
                { label: "Canada", value: "CA" },
                { label: "Ireland", value: "IE" },
            ]
        }
    ], []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-full'>
            <div className="section full mt-2 mb-2 w-full">
                <div className="section-title">Shipping Details</div>
                <div className="wide-block pb-1 pt-1">
                    {fields.map((field, idx) => (
                        <div className="form-group basic" key={idx}>
                            <div className="input-wrapper">
                                <label className="form-label">
                                    {field.label}
                                    {field.required && <span className="text-danger ml-0.5">*</span>}
                                </label>
                                {field.type === "select" ? (
                                    <select
                                        className={`form-control ${errors[field.name as keyof UserSchema] ? 'border-red-500' : ''}`}
                                        {...register(field.name as keyof UserSchema)}
                                    >
                                        <option disabled value="">
                                            {field.placeholder}
                                        </option>
                                        {field.options?.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        className={`form-control ${errors[field.name as keyof UserSchema] ? '!border-b !border-red-500' : ''}`}
                                        placeholder={field.placeholder}
                                        {...register(field.name as keyof UserSchema)}
                                    />
                                )}

                                {errors[field.name as keyof UserSchema] && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors[field.name as keyof UserSchema]?.message}
                                    </p>
                                )}
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle"></IonIcon>
                                </i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button type="submit" className="btn btn-primary w-3/4">Save</button>
        </form>
    );
};

const OrderTotals = () => {
    const { totalPrice } = useCartStore();

    return (
        <div className="flex flex-col my-2">
            <div className="wide-block pb-1 pt-1">
                <div className="section-title mb-1">Order Totals</div>
                <div className="card mb-2">
                    <ul className="listview flush transparent simple-listview">
                        <li>Subtotal <span className="text-muted">{`£${totalPrice}`}</span></li>
                        <li>Shipping <span className="text-muted">£{FIXED_SHIPPING_COST}</span></li>
                        <li>Total <span className="text-primary font-weight-bold">£{totalPrice + FIXED_SHIPPING_COST}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const SelectedShippingDetails = () => {
    const { shippingInfo, setEditShippingInfo } = useCheckout();

    return (
        <div className="flex flex-col">
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
                        <span>{shippingInfo.address_1}, {(shippingInfo.address_2 !== null && shippingInfo.address_2) ? shippingInfo.address_2 + ',' : null}, {shippingInfo.city}</span>
                        <span>{shippingInfo.state}, {shippingInfo.postcode}, {shippingInfo.country}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CheckoutForm = () => {
    const { editShippingInfo } = useCheckout();

    const renderView = () => {
        if (editShippingInfo) {
            return <ShippingForm />;
        } else {
            return (
                <>
                    <SelectedShippingDetails />
                    <OrderTotals />
                    <PaymentForm />
                </>
            );
        }
    };

    return (
        <div className="flex flex-col">
            {renderView()}
        </div>
    );
};

