'use client';

import { createContext, useContext, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Posts } from '../types/posts';

interface ObservedQueryContextProps {
    data: any; // Replace 'any' with the type of your data
    isLoading: boolean;
    error: any; // Replace 'any' with the type of your error object
    isFetching: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<any>;
    hasNextPage: boolean | undefined;
    refetch: () => Promise<any>;
}

const ObservedQueryContext = createContext<ObservedQueryContextProps>(
    {} as ObservedQueryContextProps
);

export const useObservedQuery = (): ObservedQueryContextProps => {
    return useContext(ObservedQueryContext);
};

const fetchPosts = async (page: number) => {
    const response = await fetch(`https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-json/app/v1/get-posts?page=${page}&limit=10`);
    console.log(response);
    const data = await response.json();
    return data;
};

export const ObservedQueryProvider = ({ children }: any) => {
    const { isLoading, error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: ({ pageParam = 1 }) => {
            return fetchPosts(pageParam);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: Posts[], limit: number; }, pages: any[]) => {
            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    });

    // Infinite scroll
    useEffect(() => {
        let fetching = false;
        const onScroll = async (event: any) => {

            const { scrollHeight, scrollTop, clientHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true;
                if (hasNextPage) await fetchNextPage();
                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage]);

    const contextValue = {
        data,
        isLoading,
        isFetching,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch
    };

    return (
        <ObservedQueryContext.Provider value={contextValue}>
            {children}
        </ObservedQueryContext.Provider>
    );
};
