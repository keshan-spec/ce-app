"use server";

import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";
import { GarageFormType } from "@/components/Profile/Garage/AddVehicle";

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