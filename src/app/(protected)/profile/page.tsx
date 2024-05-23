import { ProfileLayout } from "@/components/Profile/ProfileLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Profile | Drive Life',
    description: 'User Profile',
    openGraph: {
        type: 'profile',
        siteName: 'Drive Life',
    },
};

const Page = () => {
    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout currentUser={true} />
        </div>
    );
};

export default Page;