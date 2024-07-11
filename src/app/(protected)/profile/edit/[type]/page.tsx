import { EditImages } from "@/components/Profile/Settings/EditImages";
import { EditProfile } from "@/components/Profile/Settings/EditProfile";
import { EditSocialLinks } from "@/components/Profile/Settings/EditSocialLinks";
import { EditUsername } from "@/components/Profile/Settings/EditUsername";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Profile Edit | Drive Life',
    description: 'User Profile',
    openGraph: {
        type: 'profile',
        siteName: 'Drive Life',
    },
};

const Page = ({ params }: { params: { type: string; }; }) => {
    console.log(params.type);

    const renderEditSection = () => {
        switch (params.type) {
            case 'images':
                return <EditImages />;
            case 'social-links':
                return <EditSocialLinks />;
            case 'details':
                return <EditProfile />;
            case 'username':
                return <EditUsername />;
            default:
                return <EditProfile />;
        }
    };

    return renderEditSection();
};

export default Page;