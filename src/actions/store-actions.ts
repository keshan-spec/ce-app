"use server";

import { StoreProduct } from "@/types/store";
import { STORE_API_URL } from "./api";


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