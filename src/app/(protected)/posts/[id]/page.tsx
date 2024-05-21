import { fetchPost } from '@/actions/post-actions';
import type { Metadata, ResolvingMetadata } from 'next';
import PostClient from './PostClient';
import { PostNotFound } from '@/components/Posts/PostNotFound';

// SEO
type Props = {
    params: { id: string; };
    searchParams: { [key: string]: string | string[] | undefined; };
};

export async function generateMetadata(
    { params, searchParams }: Props,
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

const Page = async ({ params }: { params: { id: string; }; }) => {
    const post = await fetchPost(params.id);


    if (!post) {
        return <PostNotFound />;
    }

    return (
        <PostClient post={post} />
    );
};

export default Page;