"use client";
import { ComentsSection } from "@/components/Posts/ComentSection";
import { PostCardSkeleton } from "@/components/Posts/PostCardSkeleton";
import { PostCard } from "@/components/Posts/Posts";
import SlideInFromBottomToTop from "@/shared/SlideIn";
import { Post } from "@/types/posts";
import { useCallback, useState } from "react";

const PostClient = ({ post }: { post: Post; }) => {
    const [muted, setMuted] = useState(true); // State to track muted state
    const [commentsOpen, setCommentsOpen] = useState(false); // State to track comments open state

    const handleOpenComments = useCallback((postId: number) => {
        setCommentsOpen(true);
    }, [post.id]);

    const getCommentCount = () => {
        return post?.comments_count ?? 0;
    };

    if (!post) {
        return <PostCardSkeleton />;
    }

    return (
        <div className="bg-theme-dark min-h-[100dvh]">
            <SlideInFromBottomToTop
                isOpen={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                height={"80%"}
                title={`${getCommentCount()} comments`}
                stickyScroll={true}
            >
                <ComentsSection postId={post.id} />
            </SlideInFromBottomToTop>
            <PostCard
                post={post}
                muted={muted}
                openComments={() => {
                    handleOpenComments(post.id);
                }}
                setMuted={setMuted}
            />
        </div >
    );
};

export default PostClient;
