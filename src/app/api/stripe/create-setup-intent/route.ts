import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
    const { email, name } = await req.json();

    try {
        // Search for an existing customer
        const customer = await stripe.customers.list({
            email,
            limit: 1,
        });

        let customerID = '';
        // If a customer is found. use the existing customer ID
        if (customer.data.length > 0) {
            customerID = customer.data[0].id;
        } else {
            // If no customer is found, create a new customer
            const newCustomer = await stripe.customers.create({
                email,
                name,
            });

            customerID = newCustomer.id;
        }

        const setupIntent = await stripe.setupIntents.create({
            customer: customerID,
        });

        return NextResponse.json({
            client_secret: setupIntent.client_secret,
        });
    } catch (error: any) {
        console.log(error);

        return NextResponse.json({
            error
        },
            { status: 500 }
        );
    }
}
