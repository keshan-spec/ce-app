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
        return data.clientSecret;
    } catch (error) {
        console.error(error);
        return null;
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
