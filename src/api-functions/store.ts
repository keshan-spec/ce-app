import { getSessionUser } from "@/actions/auth-actions";
import { UserOrderResponse } from "@/types/store";

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