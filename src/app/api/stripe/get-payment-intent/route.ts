import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RequestData {
    payment_intent: string;
}

export async function POST(request: NextRequest) {
    try {
        const { payment_intent } = await request.json() as RequestData;
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent);

        return NextResponse.json({
            data: paymentIntent,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            body: "An error occurred",
        });
    }
}