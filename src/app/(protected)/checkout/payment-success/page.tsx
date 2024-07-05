import { PaymentSuccess } from "@/components/Checkout/PaymentSuccess";

export default async function Page({
    searchParams: { order_id, payment_intent },
}: {
    searchParams: { order_id: number; payment_intent: string; };
}) {
    return (
        <main className="p-10 text-white text-center bg-gradient-to-tr to-theme-primary from-purple-500">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold  text-white mb-2">Thank you!</h1>
                <h2 className="text-2xl text-white ">Your order has been placed</h2>

                <p className="text-white mt-2">
                    Your order number is <strong>{order_id}</strong>
                </p>
                <PaymentSuccess payment_intent={payment_intent} />
            </div>
        </main>
    );
}