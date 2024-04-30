"use server";
import { getSessionUser } from "./auth-actions";

export const maybeLikePost = async (postId: number) => {
    const user = await getSessionUser();

    const response = await fetch("https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/toggle-like-post", {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, post_id: postId }),
    });
    const data = await response.json();
    return data;
};

export const fetchPosts = async (page: number) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch(`https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/get-posts?page=${page}&limit=10`, {
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

export const addComment = async (postId: number, comment: string) => {
    const user = await getSessionUser();

    const response = await fetch("https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/add-post-comment", {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, post_id: postId, comment }),
    });

    const data = await response.json();
    return data;
};

export const fetchPostComments = async (postId: number) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user", e);
    }

    const response = await fetch(`https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/get-post-comments`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, post_id: postId }),
    });

    const data = await response.json();
    return data;
};