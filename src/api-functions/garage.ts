import { Garage } from "@/types/garage";

export const getGarageById = async (garageId: string): Promise<Garage | null> => {
    const response = await fetch(`/api/garage/get-garage?id=${garageId}`, {
        method: "GET",
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
    const response = await fetch(`/api/garage/get-user-garage`, {
        method: "GET",
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
    const response = await fetch(`/api/garage/get-posts`, {
        method: "GET",
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
