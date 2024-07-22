"use server";
import { SocialMediaLinks } from "@/zod-schemas/profile";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";
import { UserSchema } from "@/zod-schemas/billing-form";

export const getUserPosts = async (profileId: string, page: number, tagged = false, limit = 10) => {
    const response = await fetch(`${API_URL}/wp-json/app/v1/get-user-posts`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: profileId, page, limit, tagged }),
    });

    const data = await response.json();
    if (response.status !== 200) {
        return [];
    }
    return data;
};

export const maybeFollowUser = async (profileId: string | number) => {
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
    return data;
};

export type ProfileLinks = {
    type: 'instagram' | 'tiktok' | 'facebook' | 'email' | 'youtube' | 'custodian' | 'mivia' | 'external_links';
    link: string | { label: string; url: string; };
};

export const addUserProfileLinks = async ({
    link,
    type,
}: ProfileLinks): Promise<{
    success: boolean;
    message: string;
    id?: string;
} | null> => {
    const user = await getSessionUser();
    if (!user) return null;

    const response = await fetch(`${API_URL}/wp-json/app/v1/add-profile-links`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, link, type }),
    });

    const data = await response.json();
    return data;
};

export const updateSocialLinks = async (links: SocialMediaLinks) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-social-links`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, links }),
    });

    const data = await response.json();
    return data;
};

export const removeProfileLink = async (linkId: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/remove-profile-link`, {
        cache: "no-cache",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, link_id: linkId }),
    });

    const data = await response.json();
    if (response.status !== 200 || data.error) {
        throw new Error(data.message);
    }

    return data;
};

export const updateProfileImage = async (image: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-profile-image`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, image }),
    });

    const data = await response.json();
    return data;
};

export const updateCoverImage = async (image: string) => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-cover-image`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, image }),
    });

    const data = await response.json();
    return data;
};

export const removeProfileImage = async () => {
    const user = await getSessionUser();
    if (!user) return;

    const response = await fetch(`${API_URL}/wp-json/app/v1/remove-profile-image`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id }),
    });

    const data = await response.json();
    return data;
};

export const updateBillingInfo = async (info: UserSchema) => {
    const user = await getSessionUser();
    if (!user) return;

    if (!info) {
        return;
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/update-billing-info`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, info }),
    });

    const data = await response.json();
    return data;
};
