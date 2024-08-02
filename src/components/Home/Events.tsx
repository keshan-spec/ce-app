"use client";
import { memo, useState } from "react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { maybeFavoriteEvent } from "@/actions/home-actions";

import { formatEventDate } from "@/utils/dateUtils";
import { useUser } from "@/hooks/useUser";
import { Options } from "@splidejs/splide";

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

export const VenueCard = memo(({ venue, onClick }: { venue: any; onClick: (id: string) => void; }) => {
    return (
        <>
            <div className="news-list-home-slider-img-row relative">
                <div className="news-list-home-slider-img"
                    // onClick={() => onClick(venue.id)}
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