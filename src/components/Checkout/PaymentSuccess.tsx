"use client";

import { getPaymentIntent } from "@/actions/store-actions";
import { IonIcon } from "@ionic/react";
import { refreshCircle, reload } from "ionicons/icons";
import { useEffect, useState } from "react";
import Stripe from "stripe";

interface PaymentSuccessProps {
    payment_intent: string;
}

export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
    payment_intent
}) => {
    const [data, setData] = useState<Stripe.PaymentIntent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!payment_intent) return;

        setLoading(true);
        getPaymentIntent(payment_intent)
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [payment_intent]);

    if (loading) {
        return (
            <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
                <h1 className="text-4xl font-extrabold mb-2">
                    <IonIcon name={refreshCircle} className="animate-spin mr-2" />
                </h1>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
                <h1 className="text-4xl font-extrabold mb-2">Error</h1>
                <p className="text-red-500">{error}</p>
            </main>
        );
    }

    console.log(data);

    return (
        <div className="mb-10">
            <div className="bg-white p-5 rounded-md text-gray-800 mt-5 text-left">
                <h3 className="text-xl font-bold mb-2">Payment Details</h3>
                <p><strong>Status:</strong> {data?.status}</p>
                <p><strong>Amount Received:</strong> {(data?.amount_received! / 100).toFixed(2)}</p>
                <p><strong>Currency:</strong> {data?.currency?.toUpperCase()}</p>
            </div>
        </div>
    );
};