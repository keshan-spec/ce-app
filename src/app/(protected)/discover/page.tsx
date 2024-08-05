import dynamic from "next/dynamic";

const DiscoverPage = dynamic(() => import("@/components/Discover/DiscoverPage"));

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