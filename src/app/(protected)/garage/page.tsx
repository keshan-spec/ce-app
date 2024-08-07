'use client';
import { useUser } from "@/hooks/useUser";
import dynamic from "next/dynamic";

const Garage = dynamic(() => import('@/components/Profile/Garage/Garage'), { ssr: false });
const NoAuthWall = dynamic(() => import('@/components/Protected/NoAuthWall'), { ssr: false });

const Page: React.FC = () => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/garage" />;
    }

    return <Garage profileId={user.id} edit />;
};

export default Page;