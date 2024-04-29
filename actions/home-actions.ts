"use server";

import { auth } from "@/auth";

const getSessionUser = async () => {
    const session = await auth();

    if (!session) {
        throw new Error("No session found");
    }

    return session.user;
};

export const fetchTrendingEvents = async () => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch("https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/get-events-trending", {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id }),
    });
    const data = await response.json();
    return data;
};

export const fetchEvent = async (eventId: string) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch(`https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/get-event`,
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

    const response = await fetch(`https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/favourite-event`, {
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