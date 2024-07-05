import { StoreProductCart } from "@/types/store";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RequestData {
    amount: number;
    cart: StoreProductCart[];
    customer: {
        name: string;
        email: string;
    };
}


export async function POST(req: NextRequest) {
    try {
        const { amount, cart, customer } = await req.json() as RequestData;

        const metadata: Stripe.MetadataParam = {
            products: JSON.stringify(cart.map((item) => ({
                id: item.id,
                name: item.title,
                price: item.price,
                qty: item.qty,
            })))
        };

        // Search for an existing customer by email
        const existingCustomers = await stripe.customers.list({
            email: customer.email,
            limit: 1
        });

        let stripeCustomer;
        if (existingCustomers.data.length > 0) {
            stripeCustomer = existingCustomers.data[0];
        } else {
            // Create a new customer if none found
            stripeCustomer = await stripe.customers.create({
                email: customer.email,
                name: customer.name,
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "gbp",
            automatic_payment_methods: {
                enabled: true,
            },
            customer: stripeCustomer.id,
            metadata: metadata,
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}