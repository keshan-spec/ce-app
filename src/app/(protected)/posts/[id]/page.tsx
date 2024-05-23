import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPost } from '@/actions/post-actions';
import PostClient from '@/components/Posts/PostClient';


import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

type Props = {
    params: { id: string; };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id;
    const post = await fetchPost(id);
    const previousImages = (await parent).openGraph?.images || [];

    let title: string;
    let image: string;
    let description = 'A post from Drive Life';

    if (!post) {
        title = 'Post not found';
        image = '';
    } else {
        if (post.caption) {
            title = post.caption;
        } else {
            title = 'Post';
        }

        image = post.media[0].media_url;
        description = `${post?.likes_count} likes, ${post?.comments_count} comments - ${post?.username}`;
    }

    return {
        title,
        description,
        openGraph: {
            images: [
                ...previousImages,
                { url: image },
            ],
            type: 'article',
            siteName: 'Drive Life',
        },
    };
}



const Page = async ({ params }: { params: { id: string; }; }) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['user', params.id],
        queryFn: () => fetchPost(params.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <PostClient postId={params.id} key={params.id} />
        </HydrationBoundary>
    );
};

export default Page;