import { AuthUser } from "@/auth";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { useSession } from "next-auth/react";

const guestUser = {
    id: '',
    first_name: "Guest",
    last_name: "",
    username: "guest",
    roles: ["guest"],
    profile_image: PLACEHOLDER_PFP,
    followers: [],
    following: [],
    posts_count: 0,
    profile_links: {
        instagram: "",
        tiktok: "",
        facebook: "",
        email: "",
    },
};

type UseUser = {
    isLoggedIn: boolean | undefined;
    user: AuthUser;
};

export const useUser = (): UseUser => {
    const session = useSession();

    return {
        user: session?.data?.user ?? guestUser,
        isLoggedIn: session && session.data?.user ? true : false,
    };
};