"use client";
import { useCallback, useState } from "react";

import { Post } from "@/types/posts";

import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "@/components/Posts/ComentSection";
import { PostCard } from "@/components/Posts/Posts";

const PostClient = ({ post }: { post: Post; }) => {
    const [muted, setMuted] = useState(true); // State to track muted state
    const [commentsOpen, setCommentsOpen] = useState(false); // State to track comments open state

    const handleOpenComments = useCallback(() => {
        setCommentsOpen(true);
    }, [post.id]);

    const getCommentCount = () => {
        return post?.comments_count ?? 0;
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
                <ComentsSection postId={post.id} />
            </SlideInFromBottomToTop>

            <PostCard
                post={post}
                muted={muted}
                openComments={handleOpenComments}
                setMuted={setMuted}
            />
        </div>
    );
};

export default PostClient;
