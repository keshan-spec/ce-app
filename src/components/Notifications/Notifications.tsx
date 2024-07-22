"use client";
import Image from "next/image";
import Action from "./Action";
import CommentPhoto from "./CommentPhoto";
import clsx from "clsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Notification, NotificationResponse } from "@/types/notifications";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { Loader } from "../Loader";
import { getUserNotifications, markMultipleNotificationsAsRead } from "@/actions/notification-actions";
import { useEffect } from "react";
import { getQueryClient } from "@/app/context/QueryClientProvider";
import { maybeFollowUser } from "@/actions/profile-actions";

const queryClient = getQueryClient();

const UserNotifications = () => {
    const { user } = useUser();
    const { data, error, isFetching } = useQuery<NotificationResponse | null, Error>({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    const { mutate: markAsRead, isPending, failureCount } = useMutation({
        mutationFn: async (notificationIds: string[]) => {
            const response = await markMultipleNotificationsAsRead(notificationIds);
            return response;
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: ["notification-count"],
            });
        },
        retry: 2,
        mutationKey: ["mark-notifications-as-read"],
    });

    const { mutate: followUser, error: followError } = useMutation({
        mutationFn: async (userId: string | number) => {
            return await maybeFollowUser(userId);
        },
        retry: 1,
    });

    useEffect(() => {
        if (failureCount > 2) {
            console.log("Failed to mark notifications as read");
            return;
        }

        if (data && !isPending) {
            const unreadNotificationIds = [
                ...data.data.recent,
                ...data.data.last_week,
                ...data.data.last_30_days,
            ].filter((item) => item.is_read === "0").map((item) => item._id);

            if (unreadNotificationIds.length > 0) {
                markAsRead(unreadNotificationIds);
            }
        }
    }, [data, isPending, failureCount]);

    const onFollowBack = async (id: number) => {
        try {
            followUser(id);
            const isFollowing = user.following.includes(id.toString());
            if (isFollowing) {
                user.following = user.following.filter((item) => item !== id.toString());
            } else {
                user.following.push(id.toString());
            }
        } catch (error) {
            console.log("Error following user", error);
        }
    };

    const renderNotifications = (item: Notification) => {
        return (
            <div
                key={item._id}
                className={clsx(
                    " grid h-auto w-full grid-flow-col grid-cols-[40px_1fr_36px] rounded-lg px-4 py-2.5",
                    item.is_read === "1" ? "bg-white" : "bg-gray-100"
                )}
            >
                <Link href={`/profile/${item.entity.initiator_data.id}`}>
                    <Image
                        src={item.entity.initiator_data.profile_image || PLACEHOLDER_PFP}
                        alt="user profile picture"
                        width={0}
                        height={0}
                        unoptimized
                        className="mt-1 mr-2 h-9 w-9 rounded-full"
                    />
                </Link>

                <div className="col-span-2 ml-2 inline w-full self-center text-sm leading-5 max-w-60">
                    <p className={`relative inline font-bold text-verydarkblue hover:cursor-pointer hover:text-customblue`}>
                        {item.entity.initiator_data.display_name}{" "}
                    </p>

                    <Action notifications={item} />
                </div>

                <div className="justify-self-end">
                    {item.type === 'follow' && (
                        <button
                            className="btn btn-primary btn-sm ml-2"
                            onClick={() => onFollowBack(item.entity.initiator_data.id)}
                        >
                            {user.following.includes(item.entity.initiator_data.id.toString()) ? "Unfollow" : "Follow Back"}
                        </button>
                    )}
                    {item.entity.entity_data?.media && (
                        <Link href={`/post/${item.entity.entity_data.post_id}`} passHref>
                            <CommentPhoto src={item.entity.entity_data.media} />
                        </Link>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full listview flush transparent no-line min-h-screen">
            {isFetching && <Loader transulcent />}
            {error && <p>Error: {error.message}</p>}
            {(!data && !error && !isFetching) && (
                <p className="text-center mt-10 text-lg text-gray-500">No notifications yet</p>
            )}

            {(data && data.data.recent.length > 0) && <h1 className="px-3 mt-2 text-sm font-medium">Recent</h1>}
            {data && data?.data?.recent?.map((item) => renderNotifications(item))}

            {(data && data.data.last_week.length > 0) && <h1 className="px-3 mt-2 text-sm font-medium">Last Week</h1>}
            {data && data?.data?.last_week?.map((item) => renderNotifications(item))}

            {(data && data.data.last_30_days.length > 0) && <h1 className="px-3 mt-2 text-sm font-medium">Last 30 Days</h1>}
            {data && data?.data?.last_30_days?.map((item) => renderNotifications(item))}
        </div>
    );
};

export default UserNotifications;
