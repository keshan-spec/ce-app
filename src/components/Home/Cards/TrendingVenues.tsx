"use client";
import { memo, useState } from "react";
import { fetchTrendingVenues } from "@/actions/home-actions";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { CarEventCardSkeleton, carouselOptions, VenueCard } from "../Events";

const ViewEvent = dynamic(() => import('@/components/Home/ViewEvent'), { ssr: false });
const SlideInFromBottomToTop = dynamic(() => import('@/shared/SlideIn'), { ssr: false });

const TrendingVenues = memo(() => {
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

export default TrendingVenues;
