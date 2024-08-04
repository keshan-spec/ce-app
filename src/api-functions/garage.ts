import { Garage } from "@/types/garage";

export const getGarageById = async (garageId: string): Promise<Garage | null> => {
    const response = await fetch(`/api/garage/get-garage?garageId=${garageId}`, {
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

export const getUserGarage = async (profileId: string) => {
    const response = await fetch(`/api/garage/get-user-garage?profileId=${profileId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }
    return data;
};

export const getGaragePosts = async (garageId: string, tagged: boolean, page: number, limit = 10,) => {
    const query = new URLSearchParams({
        garageId,
        tagged: tagged.toString(),
        page: page.toString(),
        limit: limit.toString(),
    });

    const response = await fetch(`/api/garage/get-posts?${query}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }

    return data;
};
