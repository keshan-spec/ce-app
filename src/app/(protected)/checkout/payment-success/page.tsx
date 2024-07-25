import { PaymentSuccess } from "@/components/Checkout/PaymentSuccess";

export default async function Page({
    searchParams: { order_id, payment_intent },
}: {
    searchParams: { order_id: number; payment_intent: string; };
}) {
    return (
        <PaymentSuccess payment_intent={payment_intent} order_id={order_id} />
    );
}