'use client';

import { NoAuthWall } from "@/components/Protected/NoAuthWall";
import { useUser } from "@/hooks/useUser";

const Page: React.FC = () => {
    const { isLoggedIn } = useUser();

    if (!isLoggedIn) {
        return <NoAuthWall redirectTo="/garage" />;
    }

    return (
        <div>
            <h1>Garage Page</h1>
        </div>
    );
};

export default Page;