"use client";
import { memo, useEffect, useState } from "react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
// import likeAnimation2 from "../lottie/lottie-2.json";
// import Lottie from "lottie-react";

import { fetchTrendingEvents, fetchTrendingVenues, maybeFavoriteEvent } from "@/actions/home-actions";

import { formatEventDate } from "@/utils/dateUtils";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ViewEvent } from "./ViewPost";
import { useUser } from "@/hooks/useUser";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDiscoverFilters } from "@/app/context/DiscoverFilterContext";

import { Options } from "@splidejs/splide";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

export const carouselOptions: Options = {
    perPage: 4,
    rewind: true,
    type: "loop",
    gap: 16,
    padding: 16,
    arrows: false,
    pagination: false,
    breakpoints: {
        768: {
            perPage: 2
        },
        991: {
            perPage: 3
        }
    }
};

export const CarEventCard = ({ event, onClick }: { event: any; onClick: (id: string) => void; }) => {
    const { isLoggedIn } = useUser();

    const startMonth = new Date(event.start_date).toLocaleString('default', { month: 'short' });
    const startDay = new Date(event.start_date).getDate();

    const [isLiked, setIsLiked] = useState<boolean>(event.is_liked ?? false);
    // const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);

    const likePost = async (postId: string) => {
        if (!isLoggedIn) {
            alert("Please login to like event");
            return;
        }

        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);

        // if (!prevStatus) {
        //     setIsAnimationPlaying(true);
        // }

        // setTimeout(() => {
        //     setIsAnimationPlaying(false);
        // }, 1500);

        try {
            // TODO: API call to like post
            const response = await maybeFavoriteEvent(postId);

            if (response) {
                event.is_liked = !isLiked;
            }
        } catch (error) {
            // Rollback
            setIsLiked(prevStatus);
            alert("Oops! Unable to save event");
            console.log(error);
        }
    };

    const renderLike = () => {
        return !isLiked ? <BiHeart className="w-6 h-6 text-gray-300" /> : <BiSolidHeart className="w-6 h-6 text-red-600" />;
    };

    return (
        <>
            <div className="news-list-home-slider-img-row relative">
                <div className="news-list-home-slider-img"
                    onClick={() => onClick(event.id)}
                    style={{
                        backgroundImage: `url(${event.thumbnail ?? "https://via.placeholder.com/300"})`
                    }}
                />

                {/* {(isAnimationPlaying) && (
                    <Lottie
                        autoPlay={isAnimationPlaying}
                        loop={false}
                        animationData={likeAnimation2}
                        className="w-14 h-14 absolute -top-2.5 -right-3.5 text-red-600"
                    />
                )} */}

                <div className="heart-icon" onClick={() => likePost(event.id)}>
                    {renderLike()}
                </div>

                <div className="dates d-flex">
                    <div className="date">
                        <p>{startMonth}</p>
                        <h5>{startDay}</h5>
                    </div>
                    {/* <div className="date">
                        <p>Feb</p>
                        <h5>21</h5>
                    </div> */}
                </div>
            </div>

            <div className="card-body pt-2 cursor-pointer" onClick={() => onClick(event.id)}>
                <div className="news-list-slider-info flex flex-col justify-start h-full">
                    <div className="flex flex-col">
                        <h3 className="text-ellipsis truncate">
                            {event.title}
                        </h3>
                        <p>{formatEventDate(event.start_date)}</p>
                    </div>
                    <p className="text-ellipsis truncate">{event.location}</p>
                </div>
            </div>
        </>
    );
};

