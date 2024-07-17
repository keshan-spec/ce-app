"use server";
import { Post } from "@/types/posts";
import { API_URL } from "./api";
import { getSessionUser } from "./auth-actions";
import { ImageMeta, Tag } from "@/app/context/CreatePostContext";

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

export const addPost = async (mediaList: ImageMeta, caption?: string, location?: string, associatedCars?: string) => {
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
    formData.append("mediaData", JSON.stringify(mediaList));

    try {
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
    } catch (e: any) {
        console.log(e.message);
        throw new Error("Failed to create post");
    }
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

export const deletePost = async (postId: number) => {
    try {
        const user = await getSessionUser();
        const response = await fetch(`${API_URL}/wp-json/app/v1/delete-post`, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, post_id: postId }),
        });



        const data = await response.json();
        if (!response.ok || response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (e: any) {
        console.error("Error deleting post");
        throw new Error(e.message);
    }
};

export const maybeLikeComment = async (commentId: number) => {
    try {
        const user = await getSessionUser();
        if (!user || !user.id) throw new Error("User session expired. Please login again.");

        const response = await fetch(`${API_URL}/wp-json/app/v1/toggle-like-comment`, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, comment_id: commentId }),
        });
        const data = await response.json();

        if (!response.ok || response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (e: any) {
        console.error("Error liking comment");
        throw new Error(e.message);
    }
};

export const addTagsForPost = async (postId: number, tags: Tag[]) => {
    try {
        const user = await getSessionUser();
        if (!user || !user.id) throw new Error("User session expired. Please login again.");

        const response = await fetch(`${API_URL}/wp-json/app/v1/add-tags`, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user?.id, post_id: postId, tags }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok || response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (e: any) {
        console.error("Error adding tags", e.message);
        return null;
    }
};

export interface PostTag {
    entity_id: number;
    type: 'car' | 'user' | 'event';
    x: number;
    y: number;
    entity: {
        id: number;
        name: string;
        image?: string;
        owner?: {
            id: number;
            name: string;
        };
    };
    media_id: number;
}

export interface PartialPostTag {
    entity_id: number;
    type: 'car' | 'user' | 'event';
    name: string;
    image: string;
}

export const fetchTagsForPost = async (postId: number): Promise<PostTag[] | null> => {
    try {
        const response = await fetch(`${API_URL}/wp-json/app/v1/get-post-tags`, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ post_id: postId }),
        });
        const data = await response.json();
        if (!response.ok || response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (e: any) {
        return [];
    }
};


export const fetchTaggableEntites = async (search: string, tagged_entities: Partial<Tag>[], is_vehicle?: boolean): Promise<any> => {
    const url = is_vehicle ? `${API_URL}/wp-json/app/v1/get-taggable-vehicles` : `${API_URL}/wp-json/app/v1/get-taggable-entities`;

    try {
        const user = await getSessionUser();
        if (!user || !user.id) throw new Error("User session expired. Please login again.");

        const response = await fetch(url, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ search, user_id: user.id, tagged_entities }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok || response.status !== 200) {
            throw new Error(data.message);
        }

        return data;
    } catch (e: any) {
        return [];
    }
};

interface UpdateTagRequest {
    post_id: string | number;
    new_tags: PostTag[];
    removed_tags: number[];
    caption?: string;
    location?: string;
}

export const updatePost = async (data: UpdateTagRequest) => {
    try {
        const user = await getSessionUser();
        if (!user || !user.id) throw new Error("User session expired. Please login again.");

        const response = await fetch(`${API_URL}/wp-json/app/v1/edit-post`, {
            cache: "no-cache",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id, ...data }),
        });

        const res = await response.json();
        return res;
    } catch (e: any) {
        console.error("Error updating post", e.message);
        return null;
    }
};