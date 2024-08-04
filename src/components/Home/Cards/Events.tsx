import dynamic from "next/dynamic";
import { CarEventCard, CarEventCardSkeleton } from "../Events";
import { useDiscoverFilters } from "@/app/context/DiscoverFilterContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useEffect, useState } from "react";
import { fetchTrendingEvents } from "@/api-functions/discover";

const SlideInFromBottomToTop = dynamic(() => import('@/shared/SlideIn'), { ssr: false });
const ViewEvent = dynamic(() => import('@/components/Home/ViewEvent'), { ssr: false });

const Events = memo(() => {
    const { dateFilter, locationFilter, categoryFilter, customDateRange, customLocation } = useDiscoverFilters();
    const { error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["filtered-events", dateFilter, locationFilter, categoryFilter, customDateRange, customLocation],
        queryFn: ({ pageParam }) => {
            let location;
            if (customLocation) {
                location = {
                    latitude: customLocation.geometry?.location?.lat(),
                    longitude: customLocation.geometry?.location?.lng(),
                };
            }

            const filters = {
                'event_location': locationFilter,
                'custom_location': location,
                'event_date': dateFilter,
                'event_start': customDateRange?.start,
                'event_end': customDateRange?.end,
                'event_category': !categoryFilter?.includes(0) ? categoryFilter : undefined,
            };

            return fetchTrendingEvents(pageParam || 1, true, filters);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: any[], limit: number; }, pages: any[]) => {
            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialPageParam: null,
    });

    const [activeEvent, setActiveEvent] = useState<string>();

    // Infinite scroll
    useEffect(() => {
        let fetching = false;

        const onScroll = async (event: any) => {
            // if elemt with class .nav-link data-bs-toggle="tab" href="#events" has aria-selected="true" then fetch events
            const activeTab = document.querySelector(".nav-link[data-bs-toggle='tab'][href='#events']") as HTMLElement;
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

    const hasRows = (data?.pages && data.pages.length > 0) && data?.pages[0].data && data?.pages[0].data.length > 0;

    return (
        <>
            <SlideInFromBottomToTop isOpen={activeEvent ? true : false} onClose={() => setActiveEvent(undefined)}>
                {activeEvent && <ViewEvent eventId={activeEvent} />}
            </SlideInFromBottomToTop>

            <div className="section mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}

                {(!isFetching && !hasRows) && <p className="px-3">No events found</p>}

                <div className="row">
                    {data && data?.pages.map((page, idx) => page.data.map((event: any, idx: number) => (
                        <div className="col-6">
                            <div className="card mb-3">
                                <CarEventCard event={event} onClick={(id) => setActiveEvent(id)} key={idx} />
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

export default Events;