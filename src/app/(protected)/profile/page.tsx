import { Metadata } from "next";
import dynamic from "next/dynamic";

const ProfileLayout = dynamic(() => import('@/components/Profile/ProfileLayout'));

export const metadata: Metadata = {
    title: 'Profile | Drive Life',
    description: 'User Profile',
    openGraph: {
        type: 'profile',
        siteName: 'Drive Life',
    },
};

const Page = async () => {
    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout currentUser={true} />
        </div>
    );
};

export default Page;