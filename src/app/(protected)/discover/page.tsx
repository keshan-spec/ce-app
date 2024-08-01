import { fetchTrendingEvents, fetchTrendingVenues } from "@/actions/home-actions";
import DiscoverAndSearchPage from "@/components/Home/Home";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const queryPrefetchPromises = () => {
    return [
        queryClient.prefetchQuery({
            queryKey: ["trending-events"],
            queryFn: () => fetchTrendingEvents(1),
        }),
        queryClient.prefetchQuery({
            queryKey: ["trending-venues"],
            queryFn: () => fetchTrendingVenues(1),
        }),
    ];
};

export default async function Page() {
    await Promise.all(queryPrefetchPromises());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DiscoverAndSearchPage />
        </HydrationBoundary>
    );
}