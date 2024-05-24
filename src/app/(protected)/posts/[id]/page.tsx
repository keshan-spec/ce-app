import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPost } from '@/actions/post-actions';
import PostClient from '@/components/Posts/PostClient';


import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import { ClientContainer } from '@/app/ClientContainer';

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
        title: `${title} - Drive Life`,
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
        queryKey: ['view-post', params.id],
        queryFn: () => fetchPost(params.id),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ClientContainer>
                <PostClient postId={params.id} key={params.id} />
            </ClientContainer>
        </HydrationBoundary>
    );
};

export default Page;