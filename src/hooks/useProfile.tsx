"use client";
import { useQuery } from "react-query";
import { useUser } from "./useUser";
import { getUserDetails } from "@/actions/auth-actions";

export const getUser = (profileId: string | undefined) => {
    const { user, isLoggedIn } = useUser();

    if (!profileId) {
        return {
            isLoggedIn,
            user,
        };
    }

    if (profileId && user?.id === profileId) {
        return {
            isLoggedIn,
            user,
        };
    }

    // 59899
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["user", profileId],
        queryFn: () => getUserDetails(profileId),
        retry: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retryOnMount: false,
    });

    return {
        isLoggedIn,
        user: data?.user,
        sessionUser: user,
        isFetching,
        refetch
    };
};