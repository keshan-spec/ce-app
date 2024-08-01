"use client";

import { Notification } from "@/types/notifications";
import TimeOfAction from "./TimeOfAction";
import Link from "next/link";

/*
Notification types
    - Posts
        X Liked your post
        X commented on your post
        X Tagged you in a post
        X Tagged your car in a post

    - Comments
        X Liked your comment
        - Replied to your comment
        X Mentioned you in a comment
    
    - Account
        X Followed you

    - Garage
        X Mentioned your car in a post
        X Created a post with your car 
*/
const Action = ({ notifications }: { notifications: Notification; }) => {
    const renderActionButton = () => {
        if (notifications.type === 'post' && notifications.entity.entity_type === 'car') {
            return (
                <Link prefetch={true} href={`/profile/garage/${notifications.entity.entity_data?.garage?.id}`} className="font-semibold block hover:cursor-pointer">
                    Review this post
                </Link>
            );
        }

        return null;
    };

    return (
        <div className="inline">
            {notifications.type === 'like' && (
                <p className="relative inline">
                    liked your {notifications.entity.entity_type}{" "}
                    {notifications.entity.entity_data?.comment && (
                        <span className="inline font-semibold text-black">
                            {notifications.entity.entity_data?.comment}
                        </span>
                    )}
                    <span
                        className={` ${notifications.is_read
                            ? null
                            : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                            }`}
                    ></span>
                </p>
            )}

            {notifications.type === 'comment' && (
                <p className="relative inline">
                    commented on your post:{" "}
                    <span className="block font-semibold text-black">
                        {notifications.entity.entity_data?.comment}
                    </span>
                    <span
                        className={` ${notifications.is_read
                            ? null
                            : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                            }`}
                    ></span>
                </p>
            )}

            {notifications.type === 'follow' && (
                <div className="inline">
                    <p className="relative inline ">
                        followed you{" "}
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        />
                    </p>
                </div>
            )}

            {notifications.type === 'mention' && (
                <p className="relative inline">
                    mentioned you in a {notifications.entity.entity_type}{" "}
                    {notifications.entity.entity_data?.comment && (
                        <span className="block font-semibold text-black">
                            {notifications.entity.entity_data?.comment}
                        </span>
                    )}
                    <span
                        className={` ${notifications.is_read
                            ? null
                            : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                            }`}
                    ></span>
                </p>
            )}

            {notifications.type === 'post' && (
                <p className="relative inline">
                    has posted {notifications.entity.entity_type === 'car' ? "your car" : "a post"}{" "}
                    <Link prefetch={true} href={`/profile/garage/${notifications.entity.entity_data?.garage?.id}`} className="font-semibold hover:cursor-pointer hover:text-customblue">
                        {notifications.entity.entity_data?.garage?.make} {notifications.entity.entity_data?.garage?.model}
                    </Link>
                    <span
                        className={` ${notifications.is_read
                            ? null
                            : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                            }`}
                    ></span>
                </p>
            )}

            {notifications.type === 'tag' && (
                <p className="relative inline">
                    {notifications.entity.entity_type === 'car' ? "tagged your car in a post" : "tagged you in a post"}
                    <span
                        className={` ${notifications.is_read
                            ? null
                            : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                            }`}
                    ></span>
                </p>
            )}


            {renderActionButton()}
            <TimeOfAction date={notifications.date} />
        </div>
    );
};

export default Action;
