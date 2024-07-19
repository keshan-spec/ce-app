"use client";

import { useUser } from "@/hooks/useUser";
import { Post } from "@/types/posts";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { useDotButton } from "../Carousel/EmbalDotButtons";
import useEmblaCarousel from 'embla-carousel-react';
import AutoHeight from 'embla-carousel-auto-height';
import { PostTag, fetchTagsForPost, maybeBookmarkPost, maybeLikePost } from "@/actions/post-actions";
import { BiBookmark, BiMapPin, BiSolidBookmark, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import clsx from "clsx";
import NcImage from "../Image/Image";
import { NativeShare } from "../ActionSheets/Share";
import { DotButton } from "./Posts";
import { formatPostDate, isValidDate } from "@/utils/dateUtils";
import Link from "next/link";
import { useObservedQuery } from "@/app/context/ObservedQuery";
import { PostActionsSheet } from "./PostActionSheets";
import { IonIcon } from "@ionic/react";
import { carOutline, chatboxOutline, heart, heartOutline } from "ionicons/icons";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { TagEntity } from "../TagEntity/TagEntity";
import { AssociatedCar } from "../TagEntity/AssociateCar";

export const PostCard = ({ post, muted, setMuted, openComments }: {
    post: Post,
    muted: boolean,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
    openComments: (postId: number) => void;
}) => {
    const { isLoggedIn, user } = useUser();
    const { refetch } = useObservedQuery();

    const videoRef = useRef<HTMLVideoElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false },/*[AutoHeight({ delay: 5000, stopOnInteraction: false })]*/);
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);
    const [bookMarked, setBookMarked] = useState<boolean>(post.is_bookmarked);
    const [tags, setTags] = useState<PostTag[]>([]);
    const [showTags, setShowTags] = useState(false);

    const fetchTags = async () => {
        const data = await fetchTagsForPost(post.id);
        if (data) {
            setTags(data);
        }
    };

    // intersection observer to fetch tags
    useEffect(() => {
        const postMainElement = document.getElementById(`PostMain-${post.id}`);

        let observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchTags();
            }
        }, { threshold: [0.6] });

        if (postMainElement) {
            observer.observe(postMainElement);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

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
                {!isLiked ? <IonIcon icon={heartOutline} role="img" className="md hydrated" aria-label="heart outline" onClick={onLikePost} /> : <IonIcon icon={heart} role="img" className="md hydrated text-red-600" aria-label="heart outline" onClick={onLikePost} />}
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
                {!bookMarked ? <BiBookmark className="w-5 h-5 text-black" onClick={handleBookMark} /> : <BiSolidBookmark className="w-5 h-5 text-black" onClick={handleBookMark} />}
            </div>
        );
    };

    const handleTagClick = (tag: PostTag) => {
        switch (tag.type) {
            case 'user':
                window.location.href = `/profile/${tag.entity.id}`;
                break;
            case 'car':
                window.location.href = `/profile/garage/${tag.entity.id}`;
                break;
            case 'event':
                window.location.href = `/event/${tag.entity.id}`;
                break;
            default:
                break;
        }
    };

    const renderTags = (index: number) => {
        const userTags = tags.filter(tag => tag.type === 'user');
        const filteredTags = userTags.filter(tag => tag.media_id === post.media[index].id);

        if (filteredTags.length === 0) {
            return null;
        }

        const tagsHtml = filteredTags.map((tag, index) => {
            return (
                <TagEntity
                    key={index}
                    index={index}
                    label={tag.entity.name}
                    x={tag.x}
                    y={tag.y}
                    type={tag.type}
                    id={tag.entity.id}
                    onClick={() => {
                        handleTagClick(tag);
                    }} />
            );
        });

        return (
            <>
                {showTags && tagsHtml}
                <div className="absolute bottom-3 left-3 text-white p-1 flex items-center justify-center rounded-full bg-black/70">
                    <BiMapPin />
                </div>
            </>
        );
    };


    const renderAssociatedCarTags = (index: number) => {
        const vehicleTags = tags.filter(tag => tag.type === 'car');
        const filteredTags = vehicleTags.filter(tag => tag.media_id === post.media[index].id);

        if (filteredTags.length === 0) {
            return null;
        }

        return (
            <div key={index}
                className="p-1 flex items-center justify-between text-white bg-black/70"
                data-bs-toggle="offcanvas" data-bs-target={`#post-assoctiated-cars-${post.id}`}
            >
                <IonIcon icon={carOutline} className='text-lg' />
                <span className="text-white text-xs">
                    View associated {filteredTags.length > 1 ? 'cars' : 'car'}
                </span>
            </div>
        );
    };

    const renderMedia = useMemo(() => {
        const { media } = post;

        if (media.length === 0) {
            return null;
        }

        return (
            <div className="embla !mb-0" onDoubleClick={onLikePost}>
                <div className="embla__viewport relative bg-black" ref={emblaRef}>
                    <div className="embla__container !items-center">
                        {media.map((item, index) => {
                            const calculatedHeight = parseInt(item.media_height) ? parseInt(item.media_height) : 500;
                            const maxHeight = calculatedHeight > 600 ? 400 : calculatedHeight;

                            return (
                                <div
                                    key={item.id}
                                    id={`media-${item.id}`}
                                    onClick={() => setShowTags(prev => !prev)}
                                    className={clsx(
                                        "embla__slide h-full group bg-black flex flex-col",
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

                                        {renderTags(index)}

                                        {item.media_type === 'video' && (
                                            <>
                                                <div
                                                    className={`w-full h-full flex items-center justify-center`}
                                                    style={{ width: item.media_width, height: 'auto' }}
                                                    id={`video-${item.id}`}
                                                    onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                                                >
                                                    <video
                                                        playsInline
                                                        loop
                                                        muted={muted}
                                                        className="object-contain w-full cursor-pointer"
                                                        ref={videoRef}
                                                        style={{
                                                            width: parseInt(item.media_width) || 400,
                                                            height: maxHeight || 400
                                                        }}
                                                        src={item.media_url}
                                                        width={parseInt(item.media_width) || 400}
                                                        height={'auto'}
                                                    />
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

                {renderAssociatedCarTags(selectedIndex)}

                <div className={
                    clsx("flex flex-col",
                        media.length > 1 && "my-2.5",
                    )
                }>
                    <div className="flex gap-1 w-full justify-center text-xl">
                        {media.length > 1 && (
                            <div className="flex gap-1 min-w-24 items-start justify-center max-w-20">
                                {scrollSnaps.map((_, index) => {
                                    return (
                                        <DotButton
                                            key={index}
                                            onClick={() => onDotButtonClick(index)}
                                        >
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedIndex === index ? 'bg-theme-primary' : 'bg-gray-300'}`} />
                                        </DotButton>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }, [post.id, muted, isLiked, selectedIndex, scrollSnaps, bookMarked, showTags, tags]);

    return (
        <div className="media-post-content relative mb-6 text-black" id={`PostMain-${post.id}`}>
            <div className="media-post-header">
                <Link href={`/profile/${post.user_id}`} passHref>
                    <div className="media-post-avatar border-black border-2" style={{
                        backgroundImage: `url(${post.user_profile_image || PLACEHOLDER_PFP})`
                    }} />
                    <div className="media-post-user text-black">
                        {post.username}
                    </div>
                </Link>
                {(post.garage_id && post.garage?.status === 'active') && (
                    <Link
                        href={`/profile/garage/${post.garage_id}`}
                        className="text-xs opacity-50">
                        {post.garage?.make} {post.garage?.model}, owned by @{post.garage?.owner?.username}
                    </Link>
                )}
                <div className="media-post-date">{formatPostDate(post.post_date)}</div>
            </div>

            {renderMedia}

            <div className="media-post-actions d-flex">
                <div className="media-post-like">
                    {renderLike()}
                </div>

                <div
                    className="media-post-comment"
                    onClick={() => openComments(post.id)}
                // data-bs-toggle="offcanvas" data-bs-target="#postComments"
                >
                    <IonIcon icon={chatboxOutline} role="img" className="md hydrated" aria-label="chatbox outline" />
                </div>

                <div className="media-post-share">
                    <NativeShare
                        id={post.id.toString()}
                        key={post.id}
                        shareUri={`/posts/${post.id}`}
                        shareText={post.caption}
                        shareTitle="DriveLife Post"
                        shareImage={post.media[0].media_url}
                    />
                </div>

                {(post.user_id === user.id) && (
                    <div className="media-post-edit">
                        <PostActionsSheet
                            postId={post.id}
                            isOwner={post.user_id === user?.id}
                            onDeleted={() => {
                                refetch();
                            }}
                            onDeleteStart={() => {
                                const elem = document.getElementById(`PostMain-${post.id}`);
                                elem?.classList.add('opacity-50', 'pointer-events-none');
                            }}
                        />
                    </div>
                )}

                <AssociatedCar
                    tags={tags}
                    post={post}
                    index={selectedIndex}
                />
            </div>

            <span className="media-post-likecount">{post.likes_count ?? 0} likes</span>
            <MediaPostDescription {...post} />


            {post.comments_count ? (
                <div className="media-post-commentcount opacity-60 !text-xm"
                    // data-bs-toggle="offcanvas" data-bs-target="#postComments"
                    onClick={() => openComments(post.id)}> View  {post.comments_count > 1 ? `all ${post.comments_count} comments` : `comment`}
                </div>
            ) : null}
        </div>
    );
};


const MediaPostDescription = (post: Post) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleReadMore = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="media-post-description">
            <strong>{post.username}</strong> {post.caption && (
                <>
                    {isExpanded ? (
                        <>
                            • {post.caption}
                            <span className="media-post-readmore cursor-pointer" onClick={toggleReadMore}> less</span>
                        </>
                    ) : (
                        <>
                            • {post.caption.slice(0, 100)}{post.caption.length > 100 && '...'}
                            {post.caption.length > 100 && (
                                <span className="media-post-readmore cursor-pointer" onClick={toggleReadMore}> more</span>
                            )}
                        </>
                    )}
                </>
            )}
            {(post.updated_at && isValidDate(post.updated_at)) && (
                <span className="media-post-updated text-xs opacity-50"><br />Updated {formatPostDate(post.updated_at)}</span>
            )}
        </div>
    );
};
