import { AuthUser } from "@/auth";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import { useSession } from "next-auth/react";

const guestUser: AuthUser = {
    id: '',
    first_name: "Guest",
    last_name: "",
    username: "guest",
    roles: ["guest"],
    profile_image: PLACEHOLDER_PFP,
    cover_image: '',
    followers: [],
    following: [],
    posts_count: 0,
    profile_links: {
        instagram: '',
        tiktok: '',
        facebook: '',
        email: '',
        custodian: '',
        mivia: '',
        youtube: '',
        external_links: [],
    },
    email: "",
};

type UseUser = {
    isLoggedIn: boolean | undefined;
    user: AuthUser;
};

export const useUser = (): UseUser => {
    const session = useSession();

    return {
        user: session?.data?.user || guestUser,
        isLoggedIn: session && session.data?.user ? true : false,
    };
};