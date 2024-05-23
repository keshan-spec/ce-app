"use server";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";

export const getUserPosts = async (profileId: string, page: number, tagged = false, limit = 10) => {
    if (tagged) {
        return [];
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-user-posts`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: profileId, page, limit, tagged }),
    });

    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message);
    return data;
};

export const maybeFollowUser = async (profileId: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/follow-user`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ following_id: profileId, follower_id: user.id }),
    });

    const data = await response.json();
    if (response.status !== 200) throw new Error(data.message);
    return data;
};