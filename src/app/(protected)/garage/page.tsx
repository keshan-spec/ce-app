'use client';
import { Garage } from "@/components/Profile/Garage/Garage";
import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import { useUser } from "@/hooks/useUser";

const Page: React.FC = () => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/garage" />;
    }

    return <Garage profileId={user.id} edit />;
};

export default Page;