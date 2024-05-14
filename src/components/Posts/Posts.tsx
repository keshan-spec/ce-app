'use client';
import { PostCardSkeleton } from "./PostCardSkeleton";
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiBookBookmark, BiBookmark, BiComment, BiHeart, BiLike, BiMailSend, BiMapPin, BiShare, BiShareAlt, BiSolidHeart, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import NcImage from "../Image/Image";

import { Share } from '@capacitor/share';

import useEmblaCarousel from 'embla-carousel-react';

import React, {
    PropsWithChildren,
    useCallback,
} from 'react';

import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { Post } from "@/types/posts";
import { useObservedQuery } from "@/app/context/ObservedQuery";
import { maybeLikePost } from "@/actions/post-actions";
import { useUser } from "@/hooks/useUser";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "./ComentSection";
import clsx from "clsx";
import { formatPostDate } from "@/utils/dateUtils";
import AutoHeight from 'embla-carousel-auto-height';
import { useDotButton } from "../Carousel/EmbalDotButtons";

type DotButtonPropType = PropsWithChildren<
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

export const DotButton: React.FC<DotButtonPropType> = (props) => {
    const { children, ...restProps } = props;

    return (
        <button type="button" {...restProps}
            className={`${restProps.className} cursor-pointer`}
            aria-label="Go to slide">
            {children}
        </button>
    );
};

const PostCard = ({ post, muted, setMuted, openComments }: {
    post: Post,
    muted: boolean,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    openComments: (postId: number) => void;
}) => {
    console.log(post);

    const { isLoggedIn } = useUser();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);


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
        try {
            await Share.share({
                title: "Share Event",
                text: post.caption,
                url: window.location.href,
                dialogTitle: "Share Event",
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onLikePost = async () => {
        if (!isLoggedIn) {
            alert("Please login to like event");
            return;
        }

        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);
        post.likes_count += isLiked ? -1 : 1;

        try {
            const response = await maybeLikePost(post.id);

            if (response) {
                post.is_liked = !isLiked;
            }
        } catch (error) {
            // Rollback
            setIsLiked(prevStatus);
            post.likes_count += prevStatus ? 1 : -1;
            alert("Oops! Unable to like post");
            console.log(error);
        }
    };

    const renderLike = () => {
        return (
            <div className="flex flex-col items-center justify-start">
                {!isLiked ? <BiHeart className="w-5 h-5 text-gray-300" onClick={onLikePost} /> : <BiSolidHeart className="w-5 h-5 text-red-600" onClick={onLikePost} />}
            </div>
        );
    };

    const renderMedia = useMemo(() => {
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
                <div onDoubleClick={onLikePost}>
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
                            <div className="flex gap-1 min-w-24 items-start justify-start">
                                {renderLike()}
                                <BiComment onClick={() => openComments(post.id)} />
                                <BiShareAlt onClick={sharePost} />
                            </div>

                            <div className="flex min-w-24 items-start justify-end">
                                <BiBookmark />
                            </div>
                        </div>

                        <span className="text-xs">{post.likes_count ?? 0} likes</span>

                        <div className="font-medium flex items-center gap-1 text-sm truncate w-48 md:w-full lg:w-full" title={post.caption}>
                            <div className=" text-white text-xs">{post.username ?? "Attendee"}</div>
                            <span className="text-white/80 text-xs"> {post.caption}</span>
                        </div>
                        {post.comments_count ? (
                            <span className="text-white/60 text-xs cursor-pointer" onClick={() => openComments(post.id)}>
                                View  {post.comments_count > 1 ? `all ${post.comments_count} comments` : `comment`}
                            </span>
                        ) : null}
                        <div className="text-white/60 text-xs">{formatPostDate(post.post_date)}</div>
                    </div>
                </div>
            );
        }

        return (
            <div className="embla" ref={emblaRef} onDoubleClick={onLikePost}>
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
                        <div className="flex gap-1 min-w-24 items-start justify-start">
                            {renderLike()}
                            <BiComment onClick={() => openComments(post.id)} />
                            <BiShareAlt onClick={sharePost} />
                        </div>

                        <div className="flex gap-1 min-w-24 items-start justify-center max-w-20">
                            {scrollSnaps.map((_, index) => {
                                return (
                                    <DotButton
                                        key={index}
                                        onClick={() => onDotButtonClick(index)}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                    </DotButton>
                                );
                            })}
                        </div>

                        <div className="flex min-w-24 items-start justify-end">
                            <BiBookmark />
                        </div>
                    </div>

                    <span className="text-xs">{post.likes_count ?? 0} likes</span>

                    <div className="font-medium flex items-center gap-1 text-sm truncate w-48 md:w-full lg:w-full" title={post.caption}>
                        <div className=" text-white text-xs">{post.username ?? "Attendee"}</div>
                        <span className="text-white/80 text-xs"> {post.caption}</span>
                    </div>
                    {post.comments_count ? (
                        <span className="text-white/60 text-xs cursor-pointer" onClick={() => openComments(post.id)}>
                            View  {post.comments_count > 1 ? `all ${post.comments_count} comments` : `comment`}
                        </span>
                    ) : null}
                    <div className="text-white/60 text-xs">{formatPostDate(post.post_date)}</div>
                </div>
            </div>
        );
    }, [post, muted, isLiked, selectedIndex, scrollSnaps]);

    return (
        <div className="relative shadow-md overflow-hidden bg-theme-dark mb-6 text-white" id={`PostMain-${post.id}`}>
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex flex-col items-start justify-start">
                    <div className="font-medium text-white text-sm">{post.username ?? "Attendee"}</div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                        <BiMapPin /> {post.location ?? "England, UK"}
                    </div>
                </div>
            </div>

            {renderMedia}
        </div>
    );
};

export const Posts: React.FC = () => {
    const { data, isFetching, isLoading, hasNextPage, isFetchingNextPage } = useObservedQuery();
    const [muted, setMuted] = useState(true); // State to track muted state

    const [activeSection, setActiveSection] = useState<number | undefined>();

    const handleOpenComments = useCallback((postId: number) => {
        if (activeSection) {
            setActiveSection(undefined);

            setTimeout(() => {
                setActiveSection(postId);
            }, 500);
            return;
        }

        setActiveSection(postId);
    }, [activeSection]);

    const getCommentCount = () => {
        const postId = activeSection;
        const post = data?.pages.find((page: any) => page.data.find((post: Post) => post.id === postId));

        if (!post) return 0;

        return post.data.find((post: Post) => post.id === postId)?.comments_count ?? 0;
    };

    return (
        <div className="w-full bg-theme-dark">
            <SlideInFromBottomToTop
                isOpen={activeSection ? true : false}
                onClose={() => setActiveSection(undefined)}
                height={"80%"}
                title={`${getCommentCount()} comments`}
                stickyScroll={true}
            >
                {activeSection && <ComentsSection postId={activeSection} />}
            </SlideInFromBottomToTop>

            <ul className={clsx(
                "listview flush transparent no-line image-listview max-w-md mx-auto",
            )}>
                {data && data.pages.map((page: any) => (
                    page.data.map((post: Post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            muted={muted}
                            setMuted={setMuted}
                            openComments={handleOpenComments}
                        />
                    ))
                ))}
                {isFetching && <PostCardSkeleton />}
            </ul>
        </div>
    );
};