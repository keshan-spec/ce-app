import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPost } from '@/actions/post-actions';

import PostClient from './PostClient';

// SEO
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
    }

    return {
        title,
        description: `${post?.likes_count} likes, ${post?.comments_count} comments - ${post?.username}`,
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

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <h1>{params.id}</h1>
    );
    return <PostClient postId={params.id} />;
};

export default Page;