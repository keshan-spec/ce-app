"use server";

import { Garage } from "@/types/garage";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";

export const getGarageById = async (garageId: string): Promise<Garage | null> => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ garage_id: garageId }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(data.message);
    }

    return data;
};

export const getUserGarage = async (profileId: string) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-user-garage`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: profileId }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(data.message);
    }
    return data;
};

export const getGaragePosts = async (garageId: string, page: number, limit = 10) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage-posts`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ garage_id: garageId, page, limit, }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }

    return data;
};