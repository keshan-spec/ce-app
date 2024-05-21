"use client";
import { useCallback, useState } from "react";

import { Post } from "@/types/posts";
import { PostNotFound } from '@/components/Posts/PostNotFound';

import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "@/components/Posts/ComentSection";
import { useQuery } from "react-query";
import { fetchPost } from "@/actions/post-actions";
import { PostCardSkeleton } from "@/components/Posts/PostCardSkeleton";
import { PostCard } from "@/components/Posts/PostCard";

const PostClient = ({ postId }: { postId: string; }) => {
    const { data, error, isLoading, isFetching } = useQuery<Post | null, Error>({
        queryKey: ["view-post", postId], // Unique key for the query, in this case "view-post-:id
        queryFn: () => {
            return fetchPost(postId);
        },
        keepPreviousData: false,
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

    return (
        <div className="bg-theme-dark min-h-screen max-h-screen overflow-hidden">
            {(isFetching || isLoading) && (
                <PostCardSkeleton />
            )}

            {(data && !isLoading) && (
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

                    <PostCard
                        post={data}
                        muted={muted}
                        openComments={handleOpenComments}
                        setMuted={setMuted}
                    />
                </>
            )}

            {!data && !isLoading && !isFetching && (
                <PostNotFound />
            )}

            {error && <PostNotFound />}
        </div>
    );
};

export default PostClient;
