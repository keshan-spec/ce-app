"use client";

import { useState } from "react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
// import { useQuery } from "react-query";
import likeAnimation2 from "../lottie/lottie-2.json";

import Lottie from "lottie-react";

import { fetchTrendingEvents, maybeFavoriteEvent } from "@/actions/home-actions";
import { Options } from "@splidejs/splide";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { formatEventDate } from "@/utils/dateUtils";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ViewEvent } from "./ViewPost";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";

const carouselOptions: Options = {
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
    const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);

    const likePost = async (postId: string) => {
        if (!isLoggedIn) {
            alert("Please login to like event");
            return;
        }

        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);

        if (!prevStatus) {
            setIsAnimationPlaying(true);
        }

        setTimeout(() => {
            setIsAnimationPlaying(false);
        }, 1500);

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
                    style={{
                        backgroundImage: `url(${event.thumbnail ?? "https://via.placeholder.com/300"})`
                    }}> </div>

                {(isAnimationPlaying) && (
                    <Lottie
                        autoPlay={isAnimationPlaying}
                        loop={false}
                        animationData={likeAnimation2}
                        className="w-14 h-14 absolute -top-2.5 -right-3.5 text-red-600"
                    />
                )}

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

            {/* <Link href={`/events/${event.id}`} passHref className="cursor-pointer"> */}
            <div className="card-body pt-2 cursor-pointer" onClick={() => onClick(event.id)}>
                <div className="news-list-slider-info flex flex-col justify-start h-full">
                    <div className="flex flex-col">
                        <h3>
                            {event.title}
                        </h3>
                        <p>{formatEventDate(event.start_date)}</p>
                    </div>
                    <p>{event.location}</p>
                </div>
            </div>
            {/* </Link> */}
        </>
    );
};

export const CarEventCardSkeleton = () => {
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
};

interface EventProps {
}

export const TrendingEvents: React.FC<EventProps> = ({ }) => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["trending-events"],
        queryFn: () => {
            return fetchTrendingEvents();
        },
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        // cacheTime: 1000,
        staleTime: 1000,
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

                    {data && data?.map((event: any, idx) => (
                        <SplideSlide className="card" key={idx}>
                            <CarEventCard event={event} onClick={(id) => setActiveEvent(id)} />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </>
    );
};

export const NearYouEvents: React.FC<EventProps> = ({ }) => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["close-events"],
        queryFn: () => {
            return fetchTrendingEvents();
        },
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [activeEvent, setActiveEvent] = useState<string>();

    return (
        <div>
            <SlideInFromBottomToTop isOpen={activeEvent ? true : false} onClose={() => setActiveEvent(undefined)}>
                {activeEvent && <ViewEvent eventId={activeEvent} />}
            </SlideInFromBottomToTop>

            <div className="header-large-title">
                <h1 className="title">Near Your</h1>
            </div>

            <div className="section full mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <Splide options={carouselOptions}>
                    {(isLoading || isFetching) && (
                        <SplideSlide>
                            <CarEventCardSkeleton />
                        </SplideSlide>
                    )}

                    {data && data?.map((event: any, idx) => (
                        <SplideSlide className="card" key={idx}>
                            <CarEventCard event={event} onClick={
                                (id) => setActiveEvent(id)
                            } />
                        </SplideSlide>
                    ))}
                </Splide>
            </div>
        </div>
    );
};

export const Events: React.FC<EventProps> = ({ }) => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["filtered-events"],
        queryFn: () => {
            return fetchTrendingEvents();
        },
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        // cacheTime: 1000,
        staleTime: 1000,
    });

    const [activeEvent, setActiveEvent] = useState<string>();

    return (
        <>
            <SlideInFromBottomToTop isOpen={activeEvent ? true : false} onClose={() => setActiveEvent(undefined)}>
                {activeEvent && <ViewEvent eventId={activeEvent} />}
            </SlideInFromBottomToTop>

            <div className="section mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <div className="row">

                    {(isLoading || isFetching) && (
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

                    {data && data?.map((event: any, idx) => (
                        <div className="col-6">
                            <div className="card mb-3">
                                <CarEventCard event={event} onClick={(id) => setActiveEvent(id)} key={idx} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};