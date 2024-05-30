import { useInfiniteQuery, DefinedInitialDataInfiniteOptions } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";


const useInfiniteScrolling = <TData, TError>(params: DefinedInitialDataInfiniteOptions<TData, Error>) => {
    const { error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<any, Error>(params);

    // Infinite scroll
    useEffect(() => {
        let fetching = isFetchingNextPage || isFetching || false;

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
    }, [hasNextPage, isFetchingNextPage]);

    const hasPages = useMemo(() => {
        if (data && data.pages) {
            // get flat array of posts
            const validPosts = data.pages.map((page: any) => {
                return !!page.data;
            });

            return validPosts.includes(true);
        }

        return false;
    }, [data]);

    return {
        error,
        data,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        hasPages
    };
};

export default useInfiniteScrolling;