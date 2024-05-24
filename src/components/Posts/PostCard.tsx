"use client";
import { useUser } from "@/hooks/useUser";
import { Post } from "@/types/posts";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDotButton } from "../Carousel/EmbalDotButtons";
import useEmblaCarousel from 'embla-carousel-react';
import AutoHeight from 'embla-carousel-auto-height';
import { maybeBookmarkPost, maybeLikePost } from "@/actions/post-actions";
import { BiBookmark, BiComment, BiHeart, BiMapPin, BiSolidBookmark, BiSolidHeart, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import clsx from "clsx";
import NcImage from "../Image/Image";
import { NativeShare } from "../ActionSheets/Share";
import { DotButton } from "./Posts";
import { formatPostDate } from "@/utils/dateUtils";
import { ellipsisVerticalOutline, trashBinOutline, warningOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import Link from "next/link";

export const PostCard = ({ post, muted, setMuted, openComments }: {
    post: Post,
    muted: boolean,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    openComments: (postId: number) => void;
}) => {
    const { isLoggedIn, user } = useUser();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [AutoHeight({ delay: 5000, stopOnInteraction: false })]);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);
    const [bookMarked, setBookMarked] = useState<boolean>(post.is_bookmarked);

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

    // when swipe to next slide, pause the video
    useEffect(() => {
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
        if (!isLoggedIn) {
            alert("Please login to like post");
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

    const handleBookMark = async () => {
        if (!isLoggedIn) {
            alert("Please login to bookmark post");
            return;
        }

        const prevStatus = bookMarked;

        // Optimistic UI
        setBookMarked(!bookMarked);
        post.is_bookmarked = bookMarked;

        try {
            await maybeBookmarkPost(post.id);
        } catch (error) {
            // Rollback
            setBookMarked(prevStatus);
            alert("Oops! Unable to bookmark post");
            post.is_bookmarked = prevStatus;
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

    const renderMedia = useMemo(() => {
        const { media } = post;

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
                            <BiComment onClick={() => openComments(post.id)} />
                            <NativeShare
                                id={post.id.toString()}
                                key={post.id}
                                shareUri={`/posts/${post.id}`}
                                shareText={post.caption}
                                shareTitle="DriveLife Post"
                                shareImage={post.media[0].media_url}
                            />
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

                    <span className="text-xs">{post.likes_count ?? 0} likes</span>

                    <div className="font-medium flex items-center gap-1 text-sm" title={post.caption}>
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
    }, [post.id, muted, isLiked, selectedIndex, scrollSnaps, bookMarked]);

    return (
        <div className="relative shadow-md overflow-hidden bg-theme-dark mb-6 text-white" id={`PostMain-${post.id}`}>
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex flex-col items-start justify-start">
                    <div className="flex items-center gap-2 justify-center">
                        <div className="avatar">
                            <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary">
                                <Link href={`/profile/${post.user_id}`} passHref>
                                    <img
                                        src={post.user_profile_image}
                                        alt="User Avatar"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-medium text-white text-sm">{post.username}</div>
                            <div className="flex items-center gap-2 text-xs text-white/60">
                                {post.location && (
                                    <div className="flex items-center gap-1">
                                        <BiMapPin />
                                        <span>{post.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {post.user_id === user?.id && (
                    <div className="flex gap-2">
                        <PostActions />
                    </div>
                )}
            </div>

            {renderMedia}
        </div>
    );
};

const PostActions: React.FC = () => {
    return (
        <div className="dropdown">
            <button type="button" data-bs-toggle="dropdown" aria-expanded="true">
                <IonIcon icon={ellipsisVerticalOutline} />
            </button>
            <div className="dropdown-menu dropdown-menu-end px-3" style={{
                position: 'absolute',
                inset: '0px 0px auto auto',
                margin: '0px',
                transform: 'translate3d(-230px, 42px, 0px)',
                minWidth: 'unset'
            }} data-popper-placement="bottom-end">
                <a className="text-red-600 text-xs flex items-center justify-center" href="#">
                    <IonIcon icon={warningOutline} className="!w-4" /> Report
                </a>
                <div className="dropdown-divider"></div>
                <a className="text-red-600 text-xs flex items-center justify-center" href="#">
                    <IonIcon icon={trashBinOutline} className="!w-4" /> Delete
                </a>
            </div>
        </div>
    );
};