'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { Post } from '../../types/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api-functions/posts';

interface ObservedQueryContextProps {
    data: any; // Replace 'any' with the type of your data
    isLoading: boolean;
    error: any; // Replace 'any' with the type of your error object
    isFetching: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<any>;
    hasNextPage: boolean | undefined;
    refetch: () => Promise<any>;
    followingOnly: boolean;
    setFollowingOnly: (value: boolean) => void;
    getMorePosts: () => void;
}

const ObservedQueryContext = createContext<ObservedQueryContextProps>(
    {} as ObservedQueryContextProps
);

const ObservedQueryProvider = ({ children }: any) => {
    const [followingOnly, setFollowingOnly] = useState(false);
    const key = followingOnly ? 'following-posts' : 'latest-posts';

    const { isLoading, error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
        queryKey: [key],
        queryFn: ({ pageParam }) => {
            return fetchPosts(pageParam || 1, followingOnly);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: Post[], limit: number; }, pages: any[]) => {
            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialPageParam: 1,
        retry: 1,
        gcTime: 1000 * 60 * 30,
    });

    const getMorePosts = useCallback(async () => {
        if (hasNextPage && !isFetchingNextPage) {
            await fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage]);

    const contextValue = {
        data,
        isLoading,
        isFetching,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        refetch,
        followingOnly,
        setFollowingOnly,
        getMorePosts,
    };

    return (
        <ObservedQueryContext.Provider value={contextValue}>
            {children}
        </ObservedQueryContext.Provider>
    );
};

export const useObservedQuery = (): ObservedQueryContextProps => {
    return useContext(ObservedQueryContext);
};

export default ObservedQueryProvider;
