'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Post } from '../../types/posts';
import { fetchPosts } from '@/actions/post-actions';
import { useInfiniteQuery } from '@tanstack/react-query';

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
}

const ObservedQueryContext = createContext<ObservedQueryContextProps>(
    {} as ObservedQueryContextProps
);

export const useObservedQuery = (): ObservedQueryContextProps => {
    return useContext(ObservedQueryContext);
};

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
        refetch,
        followingOnly,
        setFollowingOnly,
    };

    return (
        <ObservedQueryContext.Provider value={contextValue}>
            {children}
        </ObservedQueryContext.Provider>
    );
};

export default ObservedQueryProvider;
