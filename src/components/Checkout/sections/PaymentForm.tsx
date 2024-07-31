'use client';
import { BASE_URL, FIXED_SHIPPING_COST } from "@/actions/api";
import { createOrder, createStripeSecret, deleteSavedPaymentMethod } from "@/actions/store-actions";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useCartStore } from "@/hooks/useCartStore";
import { useUser } from "@/hooks/useUser";
import { capitalize } from "@/utils/utils";
import { IonIcon } from "@ionic/react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import clsx from "clsx";
import { cardOutline, trashBinOutline } from "ionicons/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoader, BiLogoMastercard, BiLogoVisa } from "react-icons/bi";
import Stripe from "stripe";
import { SetupCardForm } from "./SetupCardForm";
import { Loader } from "@/components/Loader";

export const PaymentForm: React.FC = () => {
    const { cart, totalPrice, stripeIntent, setStripeIntent } = useCartStore();

    const { shippingInfo, isShippingInfoValid } = useCheckout();
    const { user } = useUser();

    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [clientSecretError, setClientSecretError] = useState<string | null>(null);
    const [savedPaymentMethods, setSavedPaymentMethods] = useState<Stripe.PaymentMethod[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [paymentType, setPaymentType] = useState<"new" | "saved">("saved");

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

            if (!response.savedPaymentMethods || response.savedPaymentMethods.length === 0) {
                setPaymentType("new");
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
        if (!isShippingInfoValid()) {
            setErrorMessage("Please complete the shipping details.");
            return;
        }

        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        if (paymentType === "new" && !clientSecret) {
            setErrorMessage("Failed to create payment intent. Please try again later.");
            setLoading(false);
            return;
        } else if (paymentType === "saved" && !selectedPaymentMethod) {
            setErrorMessage("Please select a payment method or add a new card.");
            setLoading(false);
            return;
        }

        let intent: any | null = null;

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
                            email: user.email,
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
                phone: shippingInfo.phone,
                email: user.email,
                id: user.id,
            },
            shipping: shippingInfo,
            payment_intent: intent.id,
        });

        if (!response?.success) {
            setErrorMessage(`Failed to create order. ${response?.message}`);
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

    const renderSavedCards = () => {
        if (paymentType === "new") return null;

        if (!savedPaymentMethods.length) {
            return (
                <SetupCardForm onComplete={createPaymentIntent} />
            );
        }

        return (
            <div className="grid grid-cols-1 gap-2">
                {savedPaymentMethods.map((method, index) => (
                    <SavedCard
                        key={index}
                        method={method}
                        onClick={(id) => setSelectedPaymentMethod(id)}
                        selectedCard={selectedPaymentMethod}
                        onDeleted={() => {
                            createPaymentIntent();
                        }}
                    />
                ))}

                <SetupCardForm onComplete={createPaymentIntent} />
            </div>
        );
    };

    return (
        <div className="flex flex-col">
            {loading && <Loader transulcent />}

            <div className="wide-block pb-1 pt-1">
                <div className="section-title">Payment Details</div>
                {/* tab options for using saved cards or stripe element */}
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className={clsx(
                                "text-sm mb-1 mr-3",
                                paymentType === "saved" ? "text-primary underline font-semibold" : "text-on-primary"
                            )}
                            onClick={() => setPaymentType("saved")}
                        >
                            Saved Cards
                        </button>
                        <button
                            type="button"
                            className={clsx(
                                "text-sm mb-1 mr-3",
                                paymentType === "new" ? "text-primary underline font-semibold" : "text-on-primary"
                            )}
                            onClick={() => {
                                setPaymentType("new");
                                setSelectedPaymentMethod(null);
                            }}
                        >
                            New Card
                        </button>
                    </div>
                </div>

                <div className="">
                    {((!clientSecret || !stripe || !elements) && !clientSecretError) ? renderLoading() : (
                        <div className="">
                            {renderSavedCards()}

                            <form onSubmit={handleSubmit}>
                                <div className={clsx(
                                    paymentType === "saved" ? "hidden" : "block",
                                )}>
                                    {(clientSecret) && (
                                        <PaymentElement
                                            options={{
                                                layout: 'tabs',
                                                fields: {
                                                    billingDetails: {
                                                        address: {
                                                            postalCode: "never",
                                                            country: "never",
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                </div>

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
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const renderCardLogo = (brand: string) => {
    switch (brand) {
        case "visa":
            return <BiLogoVisa size={44} />;
        case "mastercard":
            return <BiLogoMastercard size={44} />;
        case "amex":
            return <i className="fab fa-cc-amex text-3xl mx-1"></i>;
        default:
            return <IonIcon icon={cardOutline} className="text-4xl mx-1" />;
    }
};

const SavedCard: React.FC<{ method: Stripe.PaymentMethod, onClick: (id: string) => void; selectedCard?: string | null; onDeleted: () => void; }> = (
    { method,
        onClick,
        selectedCard,
        onDeleted
    }
) => {
    const [deleting, setDeleting] = useState(false);

    const onDelete = async () => {
        if (confirm("Are you sure you want to delete this card?") === false) return;

        setDeleting(true);

        try {
            await deleteSavedPaymentMethod(method.id);
            setDeleting(false);
            onDeleted();
        } catch (error) {
            setDeleting(false);
            console.error(error);
        }
    };

    return (
        <div className={clsx(
            "rounded-md py-1.5 px-3 cursor-pointer border border-solid flex justify-between items-center transition-all duration-300",
            selectedCard === method.id ? "bg-primary text-white" : "bg-surface text-on-surface",
            "hover:scale-105",
            deleting && "opacity-50"
        )}>
            <div className="flex items-center gap-2 w-full" onClick={() => onClick(method.id)}>
                {renderCardLogo(method.card?.brand || "")}
                <div className="flex flex-col">
                    <span>{capitalize(method.card?.brand || "")} xxxx {method.card?.last4}</span>
                    <span className="text-xs text-on-surface opacity-50">Expires {method.card?.exp_month}/{method.card?.exp_year}</span>
                </div>
            </div>

            {deleting ? <BiLoader className="animate-spin text-lg" /> : <IonIcon icon={trashBinOutline} className="text-lg" onClick={onDelete} />}
        </div>
    );
};