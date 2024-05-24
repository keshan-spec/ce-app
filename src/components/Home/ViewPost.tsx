"use client";
import { IonIcon } from "@ionic/react";
import { calendarClearOutline, heart, location, shareSocial, ticketOutline } from "ionicons/icons";
// import { useQuery } from "react-query";
import { fetchEvent, maybeFavoriteEvent } from "@/actions/home-actions";
import EmblaCarousel, { IGallery } from "../Carousel/Embla";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";

const bannerData = [
    {
        title: "Great British Motor Show",
        date: "17th – 20th August",
        img: "assets/img/sample/photo/home-slider-1.jpg",
    },
    {
        title: "Great British Motor Show",
        date: "17th – 20th August",
        img: "assets/img/sample/photo/home-slider-2.jpg",
    },
];

interface ViewEventProps {
    eventId: string;
}

export const ViewEvent: React.FC<ViewEventProps> = ({ eventId }) => {
    const { isLoggedIn } = useUser();

    const { data, error, isFetching, isLoading } = useQuery<any, Error>({
        queryKey: ["event", eventId],
        queryFn: () => {
            return fetchEvent(eventId);
        },
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [isLiked, setIsLiked] = useState<boolean>(data?.is_liked ?? false);

    useEffect(() => {
        setIsLiked(data?.is_liked ?? false);
    }, [data]);

    const likePost = async () => {
        if (!isLoggedIn) {
            alert("Please login to like event");
            return;
        }

        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);

        try {
            // TODO: API call to like post
            const response = await maybeFavoriteEvent(eventId);

            if (response) {
                data.is_liked = !isLiked;
            }
        } catch (error) {
            // Rollback
            setIsLiked(prevStatus);
            alert("Oops! Unable to save event");
            console.log(error);
        }
    };

    const renderLike = () => {
        return !isLiked ? <BiHeart className="w-5 h-5 text-gray-300" /> : <BiSolidHeart className="w-5 h-5 text-white" />;
    };

    const craeteSlides = (): IGallery[] => {
        const slides: IGallery[] = data.gallery.map((img: any) => {
            return {
                src: img.url,
                alt: img.alt,
                width: img.width,
                height: img.height,
            };
        });

        return [
            {
                src: data.cover_photo.url,
                alt: data.cover_photo.alt,
                width: data.cover_photo.width,
                height: data.cover_photo.height,
            },
            ...slides,
        ];
    };


    return (
        <>
            {(isLoading || isFetching) && <ViewEventSkeleton />}
            {error && <div>{error.message}</div>}
            {data && <>
                <EmblaCarousel slides={craeteSlides()} />

                <div className="product-details-section">
                    <div className="product-details-info-row">
                        <div className="product-details-title font-semibold max-w-sm mx-auto">{data.title}</div>
                        <div className="product-ul">
                            <ul>
                                <li className="!text-sm">
                                    <IonIcon icon={calendarClearOutline} className="!text-sm" />
                                    Sat, Aug 18th - Sun, Aug 19th 2021   •   10AM - 4PM</li>
                                <li className="!text-sm">
                                    <IonIcon icon={location} className="!text-sm" />
                                    {data.location}
                                </li>
                            </ul>
                        </div>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2 mx-auto"
                            onClick={() => { }}>
                            <IonIcon icon={shareSocial} />
                            Share event
                        </button>

                        <div className="product-details-btn-row">
                            <div className="product-btn">
                                <button type="button" className="product-button buy-tickets" onClick={() => {
                                    // open new tab to buy tickets
                                    window.open(data.ticket_url, "_blank");
                                }}>
                                    <IonIcon icon={ticketOutline} className="mr-1" />
                                    {data.has_tickets ? (
                                        <>
                                            Buy tickets
                                        </>
                                    ) : (
                                        <>
                                            Register for Event
                                        </>
                                    )}

                                </button>
                            </div>
                            <div className="product-btn">

                                <button type="button" className="product-button flex gap-1 items-center justify-center" onClick={likePost}>
                                    {renderLike()}
                                    {isLiked ? "Remove from favourites" : "Add to favourites"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-tab-section">
                    <div className="product-tab-wrapper">

                        <div className="tab-pane fade show active" id="pilled" role="tabpanel">
                            <div className="product-tab-block">
                                <ul className="nav nav-tabs capsuled" role="tablist">
                                    <li className="nav-item"> <a className="nav-link active" data-bs-toggle="tab" href="#details" role="tab">Details</a> </li>
                                    <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#location" role="tab">Location</a> </li>
                                    <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#gallery" role="tab">Gallery</a> </li>
                                    <li className="nav-item"> <a className="nav-link" data-bs-toggle="tab" href="#comments" role="tab">Comments (0)</a> </li>
                                </ul>
                                <div className="tab-content mt-2">
                                    <div className="tab-pane fade show active" id="details" role="tabpanel">
                                        <div className="product-tab-content">
                                            <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade min-h-[200px]" id="location" role="tabpanel">
                                        {data.location}
                                    </div>
                                    <div className="tab-pane fade min-h-[200px]" id="gallery" role="tabpanel">

                                    </div>
                                    <div className="tab-pane fade min-h-[200px]" id="comments" role="tabpanel">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
        </>
    );
};


const ViewEventSkeleton = () => {
    return (
        <div>
            <div className="product-detail-slider">
                {/* Skeleton for slider */}
                <div className="skeleton-slider w-full h-64 mb-4 bg-gray-200 animate-pulse"></div>
            </div>

            <div className="product-details-section">
                <div className="product-details-info-row">
                    <div className="product-details-title">
                        {/* Skeleton for title */}
                        <div className="skeleton-title w-3/4 h-8 mb-4 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="product-ul">
                        {/* Skeleton for details */}
                        <div className="skeleton-details w-full h-6 mb-2 bg-gray-200 rounded-xl"></div>
                        <div className="skeleton-details w-full h-6 mb-2 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="product-share-btn">
                        {/* Skeleton for share button */}
                        <div className="skeleton-button w-32 h-10 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="product-details-btn-row">
                        <div className="product-btn">
                            {/* Skeleton for buy tickets button */}
                            <div className="skeleton-button w-32 h-10 mr-4 bg-gray-200 rounded-xl"></div>
                        </div>
                        <div className="product-btn">
                            {/* Skeleton for add to favorites button */}
                            <div className="skeleton-button w-32 h-10 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-tab-section">
                <div className="product-tab-wrapper">
                    <div className="tab-pane fade show active" id="pilled" role="tabpanel">
                        <div className="product-tab-block">
                            <ul className="nav nav-tabs capsuled" role="tablist">
                                {/* Skeleton for tabs */}
                                <li className="nav-item">
                                    <div className="skeleton-tab w-20 h-8 bg-gray-200 rounded-xl"></div>
                                </li>
                                <li className="nav-item">
                                    <div className="skeleton-tab w-20 h-8 bg-gray-200 rounded-xl"></div>
                                </li>
                                <li className="nav-item">
                                    <div className="skeleton-tab w-20 h-8 bg-gray-200 rounded-xl"></div>
                                </li>
                                <li className="nav-item">
                                    <div className="skeleton-tab w-20 h-8 bg-gray-200 rounded-xl"></div>
                                </li>
                            </ul>
                            <div className="tab-content mt-2">
                                {/* Skeleton for tab content */}
                                <div className="tab-pane fade show active" id="details" role="tabpanel">
                                    <div className="product-tab-content bg-gray-200 rounded-xl">
                                        <div className="skeleton-details w-full h-12 mb-2"></div>
                                        <div className="skeleton-details w-full h-12 mb-2"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};