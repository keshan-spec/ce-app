'use client';
import { memo, useEffect, useMemo, useState } from 'react';
import React, {
    useCallback,
} from 'react';

import { Post } from "@/types/posts";
import { useObservedQuery } from "@/app/context/ObservedQuery";
import { Virtuoso } from 'react-virtuoso';

import dynamic from "next/dynamic";
import useSwipeableIndexes from '@/hooks/useSwipable';
import clsx from 'clsx';

const PostCard = dynamic(() => import('@/components/Posts/PostCard'));
const ComentsSection = dynamic(() => import('@/components/Posts/ComentSection'), { ssr: false });
// const SlideInFromBottomToTop = dynamic(() => import('@/shared/SlideIn'), { ssr: false });
const PostCardSkeleton = dynamic(() => import('./PostCardSkeleton'));

import SlideInFromBottomToTop from '@/shared/SlideIn';

const Posts = () => {
    const { data, isFetching, setFollowingOnly, getMorePosts, followingOnly } = useObservedQuery();
    const [muted, setMuted] = useState(true); // State to track muted state

    const {
        activeIndex,
        handlers,
        swiping,
    } = useSwipeableIndexes(1);

    // useEffect(() => {
    //     if (activeIndex === 0) {
    //         setFollowingOnly(false);
    //     } else {
    //         setFollowingOnly(true);
    //     }
    // }, [activeIndex]);

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

    const getCommentCount = useCallback((): number => {
        const postId = activeSection;
        const post = data?.pages.find((page: any) => page.data.find((post: Post) => post.id === postId));

        if (!post) return 0;

        return post.data.find((post: Post) => post.id === postId)?.comments_count ?? 0;
    }, [activeSection, data]);

    const incrementCommentCount = () => {
        const postId = activeSection;
        const post = data?.pages.find((page: any) => page.data.find((post: Post) => post.id === postId));

        if (!post) return;

        post.data.find((post: Post) => post.id === postId).comments_count++;
    };

    const memoizedSkeleton = useMemo(() => {
        return <>
            <PostCardSkeleton />
            <PostCardSkeleton />
        </>;
    }, []);

    const posts = data ? data.pages.flatMap((page: any) => page.data) : [];

    const renderPosts = () => {
        if (!isFetching && posts.length === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center text-lg text-neutral-500 dark:text-neutral-400">
                    No posts found
                </div>
            );
        }

        return (
            <Virtuoso
                style={{ height: "100vh", paddingBottom: '2rem' }}
                data={posts}
                itemContent={(_, post: Post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        muted={muted}
                        setMuted={setMuted}
                        openComments={handleOpenComments}
                    />
                )}
                components={{
                    Footer: () => isFetching ? memoizedSkeleton : null
                }}
                endReached={getMorePosts}
            />
        );
    };

    return (
        <div className="w-full h-full bg-white" {...handlers}>
            <div className="fixed w-full social-tabs !mt-0 z-50">
                <ul className="nav nav-tabs capsuled" role="tablist">
                    <li className="nav-item" onClick={() => {
                        setFollowingOnly(false);
                    }}>
                        <a className={clsx(
                            "nav-link",
                            !followingOnly && 'active'
                        )} role="tab" aria-selected="true">
                            Latest
                        </a>
                    </li>
                    <li className="nav-item" onClick={() => {
                        setFollowingOnly(true);
                    }}>
                        <a className={clsx(
                            "nav-link",
                            followingOnly && 'active'
                        )}
                            role="tab" aria-selected="false">
                            Following
                        </a>
                    </li>
                </ul>
            </div>

            <SlideInFromBottomToTop
                titleClassName="comments-container-header"
                isOpen={activeSection ? true : false}
                onClose={() => setActiveSection(undefined)}
                height={"80%"}
                title={`${getCommentCount()} comments`}
                stickyScroll={true}
                className="offcanvas-large"
            >
                {activeSection && <ComentsSection
                    postId={activeSection}
                    onNewComment={incrementCommentCount}
                />}
            </SlideInFromBottomToTop>

            <ul className={"listview flush transparent no-line image-listview max-w-md mx-auto !pt-16"}>
                <div className="tab-content">
                    <div className="tab-pane fade active show pb-2" id="latest-posts" role="tabpanel">
                        {renderPosts()}

                        {isFetching && memoizedSkeleton}
                    </div>
                </div>
            </ul>
        </div>
    );
};

export default memo(Posts);