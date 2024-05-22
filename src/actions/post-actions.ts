"use server";
import { Post } from "@/types/posts";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";

export const maybeLikePost = async (postId: number) => {
    const user = await getSessionUser();

    const response = await fetch(`${API_URL}/wp-json/app/v1/toggle-like-post`, {
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

export const maybeBookmarkPost = async (postId: number) => {
    const user = await getSessionUser();

    const response = await fetch(`${API_URL}/wp-json/app/v1/bookmark-post`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, post_id: postId }),
    });
    const data = await response.json();
    console.log(data);

    return data;
};

export const fetchPosts = async (page: number) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-posts?page=${page}&limit=10`, {
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

    const response = await fetch(`${API_URL}/wp-json/app/v1/add-post-comment`, {
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
        console.error("Error fetching user");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-post-comments`, {
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

export const addPost = async (mediaList: string[], caption?: string, location?: string) => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        throw new Error("User session expired. Please login again.");
    }

    const formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("caption", caption || "");
    formData.append("location", location || "");
    for (let i = 0; i < mediaList.length; i++) {
        formData.append("mediaData[]", mediaList[i]);
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/save-media`, {
        cache: "no-cache",
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    if (!data || data.error) {
        throw new Error(data.error);
    }

    if (response.status !== 200) {
        throw new Error("Failed to create post");
    }

    return data;
};


export const fetchPost = async (postId: string): Promise<Post | null> => {
    let user;
    try {
        user = await getSessionUser();
    } catch (e) {
        console.error("Error fetching user");
    }

    const response = await fetch(`${API_URL}/wp-json/app/v1/get-post`, {
        cache: "no-cache",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user?.id, post_id: postId }),
    });

    const data = await response.json();

    if (response.status !== 200) {
        return null;
    }

    return data;
};