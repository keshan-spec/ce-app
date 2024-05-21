'use client';
import { PostCardSkeleton } from "./PostCardSkeleton";
import { useEffect, useMemo, useRef, useState } from 'react';
import { BiBookmark, BiComment, BiHeart, BiMapPin, BiShareAlt, BiSolidHeart, BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import NcImage from "../Image/Image";

import { Share } from '@capacitor/share';

import useEmblaCarousel from 'embla-carousel-react';

import React, {
    PropsWithChildren,
    useCallback,
} from 'react';

import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
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
import { IonIcon } from "@ionic/react";
import { copy, ellipsisVerticalCircle, ellipsisVerticalCircleOutline, ellipsisVerticalOutline, trashBinOutline, warningOutline } from "ionicons/icons";

import { usePathname, useRouter } from 'next/navigation';
import { NativeShare } from "../ActionSheets/Share";
import { PostCard } from "./PostCard";

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

// export const PostCard = ({ post, muted, setMuted, openComments }: {
//     post: Post,
//     muted: boolean,
//     setMuted: React.Dispatch<React.SetStateAction<boolean>>;
//     openComments: (postId: number) => void;
// }) => {
//     const { isLoggedIn, user } = useUser();

//     const videoRef = useRef<HTMLVideoElement>(null);
//     const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [AutoHeight({ delay: 5000, stopOnInteraction: false })]);
//     const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

//     const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);

//     useEffect(() => {
//         const video = videoRef.current;

//         if (!video) return;

//         const postMainElement = document.getElementById(`PostMain-${post.id}`);

//         let observer = new IntersectionObserver((entries) => {
//             if (video === null) return;
//             if (entries[0].isIntersecting) {
//                 video.play();
//             } else {
//                 video.pause();
//             }
//         }, { threshold: [0.6] });

//         if (postMainElement) {
//             observer.observe(postMainElement);
//         }

//         return () => {
//             observer.disconnect();
//         };
//     }, []);

//     // when swipe to next slide, pause the video
//     useEffect(() => {
//         const video = videoRef.current;

//         if (!video) return;

//         const onUserScroll = (e: any) => {
//             // const slidesInView = emblaApi?.slidesInView(); // <-- Pass true to the slidesInView method
//             // console.log(slidesInView);
//             video.pause();
//         };

//         emblaApi?.on('select', onUserScroll);

//         return () => {
//             emblaApi?.off('select', onUserScroll);
//         };
//     }, [emblaApi]);

//     const onLikePost = async () => {
//         if (!isLoggedIn) {
//             alert("Please login to like event");
//             return;
//         }

//         const prevStatus = isLiked;

//         // Optimistic UI
//         setIsLiked(!isLiked);
//         post.likes_count += isLiked ? -1 : 1;

//         try {
//             const response = await maybeLikePost(post.id);

//             if (response) {
//                 post.is_liked = !isLiked;
//             }
//         } catch (error) {
//             // Rollback
//             setIsLiked(prevStatus);
//             post.likes_count += prevStatus ? 1 : -1;
//             alert("Oops! Unable to like post");
//             console.log(error);
//         }
//     };

//     const renderLike = () => {
//         return (
//             <div className="flex flex-col items-center justify-start">
//                 {!isLiked ? <BiHeart className="w-5 h-5 text-gray-300" onClick={onLikePost} /> : <BiSolidHeart className="w-5 h-5 text-red-600" onClick={onLikePost} />}
//             </div>
//         );
//     };

//     const renderMedia = useMemo(() => {
//         const { media } = post;

//         if (media.length === 0) {
//             return null;
//         }

//         return (
//             <div className="embla" onDoubleClick={onLikePost}>
//                 <div className="embla__viewport" ref={emblaRef}>
//                     <div className="embla__container">
//                         {media.map((item, index) => {
//                             const calculatedHeight = parseInt(item.media_height) ? parseInt(item.media_height) - 50 : 400;
//                             const maxHeight = calculatedHeight > 600 ? 600 : calculatedHeight;

//                             return (
//                                 <div key={item.id} className={clsx(
//                                     "embla__slide h-full group",
//                                     item.media_type === 'video' && "embla__slide--video"
//                                 )}>
//                                     <div className="embla__slide__number w-full h-full">
//                                         {item.media_type === 'image' && (
//                                             <NcImage src={item.media_url} alt={item.media_alt} className="object-contain w-full" imageDimension={{
//                                                 width: parseInt(item.media_width) || 400,
//                                                 height: maxHeight || 400
//                                             }} />
//                                         )}

//                                         {item.media_type === 'video' && (
//                                             <>
//                                                 <div
//                                                     className={`w-full h-full flex items-center justify-center relative`}
//                                                     style={{ width: item.media_width, height: maxHeight }}
//                                                 >
//                                                     <video
//                                                         loop
//                                                         muted={muted}
//                                                         id={`video-${item.id}`}
//                                                         className="object-contain w-full cursor-pointer"
//                                                         ref={videoRef}
//                                                         width={parseInt(item.media_width) || 400}
//                                                         height={parseInt(item.media_height) || 400}
//                                                         onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
//                                                     >
//                                                         <source src={item.media_url} type={item.media_mime_type} />
//                                                     </video>
//                                                     <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
//                                                         {muted ? <BiVolumeMute /> : <BiVolumeFull />}
//                                                     </button>
//                                                 </div>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//                 <div className="flex flex-col p-2 gap-y-2">
//                     <div className="flex gap-1 w-full justify-between text-xl">
//                         <div className="flex gap-2 min-w-24 items-start justify-start">
//                             {renderLike()}
//                             <BiComment onClick={() => openComments(post.id)} />
//                             <NativeShare
//                                 shareUri={`/posts/${post.id}`}
//                                 shareText={post.caption}
//                                 shareTitle="DriveLife Post"
//                                 shareImage={post.media[0].media_url}
//                             />
//                         </div>
//                         {media.length > 1 && (
//                             <div className="flex gap-1 min-w-24 items-start justify-center max-w-20">
//                                 {scrollSnaps.map((_, index) => {
//                                     return (
//                                         <DotButton
//                                             key={index}
//                                             onClick={() => onDotButtonClick(index)}
//                                         >
//                                             <div className={`w-1.5 h-1.5 rounded-full ${selectedIndex === index ? 'bg-blue-500' : 'bg-gray-300'}`} />
//                                         </DotButton>
//                                     );
//                                 })}
//                             </div>
//                         )}

//                         <div className="flex min-w-24 items-start justify-end">
//                             <BiBookmark />
//                         </div>
//                     </div>

//                     <span className="text-xs">{post.likes_count ?? 0} likes</span>

//                     <div className="font-medium flex items-center gap-1 text-sm" title={post.caption}>
//                         <div className=" text-white text-xs">{post.username ?? "Attendee"}</div>
//                         <span className="text-white/80 text-xs"> {post.caption}</span>
//                     </div>
//                     {post.comments_count ? (
//                         <span className="text-white/60 text-xs cursor-pointer" onClick={() => openComments(post.id)}>
//                             View  {post.comments_count > 1 ? `all ${post.comments_count} comments` : `comment`}
//                         </span>
//                     ) : null}
//                     <div className="text-white/60 text-xs">{formatPostDate(post.post_date)}</div>
//                 </div>
//             </div>
//         );
//     }, [post, muted, isLiked, selectedIndex, scrollSnaps]);

//     return (
//         <div className="relative shadow-md overflow-hidden bg-theme-dark mb-6 text-white" id={`PostMain-${post.id}`}>
//             <div className="flex items-center justify-between px-3 py-3">
//                 <div className="flex flex-col items-start justify-start">
//                     <div className="flex items-center gap-2 justify-center">
//                         <div className="avatar">
//                             <div className="w-8 h-8 bg-gray-300 rounded-full border-1 border-theme-primary">
//                                 <img
//                                     src={post.user_profile_image}
//                                     alt="User Avatar"
//                                     className="w-full h-full object-cover rounded-full"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex flex-col">
//                             <div className="font-medium text-white text-sm">{post.username}</div>
//                             <div className="flex items-center gap-2 text-xs text-white/60">
//                                 {post.location && (
//                                     <div className="flex items-center gap-1">
//                                         <BiMapPin />
//                                         <span>{post.location}</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {post.user_id === user?.id && (
//                     <div className="flex gap-2">
//                         <PostActions />
//                     </div>
//                 )}
//             </div>

//             {renderMedia}
//         </div>
//     );
// };

export const Posts: React.FC = () => {
    const { data, isFetching } = useObservedQuery();
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

    const memoizedSkeleton = useMemo(() => {
        return <>
            <PostCardSkeleton />
            <PostCardSkeleton />
        </>;
    }, []);

    return (
        <div className="w-full h-full bg-theme-dark">
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
                {isFetching && memoizedSkeleton}
            </ul>
        </div>
    );
};