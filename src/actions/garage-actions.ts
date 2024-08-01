"use server";

import { Garage } from "@/types/garage";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";
import { GarageFormType } from "@/components/Profile/Garage/AddVehicle";

export const getGarageById = async (garageId: string): Promise<Garage | null> => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ garage_id: garageId }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        return null;
    }
    return data;
};

export const getUserGarage = async (profileId: string) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-user-garage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: profileId }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }
    return data;
};

export const getGaragePosts = async (garageId: string, tagged: boolean, page: number, limit = 10,) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-garage-posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ garage_id: garageId, page, limit, tagged }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }

    return data;
};

export const addVehicleToGarage = async (data: GarageFormType) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/add-vehicle-to-garage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            user_id: user.id,
        }),
    });

    const res = await response.json();
    return res;
};

export const updateVehicleInGarage = async (data: GarageFormType, garageId: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-garage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...data,
            user_id: user.id,
            garage_id: garageId,
        }),
    });

    const res = await response.json();
    return res;
};

export const deleteVehicleFromGarage = async (garageId: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/delete-garage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: user.id,
            garage_id: garageId,
        }),
    });

    const res = await response.json();
    return res;
};