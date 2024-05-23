import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { useSession } from "next-auth/react";

const guestUser = {
    id: "",
    first_name: "Guest",
    last_name: "",
    username: "guest",
    roles: ["guest"],
    profile_image: PLACEHOLDER_PFP,
    followers: [],
    following: [],
    posts_count: 0,
};

export const useUser = () => {
    const session = useSession();

    return {
        isLoggedIn: session && session.data?.user,
        user: session?.data?.user ?? guestUser,
    };
};