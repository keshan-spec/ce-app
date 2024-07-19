'use client';

import { PostCardSkeleton } from "./PostCardSkeleton";
import { useMemo, useState } from 'react';

import useEmblaCarousel from 'embla-carousel-react';

import React, {
    PropsWithChildren,
    useCallback,
} from 'react';

import { EmblaOptionsType } from 'embla-carousel';
import { Post } from "@/types/posts";
import { useObservedQuery } from "@/app/context/ObservedQuery";

import clsx from "clsx";

import { PostCard } from "./PostCard";
import { ComentsSection } from "./ComentSection";
import SlideInFromBottomToTop from "@/shared/SlideIn";

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

export const Posts: React.FC = () => {
    const { data, isFetching, setFollowingOnly } = useObservedQuery();
    const [muted, setMuted] = useState(true); // State to track muted state

    const [activeSection, setActiveSection] = useState<number | undefined>();
    const [activeTab, setActiveTab] = useState<"latest" | "following">("latest");

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

    return (
        <div className="w-full h-full bg-white">
            <div className="fixed w-full social-tabs !mt-0 z-50">
                <ul className="nav nav-tabs capsuled" role="tablist">
                    <li className="nav-item" onClick={() => {
                        setActiveTab("latest");
                        setFollowingOnly(false);
                    }}>
                        <a className="nav-link active" data-bs-toggle="tab" href="#latest-posts" role="tab" aria-selected="false">
                            Latest
                        </a>
                    </li>
                    <li className="nav-item" onClick={() => {
                        setActiveTab("following");
                        setFollowingOnly(true);
                    }}>
                        <a className="nav-link" data-bs-toggle="tab" href="#following-posts" role="tab" aria-selected="true">
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

            <ul className={clsx(
                "listview flush transparent no-line image-listview max-w-md mx-auto !pt-16",
            )}>
                <div className="tab-content">
                    <div className="tab-pane fade active show" id="latest-posts" role="tabpanel">
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
                    </div>

                    <div className="tab-pane fade" id="following-posts" role="tabpanel">
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
                    </div>
                </div>
            </ul>
        </div>
    );
};