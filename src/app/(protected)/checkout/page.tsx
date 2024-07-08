"use client";
import { FIXED_SHIPPING_COST } from "@/actions/api";
import { CheckoutProvider } from "@/app/context/CheckoutContext";
import { CheckoutForm } from "@/components/Checkout/Checkout";
import { useCartStore } from "@/hooks/useCartStore";
import { convertToSubcurrency } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { redirect } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Page = () => {
    const isHydrated = useCartStore.persist?.hasHydrated();

    const { totalPrice, totalItems } = useCartStore();

    if (totalItems === 0 && isHydrated) {
        redirect("/store");
    }

    return (
        <div suppressHydrationWarning>
            {!isHydrated ? <p>Loading...</p> : (
                <Elements stripe={stripePromise} options={{
                    amount: convertToSubcurrency(totalPrice + FIXED_SHIPPING_COST),
                    currency: 'gbp',
                    mode: 'payment',
                }}>
                    <CheckoutProvider>
                        <CheckoutForm />
                    </CheckoutProvider>
                </Elements>
            )}
        </div>
    );
};

export default Page;