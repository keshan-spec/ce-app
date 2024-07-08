"use server";
import { CreateOrderData, CreateOrderResponse, StoreProductCart, StoreProductResponse, StripeSecretResponse } from "@/types/store";
import { BASE_URL, STORE_API_URL } from "./api";
import { convertToSubcurrency } from "@/utils/utils";


export const getStoreProducts = async (page: number, limit = 10) => {
    const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/get-products`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ page, limit }),
    });

    const data = await response.json();

    if (response.status !== 200) {
        return [];
    }

    return data;
};

export const getStoreProduct = async (id: number): Promise<StoreProductResponse | null> => {
    const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/get-product`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
        return null;
    }

    return data;
};

export const createStripeSecret = async (amount: number, cart: StoreProductCart[], customer: {
    name: string;
    email: string;
}, existing_intent: string | null = null): Promise<StripeSecretResponse> => {
    try {
        const response = await fetch(`${BASE_URL}/api/stripe/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount), cart, customer, existing_intent }),
        });

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error(error);
        return {
            error: error.message || "Failed to create payment intent",
        };
    }
};

export const getPaymentIntent = async (payment_intent: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/stripe/get-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ payment_intent }),
        });

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const cancelPaymentIntent = async (payment_intent: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/stripe/cancel-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ payment_intent }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createSetupIntent = async (email: string, name: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/stripe/create-setup-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, name }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteSavedPaymentMethod = async (paymentMethodID: string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/stripe/delete-payment-method`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentMethodID }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const createOrder = async ({
    cart,
    customer,
    payment_intent,
    shipping,
}: CreateOrderData): Promise<CreateOrderResponse | null> => {
    const product_data = cart.map((item) => ({
        id: item.id.split("-")[0],
        quantity: item.qty,
        variation_id: item.id.split("-")[1] || null,
        variations: item.variation,
    }));

    try {
        const response = await fetch(`${STORE_API_URL}/wp-json/app/v1/create-order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                products: product_data,
                customer,
                payment_intent,
                shipping,
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};