"use client";
import { CheckoutForm } from "@/components/Checkout/Checkout";
import { useCartStore } from "@/hooks/useCartStore";
import { convertToSubcurrency } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Page = () => {
    const { totalPrice } = useCartStore();

    return (
        <Elements stripe={stripePromise} options={{
            amount: convertToSubcurrency(totalPrice),
            currency: 'gbp',
            mode: 'payment',
        }}>
            <CheckoutForm amount={totalPrice} />
        </Elements>
    );
};

export default Page;