"use server";

import { StoreProduct, StoreProductCart } from "@/types/store";
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

interface StoreProductResponse {
    data: StoreProduct;
    success: boolean;
}


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
}) => {
    try {
        const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: convertToSubcurrency(amount), cart, customer }),
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
        const response = await fetch(`${BASE_URL}/api/get-payment-intent`, {
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

interface CreateOrderData {
    cart: StoreProductCart[];
    customer: {
        first_name: string;
        last_name: string;
        email: string;
        phone?: string;
    };
    shipping: {
        address_1: string;
        address_2?: string;
        city: string;
        country: string;
        postcode: string;
    };
    payment_intent: string;
}

interface CreateOrderResponse {
    success: boolean;
    message?: string;
    order_id?: number;
}

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