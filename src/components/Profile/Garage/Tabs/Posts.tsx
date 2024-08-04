'use client';
import NcImage from '@/components/Image/Image';
import { Post } from '@/types/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import { MiniPostSkeleton } from '../../Sections/Feed';
import { getGaragePosts } from '@/api-functions/garage';

interface GaragePostsProps {
    garageId: string;
    isTagged?: boolean;
}

export const GaragePostsTab: React.FC<GaragePostsProps> = ({
    garageId,
    isTagged = false
}) => {
    const key = isTagged ? 'tagged-garage-posts' : 'garage-posts';

    const { error, data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [key, garageId],
        queryFn: ({ pageParam }) => {
            return getGaragePosts(garageId, isTagged, pageParam || 1);
        },
        getNextPageParam: (lastPage: { total_pages: number, data: Post[], limit: number; }, pages: any[]) => {
            const maxPages = Math.ceil(lastPage.total_pages / lastPage.limit);
            const nextPage = pages.length + 1;
            return nextPage <= maxPages ? nextPage : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        initialPageParam: null,
    });

    // Infinite scroll
    useEffect(() => {
        let fetching = isFetchingNextPage || isFetching || false;

        const onScroll = async (event: any) => {
            const { scrollHeight, scrollTop, clientHeight } =
                event.target.scrollingElement;

            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true;
                if (hasNextPage) await fetchNextPage();
                fetching = false;
            }
        };

        document.addEventListener("scroll", onScroll);
        return () => {
            document.removeEventListener("scroll", onScroll);
        };
    }, [hasNextPage, isFetchingNextPage]);

    const hasPages = useMemo(() => {
        if (data && data.pages) {
            // get flat array of posts
            const validPosts = data.pages.map((page: any) => {
                return !!page.data;
            });

            return validPosts.includes(true);
        }

        return false;
    }, [data]);

    const renderMedia = (post: Post) => {
        if (!post.media) return (
            <div className="bg-gray-300 w-full h-32" />
        );

        const isVideo = post.media[0].media_type === 'video';
        const isMultiple = post.media.length > 1;

        return (
            <div className="relative w-full overflow-hidden max-h-32">
                {isVideo ? (
                    <video
                        className="w-full h-32 object-cover"
                        autoPlay={false}
                    >
                        <source src={post.media[0].media_url} type="video/mp4" />
                    </video>
                ) : (
                    <NcImage
                        src={post.media[0].media_url}
                        alt="image"
                        className="w-full object-cover h-32"
                        width={parseFloat(post.media[0].media_width) || 320}
                        height={parseFloat(post.media[0].media_height) || 320}
                    />
                )}

                {isMultiple && (
                    <div className="absolute -top-1 right-0 bg-black/30 text-white !p-1.5 rounded-bl-md text-xs">
                        <i className="fas fa-images" />
                    </div>
                )}

                {isVideo && (
                    <div className="absolute -top-1 left-0 bg-black/30 text-white !p-1.5 rounded-br-md text-xs">
                        <i className="fas fa-video" />
                    </div>
                )}

                {post.garage_id && (
                    <div className="absolute -top-1 left-0 bg-black/30 text-white !p-1.5 rounded-br-md text-xs">
                        <i className="fas fa-car" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="tab-pane fade show active" id={isTagged ? "tags" : "posts"} role="tabpanel">
            {(!isFetching && !hasPages && !error) && (
                <div className="alert alert-info mx-3 text-center">No posts found</div>
            )}

            {error instanceof Error && (
                <div className="alert alert-danger mx-3 text-center">{error.message}</div>
            )}

            {(isFetching && !isFetchingNextPage) && (
                <MiniPostSkeleton />
            )}

            {isFetchingNextPage && (
                <div className="w-full text-center my-4">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            )}

            <div className="mt-2 p-1 pt-0 pb-0">
                <div className="grid grid-cols-3 gap-1">
                    {data && data.pages?.map((page: any) => (
                        page.data?.map((post: Post) => (
                            <Link prefetch={true} key={post.id} href={`/post/${post.id}`}>
                                {renderMedia(post)}
                            </Link>
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
};