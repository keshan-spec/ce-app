import { getSessionUser, getUserDetails } from "@/actions/auth-actions";
import { auth } from "@/auth";
import { DLayout, ProfileLayout } from "@/components/Profile/ProfileLayout";
import { UserNotFound } from "@/components/Profile/UserNotFound";
import { getUser } from "@/hooks/useProfile";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: { id: string; };
};

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
    const session = await auth();
    const user = await getUserDetails(params.id);

    if (!user || !user.success) {
        return <UserNotFound />;
    }

    return (
        <DLayout sessionUser={session?.user} user={user.user} />
    );

    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout currentUser={false} profileId={params.id} />
        </div>
    );
};

export default Page;