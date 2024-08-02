"use client";
import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import { CarEventCard, CarEventCardSkeleton, carouselOptions } from "../Events";
import { fetchTrendingEvents } from "@/actions/home-actions";

const ViewEvent = dynamic(() => import('@/components/Home/ViewEvent'), { ssr: false });
const SlideInFromBottomToTop = dynamic(() => import('@/shared/SlideIn'), { ssr: false });

const TrendingEvents = memo(() => {
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

export default TrendingEvents;