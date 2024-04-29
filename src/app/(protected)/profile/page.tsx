'use client';
import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import { useUser } from "@/hooks/useUser";

const Page = () => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/profile" />;
    }

    return (
        <div>
            <h1>Profile Page</h1>
        </div>
    );
};

export default Page;