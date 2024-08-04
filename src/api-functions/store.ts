import { BASE_URL } from "@/actions/api";
import { getSessionUser } from "@/actions/auth-actions";
import { StoreProductResponse, UserOrderResponse } from "@/types/store";

export const getStoreProducts = async (page: number, limit = 10) => {
    const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`/api/store/get-products?${query.toString()}`, {
        method: "GET",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    return data;
};

export const getUserOrders = async (): Promise<UserOrderResponse | null> => {
    const user = await getSessionUser();
    if (!user) return null;

    try {
        const response = await fetch(`/api/store/get-user-orders?user_id=${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json() as UserOrderResponse;
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getStoreProduct = async (id: number): Promise<StoreProductResponse | null> => {
    const response = await fetch(`/api/store/get-product?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (response.status !== 200) {
        return null;
    }

    return data;
};

export const getOrder = async (order_id: number) => {
    try {
        const response = await fetch(`/api/store/get-order?order_id=${order_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// ------ unused
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
