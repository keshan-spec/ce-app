"use client";
import { useCallback, useState } from "react";

import { Post } from "@/types/posts";
import { PostNotFound } from '@/components/Posts/PostNotFound';

import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "@/components/Posts/ComentSection";
import { fetchPost } from "@/actions/post-actions";
import { PostCardSkeleton } from "@/components/Posts/PostCardSkeleton";
import { PostCard } from "@/components/Posts/PostCard";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { useEffect, useMemo, useRef } from "react";
import { useDotButton } from "../Carousel/EmbalDotButtons";
import useEmblaCarousel from 'embla-carousel-react';
import AutoHeight from 'embla-carousel-auto-height';
import { maybeBookmarkPost, maybeLikePost } from "@/actions/post-actions";
import { BiBookmark, BiComment, BiHeart, BiMapPin, BiSolidBookmark, BiSolidHeart, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import clsx from "clsx";
import NcImage from "../Image/Image";
import { DotButton } from "./Posts";
import Link from "next/link";

const PostClient = ({ postId }: { postId: string; }) => {
    const { data, error, isLoading, isFetching } = useQuery<Post | null, Error>({
        queryKey: ["view-post", postId],
        queryFn: () => fetchPost(postId),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    const [muted, setMuted] = useState(true); // State to track muted state
    const [commentsOpen, setCommentsOpen] = useState(false); // State to track comments open state

    const handleOpenComments = useCallback(() => {
        setCommentsOpen(true);
    }, [postId]);

    const getCommentCount = useCallback(() => {
        return data?.comments_count || 0;
    }, [data]);

    const { isLoggedIn, user } = useUser();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [AutoHeight({ delay: 5000, stopOnInteraction: false })]);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const [isLiked, setIsLiked] = useState<boolean>(data?.is_liked ?? false);
    const [bookMarked, setBookMarked] = useState<boolean>(data?.is_bookmarked ?? false);

    useEffect(() => {
        console.log('PostCard.tsx -> useEffect -> post.id', data?.id);

        const video = videoRef.current;

        if (!video) return;

        const postMainElement = document.getElementById(`PostMain-${data?.id}`);

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

    // when swipe to next slide, pause the video
    useEffect(() => {
        console.log('PostCard.tsx -> useEffect -> emblaApi', emblaApi);

        const video = videoRef.current;

        if (!video) return;

        const onUserScroll = (e: any) => {
            // const slidesInView = emblaApi?.slidesInView(); // <-- Pass true to the slidesInView method
            // console.log(slidesInView);
            video.pause();
        };

        emblaApi?.on('select', onUserScroll);

        return () => {
            emblaApi?.off('select', onUserScroll);
        };
    }, [emblaApi]);

    const onLikePost = async () => {
        if (!data) return;
        if (!isLoggedIn) {
            alert("Please login to like post");
            return;
        }

        const prevStatus = isLiked;

        // Optimistic UI
        setIsLiked(!isLiked);
        data.likes_count += isLiked ? -1 : 1;

        try {
            const response = await maybeLikePost(data.id);

            if (response) {
                data.is_liked = !isLiked;
            }
        } catch (error) {
            // Rollback
            setIsLiked(prevStatus);
            data.likes_count += prevStatus ? 1 : -1;
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

    const handleBookMark = async () => {
        if (!data) return;

        if (!isLoggedIn) {
            alert("Please login to bookmark post");
            return;
        }

        const prevStatus = bookMarked;

        // Optimistic UI
        setBookMarked(!bookMarked);
        data.is_bookmarked = bookMarked;

        try {
            await maybeBookmarkPost(data.id);
        } catch (error) {
            // Rollback
            setBookMarked(prevStatus);
            alert("Oops! Unable to bookmark post");
            data.is_bookmarked = prevStatus;
            console.log(error);
        }
    };

    const renderBookmark = () => {
        return (
            <div className="flex flex-col items-center justify-start">
                {!bookMarked ? <BiBookmark className="w-5 h-5 text-gray-300" onClick={handleBookMark} /> : <BiSolidBookmark className="w-5 h-5 text-white" onClick={handleBookMark} />}
            </div>
        );
    };

    const renderMedia = () => {
        if (!data) return null;

        const { media } = data;

        if (media.length === 0) {
            return null;
        }

        return (
            <div className="embla" onDoubleClick={onLikePost}>
                <div className="embla__viewport" ref={emblaRef}>
                    <div className="embla__container">
                        {media.map((item, index) => {
                            const calculatedHeight = parseInt(item.media_height) ? parseInt(item.media_height) - 50 : 400;
                            const maxHeight = calculatedHeight > 600 ? 600 : calculatedHeight;

                            return (
                                <div key={item.id} className={clsx(
                                    "embla__slide h-full group",
                                    item.media_type === 'video' && "embla__slide--video"
                                )}>
                                    <div className="embla__slide__number w-full h-full">
                                        {item.media_type === 'image' && (
                                            <NcImage
                                                key={item.id}
                                                src={item.media_url} alt={item.media_alt}
                                                className="object-contain w-full"
                                                imageDimension={{
                                                    width: parseInt(item.media_width) || 400,
                                                    height: maxHeight || 400
                                                }}
                                            />
                                        )}

                                        {item.media_type === 'video' && (
                                            <>
                                                <div
                                                    className={`w-full h-full flex items-center justify-center relative`}
                                                    style={{ width: item.media_width, height: maxHeight }}
                                                >
                                                    <video
                                                        loop
                                                        muted={muted}
                                                        id={`video-${item.id}`}
                                                        className="object-contain w-full cursor-pointer"
                                                        ref={videoRef}
                                                        width={parseInt(item.media_width) || 400}
                                                        height={parseInt(item.media_height) || 400}
                                                        onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                                                    >
                                                        <source src={item.media_url} type={item.media_mime_type} />
                                                    </video>
                                                    <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
                                                        {muted ? <BiVolumeMute /> : <BiVolumeFull />}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col p-2 gap-y-2">
                    <div className="flex gap-1 w-full justify-between text-xl">
                        <div className="flex gap-2 min-w-24 items-start justify-start">
                            {renderLike()}
                            <BiComment onClick={() => handleOpenComments()} />

                        </div>
                        {media.length > 1 && (
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
                        )}

                        <div className="flex min-w-24 items-start justify-end">
                            {renderBookmark()}
                        </div>
                    </div>

                    <span className="text-xs">{data.likes_count ?? 0} likes</span>

                    <div className="font-medium flex items-center gap-1 text-sm" title={data.caption}>
                        <div className=" text-white text-xs">{data.username ?? "Attendee"}</div>
                        <span className="text-white/80 text-xs"> {data.caption}</span>
                    </div>
                    {data.comments_count ? (
                        <span className="text-white/60 text-xs cursor-pointer" onClick={() => handleOpenComments()}>
                            View  {data.comments_count > 1 ? `all ${data.comments_count} comments` : `comment`}
                        </span>
                    ) : null}
                    {/* <div className="text-white/60 text-xs">{formatPostDate(data.post_date)}</div> */}
                </div>
            </div>
        );
    };

    const renderContent = useCallback(() => {
        console.log('PostClient.tsx -> Rendering content');

        if (data && !isLoading) {
            return (
                <>
                    <SlideInFromBottomToTop
                        isOpen={commentsOpen}
                        onClose={() => setCommentsOpen(false)}
                        height={"80%"}
                        title={`${getCommentCount()} comments`}
                        stickyScroll={true}
                    >
                        <ComentsSection postId={parseInt(postId)} />
                    </SlideInFromBottomToTop>

                    <div className="relative shadow-md overflow-hidden bg-theme-dark mb-6 text-white" id={`PostMain-${data.id}`}>
                        <div className="flex items-center justify-between px-3 py-3">
                            <div className="flex flex-col items-start justify-start">
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="avatar">
                                        <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary">
                                            <Link href={`/profile/${data.user_id}`} passHref>
                                                <img
                                                    src={data.user_profile_image}
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="font-medium text-white text-sm">{data.username}</div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            {data.location && (
                                                <div className="flex items-center gap-1">
                                                    <BiMapPin />
                                                    <span>{data.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data && renderMedia()}
                    </div>
                </>
            );
        }

        if (!data && !isLoading && !isFetching) {
            return <PostNotFound />;
        }

        return null;
    }, [commentsOpen, data, isLoading, muted, postId, isFetching]);

    return (
        <div className="bg-theme-dark min-h-screen max-h-screen overflow-hidden">
            {(isFetching || isLoading) && (
                <PostCardSkeleton />
            )}

            {renderContent()}

            {error && <PostNotFound />}
        </div>
    );
};

export default PostClient;
