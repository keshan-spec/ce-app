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
    existing_intent?: string;
}

export async function POST(req: NextRequest) {
    const { amount, cart, customer, existing_intent } = await req.json() as RequestData;

    try {
        const product_data = cart.map((item) => (
            `${item.title} (${item.variationId}) x${item.qty}`
        )).join(",\n");


        const metadata: Stripe.MetadataParam = {
            Products: product_data,
        };

        // Search for an existing customer by email
        const existingCustomers = await stripe.customers.list({
            email: customer.email,
            limit: 1
        });

        let stripeCustomer: Stripe.Customer;
        if (existingCustomers.data.length > 0) {
            stripeCustomer = existingCustomers.data[0];
        } else {
            // Create a new customer if none found
            stripeCustomer = await stripe.customers.create({
                email: customer.email,
                name: customer.name,
            });
        }

        const savedPaymentMethods = await stripe.paymentMethods.list({
            customer: stripeCustomer.id,
            type: "card",
        });

        // Check if an existing intent is provided
        if (existing_intent) {
            const intent = await stripe.paymentIntents.retrieve(existing_intent);

            // check if the intent is valid, and not been paid, and is less than 1 hour old
            if (intent && intent.status === "requires_payment_method" && intent.created > (Date.now() / 1000) - 3600) {
                let returnIntent = intent;

                const intentAmount = intent.amount;
                // if the amount is mismatched, update the intent
                if (intentAmount !== amount) {
                    const updatedIntent = await stripe.paymentIntents.update(intent.id, {
                        amount,
                        metadata: metadata,
                    });

                    returnIntent = updatedIntent;
                }

                return NextResponse.json({
                    clientSecret: returnIntent.client_secret,
                    intentId: returnIntent.id,
                    savedPaymentMethods: savedPaymentMethods.data,
                    isNew: false,
                });
            }
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "gbp",
            description: "DriveLife Store Purchase",
            automatic_payment_methods: {
                enabled: true,
            },
            customer: stripeCustomer.id,
            metadata: metadata,
            // save the payment method for future use
            setup_future_usage: "off_session",

        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            intentId: paymentIntent.id,
            isNew: true,
            savedPaymentMethods: savedPaymentMethods.data,
        });
    } catch (error) {
        return NextResponse.json({
            error: error,
            amount,
            customer,
            cart
        }, { status: 500 });
    }
}