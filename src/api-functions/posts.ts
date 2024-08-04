export const fetchPosts = async (page: number, following_only = false) => {
    const query = new URLSearchParams({
        page: page.toString(),
        following_only: following_only.toString(),
    });

    const endpoint = following_only ? '/api/get-posts/following' : '/api/get-posts/latest';

    const response = await fetch(`${endpoint}?${query.toString()}`, {
        method: "GET",
        cache: "force-cache",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch trending events');
    }

    const data = await response.json();
    return data;
};

export const getUserPosts = async (profileId: string, page: number, tagged = false, limit = 10) => {
    const query = new URLSearchParams({
        profileId: profileId.toString(),
        page: page.toString(),
        limit: limit.toString(),
        tagged: tagged.toString(),
    });

    const response = await fetch(`/api/get-posts/user?${query.toString()}`, {
        method: "GET",
        cache: "force-cache",
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