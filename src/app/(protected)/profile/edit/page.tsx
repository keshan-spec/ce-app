import { EditProfile } from "@/components/Profile/Settings/EditProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Profile Edit | Drive Life',
    description: 'User Profile',
    openGraph: {
        type: 'profile',
        siteName: 'Drive Life',
    },
};

const Page = () => {
    return (
        <EditProfile />
    );
};

export default Page;