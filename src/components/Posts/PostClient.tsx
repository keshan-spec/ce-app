"use client";
import { useCallback, useState } from "react";

import { Post } from "@/types/posts";
import { PostNotFound } from '@/components/Posts/PostNotFound';

import { fetchPost } from "@/actions/post-actions";
import { PostCardSkeleton } from "@/components/Posts/PostCardSkeleton";
import { PostCard } from "@/components/Posts/PostCard";
import { useQuery } from "@tanstack/react-query";
import { CommentsSlider } from "./CommentsSlider";

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

    const renderContent = useCallback(() => {
        if (data && !isLoading) {
            return (
                <>
                    <CommentsSlider postId={parseInt(postId)} commentCount={getCommentCount()} />
                    <PostCard
                        post={data}
                        muted={muted}
                        openComments={handleOpenComments}
                        setMuted={setMuted}
                    />
                </>
            );
        }

        if (!data && !isLoading && !isFetching) {
            return <PostNotFound />;
        }

        return null;
    }, [commentsOpen, data, isLoading, muted, postId, isFetching]);

    return (
        <div className="bg-white min-h-screen max-h-screen overflow-hidden">
            {(isFetching || isLoading) && (
                <PostCardSkeleton />
            )}

            {renderContent()}

            {error && <PostNotFound />}
        </div>
    );
};

export default PostClient;
