import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const response = JSON.parse(payload);

        const sig = request.headers.get('Stripe-Signature')!;

        const dateTime = new Date(response?.created * 1000).toLocaleDateString();
        const timeString = new Date(response?.created * 1000).toLocaleTimeString();

        console.log(`🔔  Payment intent webhook received! ${dateTime} ${timeString}`);

        const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET!);

        return NextResponse.json({ received: true, event: event.type });
    } catch (error: any) {
        console.error(error);
        return NextResponse.error();
    }
}