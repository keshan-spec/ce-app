'use client';
import { useObservedQuery } from "../../context/ObservedQuery";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { useEffect, useRef, useState } from 'react';
import { BiBookBookmark, BiBookmark, BiHeart, BiLike, BiMailSend, BiMapPin, BiShare, BiShareAlt, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import NcImage from "../Image/Image";

import { Share } from '@capacitor/share';

const formatPostDate = (date: string) => {
    // format to relative time, like less than a minute ago, 1 minute ago, 1 hour ago, etc.
    const postDate = new Date(date);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const seconds = timeDifference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    const years = months / 12;

    if (seconds < 60) {
        return `${Math.floor(seconds)} seconds ago`;
    } else if (minutes < 60) {
        return `${Math.floor(minutes)} minutes ago`;
    } else if (hours < 24) {
        return `${Math.floor(hours)} hours ago`;
    } else if (days < 30) {
        return `${Math.floor(days)} days ago`;
    } else if (months < 12) {
        return `${Math.floor(months)} months ago`;
    } else {
        return `${Math.floor(years)} years ago`;
    }
};

import useEmblaCarousel from 'embla-carousel-react';

import React, {
    PropsWithChildren,
    useCallback,
} from 'react';

import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { Post } from "../../types/posts";
import clsx from "clsx";

type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
    emblaApi: EmblaCarouselType | undefined,
    onButtonClick?: (emblaApi: EmblaCarouselType) => void
): UseDotButtonType => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onDotButtonClick = useCallback(
        (index: number) => {
            if (!emblaApi) return;
            emblaApi.scrollTo(index);
            if (onButtonClick) onButtonClick(emblaApi);
        },
        [emblaApi, onButtonClick]
    );

    const onInit = useCallback((emblaApi: EmblaCarouselType) => {
        setScrollSnaps(emblaApi.scrollSnapList());
    }, []);

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onInit(emblaApi);
        onSelect(emblaApi);
        emblaApi.on('reInit', onInit);
        emblaApi.on('reInit', onSelect);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onInit, onSelect]);

    return {
        selectedIndex,
        scrollSnaps,
        onDotButtonClick
    };
};

type PropType = PropsWithChildren<
    React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >
>;

interface CarouselProps {
    children: React.ReactNode;
    settings?: EmblaOptionsType;
}

export const Carousel = ({ children, settings = { loop: false } }: CarouselProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(settings);

    return (
        <div className="embla" ref={emblaRef}>
            <div className="embla__container">
                {children}
            </div>
        </div>
    );
};

export const DotButton: React.FC<PropType> = (props) => {
    const { children, ...restProps } = props;

    return (
        <button type="button" {...restProps}
            className={`${restProps.className} cursor-pointer`}
            aria-label="Go to slide">
            {children}
        </button>
    );
};

