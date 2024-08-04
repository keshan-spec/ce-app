import axios from 'axios';
import crypto from 'crypto';
import { getSessionUser } from '@/actions/auth-actions';

const createHash = (filters: any) => {
    const hash = crypto.createHash('sha256');
    hash.update(JSON.stringify(filters));
    return hash.digest('hex');
};

export const fetchTrendingEvents = async (page: number, paginate = false, filters = {}) => {
    try {
        const user = await getSessionUser();
        if (!user) {
            throw new Error('Session user not found');
        }

        // create a hash of the filters object so the cache is unique for each set of filters
        const cacheKey = createHash(filters);

        const query = new URLSearchParams({
            page: page.toString(),
            paginate: paginate.toString(),
            filters: JSON.stringify(filters),
            cacheKey,
            user_id: user.id,
        });

        const response = await axios.get(`/api/discover/trending-events?${query.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchTrendingVenues = async (page: number, paginate = false, filters = {}) => {
    try {
        const user = await getSessionUser();

        if (!user) {
            throw new Error('Session user not found');
        }

        const cacheKey = createHash(filters);
        const query = new URLSearchParams({
            page: page.toString(),
            paginate: paginate.toString(),
            filters: JSON.stringify(filters),
            cacheKey,
        });

        const response = await axios.get(`/api/discover/trending-venues?${query.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        return response.data;

        // const response = await fetch(`/api/discover/trending-venues?${query.toString()}`, {
        //     method: "GET",
        //     cache: "force-cache",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        // });

        // if (!response.ok) {
        //     throw new Error('Failed to fetch trending events');
        // }

        // const data = await response.json();
        // return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getEventCategories = async () => {
    const response = await fetch(`/api/discover/get-event-categories`, {
        method: "GET",
        cache: "force-cache",
    });

    const data = await response.json();
    return data;
};