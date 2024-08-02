import dynamic from 'next/dynamic';

const EditImages = dynamic(() => import('@/components/Profile/Settings/EditImages'), { ssr: false });
const EditProfile = dynamic(() => import('@/components/Profile/Settings/EditProfile'), { ssr: false });
const EditSocialLinks = dynamic(() => import('@/components/Profile/Settings/EditSocialLinks'), { ssr: false });
const EditUsername = dynamic(() => import('@/components/Profile/Settings/EditUsername'), { ssr: false });

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