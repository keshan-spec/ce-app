"use client";
import { useEffect, useState } from "react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { useQuery } from "react-query";
import likeAnimation2 from "../lottie/lottie-2.json";

import Lottie from "lottie-react";
import Link from "next/link";
import { fetchTrendingEvents } from "@/actions/home-actions";

const formatEventDate = (date: string): string => {
    const eventDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };

    return eventDate.toLocaleDateString('en-US', options);
};

export const CarEventCard = ({ event }: { event: any; }) => {
    const startMonth = new Date(event.start_date).toLocaleString('default', { month: 'short' });
    const startDay = new Date(event.start_date).getDate();

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);

    const likePost = async (postId: string) => {
        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);

        if (!prevStatus) {
            setIsAnimationPlaying(true);
        }

        // TODO: API call to like post

        setTimeout(() => {
            setIsAnimationPlaying(false);
        }, 1500);
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

            <Link href={`/events/${event.id}`} passHref className="cursor-pointer">
                <div className="card-body pt-2">
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
            </Link>
        </>
    );
};

export const CarEventCardSkeleton = () => {
    return (
        <div className="card max-w-sm bg-slate-100 animate-pulse">
            <div className="news-list-home-slider-img-row">
                <div className="news-list-home-slider-img skeleton w-full h-full bg-gray-300 animate-pulse">
                </div>
                <div className="heart-icon m-1">
                    <BiHeart className="w-6 h-6 text-gray-300 animate-pulse" />
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
                <div className="news-list-slider-info">
                    <h3 className="w-1/2 bg-gray-300 animate-pulse"></h3>
                    <p className="w-1/4 bg-gray-300 animate-pulse"></p>
                    <p className="w-1/4 bg-gray-300 animate-pulse"></p>
                </div>
            </div>
        </div>
    );
};

interface TrendingEventProps {
}

const carouselOptions = {
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

export const TrendingEvents: React.FC<TrendingEventProps> = ({ }) => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["trendingEvents"],
        queryFn: () => {
            return fetchTrendingEvents();
        },
        retry: 0,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!data) {
            // @ts-ignore
            new Splide('.carousel-multiple', carouselOptions).mount();
            return;
        };

        // @ts-ignore
        const splide = new Splide('.trending-events', carouselOptions).mount();

        return () => {
            splide.destroy();
        };
    }, [data]);

    return (
        <>
            <div className="header-large-title">
                <h1 className="title">Trending Events</h1>
            </div>

            <div className="section full mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <div className="trending-events splide carousel-multiple-wrapper">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {data && data?.map((event: any, idx) => (
                                <li className="splide__slide card" key={idx}>
                                    <CarEventCard event={event} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {(isLoading || isFetching) && (
                    <div className="carousel-multiple splide carousel-multiple-wrapper">
                        <div className="splide__track">
                            <ul className="splide__list">
                                <li className="splide__slide">
                                    <CarEventCardSkeleton />
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export const NearYouEvents: React.FC<TrendingEventProps> = ({ }) => {
    const { data, error, isFetching, isLoading } = useQuery<any[], Error>({
        queryKey: ["close-events"],
        queryFn: () => {
            return fetchTrendingEvents();
        },
        retry: 0,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!data) {
            // @ts-ignore
            new Splide('.carousel-multiple', carouselOptions).mount();
            return;
        };

        // @ts-ignore
        const splide = new Splide('.near-events', carouselOptions).mount();

        return () => {
            splide.destroy();
        };
    }, [data]);

    return (
        <>
            <div className="header-large-title">
                <h1 className="title">Near You</h1>
            </div>

            <div className="section full mt-2 mb-3">
                {error instanceof Error && <p className="px-3">Error: {error?.message ?? "An error occured"}</p>}
                <div className="near-events splide carousel-multiple-wrapper">
                    <div className="splide__track">
                        <ul className="splide__list">
                            {data && data?.map((event: any, idx) => (
                                <li className="splide__slide card" key={idx}>
                                    <CarEventCard event={event} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {(isLoading || isFetching) && (
                    <div className="carousel-multiple splide carousel-multiple-wrapper">
                        <div className="splide__track">
                            <ul className="splide__list">
                                <li className="splide__slide">
                                    <CarEventCardSkeleton />
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};