const PostCard = ({ post, muted, setMuted }: {
    post: Post,
    muted: boolean,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        const postMainElement = document.getElementById(`PostMain-${post.id}`);

        let observer = new IntersectionObserver((entries) => {
            if (video === null) return;
            if (entries[0].isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        }, { threshold: [0.6] });

        if (postMainElement) {
            observer.observe(postMainElement);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const sharePost = async () => {
        // Share.canShare().then(async (result) => {
        //     if (!result.value) {
        //         // Check if the share plugin is available
        //         if (!navigator.share) {
        //             // Web Share API not available, provide alternative sharing method
        //             alert('Share API not available in this browser. You can manually share the link.');
        //             return;
        //         }

        //         // Share using the Web Share API
        //         try {
        //             await navigator.share({
        //                 title: post.post.post_title,
        //                 text: post.post.post_title,
        //                 url: post.url,
        //             });
        //         } catch (error) {
        //             console.error('Error sharing:', error);
        //             alert('Failed to share the post. You can manually share the link.');
        //         }
        //     } else {
        //         await Share.share({
        //             title: post.post.post_title,
        //             text: post.post.post_title,
        //             url: post.url,
        //             dialogTitle: 'Share post'
        //         });
        //     }
        // });
    };

    const renderMedia = () => {
        const { media } = post;

        if (media.length === 0) {
            return null;
        }

        // Get the dimensions of the first media
        const firstMedia = media[0];
        const firstMediaWidth = firstMedia.media_width;
        const firstMediaHeight = firstMedia.media_height;

        if (media.length === 1) {
            return (
                <div>
                    {firstMedia.media_type === 'image' && (
                        <NcImage src={firstMedia.media_url} alt={firstMedia.media_alt} className="object-contain w-full" imageDimension={{
                            width: firstMediaWidth,
                            height: firstMediaHeight
                        }} />
                    )}

                    {firstMedia.media_type === 'video' && (
                        <>
                            <video
                                loop
                                muted={muted}
                                id={`video-${firstMedia.id}`}
                                className="object-contain w-full cursor-pointer"
                                ref={videoRef}
                                onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                            >
                                <source src={firstMedia.media_url} type={firstMedia.media_mime_type} />
                            </video>
                            <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
                                {muted ? <BiVolumeMute /> : <BiVolumeFull />}
                            </button>
                        </>
                    )}
                    <div className="flex flex-col p-2 gap-y-2">
                        <div className="flex gap-1 w-full justify-between text-xl">
                            <div className="flex gap-1 min-w-24 items-center justify-start">
                                <BiHeart />
                                <BiShareAlt />
                            </div>

                            <div className="flex min-w-24 items-center justify-end">
                                <BiBookmark />
                            </div>
                        </div>
                        <div className="font-medium flex items-center gap-1 text-sm truncate w-48 md:w-full lg:w-full" title={post.caption}>
                            <div className=" text-white text-xs">{post.username ?? "Attendee"}</div>
                            <span className="text-white/80 text-xs"> {post.caption}</span>
                        </div>
                        <div className="text-white/60 text-xs">{formatPostDate(post.post_date)}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {media.map((item, index) => (
                        <div key={item.id} className="embla__slide">
                            {item.media_type === 'image' && (
                                <NcImage src={item.media_url} alt={item.media_alt} className="object-contain w-full" imageDimension={{
                                    width: item.media_width,
                                    height: item.media_height
                                }} />
                            )}

                            {item.media_type === 'video' && (
                                <>
                                    <video
                                        loop
                                        muted={muted}
                                        id={`video-${item.id}`}
                                        className="object-contain w-full cursor-pointer"
                                        ref={videoRef}
                                        onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                                    >
                                        <source src={item.media_url} type={item.media_mime_type} />
                                    </video>
                                    <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
                                        {muted ? <BiVolumeMute /> : <BiVolumeFull />}
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col p-2 gap-y-2">
                    <div className="flex gap-1 w-full justify-between text-xl">
                        <div className="flex gap-1 min-w-24 items-center justify-start">
                            <BiHeart />
                            <BiShareAlt />
                        </div>

                        <div className="flex gap-1 min-w-24 items-center justify-center max-w-20">
                            {scrollSnaps.map((_, index) => {
                                return (
                                    <DotButton
                                        key={index}
                                        onClick={() => onDotButtonClick(index)}
                                    // if over 5 dots, show only 5 dots and show the rest as they scroll
                                    // className={clsx(
                                    //     index > 5 && selectedIndex < 4 ? 'opacity-50' : 'block',
                                    //     index < 5 && selectedIndex >= 4 ? 'opacity-50' : 'block',
                                    //     'group'
                                    // )}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                    </DotButton>
                                );
                            })}
                        </div>

                        <div className="flex min-w-24 items-center justify-end">
                            <BiBookmark />
                        </div>
                    </div>
                    <div className="font-medium flex items-center gap-1 text-sm truncate w-48 md:w-full lg:w-full" title={post.caption}>
                        <div className=" text-white text-xs">{post.username ?? "Attendee"}</div>
                        <span className="text-white/80 text-xs"> {post.caption}</span>
                    </div>
                    <div className="text-white/60 text-xs">{formatPostDate(post.post_date)}</div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative shadow-md overflow-hidden bg-theme-dark mb-6 max-h-[80vh] text-white" id={`PostMain-${post.id}`}>
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex flex-col items-start justify-start">
                    <div className="font-medium text-white text-sm">{post.username ?? "Attendee"}</div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                        <BiMapPin /> {post.location ?? "England, UK"}
                    </div>
                </div>
            </div>

            {renderMedia()}
        </div>
    );
};

export const Posts: React.FC = () => {
    const { data, isFetching, isLoading, hasNextPage, isFetchingNextPage } = useObservedQuery();
    const [muted, setMuted] = useState(true); // State to track muted state

    return (
        <div className="w-full bg-theme-dark">
            {/* <div className="offcanvas-body"> */}
            <ul className="listview flush transparent no-line image-listview max-w-md mx-auto">
                {data && data.pages.map((page: any) => (
                    page.data.map((post: Post) => (
                        <PostCard key={post.id} post={post} muted={muted} setMuted={setMuted} />
                    ))
                ))}
                {isFetching && <PostCardSkeleton />}
            </ul>
            {/* </div> */}
        </div>
    );
};