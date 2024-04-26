import { useSession } from "next-auth/react";

const guestUser = {
    id: "",
    first_name: "Guest",
    last_name: "",
    username: "guest",
    roles: ["guest"],
    profile_image: "https://wordpress-889362-4267074.cloudwaysapps.com/uk/wp-content/uploads/sites/3/2022/10/logo-icon-1.svg",
};

export const useUser = () => {
    const session = useSession();

    return {
        isLoggedIn: session && session.data?.user,
        user: session?.data?.user ?? guestUser,
    };
};