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

import SlideInFromBottomToTop from "@/shared/SlideIn";
import { ComentsSection } from "./ComentSection";
import clsx from "clsx";

import { PostCard } from "./PostCard";
import { CommentsSlider } from "./CommentsSlider";

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

    const getCommentCount = (): number => {
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
        <div className="w-full h-full bg-white">
            {/* <SlideInFromBottomToTop
                titleClassName="comments-container-header"
                isOpen={activeSection ? true : false}
                onClose={() => setActiveSection(undefined)}
                height={"80%"}
                title={`${getCommentCount()} comments`}
                stickyScroll={true}
                className="offcanvas-large"
            >
                {activeSection && <ComentsSection postId={activeSection} />}
            </SlideInFromBottomToTop> */}
            <CommentsSlider postId={activeSection!} commentCount={getCommentCount()} />

            <ul className={clsx(
                "listview flush transparent no-line image-listview max-w-md mx-auto",
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
                    </div>
                </div>
            </ul>
        </div>
    );
};