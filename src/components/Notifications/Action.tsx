"use client";

import { Notification } from "@/types/notifications";
import PrivateMessage from "./PrivateMessage";
import TimeOfAction from "./TimeOfAction";
import { useUser } from "@/hooks/useUser";

const posts = [
    {
        id: "1",
        title: "My first tournament today!",
    },
    {
        id: "2",
        title: "5 end-game strategies to increase your win rate",
    },
];

const groups = [
    {
        id: "1",
        title: "Chess Club",
    },
];

const Action = ({ notifications }: { notifications: Notification; }) => {
    return (
        <div key={notifications._id} className="inline">
            {notifications.type === 'like' && (
                <>
                    <p className="relative inline">
                        liked your post{" "}
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    <TimeOfAction date={notifications.date} />
                </>
            )}
            {notifications.type === 'follow' && (
                <>
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
                    <TimeOfAction date={notifications.date} />
                </>
            )}
            {notifications.type === 'car' && (
                <>
                    <p className="relative inline">
                        has joined your group{" "}
                        <span className="font-extrabold hover:cursor-pointer hover:text-customblue">
                            {groups[0].title}
                        </span>
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    {/* <TimeOfAction props={notifications} /> */}
                </>
            )}
            {/* {notifications.type === 'car' && (
                <>
                    <p className="relative inline">
                        sent you a private message{" "}
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    <TimeOfAction props={notifications} />
                    <PrivateMessage message={item.message} />
                </>
            )} */}
            {notifications.type === 'car' && (
                <>
                    <p className="relative inline">
                        commented on your picture{" "}
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    {/* <TimeOfAction props={notifications} /> */}
                </>
            )}
            {notifications.type === 'car' && (
                <>
                    <p className="relative inline">
                        reacted to your recent post{" "}
                        <span className="font-extrabold text-darkgrayishblue hover:cursor-pointer hover:text-customblue">
                            {posts[1].title}
                        </span>
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    {/* <TimeOfAction props={notifications} /> */}
                </>
            )}
            {notifications.type === 'car' && (
                <>
                    <p className="relative inline">
                        left the group{" "}
                        <span className="inline font-extrabold text-darkgrayishblue ">
                            {groups[0].title}
                        </span>
                        <span
                            className={` ${notifications.is_read
                                ? null
                                : "absolute right-0 h-2 w-2 translate-x-3 translate-y-2 rounded-full border-2  bg-customred"
                                }`}
                        ></span>
                    </p>
                    {/* <TimeOfAction props={notifications} /> */}
                </>
            )}
        </div>
    );
};

export default Action;
