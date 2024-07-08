'use client';
import { BASE_URL, FIXED_SHIPPING_COST } from "@/actions/api";
import { createOrder, createStripeSecret } from "@/actions/store-actions";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useCartStore } from "@/hooks/useCartStore";
import { useUser } from "@/hooks/useUser";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Stripe from "stripe";

export const PaymentForm: React.FC = () => {
    const { cart, totalPrice, stripeIntent, setStripeIntent } = useCartStore();
    const { shippingInfo } = useCheckout();
    const { user } = useUser();

    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecretError, setClientSecretError] = useState<string | null>(null);
    const [savedPaymentMethods, setSavedPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

    const createPaymentIntent = async () => {
        setLoading(true);

        const response = await createStripeSecret(totalPrice + FIXED_SHIPPING_COST, cart, {
            name: `${shippingInfo.first_name} ${shippingInfo.last_name}`,
            email: user?.email, // Use the user's email to retrieve the customer and get saved payment methods
        }, stripeIntent);

        if (response && response?.clientSecret && response?.intentId) {
            setClientSecret(response?.clientSecret);

            if (response?.isNew || !stripeIntent) {
                console.log("Payment intent created", response);
                setStripeIntent(response?.intentId);
            }

            if (response.savedPaymentMethods) {
                setSavedPaymentMethods(response.savedPaymentMethods);
            }
        } else {
            setClientSecretError(response.error || "Failed to create payment intent");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!loading) {
            createPaymentIntent();
        }
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        let intent: any | null = null;
        console.log("Selected payment method", selectedPaymentMethod);

        if (selectedPaymentMethod) {
            // Handle payment with saved payment method
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: selectedPaymentMethod,
            });

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            intent = paymentIntent;
        } else {
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
                    payment_method_data: {
                        billing_details: {
                            address: {
                                city: shippingInfo.city,
                                country: shippingInfo.country,
                                line1: shippingInfo.address_1,
                                line2: shippingInfo.address_2,
                                postal_code: shippingInfo.postcode,
                                state: shippingInfo.state,
                            },
                            email: shippingInfo.email,
                            name: `${shippingInfo.first_name} ${shippingInfo.last_name}`,
                            phone: shippingInfo.phone,
                        }
                    },
                },
            });

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            intent = paymentIntent;
        }

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
            payment_intent: intent.id,
        });

        if (!response?.success) {
            setErrorMessage(response?.message);
            setLoading(false);
            return;
        }

        // Redirect to the payment success page
        router.push(`/checkout/payment-success?payment_intent=${intent.id}&order_id=${response.order_id}`);
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

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(event.target.value);
    };

    return (
        <div className="flex flex-col">
            <div className="wide-block pb-1 pt-1">
                <div className="section-title mb-1">Payment Details</div>
                <form onSubmit={handleSubmit}>
                    {((!clientSecret || !stripe || !elements) && !clientSecretError) ? renderLoading() : (
                        <div className="my-3">
                            {savedPaymentMethods.length > 0 && (
                                <div className="my-3">
                                    <div className="section-title mb-1">Saved Cards</div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {savedPaymentMethods.map((method, index) => (
                                            <div key={index} className="card py-1.5 px-3">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span>{method.card?.brand} ending in {method.card?.last4}</span>
                                                    </div>
                                                    <div>
                                                        <input type="radio" name="payment_method" value={method.id} onChange={handlePaymentMethodChange} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {clientSecret && (
                                <PaymentElement
                                    options={{
                                        layout: 'accordion',
                                        fields: {
                                            billingDetails: {
                                                address: {
                                                    postalCode: "never",
                                                }
                                            }
                                        }
                                    }}
                                />
                            )}

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
