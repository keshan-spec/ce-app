import { fetchTrendingVenues } from "@/actions/home-actions";
import { useDiscoverFilters } from "@/app/context/DiscoverFilterContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { CarEventCardSkeleton, VenueCard } from "../Events";

const SlideInFromBottomToTop = dynamic(() => import('@/shared/SlideIn'), { ssr: false });
const ViewEvent = dynamic(() => import('@/components/Home/ViewEvent'), { ssr: false });


const Venues = memo(() => {
    const { locationFilter, customLocation } = useDiscoverFilters();

    const { error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["filtered-venues", locationFilter, customLocation],
        queryFn: ({ pageParam }) => {
            let location;

            if (customLocation) {
                location = {
                    latitude: customLocation.geometry?.location?.lat(),
                    longitude: customLocation.geometry?.location?.lng(),
                };
            }

            const filters = {
                'location': locationFilter,
                'custom_location': location,
            };

            if (customLocation) {
                location = {
                    latitude: customLocation.geometry?.location?.lat(),
                    longitude: customLocation.geometry?.location?.lng(),
                };
            }

            return fetchTrendingVenues(pageParam || 1, true, filters);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: any[], limit: number; }, pages: any[]) => {
            if (lastPage.total_pages === 1) return undefined;

            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialPageParam: null,
    });

    // Infinite scroll
    useEffect(() => {
        let fetching = false;

        const onScroll = async (event: any) => {
            const activeTab = document.querySelector(".nav-link[data-bs-toggle='tab'][href='#venues']") as HTMLElement;
            if (!activeTab || activeTab.getAttribute("aria-selected") !== "true") return;

            if (isFetchingNextPage) return;

            const { scrollHeight, scrollTop, clientHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true;

                if (hasNextPage && !isFetchingNextPage) {
                    console.log("hasNextPage", fetching);
                    await fetchNextPage();
                };

                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNextPage, isFetchingNextPage]);

    const [activeEvent, setActiveEvent] = useState<string>();

    return (
        <>
            <SlideInFromBottomToTop isOpen={activeEvent ? true : false} onClose={() => setActiveEvent(undefined)}>
                {activeEvent && <ViewEvent eventId={activeEvent} />}
            </SlideInFromBottomToTop>

            <div className="section mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <div className="row">
                    {data && data?.pages.map((page, idx) => page.data.map((venue: any, idx: number) => (
                        <div className="col-6">
                            <div className="card mb-3">
                                <VenueCard venue={venue} onClick={(id) => setActiveEvent(id)} key={idx} />
                            </div>
                        </div>
                    )))}

                    {(isFetchingNextPage || isFetching) && (
                        <>
                            <div className="col-6">
                                <div className="card mb-3">
                                    <CarEventCardSkeleton />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card mb-3">
                                    <CarEventCardSkeleton />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card mb-3">
                                    <CarEventCardSkeleton />
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="card mb-3">
                                    <CarEventCardSkeleton />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
});

export default Venues;