import { QueryClient, QueryKey } from '@tanstack/react-query';

type QueryConfig = {
    queryKey: QueryKey;
    queryFn: (page?: number) => Promise<any>;
    isInfinite?: boolean;
};

const useBulkPrefetchQueries = (queries: QueryConfig[]) => {
    const queryClient = new QueryClient();

    const prefetchQueries = async () => {
        await Promise.all(
            queries.map(({ queryKey, queryFn, isInfinite }) => {
                if (isInfinite) {
                    return queryClient.prefetchInfiniteQuery({
                        queryKey: [queryKey],
                        queryFn: () => queryFn(1),
                        initialPageParam: 1,
                    });
                }

                return queryClient.prefetchQuery({
                    queryKey: [queryKey],
                    queryFn: () => queryFn(),
                });
            })
        );
    };

    return prefetchQueries;
};

export default useBulkPrefetchQueries;
