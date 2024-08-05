// import { getUserDetails } from "@/actions/auth-actions";
import { Metadata, ResolvingMetadata } from "next";

import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import dynamic from "next/dynamic";
import { getUserDetails } from "@/api-functions/auth";

const ProfileLayout = dynamic(() => import('@/components/Profile/ProfileLayout'));

type Props = {
    params: { id: string; };
};

const queryClient = new QueryClient();

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id;
    const post = await getUserDetails(id);
    const previousImages = (await parent).openGraph?.images || [];

    let title: string = 'User';
    let image: string;
    let description = 'User Profile';

    if (!post) {
        title = 'User not found';
        image = '';
    } else {
        if (post.success) {
            title = post.user?.username || 'User';
        }

        image = post.user?.profile_image || '';
        description = `${post.user?.first_name} ${post.user?.last_name} - ${post.user?.posts_count} posts | ${post.user?.followers.length} followers | ${post.user?.following.length} following`;
    }

    return {
        title: `@${title} Profile | Drive Life`,
        description,
        openGraph: {
            images: [
                ...previousImages,
                { url: image },
            ],
            firstName: post?.user?.first_name,
            lastName: post?.user?.last_name,
            username: post?.user?.username,
            type: 'profile',
            siteName: 'Drive Life',
        },
    };
}

const Page = async ({ params }: { params: { id: string; }; }) => {
    await queryClient.prefetchQuery({
        queryKey: ['user', params.id],
        queryFn: () => getUserDetails(params.id),
    });

    return (
        <div className="relative">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProfileLayout currentUser={false} profileId={params.id} />
            </HydrationBoundary>
        </div>
    );
};

export default Page;