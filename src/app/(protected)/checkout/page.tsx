"use client";
import { CheckoutForm } from "@/components/Checkout/Checkout";
import { useCartStore } from "@/hooks/useCartStore";
import { convertToSubcurrency } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { redirect } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}
export const FIXED_SHIPPING_COST = 3.95;

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Page = () => {
    const isHydrated = useCartStore.persist.hasHydrated();

    const { totalPrice, totalItems } = useCartStore();

    if (!isHydrated) {
        return (
            <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
                <h1 className="text-4xl font-extrabold mb-2">No items in cart</h1>
            </main>
        );
    }

    if (totalItems === 0) {
        redirect("/store");
    }

    return (
        <Elements stripe={stripePromise} options={{
            amount: convertToSubcurrency(totalPrice + FIXED_SHIPPING_COST),
            currency: 'gbp',
            mode: 'payment',
        }}>
            <CheckoutForm />
        </Elements>
    );
};

export default Page;