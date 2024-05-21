import type { Metadata, ResolvingMetadata } from 'next';
import { fetchPost } from '@/actions/post-actions';
import PostClient from '@/components/Posts/PostClient';
import { ClientContainer } from '@/app/layouts/ClientContainer';

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

const Page = ({ params }: { params: { id: string; }; }) => {
    return (
        <ClientContainer>
            <PostClient postId={params.id} key={params.id} />
        </ClientContainer>
    );
};

export default Page;