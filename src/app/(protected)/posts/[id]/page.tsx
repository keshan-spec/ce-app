import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPost } from '@/actions/post-actions';
import PostClient from '@/components/Posts/PostClient';
import { Suspense } from 'react';

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

const Page = async ({ params }: { params: { id: string; }; }) => {
    const post = await fetchPost(params.id);

    return (
        <div key={params.id}>
            {post ? (
                <>
                    <h2>{post.caption}</h2>
                    <img src={post.media[0].media_url} alt={post.caption} />
                    <Suspense fallback={<div>Loading...</div>}>
                        <PostClient postId={params.id} />
                    </Suspense>
                </>
            ) : (
                <div>Post not found</div>
            )}
        </div>
    );
};

export default Page;