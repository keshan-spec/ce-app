// import { fetchTrendingEvents, fetchTrendingVenues } from "@/api-functions/discover";
// import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";

const DiscoverPage = dynamic(() => import("@/components/Discover/DiscoverPage"));

// const queryClient = new QueryClient();

export default async function Page() {
    // await Promise.all([
    //     queryClient.prefetchQuery({
    //         queryKey: ["trending-events"],
    //         queryFn: () => fetchTrendingEvents(1),
    //     }),
    //     queryClient.prefetchQuery({
    //         queryKey: ["trending-venues"],
    //         queryFn: () => fetchTrendingVenues(1),
    //     }),
    // ]);

    return (
        <DiscoverPage />
    );
}