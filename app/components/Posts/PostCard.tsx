import React, { useEffect, useState } from 'react'
import { IPosts } from 'types';
import Lottie from "lottie-react";

export interface PostCardProps {
    post: IPosts;
}

// import likeAnimation from "./LikeAnim-lottie.json";
import likeAnimation2 from "./likeAnim-lottie-2.json";
import { maybeLikePost } from '../../api/posts';
import { Toast } from '../../components/Toast/Toast';
import { PostTools } from './PostTools';

export const PostCard: React.FC<PostCardProps> = ({
    post
}) => {
    const [isLiked, setIsLiked] = useState<string[]>(post.likes);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isAnimationPlaying, setIsAnimationPlaying] = useState<boolean>(false);

    const userId = "64e1215c8e55df79d1be5d37"

    useEffect(() => {
        // preload image
        if (typeof post.imageUrl === 'string') {
            const img = new Image();
            img.src = post.imageUrl;
        }
    }, [post.imageUrl]);

    // remove toast after 5 seconds
    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const likePost = async (postId: string) => {
        // Optimistic UI
        if (isLiked.includes(userId)) {
            // unlike
            setIsLiked(isLiked.filter((id) => id !== userId));
        } else {
            setIsLiked([...isLiked, userId]);
            setIsAnimationPlaying(true);
        }

        const response = await maybeLikePost(postId);

        if (!response) {
            // revert optimistic UI
            setIsLiked(post.likes);
            if (isLiked.includes(postId)) {
                setErrorMessage('Failed to unlike post.');
            } else {
                setErrorMessage('Failed to like post.');
            }
        }

        setTimeout(() => {
            setIsAnimationPlaying(false);
        }, 1500);
    }

    const renderToast = () => {
        if (errorMessage) {
            return <Toast message={errorMessage} />
        }
    }

    return (
        <>
            {renderToast()}
            <div className="relative p-4 max-w-md w-full ">
                <PostTools key={post._id} postId={post._id} onActionComplete={
                    (action) => {
                        setErrorMessage(action);
                    }
                } />
                <div className="rounded-xl bg-white dark:bg-zinc-950 h-full cursor-pointer"
                    // double click to like
                    onDoubleClick={() => likePost(post._id)}
                >
                    <div className="flex items-center px-4 py-3">
                        {/* <img className="h-8 w-8 rounded-full" src="https://picsum.photos/id/1027/150/150" /> */}
                        <div className="ml-3">
                            <span className="text-sm font-semibold antialiased block leading-tight dark:text-white mb-1">{post.username}</span>
                            <span className="text-[.6rem] font-semibold antialiased block leading-tight dark:text-gray-400">{new Date(post.createdAt).toDateString()}</span>
                        </div>
                    </div>
                    {typeof post.imageUrl === 'string' && <img src={post.imageUrl} alt={post.description} className='w-full max-h-[400px] object-contain' />}
                    <div className="flex items-center mx-4 mt-3 mb-2">
                        {/* like button */}
                        <div className="flex my-3 cursor-pointer relative" onClick={() => likePost(post._id)}>
                            {isAnimationPlaying ?
                                <div className="pointer-events-none">
                                    <Lottie
                                        autoPlay={isAnimationPlaying}
                                        loop={false}
                                        animationData={likeAnimation2}
                                        className="w-14 h-14 absolute -top-7 -left-[1.2rem] text-red-600" />
                                </div>
                                :
                                <i className={`${isLiked.includes(userId) ? "fas text-red-600 bg-red-600" : "far dark:text-white"} fa-heart fa-lg`}></i>
                            }
                        </div>
                        <div className={`font-semibold w-14 text-sm dark:text-white ${isAnimationPlaying ? "ml-8" : "ml-3"}`}>{isLiked.length} likes</div>
                    </div>

                    <div className="font-semibold text-sm mx-4 mt-2 mb-4 dark:text-white flex items-center pb-5">
                        <span className="text-sm mr-1.5 font-semibold antialiased leading-tight dark:text-white">{post.username}</span>
                        <span className="font-normal truncate antialiased leading-tight">
                            {post.description}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}