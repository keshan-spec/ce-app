import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// cancel payment intent
interface RequestData {
    payment_intent: string;
}

export async function POST(req: NextRequest) {
    const { payment_intent } = await req.json() as RequestData;

    try {
        const intent = await stripe.paymentIntents.cancel(payment_intent);

        return NextResponse.json({ success: true, intent });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}