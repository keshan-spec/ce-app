"use client";
import { useCallback, useState } from "react";

import { Post } from "@/types/posts";
import { PostNotFound } from '@/components/Posts/PostNotFound';

import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "@/components/Posts/ComentSection";
import { PostCard } from "@/components/Posts/Posts";
import { useQuery } from "react-query";
import { fetchPost } from "@/actions/post-actions";
import { PostCardSkeleton } from "@/components/Posts/PostCardSkeleton";

const PostClient = ({ postId }: { postId: string; }) => {
    const { data, error, isLoading, isFetching } = useQuery<Post | null, Error>({
        queryKey: ["post", postId],
        queryFn: () => {
            return fetchPost(postId);
        },
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        keepPreviousData: true,
    });

    const [muted, setMuted] = useState(true); // State to track muted state
    const [commentsOpen, setCommentsOpen] = useState(false); // State to track comments open state

    const handleOpenComments = useCallback(() => {
        setCommentsOpen(true);
    }, [postId]);

    const getCommentCount = () => {
        return data?.comments_count || 0;
    };

    return (
        <div className="bg-theme-dark min-h-screen max-h-screen overflow-hidden">
            <SlideInFromBottomToTop
                isOpen={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                height={"80%"}
                title={`${getCommentCount()} comments`}
                stickyScroll={true}
            >
                <ComentsSection postId={parseInt(postId)} />
            </SlideInFromBottomToTop>

            {(isFetching || isLoading) && (
                <PostCardSkeleton />
            )}

            {(data && !error) && (
                <PostCard
                    post={data}
                    muted={muted}
                    openComments={handleOpenComments}
                    setMuted={setMuted}
                />
            )}

            {error && <PostNotFound />}
        </div>
    );
};

export default PostClient;
