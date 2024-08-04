export const fetchTrendingEvents = async (page: number, paginate = false, filters = {}) => {
    const query = new URLSearchParams({
        page: page.toString(),
        paginate: paginate.toString(),
        filters: JSON.stringify(filters),
    });

    const response = await fetch(`/api/discover/trending-events?${query.toString()}`, {
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

export const fetchTrendingVenues = async (page: number, paginate = false, filters = {}) => {
    const query = new URLSearchParams({
        page: page.toString(),
        paginate: paginate.toString(),
        filters: JSON.stringify(filters),
    });

    const response = await fetch(`/api/discover/trending-venues?${query.toString()}`, {
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