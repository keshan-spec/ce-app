'use client';
import { useObservedQuery } from "./context/ObservedQuery";
import { PostCardSkeleton } from "./components/Posts/PostCardSkeleton";
import { useEffect, useRef, useState } from 'react';
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";

const PostCard = ({ post, muted, setMuted }: {
    post: any,
    muted: boolean,
    setMuted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

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

    return (
        <div className="rounded-lg relative shadow-md overflow-hidden mx-2 bg-slate-300 mb-6 max-h-[80vh]" id={`PostMain-${post.id}`}>
            <div className="px-4 py-3">
                <div className="flex items-center mb-2">
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-800">{post.post.uploaded_by}</div>
                        <div className="text-xs text-gray-500">{post.post.posted_at}</div>
                    </div>
                </div>

                {post.location && (
                    <div className="text-xs text-gray-500 mb-2">
                        <span className="mr-1">&#x1F4CD;</span> {post.post.location}
                    </div>
                )}

                <div className="font-semibold mb-2">{post.post.post_title}</div>
            </div>

            <div className="group">
                {post.type === 'image' && (
                    <img src={post.url} alt={post.alt} className="object-contain w-full" />
                )}
                {post.type === 'video' && (
                    <>
                        <video
                            loop
                            muted={muted}
                            id={`video-${post.id}`}
                            className="object-contain w-full cursor-pointer"
                            ref={videoRef}
                            onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                        >
                            <source src={post.url} type={post.mime_type} />
                        </video>
                        <button className="absolute bottom-3 left-3 text-white hidden group-hover:block p-2 bg-black/40 rounded-full" onClick={() => setMuted(prevMuted => !prevMuted)}>
                            {muted ? <BiVolumeMute /> : <BiVolumeFull />}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export const Posts: React.FC = () => {
    const { data, isFetching, isLoading, hasNextPage, isFetchingNextPage } = useObservedQuery();
    const [muted, setMuted] = useState(true); // State to track muted state

    return (
        <div className="w-full max-w-lg mx-auto">
            {data && data.pages.map((page) => (
                page.data.map((post) => (
                    <PostCard key={post.id} post={post} muted={muted} setMuted={setMuted} />
                ))
            ))}

            {isFetching && <PostCardSkeleton />}
        </div>
    );
};