export const CarEventCardSkeleton = memo(() => {
    return (
        <div className="card max-w-sm bg-slate-100 min-h-64 rounded-xl overflow-hidden">
            <div className="news-list-home-slider-img-row bg-gray-300 animate-pulse">
                <div className="news-list-home-slider-img skeleton w-full h-full">
                </div>
                <div className="heart-icon m-1 z-50">
                    <BiHeart className="w-6 h-6 text-gray-400 animate-pulse" />
                </div>
                <div className="dates d-flex">
                    <div className="date">
                        <span className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></span>
                        <span className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></span>
                    </div>
                    <div className="date">
                        <span className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></span>
                        <span className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></span>
                    </div>
                </div>
            </div>
            <div className="card-body pt-2">
                <div className="news-list-slider-info w-full">
                    <h3 className="w-full h-3 bg-gray-300 rounded-lg animate-pulse"></h3>
                    <p className="w-1/2 h-3 bg-gray-300 rounded-lg animate-pulse"></p>
                    <p className="w-1/2 h-3 mt-3 bg-gray-300 rounded-lg animate-pulse"></p>
                </div>
            </div>
        </div>
    );
});

const VenueCard = memo(({ venue, onClick }: { venue: any; onClick: (id: string) => void; }) => {
    return (
        <>
            <div className="news-list-home-slider-img-row relative">
                <div className="news-list-home-slider-img"
                    onClick={() => onClick(venue.id)}
                    style={{
                        backgroundImage: `url(${venue.cover_image ?? "https://via.placeholder.com/300"})`
                    }}>
                </div>
                <img src={venue.logo} alt="venue" className="w-24 h-24 object-cover rounded-lg absolute top-7 left-11 border" />
            </div>


            <div className="card-body pt-2 cursor-pointer" onClick={() => onClick(venue.id)}>
                <div className="news-list-slider-info flex flex-col justify-start h-full">
                    <div className="flex flex-col">
                        <h3 className="text-ellipsis truncate">
                            {venue.title}
                        </h3>
                    </div>
                    <p className="text-ellipsis truncate">{venue.venue_location}</p>
                    {/* distance */}
                    <p className="text-ellipsis truncate">Apprx. {venue.distance} miles away</p>
                </div>
            </div>
        </>
    );
});

export const TrendingVenues = memo(() => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["trending-venues"],
        queryFn: () => {
            return fetchTrendingVenues(1);
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [activeVenue, setActiveVenue] = useState<string>();

    return (
        <>
            <SlideInFromBottomToTop isOpen={activeVenue ? true : false} onClose={() => setActiveVenue(undefined)}>
                {activeVenue && <ViewEvent eventId={activeVenue} />}
            </SlideInFromBottomToTop>

            <div className="header-large-title">
                <h1 className="title">Trending Venues</h1>
            </div>

            <div className="section full mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                {(!isFetching && data?.length === 0) && <p className="px-3">No venues found</p>}

                <Splide options={carouselOptions}>
                    {(isLoading || isFetching) && (
                        <SplideSlide>
                            <CarEventCardSkeleton />
                        </SplideSlide>
                    )}

                    {data && data?.map((venue: any, idx: number) => (
                        <SplideSlide className="card" key={idx}>
                            <VenueCard venue={venue} onClick={(id) => setActiveVenue(id)} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </>
    );
});

export const TrendingEvents = memo(() => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["trending-events"],
        queryFn: () => {
            return fetchTrendingEvents(1);
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [activeEvent, setActiveEvent] = useState<string>();

    return (
        <>
            <SlideInFromBottomToTop isOpen={activeEvent ? true : false} onClose={() => setActiveEvent(undefined)}>
                {activeEvent && <ViewEvent eventId={activeEvent} />}
            </SlideInFromBottomToTop>

            <div className="header-large-title">
                <h1 className="title">Trending Events</h1>
            </div>

            <div className="section full mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <Splide options={carouselOptions}>
                    {(isLoading || isFetching) && (
                        <SplideSlide>
                            <CarEventCardSkeleton />
                        </SplideSlide>
                    )}

                    {data && data?.map((event: any, idx: number) => (
                        <SplideSlide className="card" key={idx}>
                            <CarEventCard event={event} onClick={(id) => setActiveEvent(id)} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </>
    );
});

export const Events = memo(() => {
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

    const hasRows = data?.pages && data.pages.length > 0 && data?.pages[0].data.length > 0;

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

export const Venues = memo(() => {
    const { locationFilter, customLocation } = useDiscoverFilters();

    const { error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
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