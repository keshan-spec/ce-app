'use client';
import { ProfileLayout } from "@/components/Profile/ProfileLayout";
import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import { useUser } from "@/hooks/useUser";

const Page = () => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/profile" />;
    }

    return (
        <div className="relative min-h-[150dvh]">
            <ProfileLayout />
        </div>
    );
};

export default Page;