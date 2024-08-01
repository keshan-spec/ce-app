"use server";

import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";

export const fetchTrendingEvents = async (page: number, paginate = false, filters?: any) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user, session not found");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-events-trending`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, page, per_page: 10, paginate, filters }),
    });


    const data = await response.json();
    return data;
};

export const fetchTrendingVenues = async (page: number, paginate = false, filters?: any) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user, session not found");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-venues-trending`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, page, per_page: 10, paginate, filters }),
    });


    const data = await response.json();
    return data;
};

export const fetchEvent = async (eventId: string) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user no session");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-event`,
        {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ event_id: eventId, user_id: user?.id }),
        });

    const data = await response.json();
    if (response.status !== 200) {
        throw new Error(data.message);
    }

    return data;
};

export const maybeFavoriteEvent = async (eventId: string) => {
    const user = await getSessionUser();

    if (!user || !user.id) {
        throw new Error("User not logged in");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/favourite-event`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: eventId, user_id: user.id }),
    });

    const data = await response.json();

    if (response.status !== 200) {
        throw new Error(data.message);
    }

    return data;
};

export type SearchType = 'users' | 'events' | 'venues' | 'all';

export const getDiscoverData = async (search: string, type: SearchType, page: number) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user no session");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/discover-search`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ search, user_id: user?.id, page, type, per_page: 10 }),
    });

    const data = await response.json();
    return data;
};

export const getEventCategories = async () => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-event-categories`, {
        method: "GET",
    });

    const data = await response.json();
    return data;
};