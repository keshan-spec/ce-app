import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

// delete payment method
export async function DELETE(req: NextRequest) {
    const { paymentMethodID } = await req.json();

    try {
        await stripe.paymentMethods.detach(paymentMethodID);

        return NextResponse.json({
            message: 'Payment method deleted',
        }, { status: 201 });
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({
            error
        },
            { status: 500 }
        );
    }
}
