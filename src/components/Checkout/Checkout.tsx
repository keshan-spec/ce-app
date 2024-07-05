"use client";

import React, { useEffect, useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/hooks/useCartStore";
import { createStripeSecret } from "@/actions/store-actions";
import { useUser } from "@/hooks/useUser";
import { BASE_URL } from "@/actions/api";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { convertToSubcurrency } from "@/utils/utils";

export const CheckoutForm = ({ amount }: { amount: number; }) => {
    const { cart, totalPrice, clearCart } = useCartStore();
    const { user } = useUser();
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (amount <= 0) return;

        createStripeSecret(amount, cart, {
            name: user.first_name + " " + user.last_name,
            email: user.email,
        }).then((clientSecret) => {
            console.log("clientSecret", clientSecret);
            if (clientSecret) setClientSecret(clientSecret);
        }).catch((error) => {
            console.error(error);
        });
    }, [amount]);

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

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${BASE_URL}/checkout/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            setErrorMessage(error.message);
        } else {
            // The payment UI automatically closes with a success animation.
            // This point is reached if the payment is successful.
            clearCart();
            // Your customer is redirected to your `return_url`.
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="section full mt-2 mb-2">
                <div className="section-title">Shipping Address</div>
                <div className="wide-block pb-1 pt-1">
                    {[
                        { label: "First Name", type: "text", placeholder: "", value: user.first_name },
                        { label: "Last Name", type: "text", placeholder: "", value: user.last_name },
                        { label: "Address Line 1", type: "text", placeholder: "" },
                        { label: "Address Line 2", type: "text", placeholder: "" },
                        { label: "City", type: "text", placeholder: "" },
                        { label: "County", type: "text", placeholder: "" },
                        { label: "Postcode", type: "text", placeholder: "" },
                    ].map((field, idx) => (
                        <div className="form-group basic" key={idx}>
                            <div className="input-wrapper">
                                <label className="form-label">{field.label}</label>
                                <input type={field.type} className="form-control" placeholder={field.placeholder} value={field.value} />
                                <i className="clear-input">
                                    <IonIcon icon={closeCircle} role="img" className="md hydrated" aria-label="close circle"></IonIcon>
                                </i>
                            </div>
                        </div>
                    ))}

                    <div className="form-group basic">
                        <div className="input-wrapper">
                            <label className="form-label">Country</label>
                            <select className="form-control">
                                <option disabled>Please select</option>
                                <option value="GB" selected>United Kingdom</option>
                                <option value="IE">Ireland</option>
                                <option value="US">United States of America</option>
                                <option value="CA">Canada</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="section-title mt-2">Order Totals</div>
                <div className="wide-block mb-2 pb-1 pt-1">
                    <div className="card mt-2 mb-2">
                        <ul className="listview flush transparent simple-listview">
                            <li>Subtotal <span className="text-muted">{`£${totalPrice}`}</span></li>
                            <li>Shipping <span className="text-muted">Free</span></li>
                            <li>Total <span className="text-primary font-weight-bold">{`£${totalPrice}`}</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {(!clientSecret || !stripe || !elements) ? (
                <div className="flex items-center justify-center h-full">
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-theme-primary"
                        role="status"
                    >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                        </span>
                    </div>
                </div>
            ) : (
                <div className="section mb-2">
                    {clientSecret && <PaymentElement />}
                    {stripe.paymentRequest && (
                        <button type="button" onClick={() => stripe.paymentRequest({
                            country: "GB",
                            currency: "gbp",
                            total: {
                                label: "Total",
                                amount: convertToSubcurrency(totalPrice),
                            },
                        })} className="btn btn-primary btn-block mt-3">
                            Pay with Apple Pay / Google Pay
                        </button>
                    )}

                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    <button
                        disabled={!stripe || loading}
                        className="btn btn-primary btn-block disabled:opacity-50 disabled:animate-pulse mt-3"
                    >
                        {!loading ? `Place Order` : "Processing..."}
                    </button>
                </div>
            )}
        </form>
    );
};
