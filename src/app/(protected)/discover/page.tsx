import dynamic from "next/dynamic";
import { Suspense } from "react";

const DiscoverPage = dynamic(() => import("@/components/Discover/DiscoverPage"), { ssr: false });

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
        <Suspense fallback={<div>Loading...</div>}>
            <DiscoverPage />
        </Suspense>
    );
}