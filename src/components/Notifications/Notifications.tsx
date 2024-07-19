"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Action from "./Action";
import CommentPhoto from "./CommentPhoto";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { getUserNotifications } from "@/actions/profile-actions";
import { NotificationResponse } from "@/types/notifications";
import { PLACEHOLDER_PFP } from "@/utils/nativeFeel";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const UserNotifications = () => {
    const { user } = useUser();
    const { data, error, isLoading, isFetching } = useQuery<NotificationResponse | null, Error>({
        queryKey: ["user-notifications"],
        queryFn: () => getUserNotifications(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
    });

    console.log(data?.data);

    return (
        <div className="w-full h-screen">
            {/* <div className="grid grid-cols-3 rounded-xl align-text-top">
                <button
                    onClick={() => changeMarking()}
                    className="col-start-3 text-end text-sm hover:cursor-pointer mt-3 mr-3"
                >
                    Mark all as read
                </button>
            </div> */}
            {isFetching && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            {data && data?.data?.map((item) => (
                <div
                    key={item._id}
                    className={clsx(
                        "my-2 grid h-auto w-full grid-flow-col grid-cols-[40px_1fr_36px] rounded-lg px-4 py-2",
                        item.is_read === "true" ? "bg-white" : "bg-gray-100"
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

                    <div className="col-span-2 ml-2 inline w-full self-center text-sm leading-5">
                        <p className={`relative inline font-bold text-verydarkblue hover:cursor-pointer hover:text-customblue`}>
                            {item.entity.initiator_data.display_name}{" "}
                        </p>

                        <Action notifications={item} />
                    </div>

                    <div className="justify-self-end">
                        {item.type === 'follow' && (
                            <button
                                className="btn btn-primary btn-sm ml-2"
                            >
                                {user.following.includes(item.entity.initiator_data.id.toString()) ? "Unfollow" : "Follow Back"}
                            </button>
                        )}
                        {item.entity.entity_data?.media && <CommentPhoto src={item.entity.entity_data.media} />}
                    </div>
                </div>
            ))}

            {/* {notifications.map((item) => (
                <div
                    key={item.id}
                    className={clsx(
                        "my-2 grid h-auto w-full grid-flow-col grid-cols-[40px_1fr_36px] rounded-lg px-4 py-2",
                        // item.viewed ? "bg-white" : "bg-gray-100"
                    )}
                    onClick={() => viewNotification(item.id)}
                >
                    <Image
                        src={item.userImg}
                        alt="user profile picture"
                        width={0}
                        height={0}
                        unoptimized
                        className="mt-1 mr-2 h-9 w-9 rounded-full"
                    />

                    <div className="col-span-2 ml-2 inline w-full self-start text-sm leading-5 text-grayishblue">
                        <p
                            className={`relative inline font-bold text-verydarkblue hover:cursor-pointer hover:text-customblue`}
                        >
                            {item.name}{" "}
                        </p>

                        <Action notifications={item} />
                    </div>

                    <div className="justify-self-end">
                        {item.action[0].commented && <CommentPhoto />}
                    </div>
                </div>
            ))} */}
        </div>
    );
};

export default UserNotifications;
